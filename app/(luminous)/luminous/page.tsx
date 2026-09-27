import Link from 'next/link'

export default function LuminousHomePage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold">Luminous</h1>
      <p className="text-fd-muted-foreground mt-4">
        官网落地页占位。内容规划：产品介绍、下载（GitHub Releases）、FAQ、隐私 / 安全 / 条款。
      </p>
      <p className="mt-6">
        <Link className="underline" href="/luminous/docs">
          前往文档 →
        </Link>
      </p>
    </main>
  )
}
