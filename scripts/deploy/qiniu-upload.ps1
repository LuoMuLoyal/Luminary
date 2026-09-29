# 七牛云 Kodo 上传脚本 —— Luminary 站点产物 → 对象存储
#
# ## 为什么需要这个脚本（而不是 rsync / 拖拽上传）
#
# out/ 的产物 **不能原样上传**，有两个只有线上才暴露的坑：
#
# 1. `out/_next/` 必须重映射到 `/luminous/_next/`。
#    实测：HTML 里写的是绝对路径 `/luminous/_next/...`（无一条裸 `/_next/`），
#    但磁盘上 `_next` 在 out/ 根、`out/luminous/_next` 并不存在
#    （`next.config.mjs` 注释里那张表的这一格与实测不符，以
#    `docs/deployment.md` 的 ⚠️ 为准）。不重映射 = 线上 CSS/JS 全 404。
#
# 2. `out/api/search.json` 是构建收尾脚本从无扩展名的 `api/search` 改名来的。
#    对象存储按扩展名定 Content-Type，无扩展名会被当 octet-stream，
#    前端 `fetch().json()` 直接失败（搜索弹窗能开、输入无结果）。
#
# ## 需要哪些配置
#
# 见同目录 README。核心是 qshell（七牛官方 CLI），本脚本不自己实现签名。

