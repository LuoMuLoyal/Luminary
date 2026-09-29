# 七牛云部署（站点产物 → Kodo + CDN）

本文只讲**七牛云这条路径**的操作。产物形态、映射表、为什么这么设计的**原理**在
[`../deployment.md`](../deployment.md)，部署前请先读那一份。

配套脚本：`qiniu-upload.ps1`（组装 + 自检 + 上传 + 线上校验）。

## 0. 前置条件：备案（最容易卡住的一步）

七牛要**绑定自定义域名**才能当静态站访问，而绑定域名要求该域名**已备案**。
所以顺序是：

```
域名备案 → 七牛建空间 → 上传产物 → 绑自定义域名 → 配静态页面 → 刷新 CDN
```

如果 `devluo.com` 还没备案，七牛的静态站路径**走不通**——这不是配置问题。
不依赖备案的替代方案见本文末尾「没有备案怎么办」。

## 1. 拿密钥

七牛控制台 → 右上角头像 → **密钥管理** → 拿 `AccessKey` / `SecretKey`。

```
https://portal.qiniu.com/user/key
```

⚠️ 这两个 key 等同于账号密码，**不要写进仓库、不要提交**。
只配到本机 qshell 或 CI 的 secrets 里。

## 2. 装 qshell

七牛官方 CLI，本脚本不自己实现签名逻辑，直接调它。

```powershell
# 从官方下载：https://developer.qiniu.com/kodo/1302/qshell
```

**脚本会自动找 qshell**，解析顺序：

1. `-Qshell <路径>` 显式传入
2. 环境变量 `LUMINARYQSHELL`
3. PATH 里的 `qshell`
4. 仓库根往上三层，找 `qshell.exe` / `qshell`

第 4 条是为了兼容「把 exe 下到工作区根」这种常见做法。本机当前就属于这种：
`qshell.exe` 放在 `Lumos\`（工作区根），脚本从 `Luminary\` 往上走一层即可命中，不用传任何参数。

```powershell
& .\qshell.exe version    # 或 qshell version（若已在 PATH）
```

## 3. 配置账号

```powershell
& .\qshell.exe account <AccessKey> <SecretKey>
```

这会写进 `~/.qshell/account.json`。脚本上传前会检查该文件是否存在，
缺了会**提前报错**并提示这条命令——否则 `qupload2` 只会抛一句很难懂的错。

确认：

```powershell
& .\qshell.exe account
```

## 4. 建空间

控制台 → 对象存储 Kodo → **新建空间**：

| 项       | 值              | 说明                       |
| -------- | --------------- | -------------------------- |
| 空间名   | `luminary-docs` | 本项目固定用这个（已建好） |
| 存储区域 | 华东-浙江 等    | 就近即可                   |
| 访问控制 | **公开**        | 静态站必须公开可读         |

```text
https://portal.qiniu.com/kodo/bucket
```

## 5. 上传产物

### 方式 A：CI 自动部署（推荐）

`.github/workflows/site.yml` 的 `deploy` job 会在 **main 分支** 推送上自动部署，
PR 只跑构建门禁、不部署。

**需要配置的 repository secrets**（Settings → Secrets and variables → Actions）：

| 名称 | 值 |
|---|---|
| `QINIU_ACCESS_KEY` | 控制台「密钥管理」里的 AccessKey |
| `QINIU_SECRET_KEY` | 同上的 SecretKey |

可选 repository **variable**（Settings → Variables）：

| 名称 | 默认 | 说明 |
|---|---|---|
| `QINIU_BUCKET` | `luminary-docs` | 想换空间名时设这个 |

未配置凭据时 deploy job 会**跳过所有实质步骤并以成功结束** —— 构建门禁已在
build job 通过，缺凭据不该让整条流水线变红。

⚠️ 两个坑已在 workflow 注释里写明，改动时别踩回去：

1. **GitHub 不允许在 `if` 里直接引用 `secrets`**（官方文档明说
   "Secrets cannot be directly referenced in `if:` conditionals"）。
   所以是「job 级 env 绑 secret → 首个 step 判定并写 output → 后续 step 判 output」。
2. **`-StageDir` 必须显式传 `$RUNNER_TEMP`**。不传的话脚本用
   `[IO.Path]::GetTempPath()`（runner 上是 `/tmp`），与 `$RUNNER_TEMP`
   （`/home/runner/work/_temp`）**不是同一个目录**，会安静地上传一个空目录。

### 方式 B：本机手动上传

空间名已作为脚本默认值，**不用每次传**：

```powershell
cd Luminary

