import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: absoluteUrl("/") }];
}
