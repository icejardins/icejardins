import { Outlet } from "react-router-dom";
import { Header } from "@/features/shell/components/Header";
import { Footer } from "@/features/shell/components/Footer";
import { WhatsAppFloat } from "@/features/shell/components/WhatsAppFloat";
import styles from "./MainLayout.module.css";

export function MainLayout() {
  return (
    <>
      <a href="#main-content" className={styles.skipLink}>
        Pular para o conteúdo principal
      </a>
      <Header />
      <main id="main-content" className={styles.main}>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
