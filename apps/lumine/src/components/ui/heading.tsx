import { InfoButton } from '@/components/ui/info-button';
import type { InfobarContent } from '@/components/ui/infobar';

interface HeadingProps {
  /** 可选。面包屑已是「你在哪里」的指示器，多数页面不需要再给标题。 */
  title?: string;
  description: string;
  infoContent?: InfobarContent;
}

/**
 * 页面头部：可选标题 + 一句上下文说明。
 *
 * ## 为什么标题是可选的
 *
 * 顶部面包屑的末项已经显示当前页名，侧边栏同时高亮对应导航项。再渲染一个同名
 * `<h1>` 会让同一个名字在界面上出现三次。
 *
 * ## 为什么无标题时仍然保留 `h2` 而非 `h1`
 *
 * 页面真正的一级标题应当由内容自己给出（例如详情页的药名）。这里用 `h2`，
 * 避免出现两个 `h1` 或标题层级跳级；不传 `title` 时它根本不渲染。
 */
export function Heading({ title, description, infoContent }: HeadingProps) {
  if (!title && !description) return null;

  return (
    <div className='flex items-start justify-between gap-4'>
      <div>
        {title && (
          <div className='flex items-center gap-2'>
            <h2 className='text-2xl font-semibold tracking-tight'>{title}</h2>
            {infoContent && (
              <div className='pt-1'>
                <InfoButton content={infoContent} />
              </div>
            )}
          </div>
        )}
        {description && <p className='text-muted-foreground text-sm'>{description}</p>}
      </div>
      {!title && infoContent && <InfoButton content={infoContent} />}
    </div>
  );
}
