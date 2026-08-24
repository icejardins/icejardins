import { Navigate, Route, Routes } from "react-router";
import HomePage from "@/features/home/HomePage";
import VisitPage from "@/features/visit/VisitPage";
import FaithPage from "@/features/faith/FaithPage";
import BlogListPage from "@/features/blog/BlogListPage";
import BlogPostPage from "@/features/blog/BlogPostPage";
import TaxonomyPage from "@/features/blog/TaxonomyPage";
import ResourceListPage from "@/features/resources/ResourceListPage";
import ResourcePage from "@/features/resources/ResourcePage";
import ResourceThankYouPage from "@/features/resources/ResourceThankYouPage";
import ContentPage from "@/features/pages/ContentPage";
import NotFoundPage from "@/features/common/NotFoundPage";
import UnsubscribePage from "@/features/landing/UnsubscribePage";
import { MainLayout } from "@/features/shell/layouts/MainLayout";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";
import { useAnalytics } from "@/shared/hooks/useAnalytics";

function RouterEffects() {
  useScrollToTop();
  useAnalytics();
  return null;
}

export function AppRoutes() {
  return (
    <>
      <RouterEffects />
      <Routes>
        <Route path="landing" element={<Navigate to="/recursos/" replace />} />
        <Route path="recursos/:slug" element={<ResourcePage />} />
        <Route path="recursos/:slug/obrigado" element={<ResourceThankYouPage />} />
        <Route path="obrigado-guia" element={<ResourceThankYouPage defaultSlug="quando-a-cabeca-nao-para" />} />
        <Route path="descadastro" element={<UnsubscribePage />} />
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="visita" element={<VisitPage />} />
          <Route path="fe" element={<FaithPage />} />
          <Route path="posts" element={<BlogListPage />} />
          <Route path="posts/:slug" element={<BlogPostPage />} />
          <Route path="recursos" element={<ResourceListPage />} />
          <Route path="tags/:slug" element={<TaxonomyPage taxonomyType="tag" />} />
          <Route
            path="categorias/:slug"
            element={<TaxonomyPage taxonomyType="category" />}
          />
          <Route path=":slug" element={<ContentPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
