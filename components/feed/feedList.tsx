"use client";

import { useState, useCallback } from "react";
import { 
  getFeed, 
  getUserFeed,
  GetFeed200ActivitiesItem, 
} from "@/lib/api/fetch-generated";
import { FeedItem } from "@/components/feed/feedItem";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { EmptyFeed } from "./feedList/emptyFeed";
import { FeedLoading } from "./feedList/feedLoading";

interface FeedListProps {
  initialItems: GetFeed200ActivitiesItem[];
  initialNextCursor: string | null;
  userId?: string;
}

export function FeedList({ initialItems, initialNextCursor, userId }: FeedListProps) {
  const [items, setItems] = useState<GetFeed200ActivitiesItem[]>(initialItems);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetchMore = useCallback(async () => {
    if (isLoading || !nextCursor) return;

    setIsLoading(true);
    setHasError(false);

    try {
      const params = {
        limit: 5,
        cursor: nextCursor,
      };

      const response = userId 
        ? await getUserFeed(userId, params)
        : await getFeed(params);

      if (response.status === 200) {
        const { activities, nextCursor: newCursor } = response.data;
        setItems((prev) => [...prev, ...activities]);
        setNextCursor(newCursor);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error("Failed to fetch more feed items", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, nextCursor, userId]);

  const observerTarget = useInfiniteScroll({
    onIntersect: fetchMore,
    enabled: !!nextCursor && !isLoading,
  });

  if (items.length === 0 && !isLoading) {
    return <EmptyFeed isUserProfile={!!userId} />;
  }

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-8">
        {items.map((item) => (
          <FeedItem key={item.id} item={item} />
        ))}
      </div>

      <FeedLoading
        isLoading={isLoading}
        hasError={hasError}
        hasMore={!!nextCursor}
        onRetry={fetchMore}
        targetRef={observerTarget}
      />
    </div>
  );
}
