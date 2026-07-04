import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let data;
  if (status) {
    data = await db.select().from(orders).where(eq(orders.status, status)).orderBy(desc(orders.createdAt));
  } else {
    data = await db.select().from(orders).orderBy(desc(orders.createdAt));
  }
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const orderNumber = `BZR-${Date.now().toString(36).toUpperCase()}`;

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail || null,
      address: body.address,
      village: body.village || null,
      pincode: body.pincode || null,
      items: body.items,
      subtotal: body.subtotal.toString(),
      deliveryFee: (body.deliveryFee || 0).toString(),
      total: body.total.toString(),
      paymentMethod: body.paymentMethod || "cod",
      notes: body.notes || null,
    })
    .returning();

  return NextResponse.json(order, { status: 201 });
}
