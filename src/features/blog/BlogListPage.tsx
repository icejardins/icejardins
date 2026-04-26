import { Link, useSearchParams } from "react-router-dom";
import {
  getAllPosts,
  getCategories,
  getSiteConfig,
  getTags,
  paginate
} from "@/content/repositories/contentRepository";
import { SeoHead } from "@/shared/components/SeoHead";
import { PostCard } from "@/features/blog/components/PostCard";
import { TaxonomyList } from "@/features/blog/components/TaxonomyList";
import styles from "./BlogListPage.module.css";

const PAGE_SIZE = 6;

export default function BlogListPage() {
  const site = getSiteConfig();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? "1");

  const allPosts = getAllPosts();
  const pagination = paginate(allPosts, Number.isFinite(page) ? page : 1, PAGE_SIZE);

  return (
    <>
      <SeoHead
        title={`${site.blog.title} | ${site.title}`}
        description={site.blog.description}
        canonicalPath="/posts/"
      />

      <section className="container py-5">
        <header className="text-center mb-4">
          <h1>{site.blog.title}</h1>
          <p>{site.blog.description}</p>
        </header>

        <div className="row g-4">
          <div className="col-lg-9">
            <div className="row g-4">
              {pagination.items.map((post) => (
                <div key={post.slug} className="col-lg-6 col-md-6">
                  <PostCard post={post} />
                </div>
              ))}
            </div>

            <nav className={styles.pagination} aria-label="Paginação de sermões">
              {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map(
                (pageNumber) => (
                  <Link
                    key={pageNumber}
                    to={pageNumber === 1 ? "/posts/" : `/posts/?page=${pageNumber}`}
                    aria-current={pageNumber === pagination.page ? "page" : undefined}
                    className={pageNumber === pagination.page ? styles.currentPage : undefined}
                  >
                    {pageNumber}
                  </Link>
                )
              )}
            </nav>
          </div>

          <div className="col-lg-3">
            <div className={styles.stickySidebar}>
              <TaxonomyList title="Categorias" items={getCategories()} basePath="/categorias" />
              <TaxonomyList title="Tags" items={getTags()} basePath="/tags" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
