import {useLoaderData, Link} from 'react-router';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';
import {ArrowRight} from 'lucide-react';

export const meta = () => {
  return [{title: `Hydrogen | Products`}];
};

export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, request}) {
  const {storefront} = context;
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const [{products}] = await Promise.all([
    storefront.query(CATALOG_QUERY, {
      variables: {...paginationVariables},
    }),
  ]);

  return {products};
}

function loadDeferredData() {
  return {};
}

export default function Collection() {
  const {products} = useLoaderData();

  return (
    <div className="collection">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <Image
            alt="Products"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            loading="eager"
            sizes="(max-width: 768px) 100vw,(max-width:1200px) 50vw, 33vw"
            data={{
              url: '/image/products.jpg',
              width: 1920,
              height: 1080,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/50 to-brand-navy/80" />
        </div>

        <div className="relative container mx-auto px-4 z-10">
          <div className="max-w-2xl">
            <h1 className="font-playfair text-4xl md:text-6xl text-white mb-6">
              Shop Smarter, Live Better
            </h1>
            <p className="font-source text-lg text-gray-200 mb-8 max-w-xl">
              Discover premium products at unbeatable prices.
            </p>
          </div>
        </div>
      </section>

      {/* Collection Header */}
      <section className="bg-brand-cream border-y border-brand-navy/10 relative z-20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 px-4 gap-4">
            <div className="space-y-2">
              <h2 className="font-playfair text-2xl text-brand-navy">
                The Collection
              </h2>
              <p className="font-source text-brand-navy/60">
                Showing {products.nodes.length} Products
              </p>
            </div>
            <div className="flex items-center gap-6">
              <button className="font-source text-sm text-brand-navy/60 hover:text-brand-navy transition-colors">
                Filter
              </button>
              <button className="font-source text-sm text-brand-navy/60 hover:text-brand-navy transition-colors">
                Sort
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <PaginatedResourceSection
            connection={products}
            resourcesClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16"
          >
            {({node: product, index}) => (
              <ProductItem key={product.id} product={product} loading={index < 8 ? 'eager' : undefined} />
            )}
          </PaginatedResourceSection>
        </div>
      </section>

      {/* Craftsmanship Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                alt="product2"
                className="w-full"
                data={{url: '/image/beauty-products.jpg'}}
                sizes="(max-width:768px) 100vw,(max-width:1200px)50vw,33vw"
                loading="lazy"
              />
            </div>
            <div className="max-w-xl">
              <h2 className="font-playfair text-3xl mb-6">
                Products by Nitrofy
              </h2>
              <p className="font-source text-gray-600 mb-8 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fuga
                ullam voluptas repudiandae expedita illo excepturi quas nemo quo
                alias ex itaque molestiae, sit voluptates consequuntur
                temporibus necessitatibus earum? Deserunt, iusto.
              </p>
              <Link
                to="/pages/our-product"
                className="inline-flex items-center font-source font-medium text-brand-navy hover:text-brand-gold transition-colors duration-300"
              >
                Discover Our Process
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Heritage Banner */}
      <section className="bg-brand-cream py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-playfair text-2xl md:text-3xl text-brand-navy mb-6">
              A Legacy of Shopping
            </h3>
            <p className="font-source text-brand-navy/80 mb-4">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Soluta
              quo saepe, consectetur ipsa, magni quas pariatur ratione ad
              eligendi aliquam.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* GraphQL Fragments */
const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyCollectionItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment ProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      altText
      url
      width
      height
    }
    images(first: 10) {
      nodes {
        id
        altText
        url
        width
        height
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyCollectionItem
      }
      maxVariantPrice {
        ...MoneyCollectionItem
      }
    }
    variants(first: 1) {
      nodes {
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

const COLLECTION_ITEM_FRAGMENT = `#graphql
  fragment CollectionItem on Product {
    ...ProductItem
  }
  ${PRODUCT_ITEM_FRAGMENT}
`;

const CATALOG_QUERY = `#graphql
  query Catalog(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor) {
      nodes {
        ...CollectionItem
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
  ${COLLECTION_ITEM_FRAGMENT}
`;
