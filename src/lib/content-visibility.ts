/** Drafts appear only in development or the explicit local review build. */
export const reviewDrafts = import.meta.env.DEV || process.env.PREVIEW_DRAFTS === '1';
export const visibleContent = ({ data }: { data: { draft: boolean } }) => !data.draft || reviewDrafts;

