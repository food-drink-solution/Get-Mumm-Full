import { customFetch } from "./client";
import type {
  BlogPost,
  Category,
  Chef,
  ContactInput,
  ContactResponse,
  CreateOrderRequest,
  HealthStatus,
  ListBlogPostsParams,
  ListMenuItemsParams,
  ListTestimonialsParams,
  MenuItem,
  OfficeInquiryInput,
  OrderResponse,
  OrderStatusResponse,
  SiteSummary,
  SubscriptionPlan,
  Testimonial,
} from "./types";

// Some backend endpoints wrap lists in { data: T[] }, others return T[] directly.
// This helper handles both shapes safely.
async function fetchList<T>(url: string, params?: Record<string, string | number | boolean | undefined | null>): Promise<T[]> {
  let fullUrl = url;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const qs = searchParams.toString();
    if (qs) fullUrl = `${url}?${qs}`;
  }

  const raw = await customFetch<unknown>(fullUrl, { method: "GET" });

  // Handle { data: T[], pagination?: ... } envelope
  if (raw && typeof raw === "object" && !Array.isArray(raw) && "data" in (raw as object)) {
    return ((raw as { data: T[] }).data) ?? [];
  }

  // Handle plain T[] array
  if (Array.isArray(raw)) {
    return raw as T[];
  }

  return [];
}

// Static subscription plans — the backend /api/subscriptions stores user
// subscription records (userId/type/status), not a plan catalog. The pricing
// page needs plan definitions, so we define them here.
const STATIC_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 1,
    name: "Weekly Plan",
    nameAr: "الخطة الأسبوعية",
    description: "Fresh homemade meals delivered 5 days a week",
    descriptionAr: "وجبات منزلية طازجة تصلك 5 أيام في الأسبوع",
    price: 299,
    period: "weekly",
    isPopular: false,
    targetAudience: "individual",
    features: ["5 meals per week", "Free delivery", "Menu customization", "Cancel anytime"],
    featuresAr: ["5 وجبات أسبوعياً", "توصيل مجاني", "تخصيص القائمة", "إلغاء في أي وقت"],
  },
  {
    id: 2,
    name: "Monthly Plan",
    nameAr: "الخطة الشهرية",
    description: "Our most popular plan — full month of delicious meals",
    descriptionAr: "خطتنا الأكثر طلباً — شهر كامل من الوجبات اللذيذة",
    price: 999,
    period: "monthly",
    isPopular: true,
    targetAudience: "individual",
    features: ["Daily meals", "Free delivery", "Menu customization", "Priority support", "10% discount on extras"],
    featuresAr: ["وجبات يومية", "توصيل مجاني", "تخصيص القائمة", "دعم أولوي", "خصم 10% على الإضافات"],
  },
  {
    id: 3,
    name: "Office Plan",
    nameAr: "خطة المكاتب",
    description: "Best value for teams — bulk meals with special pricing",
    descriptionAr: "أفضل قيمة للفرق — وجبات جماعية بأسعار خاصة",
    price: 2699,
    period: "monthly",
    isPopular: false,
    targetAudience: "office",
    features: ["Daily team meals", "Free priority delivery", "Full menu access", "Dedicated account manager", "15% discount"],
    featuresAr: ["وجبات يومية للفريق", "توصيل أولوي مجاني", "وصول كامل للقائمة", "مدير حساب مخصص", "خصم 15%"],
  },
];

export const endpoints = {
  // Health
  healthCheck: () => customFetch<HealthStatus>("/api/health", { method: "GET" }),

  // Site Stats — flat object, no envelope
  getSiteSummary: () => customFetch<SiteSummary>("/api/stats", { method: "GET" }),

  // Subscriptions — uses static plan catalog (backend has user records, not plans)
  listSubscriptionPlans: (): Promise<SubscriptionPlan[]> =>
    Promise.resolve(STATIC_SUBSCRIPTION_PLANS),

  // Menu Categories
  listCategories: () => fetchList<Category>("/api/menu/categories"),

  // Menu Items
  listMenuItems: (params?: ListMenuItemsParams) =>
    fetchList<MenuItem>("/api/menu/items", params as Record<string, string | number | boolean | undefined | null>),

  getFeaturedItems: () => fetchList<MenuItem>("/api/menu/items/featured"),

  getMenuItem: (id: string | number) =>
    customFetch<MenuItem>(`/api/menu/items/${id}`, { method: "GET" }),

  // Chefs
  listChefs: () => fetchList<Chef>("/api/chefs"),

  getChef: (id: string | number) =>
    customFetch<Chef>(`/api/chefs/${id}`, { method: "GET" }),

  // Blog
  listBlogPosts: (params?: ListBlogPostsParams) =>
    fetchList<BlogPost>("/api/blog/posts", params as Record<string, string | number | boolean | undefined | null>),

  getBlogPost: (slug: string) =>
    customFetch<BlogPost>(`/api/blog/posts/${slug}`, { method: "GET" }),

  // Testimonials
  listTestimonials: (params?: ListTestimonialsParams) =>
    fetchList<Testimonial>("/api/testimonials", params as Record<string, string | number | boolean | undefined | null>),

  // Orders
  createOrder: (data: CreateOrderRequest) =>
    customFetch<OrderResponse>("/api/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getOrder: (id: string) =>
    customFetch<OrderResponse>(`/api/orders/${id}`, { method: "GET" }),

  getOrderStatus: (id: string) =>
    customFetch<OrderStatusResponse>(`/api/orders/${id}/status`, { method: "GET" }),

  // Forms
  submitContact: (data: ContactInput) =>
    customFetch<ContactResponse>("/api/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  submitOfficeInquiry: (data: OfficeInquiryInput) =>
    customFetch<ContactResponse>("/api/contact/office-inquiry", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
