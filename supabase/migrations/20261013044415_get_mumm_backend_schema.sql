CREATE TABLE public."Categories" (
    "Id" uuid NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "Name" text NOT NULL,
    "NameAr" text NOT NULL,
    "Description" text NOT NULL,
    "DescriptionAr" text NOT NULL,
    "ImageUrl" text NOT NULL,
    "ItemCount" integer NOT NULL,
    CONSTRAINT "PK_Categories" PRIMARY KEY ("Id")
);

CREATE TABLE public."Chefs" (
    "Id" uuid NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "Name" text NOT NULL,
    "NameAr" text NOT NULL,
    "Bio" text NOT NULL,
    "BioAr" text NOT NULL,
    "ImageUrl" text NOT NULL,
    "Specialties" text[] NOT NULL,
    "SpecialtiesAr" text[] NOT NULL,
    "ItemCount" integer NOT NULL,
    "Rating" numeric NOT NULL,
    "JoinedYear" integer NOT NULL,
    CONSTRAINT "PK_Chefs" PRIMARY KEY ("Id")
);

CREATE TABLE public."BlogPosts" (
    "Id" uuid NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "Title" text NOT NULL,
    "TitleAr" text NOT NULL,
    "Content" text NOT NULL,
    "ContentAr" text NOT NULL,
    "AuthorName" text NOT NULL,
    "AuthorNameAr" text NOT NULL,
    "Slug" text NOT NULL,
    "PublishStatus" integer NOT NULL,
    "PublishedAt" timestamp with time zone,
    CONSTRAINT "PK_BlogPosts" PRIMARY KEY ("Id")
);

CREATE TABLE public."Contacts" (
    "Id" uuid NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "Name" text NOT NULL,
    "Email" text NOT NULL,
    "Phone" text NOT NULL,
    "Message" text NOT NULL,
    "Subject" text NOT NULL,
    "Status" integer NOT NULL,
    CONSTRAINT "PK_Contacts" PRIMARY KEY ("Id")
);

CREATE TABLE public."OfficeInquiries" (
    "Id" uuid NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "CompanyName" text NOT NULL,
    "ContactName" text NOT NULL,
    "Email" text NOT NULL,
    "Phone" text NOT NULL,
    "HeadCount" integer NOT NULL,
    "DeliveryArea" text,
    "Frequency" text,
    "Message" text NOT NULL,
    CONSTRAINT "PK_OfficeInquiries" PRIMARY KEY ("Id")
);

CREATE TABLE public."Subscriptions" (
    "Id" uuid NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "UserId" text NOT NULL,
    "Type" integer NOT NULL,
    "StartDate" timestamp with time zone NOT NULL,
    "EndDate" timestamp with time zone,
    "Status" integer NOT NULL,
    CONSTRAINT "PK_Subscriptions" PRIMARY KEY ("Id")
);

CREATE TABLE public."Testimonials" (
    "Id" uuid NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "CustomerName" text NOT NULL,
    "Rating" integer NOT NULL,
    "Content" text NOT NULL,
    CONSTRAINT "PK_Testimonials" PRIMARY KEY ("Id")
);

CREATE TABLE public."Orders" (
    "Id" uuid NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "Status" text NOT NULL,
    "CustomerName" text NOT NULL,
    "Phone" text NOT NULL,
    "Area" text NOT NULL,
    "Street" text NOT NULL,
    "Building" text NOT NULL,
    "Notes" text NOT NULL,
    "PaymentMethod" text NOT NULL,
    "Subtotal" numeric NOT NULL,
    "DeliveryFee" numeric NOT NULL,
    "Total" numeric NOT NULL,
    "PlacedAt" timestamp with time zone NOT NULL,
    "EstimatedDeliveryAt" timestamp with time zone NOT NULL,
    "StripePaymentIntentId" text,
    "StripeClientSecret" text,
    CONSTRAINT "PK_Orders" PRIMARY KEY ("Id")
);

CREATE TABLE public."MenuItems" (
    "Id" uuid NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "Name" text NOT NULL,
    "NameAr" text NOT NULL,
    "Description" text NOT NULL,
    "DescriptionAr" text NOT NULL,
    "Price" numeric NOT NULL,
    "CategoryId" uuid NOT NULL,
    "CategoryName" text NOT NULL,
    "CategoryNameAr" text NOT NULL,
    "ImageUrl" text NOT NULL,
    "Dietary" text[] NOT NULL,
    "IsAvailable" boolean NOT NULL,
    "IsFeatured" boolean NOT NULL,
    "ChefName" text NOT NULL,
    "ChefNameAr" text NOT NULL,
    "Rating" numeric,
    "PrepTimeMinutes" integer,
    "ChefId" uuid,
    CONSTRAINT "PK_MenuItems" PRIMARY KEY ("Id"),
    CONSTRAINT fk_menu_items_category_id FOREIGN KEY ("CategoryId")
        REFERENCES public."Categories" ("Id") ON DELETE CASCADE,
    CONSTRAINT fk_menu_items_chef_id FOREIGN KEY ("ChefId")
        REFERENCES public."Chefs" ("Id") ON DELETE CASCADE
);

CREATE TABLE public."OrderItems" (
    "Id" uuid NOT NULL,
    "IsDeleted" boolean NOT NULL,
    "CreatedAt" timestamp with time zone NOT NULL,
    "OrderId" uuid NOT NULL,
    "MenuItemId" uuid NOT NULL,
    "Name" text NOT NULL,
    "NameAr" text NOT NULL,
    "ImageUrl" text NOT NULL,
    "Price" numeric NOT NULL,
    "Qty" integer NOT NULL,
    CONSTRAINT "PK_OrderItems" PRIMARY KEY ("Id"),
    CONSTRAINT fk_order_items_order_id FOREIGN KEY ("OrderId")
        REFERENCES public."Orders" ("Id") ON DELETE CASCADE
);

CREATE INDEX idx_menu_items_category_id ON public."MenuItems" ("CategoryId");
CREATE INDEX idx_menu_items_is_featured ON public."MenuItems" ("IsFeatured");
CREATE INDEX idx_menu_items_is_available ON public."MenuItems" ("IsAvailable");
CREATE INDEX idx_menu_items_available_featured ON public."MenuItems" ("IsAvailable", "IsFeatured");
CREATE INDEX idx_contacts_created_at ON public."Contacts" ("CreatedAt");
CREATE INDEX idx_blog_posts_publish_status ON public."BlogPosts" ("PublishStatus");
CREATE UNIQUE INDEX idx_blog_posts_slug_unique ON public."BlogPosts" ("Slug");
CREATE INDEX idx_subscriptions_user_id ON public."Subscriptions" ("UserId");
CREATE INDEX idx_subscriptions_status ON public."Subscriptions" ("Status");
CREATE INDEX idx_orders_phone ON public."Orders" ("Phone");
CREATE INDEX idx_orders_status ON public."Orders" ("Status");
CREATE INDEX idx_order_items_order_id ON public."OrderItems" ("OrderId");

ALTER TABLE public."Categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Chefs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."BlogPosts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Contacts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."OfficeInquiries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Subscriptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Testimonials" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."MenuItems" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."OrderItems" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE
    public."Categories",
    public."Chefs",
    public."BlogPosts",
    public."Contacts",
    public."OfficeInquiries",
    public."Subscriptions",
    public."Testimonials",
    public."Orders",
    public."MenuItems",
    public."OrderItems"
FROM PUBLIC, anon, authenticated;
