export const canUseDom = Boolean(
  typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
);

export function isSafari(): boolean {
  return (
    (typeof window !== 'undefined' &&
      /^((?!chrome|android).)*safari/i.test(window.navigator.userAgent)) ||
    (canUseDom && !!(window as any).safari)
  );
}
