import styles from "./PageLoader.module.css";

export function PageLoader() {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true" />
      <span>Carregando página...</span>
    </div>
  );
}
