import { supabase } from "@/lib/supabase";
import type {
  BlogPost,
  Category,
  Chef,
  ListBlogPostsParams,
  ListMenuItemsParams,
  ListTestimonialsParams,
  MenuItem,
  Testimonial,
} from "./types";

const CATEGORY_COLUMNS = "Id,Name,NameAr,Description,DescriptionAr,ImageUrl,ItemCount";
const CHEF_COLUMNS = "Id,Name,NameAr,Bio,BioAr,ImageUrl,Specialties,SpecialtiesAr,ItemCount,Rating,JoinedYear";
const MENU_ITEM_COLUMNS = "Id,Name,NameAr,Description,DescriptionAr,Price,CategoryId,CategoryName,CategoryNameAr,ImageUrl,Dietary,IsAvailable,IsFeatured,ChefName,ChefNameAr,Rating,PrepTimeMinutes,ChefId";
const BLOG_POST_COLUMNS = "Id,Title,TitleAr,Content,ContentAr,AuthorName,AuthorNameAr,Slug,PublishStatus,PublishedAt,CreatedAt";
const TESTIMONIAL_COLUMNS = "Id,CustomerName,Rating,Content,CreatedAt";

function toCategory(row: Record<string, unknown>): Category {
  const name = String(row.Name ?? "");
  return {
    id: String(row.Id ?? ""),
    name,
    nameAr: String(row.NameAr ?? name),
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    description: String(row.Description ?? ""),
    descriptionAr: String(row.DescriptionAr ?? ""),
    imageUrl: String(row.ImageUrl ?? ""),
    itemCount: Number(row.ItemCount ?? 0),
  };
}

function toChef(row: Record<string, unknown>): Chef {
  return {
    id: String(row.Id ?? ""),
    name: String(row.Name ?? ""),
    nameAr: String(row.NameAr ?? row.Name ?? ""),
    bio: String(row.Bio ?? ""),
    bioAr: String(row.BioAr ?? ""),
    imageUrl: String(row.ImageUrl ?? ""),
    specialties: Array.isArray(row.Specialties) ? row.Specialties.map(String) : [],
    specialtiesAr: Array.isArray(row.SpecialtiesAr) ? row.SpecialtiesAr.map(String) : [],
    itemCount: Number(row.ItemCount ?? 0),
    rating: Number(row.Rating ?? 0),
    joinedYear: Number(row.JoinedYear ?? 0),
  };
}

function normalizeDietary(value: string): string {
  return value.toLowerCase().replaceAll("-", "_").replaceAll(" ", "_");
}

function toMenuItem(row: Record<string, unknown>): MenuItem {
  return {
    id: String(row.Id ?? ""),
    name: String(row.Name ?? ""),
    nameAr: String(row.NameAr ?? row.Name ?? ""),
    description: String(row.Description ?? ""),
    descriptionAr: String(row.DescriptionAr ?? ""),
    price: Number(row.Price ?? 0),
    categoryId: String(row.CategoryId ?? ""),
    categoryName: String(row.CategoryName ?? ""),
    categoryNameAr: String(row.CategoryNameAr ?? ""),
    imageUrl: String(row.ImageUrl ?? ""),
    dietary: Array.isArray(row.Dietary) ? row.Dietary.map((value) => normalizeDietary(String(value))) : [],
    isAvailable: Boolean(row.IsAvailable),
    isFeatured: Boolean(row.IsFeatured),
    chefName: String(row.ChefName ?? ""),
    chefNameAr: String(row.ChefNameAr ?? ""),
    rating: row.Rating == null ? null : Number(row.Rating),
    prepTimeMinutes: row.PrepTimeMinutes == null ? null : Number(row.PrepTimeMinutes),
  };
}

function toBlogPost(row: Record<string, unknown>): BlogPost {
  const content = String(row.Content ?? "");
  const contentAr = String(row.ContentAr ?? "");
  const slug = String(row.Slug ?? "");
  const excerpt = content.slice(0, 180).trim();
  const excerptAr = contentAr.slice(0, 180).trim();
  const publishedAt = row.PublishedAt ?? row.CreatedAt;
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return {
    id: String(row.Id ?? ""),
    title: String(row.Title ?? ""),
    titleAr: String(row.TitleAr ?? row.Title ?? ""),
    slug,
    excerpt: content.length > 180 ? `${excerpt}…` : excerpt,
    excerptAr: contentAr.length > 180 ? `${excerptAr}…` : excerptAr,
    content,
    contentAr,
    imageUrl: "/fatta.png",
    type: slug.startsWith("recipe-") ? "recipe" : "blog",
    publishedAt: publishedAt ? new Date(String(publishedAt)).toISOString() : new Date().toISOString(),
    author: String(row.AuthorName ?? ""),
    authorAr: String(row.AuthorNameAr ?? row.AuthorName ?? ""),
    readTimeMinutes: Math.max(1, Math.ceil(wordCount / 200)),
    tags: slug.startsWith("recipe-") ? ["recipe", "Egyptian cuisine"] : ["Egyptian cuisine"],
  };
}

