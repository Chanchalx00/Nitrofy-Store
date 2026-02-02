import {redirect} from '@shopify/remix-oxygen';
import {useLoaderData} from 'react-router';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductItem} from '~/components/ProductItem';

export async function loader({context, params, request}) {
  const {handle} = params;

  if (!handle) {
    throw redirect('/collections');
  }

  const paginationVariables = getPaginationVariables(request, {
    pageBy: 8,
  });

  const {storefront} = context;

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle, ...paginationVariables},
  });

  if (!collection) {
    throw new Response('Collection not found', {status: 404});
  }

  return {collection};
}

export default function CollectionPage() {
  const {collection} = useLoaderData();

  return (
    <div className="collection min-h-screen">
      <header className="collection-header mt-36">
        <h1>{collection.title}</h1>
      </header>

      <PaginatedResourceSection
        connection={collection.products}
        resourcesClassName="products-grid"
      >
        {({node: product, index}) => (
          <ProductItem
            key={product.id}
            product={product}
            loading={index < 8 ? 'eager' : undefined}
          />
        )}
      </PaginatedResourceSection>

      <Analytics.CollectionView
        data={{
          collection: {
            id: collection.id,
            handle: collection.handle,
          },
        }}
      />

      <style >{`
        .collection {
          padding: 1rem;
          
          
        }

        .collection-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .collection-header h1 {
          font-size: 1.5rem;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .collection {
            padding: 2rem;
          }

          .collection-header h1 {
            font-size: 2rem;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .collection-header h1 {
            font-size: 2.25rem;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------ GRAPHQL ------------------ */

const PRODUCT_ITEM_FRAGMENT = `#graphql
  fragment MoneyProductItem on MoneyV2 {
    amount
    currencyCode
  }
  fragment CollectionProductItem on Product {
    id
    handle
    title
    featuredImage {
      id
      url
      altText
      width
      height
    }
      images(first: 2) {
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
        ...MoneyProductItem
      }
      maxVariantPrice {
        ...MoneyProductItem
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  ${PRODUCT_ITEM_FRAGMENT}
  query Collection(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      handle
      title
      products(
        first: $first
        last: $last
        before: $startCursor
        after: $endCursor
      ) {
        nodes {
          ...CollectionProductItem
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;
