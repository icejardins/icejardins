import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { MainLayout } from "@/features/shell/layouts/MainLayout";
import { PageLoader } from "@/shared/components/PageLoader";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";

const HomePage = lazy(() => import("@/features/home/HomePage"));
const VisitPage = lazy(() => import("@/features/visit/VisitPage"));
const FaithPage = lazy(() => import("@/features/faith/FaithPage"));
const BlogListPage = lazy(() => import("@/features/blog/BlogListPage"));
const BlogPostPage = lazy(() => import("@/features/blog/BlogPostPage"));
const TaxonomyPage = lazy(() => import("@/features/blog/TaxonomyPage"));
const ContentPage = lazy(() => import("@/features/pages/ContentPage"));
const NotFoundPage = lazy(() => import("@/features/common/NotFoundPage"));

function RouterEffects() {
  useScrollToTop();
  return null;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterEffects />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="visita" element={<VisitPage />} />
          <Route path="fe" element={<FaithPage />} />
          <Route path="posts" element={<BlogListPage />} />
          <Route path="posts/:slug" element={<BlogPostPage />} />
          <Route path="tags/:slug" element={<TaxonomyPage taxonomyType="tag" />} />
          <Route
            path="categorias/:slug"
            element={<TaxonomyPage taxonomyType="category" />}
          />
          <Route path=":slug" element={<ContentPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
