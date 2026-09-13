import { ProductDetail } from "@/features/products/product-detail";

export default async function ProductDetailPage({
  params,
}: {
  readonly params: Promise<{ readonly id: string }>;
}) {
  const { id } = await params;
  return <ProductDetail productId={id} />;
}
