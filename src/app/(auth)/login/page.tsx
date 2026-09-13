import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <section className="auth-card" aria-labelledby="login-title">
      <p className="eyebrow">Welcome back</p>
      <h1 id="login-title">Đăng nhập workspace</h1>
      <p className="auth-description">Sử dụng tài khoản đã được cấp quyền để truy cập dashboard.</p>
      <LoginForm />
      <p className="auth-hint">Tài khoản development được tạo từ `prisma db seed`.</p>
    </section>
  );
}
