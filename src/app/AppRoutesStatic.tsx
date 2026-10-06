import { Navigate, Route, Routes } from "react-router";
import HomePage from "@/features/home/HomePage";
import HomePageEn from "@/features/home/HomePageEn";
import HomePageEs from "@/features/home/HomePageEs";
import VisitPage from "@/features/visit/VisitPage";
import VisitPageEn from "@/features/visit/VisitPageEn";
import VisitPageEs from "@/features/visit/VisitPageEs";
import FaithPage from "@/features/faith/FaithPage";
import FaithPageEn from "@/features/faith/FaithPageEn";
import FaithPageEs from "@/features/faith/FaithPageEs";
import BlogListPage from "@/features/blog/BlogListPage";
import BlogPostPage from "@/features/blog/BlogPostPage";
import TaxonomyPage from "@/features/blog/TaxonomyPage";
import ResourceListPage from "@/features/resources/ResourceListPage";
import ResourcePage from "@/features/resources/ResourcePage";
import ResourceThankYouPage from "@/features/resources/ResourceThankYouPage";
import GivePage from "@/features/give/GivePage";
import GivePageEn from "@/features/give/GivePageEn";
import GivePageEs from "@/features/give/GivePageEs";
import ProjectsPage from "@/features/projects/ProjectsPage";
import ProjectsPageEn from "@/features/projects/ProjectsPageEn";
import ProjectsPageEs from "@/features/projects/ProjectsPageEs";
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
        <Route path="donar" element={<Navigate to="/es/donar/" replace />} />
        <Route path="faith" element={<Navigate to="/en/faith/" replace />} />
        <Route path="visit" element={<Navigate to="/en/visit/" replace />} />
        <Route path="recursos/:slug" element={<ResourcePage />} />
        <Route path="recursos/:slug/obrigado" element={<ResourceThankYouPage />} />
        <Route path="obrigado-guia" element={<ResourceThankYouPage defaultSlug="quando-a-cabeca-nao-para" />} />
        <Route path="descadastro" element={<UnsubscribePage />} />
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="en" element={<HomePageEn />} />
          <Route path="en/sermons" element={<BlogListPage />} />
          <Route path="en/posts" element={<Navigate to="/en/sermons/" replace />} />
          <Route path="en/give" element={<GivePageEn />} />
          <Route path="en/give/temple-project" element={<ProjectsPageEn />} />
          <Route path="en/give/building-project" element={<Navigate to="/en/give/temple-project/" replace />} />
          <Route path="en/give/projects" element={<Navigate to="/en/give/temple-project/" replace />} />
          <Route path="en/faith" element={<FaithPageEn />} />
          <Route path="en/fe" element={<Navigate to="/en/faith/" replace />} />
          <Route path="en/visit" element={<VisitPageEn />} />
          <Route path="en/visita" element={<Navigate to="/en/visit/" replace />} />
          <Route path="en/visitar" element={<Navigate to="/en/visit/" replace />} />
          <Route path="en/projects" element={<Navigate to="/en/give/temple-project/" replace />} />
          <Route path="en/projetos" element={<Navigate to="/en/give/temple-project/" replace />} />
          <Route path="en/contribuir" element={<Navigate to="/en/give/" replace />} />
          <Route path="en/contribua" element={<Navigate to="/en/give/" replace />} />
          <Route path="es" element={<HomePageEs />} />
          <Route path="es/sermones" element={<BlogListPage />} />
          <Route path="es/sermons" element={<Navigate to="/es/sermones/" replace />} />
          <Route path="es/posts" element={<Navigate to="/es/sermones/" replace />} />
          <Route path="es/donar" element={<GivePageEs />} />
          <Route path="es/donar/proyecto-templo" element={<ProjectsPageEs />} />
          <Route path="es/donar/proyecto-edificacion" element={<Navigate to="/es/donar/proyecto-templo/" replace />} />
          <Route path="es/donar/edificacion" element={<Navigate to="/es/donar/proyecto-templo/" replace />} />
          <Route path="es/donar/proyectos" element={<Navigate to="/es/donar/proyecto-templo/" replace />} />
          <Route path="es/proyectos" element={<Navigate to="/es/donar/proyecto-templo/" replace />} />
          <Route path="es/fe" element={<FaithPageEs />} />
          <Route path="es/faith" element={<Navigate to="/es/fe/" replace />} />
          <Route path="es/visita" element={<VisitPageEs />} />
          <Route path="es/visit" element={<Navigate to="/es/visita/" replace />} />
          <Route path="es/visitar" element={<Navigate to="/es/visita/" replace />} />
          <Route path="es/contribuir" element={<Navigate to="/es/donar/" replace />} />
          <Route path="es/contribua" element={<Navigate to="/es/donar/" replace />} />
          <Route path="es/give" element={<Navigate to="/es/donar/" replace />} />
          <Route path="es/ofrendar" element={<Navigate to="/es/donar/" replace />} />
          <Route path="es/dar" element={<Navigate to="/es/donar/" replace />} />
          <Route path="visita" element={<VisitPage />} />
          <Route path="visitar" element={<Navigate to="/visita/" replace />} />
          <Route path="fe" element={<FaithPage />} />
          <Route path="projetos" element={<Navigate to="/contribuir/projeto-templo/" replace />} />
          <Route path="projetos/construcao-do-templo" element={<Navigate to="/contribuir/projeto-templo/" replace />} />
          <Route path="posts" element={<BlogListPage />} />
          <Route path="posts/:slug" element={<BlogPostPage />} />
          <Route path="recursos" element={<ResourceListPage />} />
          <Route path="contribuir" element={<GivePage />} />
          <Route path="contribuir/projeto-templo" element={<ProjectsPage />} />
          <Route path="contribuir/edificacao" element={<Navigate to="/contribuir/projeto-templo/" replace />} />
          <Route path="contribuir/projetos" element={<Navigate to="/contribuir/projeto-templo/" replace />} />
          <Route path="contribuir/terreno" element={<Navigate to="/contribuir/projeto-templo/" replace />} />
          <Route path="contribuir/construcao" element={<Navigate to="/contribuir/projeto-templo/" replace />} />
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
