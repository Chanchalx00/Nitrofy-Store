import {Suspense} from 'react';
import {useLoaderData, Await} from 'react-router';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';
import {ProductPrice} from '~/components/ProductPrice';
import ProductImage from '~/components/ProductImage';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/** @type {import('@shopify/remix-oxygen').MetaFunction} */
export const meta = ({data}) => {
  return [
    {title: `Hydrogen | ${data?.product?.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product?.handle}`,
    },
  ];
};

/** @type {import('@shopify/remix-oxygen').LoaderFunction} */
export async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context, params, request}) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const [{product}] = await Promise.all([
    storefront
      .query(PRODUCT_QUERY, {
        variables: {
          handle,
          selectedOptions: getSelectedProductOptions(request) || [],
        },
      })
      .catch((err) => {
        console.error('GraphQL query failed:', err);
        throw new Response('GraphQL Error', {status: 500});
      }),
  ]);

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

function loadDeferredData({context, params}) {
  return {
    variants: context.storefront.query(VARIANTS_QUERY, {
      variables: {handle: params.handle},
    }),
  };
}

export default function Product() {
  const {product, variants} = useLoaderData();

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  return (
    <div className="pt-48 md:pt-48">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-8">
            <ProductImage
              images={product.images.nodes.map((node) => ({
                id: node.id,
                url: node.url,
                altText: node.altText,
                width: node.width,
                height: node.height,
              }))}
              selectedVariantImage={selectedVariant?.image}
            />
          </div>
          <div className="space-y-10">
            <div className="space-y-4 border-b border-brand-navy/10 pb-6">
              <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-brand-navy">
                {product.title}
              </h1>
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant.compareAtPrice}
                className="font-source text-xl text-brand-navy"
              />
            </div>
            <div className="font-source text-brand-navy/80 max-w-none">
              <div
                dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
              />
            </div>

            {/* Product Form */}
            <Suspense fallback={<div>Loading variants...</div>}>
              <Await resolve={variants}>
                {(data) => (
                  <ProductForm
                    product={product}
                    selectedVariant={selectedVariant}
                    variants={data?.product?.variants?.nodes || []}
                    className="space-y-8"
                  />
                )}
              </Await>
            </Suspense>
          </div>
        </div>
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </div>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
fragment ProductVariant on ProductVariant {
  availableForSale
  compareAtPrice {
    amount
    currencyCode
  }
  id
  image {
    id
    url
    altText
    width
    height
  }
  price {
    amount
    currencyCode
  }
  product {
    title
    handle
  }
  selectedOptions {
    name
    value
  }
  sku
  title
}
`;

const PRODUCT_FRAGMENT = `#graphql
fragment Product on Product {
  id
  title
  vendor
  handle
  descriptionHtml
  featuredImage {
    url
    altText
    width
    height
  }
  images(first: 5) {
    nodes {
      id
      url
      altText
      width
      height
    }
  }
  options {
    name
    optionValues {
      name
      firstSelectableVariant {
        ...ProductVariant
      }
    }
  }
  selectedOrFirstAvailableVariant(
    selectedOptions: $selectedOptions
    ignoreUnknownOptions: true
    caseInsensitiveMatch: true
  ) {
    ...ProductVariant
  }
  adjacentVariants(selectedOptions: $selectedOptions) {
    ...ProductVariant
  }

  #Added metafields
  materials: metafield(namespace: "custom", key: "materials") {
    value
  }
  construction: metafield(namespace: "custom", key: "construction") {
    value
  }
  sizingNotes: metafield(namespace: "custom", key: "sizing_notes") {
    value
  }
  careInstructions: metafield(namespace: "custom", key: "care_instructions") {
    value
  }
  colours: metafield(namespace: "custom", key: "colours") {
    value
  }
}
`;

const PRODUCT_QUERY = `#graphql
query Product(
  $country: CountryCode
  $handle: String!
  $language: LanguageCode
  $selectedOptions: [SelectedOptionInput!]!
) @inContext(country: $country, language: $language) {
  product(handle: $handle) {
    ...Product
  }
}
${PRODUCT_FRAGMENT}
${PRODUCT_VARIANT_FRAGMENT}
`;

const VARIANTS_QUERY = `#graphql
query Variants($handle: String!) {
  product(handle: $handle) {
    variants(first: 50) {
      nodes {
        ...ProductVariant
      }
    }
  }
}
${PRODUCT_VARIANT_FRAGMENT}
`;
