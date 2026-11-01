import { MongoClient, MongoServerError } from "mongodb";
import { setServers } from "node:dns";

interface VisitorDocument {
  _id: string;
  firstSeen: Date;
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

export async function registerVisitor(id: string): Promise<number> {
  const visitors = await visitorCollection();
  try {
    await visitors.updateOne({ _id: id }, { $setOnInsert: { firstSeen: new Date() } }, { upsert: true });
  } catch (error) {
    // Simultaneous first visits with the same ID still represent one browser.
    if (!(error instanceof MongoServerError) || error.code !== 11000) throw error;
  }
  return visitors.countDocuments();
}