[CmdletBinding()]
param(
  # 要部署哪个 app 的产物
  [ValidateSet('site', 'personal')]
  [string]$App = 'site',

  # 七牛空间名（本项目的空间）
  [string]$Bucket = 'luminary-docs',

  # 空间绑定的 CDN 域名（不带 scheme），用于上传后校验
  [Parameter(Mandatory)]
  [string]$Domain,

  # 剔除站点根级静态资源以外的 compodoc 产物（61.6 MB）
  [switch]$DropCompodoc,

  # qshell 可执行文件路径。不传则依次找：PATH → 仓库根 → 工作区根（Lumos/）
  [string]$Qshell,

  # 组装出的"线上形态"暂存目录。不传则用 LUMINARY_STAGE_DIR 或系统临时目录。
  # CI 里显式传这个，避免脚本与上传步骤对临时目录的理解不一致。
  [string]$StageDir,

  # 先本地组装一份"映射后形态"再传，便于自查与校验
  [switch]$StageOnly,

  # 试运行：只打印将要上传的映射，不真正调用 qshell
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

# ---- 路径约定 -------------------------------------------------------------
# scripts/deploy/ 往上两级是仓库根
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..\..')
$appRoot = Join-Path $repoRoot "apps\$App"
$outDir = Join-Path $appRoot 'out'

if (-not (Test-Path $outDir)) {
  throw "找不到产物目录：$outDir`n先跑 pnpm --filter @luminary/$App build"
}

Write-Host "=== 部署 $App → 七牛空间 $Bucket ===" -ForegroundColor Cyan
Write-Host "产物目录: $outDir"

# ---- 组装"线上形态"的暂存目录 ---------------------------------------------
# 这一步把 上传映射表 烘成真实目录结构：磁盘布局 = 线上 URL 布局。
# 好处是上传逻辑退化成"整目录原样上传"，映射错误在这里而不是线上暴露。
#
# ⚠️ 暂存目录位置必须与调用方一致，且**不能依赖 GetTempPath()**：
#    - 可用 `-StageDir` 显式指定（CI 用这个，避免猜平台）
#    - 未指定时用 `$env:LUMINARY_STAGE_DIR`
#    - 再退回系统临时目录
# 之前只写死 GetTempPath() 时，CI 上出现「脚本写到 /tmp、上传步骤读
# $RUNNER_TEMP」的错位——两者在 GitHub runner 上**不是同一个目录**，
# 结果是安静地上传了一个空目录。
$stage = if ($StageDir) {
  $StageDir
} elseif ($env:LUMINARY_STAGE_DIR) {
  $env:LUMINARY_STAGE_DIR
} else {
  Join-Path ([System.IO.Path]::GetTempPath()) "luminary-$App-stage"
}
if (Test-Path $stage) { Remove-Item $stage -Recurse -Force }
New-Item -ItemType Directory -Force -Path $stage | Out-Null

function Copy-Tree {
  param([string]$From, [string]$To)
  if (-not (Test-Path $From)) { return }
  $parent = Split-Path $To -Parent
  if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
  Copy-Item $From $To -Recurse -Force
}

if ($App -eq 'site') {
  # 映射表见 docs/deployment.md
  #   out/luminous/**  → /luminous/**     （页面，路径已天然对应）
  #   out/_next/**     → /luminous/_next/ （⚠️ 需重映射：磁盘在根，引用带前缀）
  #   out/api/**       → /luminous/api/**
  #   out/*.ico,*.svg  → /luminous/
  Write-Host "`n--- 按映射表组装 ---" -ForegroundColor Yellow
  Copy-Tree (Join-Path $outDir 'luminous') (Join-Path $stage 'luminous')
  Copy-Tree (Join-Path $outDir '_next')    (Join-Path $stage 'luminous\_next')
  Copy-Tree (Join-Path $outDir 'api')      (Join-Path $stage 'luminous\api')
  Get-ChildItem $outDir -File | Where-Object { $_.Extension -in '.ico', '.svg' } | ForEach-Object {
    Copy-Item $_.FullName (Join-Path $stage 'luminous') -Force
  }
  if (-not $DropCompodoc) {
    Copy-Tree (Join-Path $outDir 'compodoc') (Join-Path $stage 'luminous\compodoc')
  }
} else {
  # personal 占根路径，原样上传
  Copy-Tree $outDir $stage
}

# ---- 产物完整性说明 --------------------------------------------------------
# RSC 导航载荷（out/luminous/**/*.txt）**刻意不提供剔除开关**：它们是 Next App Router
# 的 client-navigation payload，删掉会让站内跳转回退为整页刷新。
# 体积确实大（实测 2884 个文件 / 485.8 MB），但换来的是正常的软导航体验，
# 属于有意保留的代价，不要图省事去掉。

# ---- 上传前自检（这些错误只在线上暴露，所以卡在这里） ----------------------
Write-Host "`n--- 产物形态自检 ---" -ForegroundColor Yellow
$fail = 0

function Assert-Path {
  param([string]$Path, [string]$Why)
  if (Test-Path $Path) {
    Write-Host "  OK   $Path"
  } else {
    Write-Host "  FAIL $Path —— $Why" -ForegroundColor Red
    $script:fail++
  }
}

if ($App -eq 'site') {
  Assert-Path (Join-Path $stage 'luminous\index.html') '官网首页缺失：basePath / trailingSlash 未生效？'
  Assert-Path (Join-Path $stage 'luminous\docs\index.html') '文档站首页缺失'
  Assert-Path (Join-Path $stage 'luminous\_next') '⚠️ 重映射失败：_next 没落到 /luminous/ 下，线上 CSS/JS 会全 404'
  Assert-Path (Join-Path $stage 'luminous\api\search.json') '搜索索引缺失：构建收尾脚本未跑，或又变成无扩展名的 search'
} else {
  Assert-Path (Join-Path $stage 'index.html') '首页缺失'
}

if ($fail -gt 0) {
  throw "自检未通过（$fail 项）。产物形态不对，先修构建再上传。"
}

$files = Get-ChildItem $stage -Recurse -File
$sizeMb = ($files | Measure-Object Length -Sum).Sum / 1MB
Write-Host ("`n待上传: {0} 个文件, {1:N1} MB（未压缩）" -f $files.Count, $sizeMb) -ForegroundColor Cyan

# ---- 上传 ------------------------------------------------------------------
# ⚠️ qupload2 收的是**命令行 flags**，不是配置文件。
# qshell 确实有个 `--config`，但那是**全局 flag**（指定 qshell 自己的账号配置，
# 默认 $HOME/.qshell.json），与上传参数无关。早期 v1 的 `qupload` 才吃 JSON 配置文件，
# 照那个写法传会得到一句看不懂的报错：
#     [E] check error: 【-11000】Bucket can't be empty
# 所以这里显式拼参数，别改回配置文件形式。
$uploadArgs = @(
  'qupload2',
  '--src-dir', $stage,
  '--bucket', $Bucket,
  '--overwrite',
  '--rescan-local',
  # 按扩展名/内容判定 MimeType，取 1 = 忽略上传方给的类型，优先按扩展名与内容探测。
  # 本站的搜索索引就是靠这个把 .json 正确判成 application/json。
  '--detect-mime', '1',
  '--thread-count', '10',
  '--skip-file-prefixes', '.DS_Store',
  '--skip-fixed-strings', '.DS_Store'
)

if ($DryRun) {
  Write-Host "`n[DryRun] 不执行上传。将要上传的目录树：" -ForegroundColor Magenta
  Get-ChildItem $stage -Directory | ForEach-Object { "  $($_.Name)/" }
  Write-Host "`n[DryRun] 实际命令会是："
  Write-Host "  qshell $($uploadArgs -join ' ')"
  return
}

if ($StageOnly) {
  Write-Host "`n[StageOnly] 暂存目录已就绪：$stage" -ForegroundColor Magenta
  Write-Host "可以起个静态服务器自查： npx serve $stage"
  return
}

# ---- 定位 qshell -----------------------------------------------------------
# 解析顺序（先精确后宽松）：
#   1. -Qshell 显式传入
#   2. 环境变量 LUMINARYQSHELL
#   3. PATH 里的 qshell
#   4. 仓库根上一级（工作区根，Lumos/）下的 qshell.exe / qshell
#
# 第 4 条是因为常见做法是"把 exe 下到工作区根"，虽然不是很干净，
# 但比让脚本硬编一个绝对路径可靠——别人 clone 下来也照样能跑。
function Resolve-Qshell {
  param([string]$Explicit)

  if ($Explicit) {
    if (-not (Test-Path $Explicit)) { throw "-Qshell 指定的路径不存在：$Explicit" }
    return (Resolve-Path $Explicit).Path
  }

  if ($env:LUMINARYQSHELL) {
    if (-not (Test-Path $env:LUMINARYQSHELL)) { throw "LUMINARYQSHELL 指向的路径不存在：$env:LUMINARYQSHELL" }
    return (Resolve-Path $env:LUMINARYQSHELL).Path
  }

  $onPath = Get-Command qshell -ErrorAction SilentlyContinue
  if ($onPath) { return $onPath.Source }

  # 仓库根 → 上一级（工作区根）→ 再上一级，逐层找
  $dir = $repoRoot
  for ($i = 0; $i -lt 3; $i++) {
    foreach ($name in @('qshell.exe', 'qshell')) {
      $candidate = Join-Path $dir $name
      if (Test-Path $candidate) { return (Resolve-Path $candidate).Path }
    }
    $dir = Split-Path $dir -Parent
    if (-not $dir) { break }
  }

  return $null
}

$qshellExe = Resolve-Qshell -Explicit $Qshell

if (-not $qshellExe) {
  throw @"
找不到 qshell。三种解决办法：
  1. 用 -Qshell 指定路径，例如：
       -Qshell ..\..\..\qshell.exe
  2. 设环境变量：`$env:LUMINARYQSHELL = 'D:\path\to\qshell.exe'
  3. 把 qshell.exe 放到 PATH 里，或放到仓库根 / 工作区根（Lumos/）下
下载：https://developer.qiniu.com/kodo/1302/qshell
（也可以只用 -StageOnly 组装出目录，再用 Kodo Browser 手动拖上去。）
"@
}

Write-Host "qshell: $qshellExe" -ForegroundColor DarkGray

# 账号没配的话，qupload2 会报一句很难懂的错，这里提前拦一下
$accountFile = Join-Path $env:USERPROFILE '.qshell\account.json'
if (-not (Test-Path $accountFile)) {
  Write-Host "`n⚠️  没找到 $accountFile" -ForegroundColor Yellow
  Write-Host "    先跑一次： & '$qshellExe' account <AccessKey> <SecretKey>" -ForegroundColor Yellow
  throw "qshell 账号未配置。"
}

Write-Host "`n--- 开始上传 ---" -ForegroundColor Cyan
& $qshellExe @uploadArgs
if ($LASTEXITCODE -ne 0) { throw "qshell 上传失败，退出码 $LASTEXITCODE" }

# ---- 上传后校验 ------------------------------------------------------------
Write-Host "`n--- 线上校验 ---" -ForegroundColor Yellow
$base = "https://$Domain"
$checks = if ($App -eq 'site') {
  @(
    @{ Url = "$base/luminous/";              Expect = 200 },
    @{ Url = "$base/luminous/docs/";         Expect = 200 },
    @{ Url = "$base/luminous/api/search.json"; Expect = 200; Type = 'application/json' }
  )
} else {
  @(@{ Url = "$base/"; Expect = 200 })
}

foreach ($c in $checks) {
  try {
    $r = Invoke-WebRequest -Uri $c.Url -Method Head -TimeoutSec 20 -SkipHttpErrorCheck
    $ok = $r.StatusCode -eq $c.Expect
    $line = "  {0} {1} → {2}" -f $(if ($ok) { 'OK  ' } else { 'FAIL' }), $c.Url, $r.StatusCode
    if ($c.Type) {
      $ct = $r.Headers['Content-Type']
      $ctypeOk = $ct -like "$($c.Type)*"
      $line += "  Content-Type=$ct"
      if (-not $ctypeOk) { $line += "  ⚠️ 期望 $($c.Type)（搜索会失效）" ; $ok = $false }
    }
    Write-Host $line -ForegroundColor $(if ($ok) { 'Green' } else { 'Red' })
  } catch {
    Write-Host "  FAIL $($c.Url) → $($_.Exception.Message)" -ForegroundColor Red
  }
}

Write-Host "`n完成。若刚更新过文件但线上还是旧的，去控制台刷新 CDN 缓存。" -ForegroundColor Cyan
