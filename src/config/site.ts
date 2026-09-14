const configuredSiteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const siteUrl = new URL(configuredSiteUrl);

export const siteConfig = {
  name: "Catalog Admin",
  description: "Nền tảng quản trị product catalog với authentication và RBAC.",
  locale: "vi_VN",
  language: "vi-VN",
} as const;

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, siteUrl).toString();
}
