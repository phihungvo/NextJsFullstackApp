"use client";

type ErrorPageProps = {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="error-page" role="alert">
      <p className="eyebrow">Application error</p>
      <h1>Đã xảy ra lỗi</h1>
      <p>Không thể hoàn tất yêu cầu hiện tại. Vui lòng thử lại.</p>
      <button type="button" onClick={reset}>
        Thử lại
      </button>
    </main>
  );
}