# 先干跑，只看映射和自检，不真上传
pwsh scripts/deploy/qiniu-upload.ps1 -Domain devluo.com -DryRun

# 确认无误后真上传
pwsh scripts/deploy/qiniu-upload.ps1 -Domain devluo.com
```

`-Domain` 只有上传后的 HTTP 校验会用到；还没绑域名时可以随便给一个，
校验会失败但不影响上传，或者加 `-StageOnly` 只组装不传。

> qshell 已放在工作区根（`Lumos\qshell.exe`）时，**不用传任何路径参数**，脚本会自动命中。
> 放在别处就用 `-Qshell <路径>`，或设 `$env:LUMINARYQSHELL`。

⚠️ 上传用的是 `qupload2` 的**命令行 flags**（`--src-dir` / `--bucket` / ...）。
qshell 确实有个 `--config`，但那是**全局 flag**（指向 qshell 自己的账号配置，
默认 `$HOME/.qshell.json`），跟上传参数无关。旧版 v1 `qupload` 才吃 JSON 配置文件——
按那个写法传会得到一句很难懂的报错：

```text
[E] check error: 【-11000】Bucket can't be empty
```

脚本里已经把原因写在注释里，别改回配置文件形式。

脚本做的事，按顺序：

1. 按 `docs/deployment.md` 的映射表在临时目录**组装出线上形态**
   （关键是把 `out/_next/` 放到 `luminous/_next/`）；
2. 可选剔除（见下节）；
3. **上传前自检**：缺 `luminous/_next` 或 `api/search.json` 直接报错并中止；
4. `qshell qupload2` 上传；
5. 按域名做 HTTP 校验，含 `search.json` 的 `Content-Type`。

只想组装出来自己看，加 `-StageOnly`，然后 `npx serve <暂存目录>`。

## 6. 体积构成（实测数据）

本仓库 `apps/site` 全量产物是 **4728 个文件 / 812.7 MB**：

| 部分                                        | 文件数 | 体积         | 处理             |
| ------------------------------------------- | ------ | ------------ | ---------------- |
| **RSC 导航载荷**（`out/luminous/**/*.txt`） | 2884   | **485.8 MB** | **保留**（见下） |
| HTML 页面                                   | 1347   | 284.4 MB     | 保留             |
| `_next/`（JS/CSS/字体）                     | 361    | 13.7 MB      | 保留             |
| `api/search.json`（搜索索引）               | 1      | 11.2 MB      | 保留             |
| `compodoc/`（Lucent 的另一套 API 文档）     | 899    | 61.6 MB      | 可选剔除         |

唯一提供的剔除开关是 `-DropCompodoc`（省 61.6 MB）。

### 为什么 RSC `.txt` 不剔除

这些 `.txt` 是 Next App Router 的 **client-navigation payload**，体积最大但**不是垃圾**：
删掉后页面照常打开，但站内跳转会从软导航退化成整页刷新（变慢、丢滚动位置）。
正常体验值这 486 MB，所以**脚本刻意不提供这个开关**——有意保留的代价，不要图省事去掉。

⚠️ 上传流量在七牛是**免费无上限**的，所以这 812 MB 传上去不花上传的钱，
真正要盯的是**下载流量**（见第 10 节）。

注意 `docs/deployment.md` 里说的「Brotli 压缩率约 10%」，那主要是 **HTML** 的压缩率。
RSC `.txt` 和 `compodoc` 里大量是 JSON/JS，**实际传输量会明显高于 10%**，
预估流量时别按 HTML 的比率套。

## 7. 控制台必须逐项配置的东西

进 空间设置，这六项缺一项线上就会坏：

### 7.1 默认首页（必配）

**开启**。开启后根目录及**子目录**的 `index.html` 才会作为目录 URL 的默认页。
不开的话 `/luminous/docs/` 这类目录 URL 全部 404。

> 这也是 `trailingSlash: true` 的原因：它让 `/about` 产出 `about/index.html`
> 而不是 `about.html`，与默认页机制吻合。

[https://developer.qiniu.com/kodo/8503/set-the-default-home-page](https://developer.qiniu.com/kodo/8503/set-the-default-home-page)

### 7.2 404 页面（必配）

指向空间内的 `404.html`。

### 7.3 Content-Type 按扩展名判定（必配）

对象存储按扩展名判类型。本仓库的搜索索引就因为无扩展名会被当成
`application/octet-stream`，所以构建收尾脚本把它改名成了 `api/search.json`
（见 `packages/sync/src/finalize-export.ts`）。

上传后用脚本的自动校验确认 `/luminous/api/search.json` 的 `Content-Type`
是 `application/json`。

### 7.4 Brotli（强烈建议）

在 CDN 域名配置里开。关掉的话 284 MB 的 HTML 是裸传的。

### 7.5 访问控制 = 公开

静态站必须公开读。私有空间浏览器取不到任何资源。

### 7.6 CDN 缓存刷新

更新部署后，若线上还是旧内容，控制台 → 文件管理 → **刷新 CDN 缓存**，
把变更路径刷一遍（本仓库按 `/luminous/` 前缀刷最省事）。

注意：全量刷新有每日额度限制，上传路径也别设太长的缓存 TTL，
否则每次部署都要等缓存过期。

## 8. 绑定自定义域名

空间设置 → 域名管理 → **绑定自定义域名**，填 `devluo.com`，
然后按提示配 CNAME 解析、等证书签发。

绑定成功后，脚本的线上校验才有意义（没绑域名时只能用七牛给的测试域名验证）。

## 9. 站点拓扑落位

```text
devluo.com/                  → personal（占根路径）
devluo.com/luminous/         → site（官网）
devluo.com/luminous/docs/    → site（文档站）
```

`site` 与 `personal` 同域共存、**都要产出 `/_next/`**，靠 `basePath: '/luminous'`
在构建期区分。上传时 `site` 必须重映射（脚本已处理），`personal` 原样上传：

```powershell
pwsh scripts/deploy/qiniu-upload.ps1 -App personal -Domain devluo.com
```

⚠️ 两个 app 传进**同一个空间**（`luminary-docs`），`personal` 占根、`site` 在 `/luminous/` 下，
这与线上拓扑一致，不要分开成两个空间（否则同域共存的前提就不成立了）。

## 10. 费用：10 GB 免费额度怎么算

七牛实名用户的免费额度（[官方说明](https://developer.qiniu.com/af/kb/1574/free-credit-information)）：

| 计费项                             | 免费额度   |
| ---------------------------------- | ---------- |
| 标准存储空间                       | 0–10 GB    |
| 上传流量                           | **无上限** |
| CDN 回源流出流量                   | 0–10 GB    |
| 标准存储 GET 请求                  | 0–100 万次 |
| 标准存储 PUT/DELETE                | 0–10 万次  |
| 融合 CDN HTTP 下载流量（中国大陆） | 0–10 GB/月 |
| 融合 CDN HTTP 下载流量（其他区域） | 0–10 GB/月 |

**上传免费**，所以 874 MB 全量传也不花上传的钱。要留神的是**下载流量**和**存储**：

- 存储：剔除后 265.9 MB，远在 10 GB 免费线内；就是全量 812.8 MB 也没超。
- 流量：这是真正会超的一项。10 GB/月 ≈ 页均 200 KB 的话约 5 万次页面浏览。
  文档站被批量抓取或图片被外链会很快吃满，**建议配 Referer 防盗链**。
- 超出部分：当月用、次月初扣费，按阶梯计费。账户余额不足会被冻结，
  建议留一点余额，别把免费额度当硬上限用。

## 没有备案怎么办

七牛绑域名要求备案。若备案还在走，先发不依赖它的部分：

- **`personal`** → GitHub Pages，免费、无需备案，见 `.github/workflows/personal.yml`。
- **`site`（含文档站）** → 同一套产物也能发 Pages，但 `basePath` 要调整：
  Pages 的项目页挂在 `/<repo>/` 下，`NEXT_PUBLIC_BASE_PATH` 得设成对应的子路径
  （例如 `/<repo>`），且 `_next` 的映射目标要跟着变。此时不需要 qshell。

备案下来之后再切七牛，产物形态不用改。

## 排错

| 现象                                | 原因                                                                  |
| ----------------------------------- | --------------------------------------------------------------------- |
| 线上全白、CSS/JS 404                | `_next` 没重映射。确认空间里存在 `luminous/_next/...`                 |
| 目录 URL 404，但带`index.html` 能开 | 没开**默认首页**                                                      |
| 搜索弹窗能开、输入无结果            | `api/search.json` 的 Content-Type 不是 `application/json`，或路径错了 |
| 文档站页面 404                      | 上传时漏了`out/luminous/docs/**`                                      |
| 页面能开但样式错乱                  | `NEXT_PUBLIC_BASE_PATH` 与上传前缀不一致                              |
| 更新后线上还是旧的                  | CDN 缓存，去控制台刷新                                                |
