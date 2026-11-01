export function SideNav({ items }) {
  return (
    <nav className="content-nav" aria-label="Portfolio sections">
      <span className="content-nav-label">EXPLORE</span>
      <div>{items.map((item, index) => <a key={item.id} href={`#${item.id}`}><span>0{index + 1}</span>{item.label}</a>)}</div>
      <span className="content-nav-end" aria-hidden="true">作品集</span>
    </nav>
  );
}
