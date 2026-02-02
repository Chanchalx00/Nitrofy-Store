import {Link, useLoaderData} from 'react-router';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';

/**
 * @type {MetaFunction<typeof loader>}
 */
export const meta = ({data}) => {
  return [{title: `Hydrogen | ${data?.page.title ?? ''}`}];
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
async function loadCriticalData({context, request, params}) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const [{page}] = await Promise.all([
    context.storefront.query(PAGE_QUERY, {
      variables: {
        handle: params.handle,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle: params.handle, data: page});

  return {
    page,
  };
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 * @param {LoaderFunctionArgs}
 */
function loadDeferredData({context}) {
  return {};
}

export default function Page() {
  /** @type {LoaderReturnData} */
  const {page} = useLoaderData();

  return (
    <div className="min-h-screen pt-24 md:pt-32">
      {/*Hero Section */}
      <section className="bg-brand-navy py-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-playfair md:text-3xl text-white mb-6 text-2xl">
              {page.title}
            </h1>
            {page.subtitle?.value && (
              <div
                className="font-source text-lg text-brand-cream"
                dangerouslySetInnerHTML={{__html: page.subtitle.value}}
              />
            )}
          </div>
        </div>
      </section>
      {/*Page Section */}
      <section className="pt-20 md:pt-28 pb-4 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="max-w-none">
              <div className="font-source text-brand-navy/80 text-lg md:text-xl leading-relaxed">
                {page.introText?.value && (
                  <div
                    className="mb-16"
                    dangerouslySetInnerHTML={{__html: page.introText.value}}
                  />
                )}
              </div>

              <div
                className="font-source text-brand-navy/80"
                dangerouslySetInnerHTML={{
                  __html: page.body
                    .replace(
                      '/<h2>/g,<h2 class=font-playfair text-2xl text-brand-navy mt-16 mb-8',
                    )
                    .replaceAll(
                      '/<h3>/g,<h3 class=font-playfair text-xl text-brand-navy mt-12 mb-4',
                    ),
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/*CTA Section */}
      {page.ctaContent?.value && (
        <section className="pt-8 pb-12 px-4 bg-white">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
              <div
                className="font-source text-brand-navy/80"
                dangerouslySetInnerHTML={{
                  __html: page.ctaContent.value
                    .replace(
                      '/<h2>/g,<h2 class=font-playfair text-2xl text-brand-navy mt-16 mb-8',
                    )
                    .replaceAll(
                      '/<h3>/g,<h3 class=font-playfair text-xl text-brand-navy mt-12 mb-4',
                    ),
                }}
              />
              <Link to='/contact' prefetch='intent' className='inline-flex items-center px-8 py-4 mt-8 bg-brand-navy text-white hover:bg-brand-navyLight transition-colors duration-300 font-source tracking-wide'>{page.ctaButton?.value}</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

const PAGE_QUERY = `#graphql
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      handle
      id
      title
      body
      seo {
        description
        title
      }
        subtitle:metafield(namespace:"custom", key:"subtitle"){
        value
        }
        introText:metafield(namespace:"custom", key:"intro_text"){
        value
        }
         ctaContent:metafield(namespace:"custom", key:"cta_content"){
        value
        }
         ctaButton:metafield(namespace:"custom", key:"cta_button"){
        value
        }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('react-router').MetaFunction<T>} MetaFunction */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
