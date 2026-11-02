import { MongoClient, MongoServerError } from "mongodb";
import { setServers } from "node:dns";
import type { VisitAttribution } from "@/lib/analytics";

interface VisitorDocument {
  _id: string;
  firstSeen: Date;
  source?: string;
  country?: string | null;
  city?: string | null;
}

const connections = globalThis as typeof globalThis & { portfolioVisitorsMongo?: Promise<MongoClient> };

async function visitorCollection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Visitor database is not configured");
  if (!connections.portfolioVisitorsMongo) {
    const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(",").map(server => server.trim()).filter(Boolean);
    if (dnsServers?.length) setServers(dnsServers);
    connections.portfolioVisitorsMongo = new MongoClient(uri, { serverSelectionTimeoutMS: 5000, maxPoolSize: 5 }).connect()
      .catch(error => { connections.portfolioVisitorsMongo = undefined; throw error; });
  }
  const client = await connections.portfolioVisitorsMongo;
  return client.db(process.env.MONGODB_DATABASE || "portfolio-ap").collection<VisitorDocument>("portfolio_visitors");
}

export function isVisitorId(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function getVisitorCount(): Promise<number> {
  const visitors = await visitorCollection();
  return visitors.countDocuments();
}

export async function registerVisitor(id: string, attribution?: VisitAttribution): Promise<number> {
  const visitors = await visitorCollection();
  try {
    await visitors.updateOne({ _id: id }, { $setOnInsert: { firstSeen: new Date(), ...attribution } }, { upsert: true });
  } catch (error) {
    // Simultaneous first visits with the same ID still represent one browser.
    if (!(error instanceof MongoServerError) || error.code !== 11000) throw error;
  }
  return visitors.countDocuments();
}

export interface AnalyticsSummary {
  total: number;
  last30Days: number;
  sources: { label: string; count: number }[];
  countries: { label: string; count: number }[];
  cities: { label: string; count: number }[];
  recent: { firstSeen: string; source: string; country: string | null; city: string | null }[];
}

export async function getVisitorAnalytics(): Promise<AnalyticsSummary> {
  const visitors = await visitorCollection();
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  type Group = { _id: string; count: number };
  const group = (field: "source" | "country") => visitors.aggregate<Group>([
    { $group: { _id: { $ifNull: [`$${field}`, field === "source" ? "Direct / Unknown" : "Unknown"] }, count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } }, { $limit: 20 },
  ]).toArray();
  const [total, last30Days, sources, countries, cities, recent] = await Promise.all([
    visitors.countDocuments(), visitors.countDocuments({ firstSeen: { $gte: since } }),
    group("source"), group("country"),
    visitors.aggregate<Group>([
      { $group: { _id: { $cond: [{ $and: ["$city", "$country"] }, { $concat: ["$city", ", ", "$country"] }, "Unknown"] }, count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } }, { $limit: 20 },
    ]).toArray(),
    visitors.find({}, { projection: { _id: 0, firstSeen: 1, source: 1, country: 1, city: 1 } }).sort({ firstSeen: -1 }).limit(25).toArray(),
  ]);
  const rows = (groups: Group[]) => groups.map(row => ({ label: row._id, count: row.count }));
  return {
    total, last30Days, sources: rows(sources), countries: rows(countries), cities: rows(cities),
    recent: recent.map(row => ({ firstSeen: row.firstSeen.toISOString(), source: row.source || "Direct / Unknown", country: row.country || null, city: row.city || null })),
  };
}