function toTestimonial(row: Record<string, unknown>): Testimonial {
  const content = String(row.Content ?? "");
  const containsArabic = /[\u0600-\u06ff]/.test(content);
  const name = String(row.CustomerName ?? "");
  return {
    id: String(row.Id ?? ""),
    name,
    nameAr: name,
    quote: content,
    quoteAr: containsArabic ? content : content,
    type: "customer",
    rating: Number(row.Rating ?? 0),
    avatarUrl: "",
    role: "",
    roleAr: "",
  };
}

export async function listCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("Categories")
    .select(CATEGORY_COLUMNS)
    .eq("IsDeleted", false)
    .order("Name");
  if (error) throw error;
  return (data ?? []).map((row) => toCategory(row as Record<string, unknown>));
}

export async function listMenuItems(params?: ListMenuItemsParams): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("MenuItems")
    .select(MENU_ITEM_COLUMNS)
    .eq("IsDeleted", false)
    .eq("IsAvailable", true)
    .order("Name");
  if (error) throw error;

  const search = params?.search?.trim().toLowerCase();
  const dietary = params?.dietary ? normalizeDietary(params.dietary) : null;
  return (data ?? [])
    .map((row) => toMenuItem(row as Record<string, unknown>))
    .filter((item) => !params?.categoryId || item.categoryId === String(params.categoryId))
    .filter((item) => params?.maxPrice == null || item.price <= params.maxPrice)
    .filter((item) => !search || `${item.name} ${item.nameAr} ${item.description} ${item.descriptionAr}`.toLowerCase().includes(search))
    .filter((item) => !dietary || item.dietary.includes(dietary));
}

export async function listFeaturedItems(): Promise<MenuItem[]> {
  return (await listMenuItems()).filter((item) => item.isFeatured);
}

export async function getMenuItem(id: string | number): Promise<MenuItem | null> {
  const { data, error } = await supabase
    .from("MenuItems")
    .select(MENU_ITEM_COLUMNS)
    .eq("Id", String(id))
    .eq("IsDeleted", false)
    .eq("IsAvailable", true)
    .maybeSingle();
  if (error) throw error;
  return data ? toMenuItem(data as Record<string, unknown>) : null;
}

export async function listChefs(): Promise<Chef[]> {
  const { data, error } = await supabase
    .from("Chefs")
    .select(CHEF_COLUMNS)
    .eq("IsDeleted", false)
    .order("Name");
  if (error) throw error;
  return (data ?? []).map((row) => toChef(row as Record<string, unknown>));
}

export async function getChef(id: string | number): Promise<Chef | null> {
  const { data, error } = await supabase
    .from("Chefs")
    .select(CHEF_COLUMNS)
    .eq("Id", String(id))
    .eq("IsDeleted", false)
    .maybeSingle();
  if (error) throw error;
  return data ? toChef(data as Record<string, unknown>) : null;
}

export async function listBlogPosts(params?: ListBlogPostsParams): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from("BlogPosts")
    .select(BLOG_POST_COLUMNS)
    .eq("IsDeleted", false)
    .eq("PublishStatus", 1)
    .order("PublishedAt", { ascending: false });
  if (error) throw error;

  return (data ?? [])
    .map((row) => toBlogPost(row as Record<string, unknown>))
    .filter((post) => !params?.type || post.type === params.type)
    .slice(0, params?.limit ?? undefined);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from("BlogPosts")
    .select(BLOG_POST_COLUMNS)
    .eq("Slug", slug)
    .eq("IsDeleted", false)
    .eq("PublishStatus", 1)
    .maybeSingle();
  if (error) throw error;
  return data ? toBlogPost(data as Record<string, unknown>) : null;
}

export async function listTestimonials(params?: ListTestimonialsParams): Promise<Testimonial[]> {
  if (params?.type && params.type !== "customer") return [];
  const { data, error } = await supabase
    .from("Testimonials")
    .select(TESTIMONIAL_COLUMNS)
    .eq("IsDeleted", false)
    .order("CreatedAt", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => toTestimonial(row as Record<string, unknown>));
}

export async function getTestimonial(id: string | number): Promise<Testimonial | null> {
  const { data, error } = await supabase
    .from("Testimonials")
    .select(TESTIMONIAL_COLUMNS)
    .eq("Id", String(id))
    .eq("IsDeleted", false)
    .maybeSingle();
  if (error) throw error;
  return data ? toTestimonial(data as Record<string, unknown>) : null;
}
