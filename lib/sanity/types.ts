import type { PortableTextBlock } from "next-sanity";

/** Formas que devuelven las consultas de `queries.ts` (solo lo que usa la web). */
export type L10n = { es?: string; en?: string } | null | undefined;
export type L10nBlocks = { es?: PortableTextBlock[]; en?: PortableTextBlock[] } | null | undefined;

export type ImageRef = {
  ref?: string;
  crop?: { top: number; bottom: number; left: number; right: number } | null;
  hotspot?: { x: number; y: number } | null;
} | null;
export type Img = { desktop?: ImageRef; mobile?: ImageRef; alt?: L10n } | null | undefined;

export type Cta = {
  _key?: string;
  label?: L10n;
  action?: "booking" | "table" | "spa" | "voucher" | "whatsapp" | "link";
  href?: string;
  style?: "primary" | "secondary" | "link";
  room?: string | null;
  offer?: string | null;
};

export type LinkTarget = { _type: string; _id: string; slug?: string } | null;
export type NavLink = { _key: string; label?: L10n; anchor?: string; target?: LinkTarget };

export type Seo = { title?: L10n; description?: L10n; noindex?: boolean } | null;

export type Settings = {
  name?: string;
  home?: string;
  address?: L10n;
  geo?: { lat?: number; lng?: number } | null;
  checkIn?: string;
  checkOut?: string;
  maxDogs?: number;
  phone?: string;
  email?: string;
  privacyEmail?: string;
  whatsapp?: string;
  social?: { _key: string; network?: string; url?: string }[] | null;
  mews?: { configurationId?: string; environment?: "demo" | "production" } | null;
  seo?: Seo;
  footerNote?: L10n;
};

export type Palette = Partial<
  Record<"background" | "surface" | "band" | "ink" | "inkSoft" | "accent" | "onAccent", string>
>;
export type Theme = {
  light?: Palette;
  dark?: Palette;
  fontDisplay?: string;
  fontText?: string;
} | null;

export type SiteData = {
  settings: Settings | null;
  theme: Theme;
  nav: { header?: NavLink[]; footer?: { _key: string; title?: L10n; links?: NavLink[] }[] } | null;
  hasPosts: boolean;
};

export type RoomCard = {
  _id: string;
  title?: L10n;
  slug: string;
  summary?: L10n;
  guests?: number;
  beds?: L10n;
  area?: number;
  orientation?: L10n;
  priceFrom?: number;
  mewsCategoryId?: string;
  mainImage?: Img;
};
export type Room = RoomCard & {
  description?: L10nBlocks;
  features?: (L10n & { _key: string })[];
  petFriendly?: boolean;
  gallery?: { _key: string; kind?: string; photo?: Img }[];
  seo?: Seo;
};
export type Offer = {
  _id: string;
  title?: L10n;
  slug?: string;
  summary?: L10n;
  image?: Img;
  cta?: Cta | null;
};
export type Faq = { _id: string; question?: L10n; answer?: L10n };
export type PostCard = {
  _id: string;
  title?: L10n;
  slug: string;
  publishedAt?: string;
  excerpt?: L10n;
  cover?: Img;
};
export type Post = PostCard & { body?: L10nBlocks; seo?: Seo };
export type LegalPage = {
  _id: string;
  title?: L10n;
  slug: string;
  updatedAt?: string;
  body?: L10nBlocks;
  seo?: Seo;
};

type Base = { _key: string; anchor?: string };
export type LabelValue = { _key: string; label?: L10n; value?: L10n };
export type HeroStep = {
  _key: string;
  kicker?: L10n;
  title?: L10n;
  text?: L10n;
  ghost?: string;
  link?: Cta | null;
};

export type Section =
  | (Base & {
      _type: "sectionHero";
      heading?: L10n;
      lead?: L10n;
      facade?: Img;
      reception?: Img;
      patio?: Img;
      steps?: HeroStep[];
      walk?: boolean;
      bookingBar?: boolean;
    })
  | (Base & { _type: "sectionRooms"; heading?: L10n; intro?: L10n; rooms?: RoomCard[] })
  | (Base & {
      _type: "sectionFeature";
      kicker?: L10n;
      heading?: L10n;
      text?: L10n;
      image?: Img;
      groups?: { _key: string; title?: L10n; text?: L10n; items?: LabelValue[] }[];
      bullets?: (L10n & { _key: string })[];
      note?: L10n;
      ctas?: Cta[];
      layout?: "fullBleed" | "imageLeft" | "imageRight";
      background?: "page" | "band";
    })
  | (Base & {
      _type: "sectionDirect";
      kicker?: L10n;
      heading?: L10n;
      items?: (L10n & { _key: string })[];
      ctas?: Cta[];
    })
  | (Base & { _type: "sectionOffers"; heading?: L10n; intro?: L10n; offers?: Offer[] })
  | (Base & {
      _type: "sectionFacts";
      kicker?: L10n;
      heading?: L10n;
      lead?: L10n;
      image?: Img;
      facts?: LabelValue[];
    })
  | (Base & { _type: "sectionFaq"; heading?: L10n; faqs?: Faq[] })
  | (Base & { _type: "sectionMap"; heading?: L10n; lead?: L10n; note?: L10n })
  | (Base & {
      _type: "sectionClosing";
      heading?: L10n;
      accentLine?: L10n;
      text?: L10n;
      ctas?: Cta[];
    })
  | (Base & { _type: "sectionRichText"; heading?: L10n; body?: L10nBlocks })
  | (Base & {
      _type: "sectionGallery";
      heading?: L10n;
      images?: (NonNullable<Img> & { _key: string })[];
    })
  | (Base & { _type: "sectionBlog"; heading?: L10n; count?: number; posts?: PostCard[] });

export type Page = { _id: string; title?: L10n; slug?: string; seo?: Seo; sections?: Section[] };
