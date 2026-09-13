"use client";

import { ErrorState } from "@/components/ui/states";

export default function DashboardError({ reset }: { readonly reset: () => void }) {
  return <ErrorState description="Màn hình này gặp lỗi không mong muốn." onRetry={reset} />;
}
