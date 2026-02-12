"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./SortByMenu.css";

export type SortKey =
  | "DEPARTURE_ASC"
  | "DEPARTURE_DESC"
  | "ARRIVAL_ASC"
  | "ARRIVAL_DESC"
  | "DURATION_ASC"
  | "DURATION_DESC";

type Props = {
  value: SortKey;
  onChange: (k: SortKey) => void;
  buttonLabel?: string;
  className?: string;
  panelMinWidth?: number;
  panelMaxWidth?: number;
};

type MenuPos = { top: number; left: number };

export default function SortByMenu({
  value,
  onChange,
  buttonLabel,
  className,
  panelMinWidth = 480,
  panelMaxWidth = 560,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<MenuPos | null>(null);
  const [panelWidth, setPanelWidth] = useState(panelMinWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null); // NEW

  const computePos = () => {
    const btn = btnRef.current;
    if (!btn) return;

    const r = btn.getBoundingClientRect();

    const vw = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0,
    );
    const maxPossible = Math.min(panelMaxWidth, vw - 24);
    const finalWidth = Math.max(panelMinWidth, maxPossible);
    setPanelWidth(finalWidth);

    let nextLeft = r.left;
    if (nextLeft + finalWidth > vw - 8) {
      nextLeft = Math.max(8, vw - finalWidth - 8);
    }

    setPos({
      top: r.bottom + 10,
      left: nextLeft,
    });
  };

  useLayoutEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => computePos());
    const onReflow = () => computePos();
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);
    return () => {
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  }, [open]);

  // ✅ Outside click on "click" (not mousedown) + check both refs
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      const container = containerRef.current;
      const menu = menuRef.current;

      const clickInsideTrigger = !!(container && container.contains(target));
      const clickInsideMenu = !!(menu && menu.contains(target));

      if (clickInsideTrigger || clickInsideMenu) {
        return; // ignore clicks inside
      }
      setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("click", onDocClick); // <-- CHANGED
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const labelFor = (k: SortKey) => {
    if (k.startsWith("DEPARTURE")) return "Departure";
    if (k.startsWith("ARRIVAL")) return "Arrival";
    if (k.startsWith("DURATION")) return "Duration";
    return "Sort";
  };

  const currentPrimary = labelFor(value);

  const pick = (k: SortKey) => {
    onChange(k); // updates parent state
    sessionStorage.setItem("sortKey", k);
    setOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`sortby__container${className ? ` ${className}` : ""}`}
    >
      <button
        ref={btnRef}
        type="button"
        className="sortby__btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="sortby__btn-text">Sort By</span>&nbsp;|&nbsp;
        {buttonLabel ?? currentPrimary}
      </button>

      {open && pos
        ? createPortal(
            <div
              key={value} // keep this - safe rerender
              ref={menuRef} // NEW: reference the menu
              className="sortby__menu"
              style={{
                position: "fixed",
                top: pos.top,
                left: pos.left,
                zIndex: 999999,
                width: "280px",
              }}
              role="menu"
              aria-label="Sort options"
              onMouseDown={(e) => e.stopPropagation()} // stop mousedown bubbling
            >
              <div className="sortby__menu-arrow" />

              <div className="sortby__grid" role="group" aria-label="Sort by">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={value === "DURATION_ASC"}
                  className={`sortby__cell ${value === "DURATION_ASC" ? "sortby__cell--active" : ""}`}
                  onClick={() => pick("DURATION_ASC")}
                >
                  <div className="sortby__cell-title">Duration</div>
                  <div className="sortby__cell-sub">Early First</div>
                </button>

                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={value === "DURATION_DESC"}
                  className={`sortby__cell ${value === "DURATION_DESC" ? "sortby__cell--active" : ""}`}
                  onClick={() => pick("DURATION_DESC")}
                >
                  <div className="sortby__cell-title">Duration</div>
                  <div className="sortby__cell-sub">Late First</div>
                </button>

                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={value === "DEPARTURE_ASC"}
                  className={`sortby__cell ${value === "DEPARTURE_ASC" ? "sortby__cell--active" : ""}`}
                  onClick={() => pick("DEPARTURE_ASC")}
                >
                  <div className="sortby__cell-title">Departure</div>
                  <div className="sortby__cell-sub">Early First</div>
                </button>

                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={value === "DEPARTURE_DESC"}
                  className={`sortby__cell ${value === "DEPARTURE_DESC" ? "sortby__cell--active" : ""}`}
                  onClick={() => pick("DEPARTURE_DESC")}
                >
                  <div className="sortby__cell-title">Departure</div>
                  <div className="sortby__cell-sub">Late First</div>
                </button>

                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={value === "ARRIVAL_ASC"}
                  className={`sortby__cell ${value === "ARRIVAL_ASC" ? "sortby__cell--active" : ""}`}
                  onClick={() => pick("ARRIVAL_ASC")}
                >
                  <div className="sortby__cell-title">Arrival</div>
                  <div className="sortby__cell-sub">Early First</div>
                </button>

                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={value === "ARRIVAL_DESC"}
                  className={`sortby__cell ${value === "ARRIVAL_DESC" ? "sortby__cell--active" : ""}`}
                  onClick={() => pick("ARRIVAL_DESC")}
                >
                  <div className="sortby__cell-title">Arrival</div>
                  <div className="sortby__cell-sub">Late First</div>
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
