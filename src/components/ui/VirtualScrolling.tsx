import React, { useState, useEffect, useRef, useMemo } from "react";

interface VirtualScrollingProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualScrolling<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = "",
}: VirtualScrollingProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const { visibleItems, totalHeight, offsetY } = useMemo(() => {
    const itemCount = items.length;
    const startIndex = Math.max(
      0,
      Math.floor(scrollTop / itemHeight) - overscan
    );
    const endIndex = Math.min(
      itemCount - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    const visibleItems = items
      .slice(startIndex, endIndex + 1)
      .map((item, index) => ({
        item,
        index: startIndex + index,
      }));

    return {
      visibleItems,
      totalHeight: itemCount * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [items, itemHeight, scrollTop, containerHeight, overscan]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div
              key={index}
              style={{ height: itemHeight }}
              className="flex-shrink-0"
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hook for dynamic item height calculation
export function useDynamicItemHeight<T>(
  items: T[],
  estimatedItemHeight: number = 200
) {
  const [itemHeights, setItemHeights] = useState<Map<number, number>>(
    new Map()
  );
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const setItemRef = (index: number) => (ref: HTMLDivElement | null) => {
    if (ref) {
      itemRefs.current.set(index, ref);
    } else {
      itemRefs.current.delete(index);
    }
  };

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const newHeights = new Map(itemHeights);
      let hasChanges = false;

      entries.forEach((entry) => {
        const element = entry.target as HTMLDivElement;
        const index = Array.from(itemRefs.current.entries()).find(
          ([, ref]) => ref === element
        )?.[0];

        if (index !== undefined) {
          const height = entry.contentRect.height;
          if (newHeights.get(index) !== height) {
            newHeights.set(index, height);
            hasChanges = true;
          }
        }
      });

      if (hasChanges) {
        setItemHeights(newHeights);
      }
    });

    itemRefs.current.forEach((ref) => {
      observer.observe(ref);
    });

    return () => {
      observer.disconnect();
    };
  }, [itemHeights]);

  const getItemHeight = (index: number) => {
    return itemHeights.get(index) || estimatedItemHeight;
  };

  const getTotalHeight = () => {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total += getItemHeight(i);
    }
    return total;
  };

  const getOffsetTop = (index: number) => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += getItemHeight(i);
    }
    return offset;
  };

  return {
    setItemRef,
    getItemHeight,
    getTotalHeight,
    getOffsetTop,
    itemHeights,
  };
}

// Advanced virtual scrolling with dynamic heights
export function AdvancedVirtualScrolling<T>({
  items,
  containerHeight,
  renderItem,
  estimatedItemHeight = 200,
  overscan = 5,
  className = "",
}: Omit<VirtualScrollingProps<T>, "itemHeight"> & {
  estimatedItemHeight?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const { setItemRef, getItemHeight, getTotalHeight, getOffsetTop } =
    useDynamicItemHeight(items, estimatedItemHeight);

  const { visibleItems, totalHeight, offsetY } = useMemo(() => {
    const itemCount = items.length;
    let startIndex = 0;
    let endIndex = itemCount - 1;

    // Find start index
    let accumulatedHeight = 0;
    for (let i = 0; i < itemCount; i++) {
      const itemHeight = getItemHeight(i);
      if (accumulatedHeight + itemHeight > scrollTop) {
        startIndex = Math.max(0, i - overscan);
        break;
      }
      accumulatedHeight += itemHeight;
    }

    // Find end index
    accumulatedHeight = getOffsetTop(startIndex);
    for (let i = startIndex; i < itemCount; i++) {
      if (accumulatedHeight > scrollTop + containerHeight) {
        endIndex = Math.min(itemCount - 1, i + overscan);
        break;
      }
      accumulatedHeight += getItemHeight(i);
    }

    const visibleItems = items
      .slice(startIndex, endIndex + 1)
      .map((item, index) => ({
        item,
        index: startIndex + index,
      }));

    return {
      visibleItems,
      totalHeight: getTotalHeight(),
      offsetY: getOffsetTop(startIndex),
    };
  }, [
    items,
    scrollTop,
    containerHeight,
    overscan,
    getItemHeight,
    getTotalHeight,
    getOffsetTop,
  ]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={scrollElementRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {visibleItems.map(({ item, index }) => (
            <div key={index} ref={setItemRef(index)} className="flex-shrink-0">
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
