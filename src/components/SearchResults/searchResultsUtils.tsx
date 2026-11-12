import type { ReactNode } from 'react';

/**
 * Highlights the matching substring in bold/semi-bold (Figma spec:
 * "the matching part of each label is SemiBold").
 */
export const highlightSearchMatch = (text: string, query?: string): ReactNode => {
  if (!query || !query.trim()) return text;
  const q = query.trim().toLowerCase();
  const lower = text.toLowerCase();
  const index = lower.indexOf(q);
  if (index === -1) return text;

  const before = text.slice(0, index);
  const match = text.slice(index, index + q.length);
  const after = text.slice(index + q.length);

  return (
    <>
      {before}
      <strong className="fmdqui-search-results__match">{match}</strong>
      {after}
    </>
  );
};
