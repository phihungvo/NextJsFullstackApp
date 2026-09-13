import { ProductForm } from "@/features/products/product-form";

export default function NewProductPage() {
  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Tạo sản phẩm</h1>
          <p>Thêm một sản phẩm vào catalog với validation ở server.</p>
        </div>
      </div>
      <ProductForm />
    </section>
  );
}
