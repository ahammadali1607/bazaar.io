import { db } from "@/db";
import { products, reviews } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const productReviews = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, product.id));

  return NextResponse.json({ ...product, reviews: productReviews });
}
