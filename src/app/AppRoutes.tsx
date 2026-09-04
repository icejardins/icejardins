import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import { MainLayout } from "@/features/shell/layouts/MainLayout";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { useAnalytics } from "@/shared/hooks/useAnalytics";
import { useLanguageAutoDetect } from "@/shared/hooks/useLanguageAutoDetect";

const HomePage = lazy(() => import("@/features/home/HomePage"));
const HomePageEn = lazy(() => import("@/features/home/HomePageEn"));
const VisitPage = lazy(() => import("@/features/visit/VisitPage"));
const FaithPage = lazy(() => import("@/features/faith/FaithPage"));
const BlogListPage = lazy(() => import("@/features/blog/BlogListPage"));
const BlogPostPage = lazy(() => import("@/features/blog/BlogPostPage"));
const TaxonomyPage = lazy(() => import("@/features/blog/TaxonomyPage"));
const ResourceListPage = lazy(() => import("@/features/resources/ResourceListPage"));
const ResourcePage = lazy(() => import("@/features/resources/ResourcePage"));
const ResourceThankYouPage = lazy(() => import("@/features/resources/ResourceThankYouPage"));
const GivePage = lazy(() => import("@/features/give/GivePage"));
const GivePageEn = lazy(() => import("@/features/give/GivePageEn"));
const ContentPage = lazy(() => import("@/features/pages/ContentPage"));
const NotFoundPage = lazy(() => import("@/features/common/NotFoundPage"));
const UnsubscribePage = lazy(() => import("@/features/landing/UnsubscribePage"));

function RouterEffects() {
  useScrollToTop();
  useAnalytics();
  useLanguageAutoDetect();
  return null;
}

export function AppRoutes() {
  return (
    <>
      <RouterEffects />
      <Suspense fallback={null}>
        <Routes>
          <Route path="landing" element={<Navigate to="/recursos/" replace />} />
          <Route path="contribua" element={<Navigate to="/contribuir/" replace />} />
          <Route path="give" element={<Navigate to="/en/give/" replace />} />
          <Route path="recursos/:slug" element={<ResourcePage />} />
          <Route path="recursos/:slug/obrigado" element={<ResourceThankYouPage />} />
          <Route path="obrigado-guia" element={<ResourceThankYouPage defaultSlug="quando-a-cabeca-nao-para" />} />
          <Route path="descadastro" element={<UnsubscribePage />} />
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="en" element={<HomePageEn />} />
            <Route path="en/give" element={<GivePageEn />} />
            <Route path="en/contribuir" element={<Navigate to="/en/give/" replace />} />
            <Route path="en/contribua" element={<Navigate to="/en/give/" replace />} />
            <Route path="visita" element={<VisitPage />} />
            <Route path="fe" element={<FaithPage />} />
            <Route path="posts" element={<BlogListPage />} />
            <Route path="posts/:slug" element={<BlogPostPage />} />
            <Route path="recursos" element={<ResourceListPage />} />
            <Route path="contribuir" element={<GivePage />} />
            <Route path="doacoes" element={<Navigate to="/contribuir/" replace />} />
            <Route path="doe" element={<Navigate to="/contribuir/" replace />} />
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
    </>
  );
}
