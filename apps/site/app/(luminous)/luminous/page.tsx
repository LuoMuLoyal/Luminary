import Link from 'next/link'

export default function LuminousHomePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Luminous</h1>
      <p className="text-fd-muted-foreground mt-4">
        官网落地页占位。内容规划：产品介绍、下载（GitHub Releases）、FAQ、隐私 / 安全 / 条款。
      </p>
      <p className="mt-6">
        {/*
          href 写**裸路径**，不带 /luminous 前缀：`basePath` 会在构建时自动注入。
          若在这里手写前缀，产出会变成 /luminous/luminous/docs（双重前缀）。
        */}
        <Link className="underline" href="/docs">
          前往文档 →
        </Link>
      </p>
    </main>
  )
}
