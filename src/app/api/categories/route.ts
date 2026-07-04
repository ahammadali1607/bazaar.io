import { db } from "@/db";
import { categories } from "@/db/schema";
import { asc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  return NextResponse.json(data);
}
