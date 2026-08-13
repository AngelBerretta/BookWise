import useAuth from '../../hooks/useAuth';
import useHomeData from './useHomeData';
import HomeHero from './HomeHero';
import HomeCategories from './HomeCategories';
import HomeFeaturedProducts from './HomeFeaturedProducts';
import HomeBlogPreview from './HomeBlogPreview';
import HomeStats from './HomeStats';
import HomeNewsletterCta from './HomeNewsletterCta';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const {
    products, posts, loadingP, loadingB, errorP, errorB, stats,
    newsletterEmail, setNewsletterEmail, subscribing, handleNewsletterSubmit,
    categoriesRef, categoriesVisible,
    productsRef, productsVisible,
    blogRef, blogVisible,
    statsRef, statsVisible,
    ctaRef, ctaVisible,
    newsletterRef, newsletterVisible,
  } = useHomeData();

  return (
    <div className="bg-[var(--bg)]">
      <HomeHero isAuthenticated={isAuthenticated} />

      <HomeCategories sectionRef={categoriesRef} visible={categoriesVisible} />

      <div className="border-t border-[var(--border-subtle)]" role="presentation" aria-hidden="true" />

      <HomeFeaturedProducts
        sectionRef={productsRef}
        visible={productsVisible}
        loading={loadingP}
        products={products}
        error={errorP}
      />

      <div className="border-t border-[var(--border-subtle)]" role="presentation" aria-hidden="true" />

      <HomeBlogPreview
        sectionRef={blogRef}
        visible={blogVisible}
        loading={loadingB}
        posts={posts}
        error={errorB}
      />

      <HomeStats sectionRef={statsRef} visible={statsVisible} stats={stats} />

      <HomeNewsletterCta
        isAuthenticated={isAuthenticated}
        ctaRef={ctaRef}
        ctaVisible={ctaVisible}
        newsletterRef={newsletterRef}
        newsletterVisible={newsletterVisible}
        newsletterEmail={newsletterEmail}
        setNewsletterEmail={setNewsletterEmail}
        subscribing={subscribing}
        onSubmit={handleNewsletterSubmit}
      />
    </div>
  );
};

export default Home;