import {Await, useLoaderData, Link} from 'react-router';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import {ProductItem} from '~/components/ProductItem';
import {ArrowRight,Star} from 'lucide-react';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Nitrofy | Home'}];
};

/**
 * @param {LoaderFunctionArgs} args
 */
export async function loader(args) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 * @param {LoaderFunctionArgs}
 */
async function loadCriticalData({context}) {
  const [{collections}] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY),
    // Add other queries here, so that they are loaded in parallel
  ]);

  return {
    featuredCollection: collections.nodes[0],
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error) => {
      // Log query errors, but don't throw them so the page can still render
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  /** @type {LoaderReturnData} */
  const data = useLoaderData();
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] bg-brand-navy">
        <Image
          alt="Products"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          loading="eager"
                sizes='(max-width:768px) 100vw,(max-width:1200px)50vw,33vw'
          data={{url: '/image/products.jpg', width: 1920, height: 1080}}
        />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl ">
            <h1 className="font-playfair text-4xl md:text-6xl text-white mb-6">
              Shop Smarter, Live Better
            </h1>
            <p className="font-source text-lg text-gray-200 mb-8">
              Discover premium products at unbeatable prices.
            </p>
            <Link
              to="/collections/all"
              className="inline-flex items-center px-8 py-4 bg-brand-gold hover:bg-brand-goldDark transition-colors duration-300 text-white font-source font-medium"
            >
              Explore Collection
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
      {/* Recommended Product */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto ">
          <h2 className="font-playfair text-3xl text-center mb-12">
            Our Latest Products
          </h2>
          <div>
            <Suspense
              fallback={
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {Array.from({length: 4}).map((_, i) => (
                    <div
                      key={`skeleton-${i}`}
                      className="flex flex-wrap gap-4 animate-pulse"
                    >
                      <div className="h-20 bg-gray-200 rounded w-20" />
                      <div className="h-20 bg-gray-200 rounded w-20" />
                      <div className="h-20 bg-gray-200 rounded w-20" />
                    </div>
                  ))}
                </div>
              }
            >
              <Await resolve={data.recommendedProducts}>
                {(response) => (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {response?.products.nodes.map((product) => (
                      <ProductItem
                        key={product.id}
                        product={product}
                        loading="lazy"
                        
                      />
                    ))}
                  </div>
                )}
              </Await>
            </Suspense>
          </div>
        </div>
      </section>
      {/* Products */}
      <section className="py-20 px-4 ">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                alt="product2"
                className="w-full"
                data={{url: '/image/beauty-products.jpg'}}
                sizes='(max-width:768px) 100vw,(max-width:1200px)50vw,33vw'
                loading='lazy'
              />
            </div>
            <div className='max-w-xl'>
              <h2 className='font-playfair text-3xl mb-6'>Products by Nitrofy</h2>
            <p className='font-source text-gray-600 mb-8 leading-relaxed'>
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga ullam voluptas repudiandae expedita illo excepturi quas nemo quo alias ex itaque molestiae, sit voluptates consequuntur temporibus necessitatibus earum? Deserunt, iusto.
            </p>
            <Link to='/pages/our-product' className='inline-flex items-center font-source font-medium text-brand-navy hover:text-brand-gold transition-colors duration-300'>
            Discover Our Process
            <ArrowRight className='ml-2 w-5 h-5'/>
            </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Testimonial */}
      <section className='py-20 px-4 bg-brand-navy text-white'> <div className='container mx-auto max-w-4xl text-center'>
        <div className='flex justify-center'>
          {Array.from({length: 5}).map((_, i) => (
            <Star
              key={`start-${i}`}
              fill='#C3A343'
              color='#C3A343'
              className='w-8 h-8 mb-8'
            />
          ))}
        </div>
        <blockquote className='font-playfair text-2xl md:text-3xl mb-8'>
          " Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem perferendis cumque hic, fugit alias expedita qui similique dolor quidem deleniti placeat laudantium, maxime recusandae repellendus suscipit? Aliquid fuga mollitia autem! "
        </blockquote>
        <cite className='font-source text-gray-300 not-italic'>
          - The Luxuary Report
        </cite>
        </div></section>
    </div>
  );
}

/**
 * @param {{
 *   collection: FeaturedCollectionFragment;
 * }}
 */
function FeaturedCollection({collection}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <h1>{collection.title}</h1>
    </Link>
  );
}

/**
 * @param {{
 *   products: Promise<RecommendedProductsQuery | null>;
 * }}
 */
function RecommendedProducts({products}) {
  return (
    <div className="recommended-products">
      <h2 className="text-brand-gold font-playfair font-bold text-2xl">
        Recommended Products
      </h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
      <br />
    </div>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }}
    featuredImage {
      id
      url
      altText
      width
      height
      }
      images(first:2) {
       nodes{
        id
        url
        altText
        width
        height
}}
    variants(first: 1) {
      nodes {
        selectedOptions{
        name
        value
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
      }
    }
  }

  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 3, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('react-router').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
