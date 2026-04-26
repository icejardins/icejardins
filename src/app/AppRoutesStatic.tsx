import { Route, Routes } from "react-router-dom";
import HomePage from "@/features/home/HomePage";
import VisitPage from "@/features/visit/VisitPage";
import FaithPage from "@/features/faith/FaithPage";
import BlogListPage from "@/features/blog/BlogListPage";
import BlogPostPage from "@/features/blog/BlogPostPage";
import TaxonomyPage from "@/features/blog/TaxonomyPage";
import ContentPage from "@/features/pages/ContentPage";
import NotFoundPage from "@/features/common/NotFoundPage";
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
    </>
  );
}
