import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/site";
import { getAllCareerSlugs } from "@/data/careersData";

async function getAnnouncementEntries(siteUrl: string): Promise<MetadataRoute.Sitemap> {
  const { data, error } = await supabaseAdmin
    .from("announcements")
    .select("id, updated_at, created_at")
    .eq("is_published", true)
    .order("announcement_date", { ascending: false });

  if (error) {
    console.error("sitemap announcements error:", error.message);
    return [];
  }

  return (data ?? []).map((row) => ({
    url: `${siteUrl}/announcements/${row.id}`,
    lastModified: row.updated_at || row.created_at || undefined,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
}

// Built per request so each domain (see lib/site.ts) lists its own URLs.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getSiteUrl();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/about-us`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/courses`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/affiliated-institutions`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/announcements`, changeFrequency: "daily", priority: 0.8 },
    { url: `${siteUrl}/result`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/admit-card`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/careers`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/contact-us`, changeFrequency: "yearly", priority: 0.7 },
  ];

  const careerPages: MetadataRoute.Sitemap = getAllCareerSlugs().map((slug) => ({
    url: `${siteUrl}/careers/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const announcementPages = await getAnnouncementEntries(siteUrl);

  return [...staticPages, ...careerPages, ...announcementPages];
}
