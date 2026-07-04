import { db } from "@/db";
import { orders, products, categories, deliveryPersons } from "@/db/schema";
import { sql, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const [productCount] = await db.select({ count: sql<number>`count(*)::int` }).from(products);
  const [categoryCount] = await db.select({ count: sql<number>`count(*)::int` }).from(categories);
  const [orderCount] = await db.select({ count: sql<number>`count(*)::int` }).from(orders);
  const [pendingOrders] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(eq(orders.status, "pending"));
  const [deliveredOrders] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(orders)
    .where(eq(orders.status, "delivered"));
  const [revenue] = await db
    .select({ total: sql<string>`COALESCE(sum(total::numeric), 0)::text` })
    .from(orders)
    .where(eq(orders.status, "delivered"));
  const [deliveryCount] = await db.select({ count: sql<number>`count(*)::int` }).from(deliveryPersons);

  return NextResponse.json({
    products: productCount.count,
    categories: categoryCount.count,
    totalOrders: orderCount.count,
    pendingOrders: pendingOrders.count,
    deliveredOrders: deliveredOrders.count,
    revenue: parseFloat(revenue.total || "0"),
    deliveryPersons: deliveryCount.count,
  });
}
