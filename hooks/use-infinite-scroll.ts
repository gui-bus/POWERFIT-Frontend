import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollOptions {
  onIntersect: () => void;
  enabled: boolean;
  threshold?: number;
}

export function useInfiniteScroll({
  onIntersect,
  enabled,
  threshold = 0.1,
}: UseInfiniteScrollOptions) {
  const targetRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && enabled) {
        onIntersect();
      }
    },
    [onIntersect, enabled]
  );

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(handleIntersect, { threshold });
    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [handleIntersect, threshold]);

  return targetRef;
}
