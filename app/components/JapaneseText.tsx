"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

const translations = {
  作: "Create",
  作品: "Works",
  継続: "Continuation · Keep going",
  道具: "Tools",
  手記: "Personal notes",
  人物: "Person",
  作品集: "Portfolio · Collection of work",
  公開: "Public",
  固定: "Pinned · Fixed in place",
  日々精進: "Keep improving every day",
  創造と探求: "Creation and exploration",
  小さな一歩: "One small step",
  探求: "Exploration · Pursuit",
};

export type JapanesePhrase = keyof typeof translations;

export function JapaneseText({ text, children, className = "" }: { text: JapanesePhrase; children?: ReactNode; className?: string }) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ left: 8, top: 8 });
  const trigger = useRef<HTMLSpanElement>(null);
  const tooltip = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const id = useId();
  const meaning = translations[text];

  function cancelClose() {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
  }

  function scheduleClose() {
    cancelClose();
    closeTimer.current = setTimeout(() => {
      if (document.activeElement !== trigger.current) setOpen(false);
    }, 120);
  }

  useLayoutEffect(() => {
    if (!open) return;
    function reposition() {
      if (!trigger.current || !tooltip.current) return;
      const anchor = trigger.current.getBoundingClientRect();
      const bubble = tooltip.current.getBoundingClientRect();
      const left = Math.max(8, Math.min(anchor.left + anchor.width / 2 - bubble.width / 2, window.innerWidth - bubble.width - 8));
      const top = anchor.top >= bubble.height + 18 ? anchor.top - bubble.height - 10 : Math.min(anchor.bottom + 10, window.innerHeight - bubble.height - 8);
      setPosition({ left, top: Math.max(8, top) });
    }
    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, text]);

  useEffect(() => {
    if (!open) return;
    const dismiss = () => setOpen(false);
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") dismiss(); };
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!trigger.current?.contains(event.target) && !tooltip.current?.contains(event.target)) dismiss();
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => () => { if (closeTimer.current !== null) clearTimeout(closeTimer.current); }, []);

  return (
    <>
      <span ref={trigger} className={`japanese-text ${className}`} tabIndex={0} aria-label={`${text}: ${meaning}`} aria-describedby={open ? id : undefined}
        onMouseEnter={() => { cancelClose(); setOpen(true); }} onMouseLeave={scheduleClose}
        onFocus={() => { cancelClose(); setOpen(true); }} onBlur={() => { cancelClose(); setOpen(false); }}
        onClick={event => { event.preventDefault(); cancelClose(); setOpen(true); }}
        onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setOpen(value => !value); } }}>
        <span lang="ja">{children || text}</span>
      </span>
      {open && createPortal(
        <span ref={tooltip} role="tooltip" id={id} className="translation-tooltip" style={position} onMouseEnter={cancelClose} onMouseLeave={scheduleClose}>
          <span className="translation-original" lang="ja">{text}</span><span>{meaning}</span>
        </span>, document.body,
      )}
    </>
  );
}
