declare module 'katex/contrib/auto-render' {
  import type { KatexOptions } from 'katex';
  export default function renderMathInElement(element: HTMLElement, options: KatexOptions & {
    delimiters?: { left: string; right: string; display: boolean }[];
    ignoredClasses?: string[];
  }): void;
}
