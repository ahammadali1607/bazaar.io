import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, asc, desc, ilike, and, SQL } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const sort = searchParams.get("sort") || "name_asc";
  const featured = searchParams.get("featured");

  const conditions: SQL[] = [eq(products.isActive, true)];
  if (category) conditions.push(eq(products.categoryId, parseInt(category)));
  if (featured === "true") conditions.push(eq(products.isFeatured, true));
  if (search) conditions.push(ilike(products.name, `%${search}%`));

  let orderClause;
  switch (sort) {
    case "price_asc": orderClause = asc(products.price); break;
    case "price_desc": orderClause = desc(products.price); break;
    case "rating": orderClause = desc(products.rating); break;
    case "newest": orderClause = desc(products.createdAt); break;
    default: orderClause = asc(products.name);
  }

  const data = await db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(orderClause);

  return NextResponse.json(data);
}
