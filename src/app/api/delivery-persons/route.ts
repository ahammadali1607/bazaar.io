import { db } from "@/db";
import { deliveryPersons } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.select().from(deliveryPersons);
  return NextResponse.json(data);
}
