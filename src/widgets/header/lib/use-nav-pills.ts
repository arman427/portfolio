"use client";

import {
    useEffect,
    useLayoutEffect,
    useRef,
    type FocusEvent,
    type PointerEvent,
} from "react";

type Pill = "active" | "hover";

/**
 * Moves one of the list's two pills under `item` through `--{pill}-x/-w`.
 * A visible pill slides there, sweeping across every item in between; a
 * hidden one (or a forced `snap`, e.g. after a resize) jumps first and only
 * then fades in, so it never flies in from a stale spot.
 */
function place(
    list: HTMLElement,
    pill: Pill,
    item: HTMLElement | null,
    snap = false,
) {
    const shown = `data-${pill}`;
    if (!item) {
        list.removeAttribute(shown);
        return;
    }

    const jump = snap || !list.hasAttribute(shown);
    if (jump) list.setAttribute(`data-${pill}-snap`, "");
    list.style.setProperty(`--${pill}-x`, `${item.offsetLeft}px`);
    list.style.setProperty(`--${pill}-w`, `${item.offsetWidth}px`);
    list.setAttribute(shown, "");
    if (jump) {
        // Flush the new position while the slide is switched off.
        void list.offsetWidth;
        list.removeAttribute(`data-${pill}-snap`);
    }
}

const itemOf = (list: HTMLElement, id: string | null) =>
    id ? list.querySelector<HTMLElement>(`:scope > [data-id="${id}"]`) : null;

/**
 * Sliding highlights for the desktop nav: one pill rests on the section in
 * view and follows it while scrolling, the other follows the pointer or the
 * keyboard focus. Items are the list's children marked with `data-id`.
 * Everything runs on DOM attributes, so hovering never re-renders the header.
 */
export function useNavPills(activeId: string | null) {
    const listRef = useRef<HTMLUListElement>(null);
    const activeRef = useRef(activeId);
    const hoveredRef = useRef<HTMLElement | null>(null);

    useLayoutEffect(() => {
        activeRef.current = activeId;
        const list = listRef.current;
        if (list) place(list, "active", itemOf(list, activeId));
    }, [activeId]);

    // Label widths change with the font load, the locale and the breakpoint
    // that reveals the nav — re-measure without animating.
    useEffect(() => {
        const list = listRef.current;
        if (!list) return;

        const observer = new ResizeObserver(() => {
            place(list, "active", itemOf(list, activeRef.current), true);
            if (hoveredRef.current?.isConnected)
                place(list, "hover", hoveredRef.current, true);
        });
        observer.observe(list);
        for (const item of list.children) observer.observe(item);
        return () => observer.disconnect();
    }, []);

    const hover = (item: HTMLElement | null) => {
        const list = listRef.current;
        if (!list || item === hoveredRef.current) return;
        hoveredRef.current = item;
        place(list, "hover", item);
    };

    const listProps = {
        onPointerOver(event: PointerEvent<HTMLUListElement>) {
            // A tap would leave the pill stuck on the item.
            if (event.pointerType === "touch") return;
            const item = (event.target as Element).closest<HTMLElement>(
                "[data-id]",
            );
            // Pointer in the gap between items: stay where it was.
            if (item) hover(item);
        },
        onPointerLeave() {
            hover(null);
        },
        onFocus(event: FocusEvent<HTMLUListElement>) {
            if (!event.target.matches(":focus-visible")) return;
            hover(event.target.closest<HTMLElement>("[data-id]"));
        },
        onBlur(event: FocusEvent<HTMLUListElement>) {
            if (!event.currentTarget.contains(event.relatedTarget)) hover(null);
        },
    };

    return { listRef, listProps };
}
