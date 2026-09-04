import { Navigate, Route, Routes } from "react-router";
import HomePage from "@/features/home/HomePage";
import HomePageEn from "@/features/home/HomePageEn";
import VisitPage from "@/features/visit/VisitPage";
import FaithPage from "@/features/faith/FaithPage";
import BlogListPage from "@/features/blog/BlogListPage";
import BlogPostPage from "@/features/blog/BlogPostPage";
import TaxonomyPage from "@/features/blog/TaxonomyPage";
import ResourceListPage from "@/features/resources/ResourceListPage";
import ResourcePage from "@/features/resources/ResourcePage";
import ResourceThankYouPage from "@/features/resources/ResourceThankYouPage";
import GivePage from "@/features/give/GivePage";
import GivePageEn from "@/features/give/GivePageEn";
import ContentPage from "@/features/pages/ContentPage";
import NotFoundPage from "@/features/common/NotFoundPage";
import UnsubscribePage from "@/features/landing/UnsubscribePage";
import { MainLayout } from "@/features/shell/layouts/MainLayout";
import { useScrollToTop } from "@/shared/hooks/useScrollToTop";

function RouterEffects() {
  useScrollToTop();
  return null;
}

export function AppRoutesStatic() {
  return (
    <>
      <RouterEffects />
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
    </>
  );
}
