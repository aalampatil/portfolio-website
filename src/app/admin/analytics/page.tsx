import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { isAnalyticsAuthorized } from "@/lib/analytics-auth";
import { getVisitorAnalytics, type AnalyticsSummary } from "@/lib/visitors";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata: Metadata = { title: "Private analytics", robots: { index: false, follow: false } };

function Breakdown({ title, rows }: { title: string; rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map(row => row.count));
  return <section className={styles.panel}>
    <h2>{title}</h2>
    {rows.length ? <ul className={styles.list}>{rows.map(row => <li key={row.label}>
      <div className={styles.row}><span>{row.label}</span><strong>{row.count.toLocaleString("en")}</strong></div>
      <div className={styles.track} aria-hidden="true"><div style={{ width: `${row.count / max * 100}%` }} /></div>
    </li>)}</ul> : <p>No visitors recorded yet.</p>}
  </section>;
}

export default async function AnalyticsPage() {
  // Recheck here: middleware alone is not the authorization boundary.
  if (!await isAnalyticsAuthorized(await headers())) return <main className={styles.main}><h1>Authentication required</h1></main>;
  let analytics: AnalyticsSummary;
  try { analytics = await getVisitorAnalytics(); } catch {
    return <main className={styles.main}><h1>Analytics temporarily unavailable</h1><p>Check the MongoDB connection and reload this page.</p></main>;
  }
  return <main className={styles.main}>
    <header className={styles.header}><div><p className="eyebrow">OWNER ACCESS</p><h1>Portfolio analytics</h1></div><a className="neo-button-secondary" href="/admin/analytics">Refresh</a></header>
    <p className={styles.note}>Anonymous browsers, counted once. Sources and locations describe each browser’s first recorded visit.</p>
    <div className={styles.stats}>
      <section className={styles.panel}><h2>Total visitors</h2><strong className={styles.number}>{analytics.total.toLocaleString("en")}</strong></section>
      <section className={styles.panel}><h2>New visitors · past 30 days</h2><strong className={styles.number}>{analytics.last30Days.toLocaleString("en")}</strong></section>
    </div>
    <div className={styles.grid}>
      <Breakdown title="Traffic sources · top 20" rows={analytics.sources} />
      <Breakdown title="Countries · top 20" rows={analytics.countries} />
      <Breakdown title="Cities · top 20" rows={analytics.cities} />
    </div>
    <section className={styles.panel}><h2>Latest first visits</h2><div className={styles.tableWrap}><table className={styles.table}>
      <thead><tr><th scope="col">Time (UTC)</th><th scope="col">Source</th><th scope="col">Country</th><th scope="col">City</th></tr></thead>
      <tbody>{analytics.recent.map((visit, index) => <tr key={`${visit.firstSeen}-${index}`}>
        <td><time dateTime={visit.firstSeen}>{visit.firstSeen.slice(0, 19).replace("T", " ")}</time></td><td>{visit.source}</td><td>{visit.country || "Unknown"}</td><td>{visit.city || "Unknown"}</td>
      </tr>)}</tbody>
    </table></div>{!analytics.recent.length && <p>No visitors recorded yet.</p>}</section>
    <p className={styles.note}>Location is approximate and may reflect a VPN or mobile network. Direct / Unknown includes hidden referrers. Older records have no source or location history. Raw IP addresses and full referrer URLs are not stored.</p>
    <Link className="text-link" href="/">Back to portfolio</Link>
  </main>;
}
