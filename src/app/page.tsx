import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";
import HomeClient from "./home-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let cats: (typeof categories.$inferSelect)[] = [];
  let featured: (typeof products.$inferSelect)[] = [];
  let allProds: (typeof products.$inferSelect)[] = [];

  try {
    cats = await db.select().from(categories).orderBy(asc(categories.sortOrder));
    featured = await db
      .select()
      .from(products)
      .where(eq(products.isFeatured, true))
      .orderBy(desc(products.rating))
      .limit(8);
    allProds = await db
      .select()
      .from(products)
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt))
      .limit(12);
  } catch {
    // Tables might not exist yet
  }

  return <HomeClient categories={cats} featured={featured} products={allProds} />;
}
