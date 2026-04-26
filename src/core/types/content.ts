export type MenuItem = {
  name: string;
  url: string;
  weight: number;
};

export type ThemeTokens = {
  textColor: string;
  secondaryTextColor: string;
  textLinkColor: string;
  backgroundColor: string;
  secondaryBackgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
};

export type SiteConfig = {
  title: string;
  baseUrl: string;
  languageCode: string;
  description: string;
  menu: MenuItem[];
  navbar: {
    brandName: string;
    sticky: boolean;
    showOnScrollUp: boolean;
  };
  contact: {
    email: string;
  };
  social: {
    facebook: string;
    instagram: string;
    whatsapp: string;
  };
  blog: {
    title: string;
    description: string;
  };
  theme: ThemeTokens;
};

export type TocHeading = {
  depth: number;
  text: string;
  id: string;
};

export type PageContent = {
  slug: string;
  route: string;
  title: string;
  description: string;
  layout: string | null;
  bodyHtml: string;
  toc: TocHeading[];
  plainText: string;
  sourcePath: string;
};

export type Post = {
  slug: string;
  route: string;
  title: string;
  subtitle: string | null;
  description: string;
  date: string | null;
  image: string | null;
  tags: string[];
  categories: string[];
  readingTime: number;
  summary: string;
  bodyHtml: string;
  toc: TocHeading[];
  plainText: string;
  sourcePath: string;
};

export type Taxonomy = {
  slug: string;
  name: string;
  count: number;
};

export type Taxonomies = {
  tags: Taxonomy[];
  categories: Taxonomy[];
};

export type SearchDocument = {
  title: string;
  description: string;
  content: string;
  image: string | null;
  permalink: string;
};

export type PaginationResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};
