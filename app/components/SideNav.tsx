import { JapaneseText } from "./JapaneseText";
import type { NavItem } from "../types";

export function SideNav({ items }: { items: NavItem[] }) {
  return (
    <nav className="content-nav" aria-label="Portfolio sections">
      <span className="content-nav-label">EXPLORE</span>
      <div>{items.map((item, index) => <a key={item.id} href={`#${item.id}`}><span>{item.number || String(index + 1).padStart(2, "0")}</span>{item.label}</a>)}</div>
      <JapaneseText className="content-nav-end" text="作品集" />
    </nav>
  );
}
