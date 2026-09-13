import Link from "next/link";

export default function HomePage() {
  return (
    <section className="public-hero page-frame">
      <div className="hero-copy">
        <p className="eyebrow">Product operations workspace</p>
        <h1>Quản trị catalog rõ ràng, an toàn và sẵn sàng mở rộng.</h1>
        <p className="hero-description">
          Một frontend nền tảng cho Product, User, Role và Permission, kết nối với API đã được bảo
          vệ bằng session và permission ở server.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/login">
            Mở dashboard
          </Link>
          <a className="button button-secondary" href="#capabilities">
            Xem khả năng
          </a>
        </div>
      </div>
      <div className="hero-panel" aria-label="Tóm tắt workspace">
        <span className="hero-panel-label">Foundation status</span>
        <strong>Frontend baseline</strong>
        <div className="status-row">
          <span className="status-dot" /> API connected
        </div>
        <div className="status-row">
          <span className="status-dot" /> Permission aware
        </div>
        <div className="status-row">
          <span className="status-dot" /> Responsive UI
        </div>
      </div>
      <div id="capabilities" className="capability-grid">
        <article className="feature-card">
          <span>01</span>
          <h2>Sản phẩm</h2>
          <p>Danh sách, chi tiết, tạo, cập nhật và archive theo permission.</p>
        </article>
        <article className="feature-card">
          <span>02</span>
          <h2>Truy cập</h2>
          <p>UX phản ánh permission; mọi thao tác vẫn được enforce ở backend.</p>
        </article>
        <article className="feature-card">
          <span>03</span>
          <h2>Trạng thái</h2>
          <p>Loading, empty, error, 401, 403 và 404 được hiển thị nhất quán.</p>
        </article>
      </div>
    </section>
  );
}
