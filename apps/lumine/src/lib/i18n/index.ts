/**
 * i18n 初始化。
 *
 * ## 默认语言是英文
 *
 * `fallbackLng: 'en'` 且 `lng` 的判定顺序是「用户上次选择 → 英文」。
 * 不跟随浏览器 `navigator.language` 自动切中文：界面语言的默认值是产品决策，
 * 不是运行环境推断。用户显式切换后记在 `localStorage.lumine.lang`。
 *
 * ## 为什么资源是 JSON 而不是 TS
 *
 * 文案与代码分离，翻译可以整文件替换；`satisfies` 只在类型层约束键名，
 * 缺键会在编译期报错（见 `resources` 的类型标注）。
 *
 * ## 命名空间
 *
 * 按 feature 分：`auth` 与 `nav`。不要在 `common` 里堆一切——那样一个 feature
 * 的键名改动会牵扯全部页面。
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enAuth from './locales/en/auth.json';
import enNav from './locales/en/nav.json';
import zhCNAuth from './locales/zh-CN/auth.json';
import zhCNNan from './locales/zh-CN/nav.json';

/** 支持的语言。新增语言时这里与 `locales/<lang>/` 一起加。 */
export const SUPPORTED_LANGUAGES = ['en', 'zh-CN'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

/** 语言选择器显示用的名字（用各语言自己的写法，不翻译）。 */
export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  'zh-CN': '简体中文'
};

const STORAGE_KEY = 'lumine.lang';

export const DEFAULT_LANGUAGE: Language = 'en';

function isLanguage(value: unknown): value is Language {
  return typeof value === 'string' && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

/** 读取用户上次选的语言；没有或非法时用默认值。 */
export function resolveInitialLanguage(): Language {
  // 先判 window：Node 26 起自带 localStorage 存根，直接判 	ypeof localStorage
  // 会在 SPA 预渲染（Node 里跑）时打出 ExperimentalWarning。
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isLanguage(stored) ? stored : DEFAULT_LANGUAGE;
  } catch {
    // 隐私模式下 localStorage 可能抛；语言不影响功能，静默回落。
    return DEFAULT_LANGUAGE;
  }
}

/** 切换语言并记住选择。 */
export async function setLanguage(language: Language): Promise<void> {
  // eslint-disable-next-line import/no-named-as-default-member -- i18next 的实例方法就是这个 API，导入的是单例而非默认导出的成员
  await i18n.changeLanguage(language);

  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // 写不进去只影响「下次打开还记不记得」，不值得打断当前操作。
  }
}

// eslint-disable-next-line import/no-named-as-default-member -- 同上：这是 i18next 单例的链式初始化 API
void i18n.use(initReactI18next).init({
  lng: resolveInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: [...SUPPORTED_LANGUAGES],
  defaultNS: 'auth',
  ns: ['auth', 'nav'],
  resources: {
    en: { auth: enAuth, nav: enNav },
    'zh-CN': { auth: zhCNAuth, nav: zhCNNan }
  },
  interpolation: {
    // React 已经转义，i18next 再转一次会把引号变成实体。
    escapeValue: false
  },
  returnNull: false
});

export default i18n;
