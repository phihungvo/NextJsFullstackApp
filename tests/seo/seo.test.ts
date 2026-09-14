import { describe, expect, it } from "vitest";

import { absoluteUrl, siteConfig } from "@/config/site";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("SEO foundation", () => {
  it("publishes the confirmed public home page in the sitemap", () => {
    expect(sitemap()).toEqual([{ url: absoluteUrl("/") }]);
  });

  it("points crawlers to the sitemap and excludes private/API paths", () => {
    expect(robots()).toEqual({
      rules: {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard", "/login"],
      },
      sitemap: absoluteUrl("/sitemap.xml"),
    });
  });

  it("keeps the site identity explicit for metadata and structured data", () => {
    expect(siteConfig.name).toBe("Catalog Admin");
    expect(siteConfig.language).toBe("vi-VN");
  });
});
