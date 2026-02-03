import {Link} from 'react-router';
import {Image, Money, Pagination} from '@shopify/hydrogen';
import {urlWithTrackingParams} from '~/lib/search';

/**
 * @param {Omit<SearchResultsProps, 'error' | 'type'>}
 */
export function SearchResults({term, result, children}) {
  if (!result?.total) {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {children({...result.items, term})}
    </div>
  );
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

/* -------------------------------------------------------------------------- */
/* Articles                                                                    */
/* -------------------------------------------------------------------------- */

function SearchResultsArticles({term, articles}) {
  if (!articles?.nodes.length) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Articles</h2>

      <ul className="space-y-2">
        {articles.nodes.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.handle}`,
            trackingParams: article.trackingParameters,
            term,
          });

          return (
            <li key={article.id}>
              <Link
                prefetch="intent"
                to={articleUrl}
                className="block rounded-md px-4 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
              >
                {article.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Pages                                                                       */
/* -------------------------------------------------------------------------- */

function SearchResultsPages({term, pages}) {
  if (!pages?.nodes.length) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Pages</h2>

      <ul className="space-y-2">
        {pages.nodes.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term,
          });

          return (
            <li key={page.id}>
              <Link
                prefetch="intent"
                to={pageUrl}
                className="block rounded-md px-4 py-3 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
              >
                {page.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

function SearchResultsProducts({term, products}) {
  if (!products?.nodes.length) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Products</h2>

      <Pagination connection={products}>
        {({nodes, isLoading, NextLink, PreviousLink}) => (
          <div className="space-y-6">
            <div>
              <PreviousLink className="text-sm text-gray-600 hover:underline">
                {isLoading ? 'Loading...' : '↑ Load previous'}
              </PreviousLink>
            </div>

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nodes.map((product) => {
                const productUrl = urlWithTrackingParams({
                  baseUrl: `/products/${product.handle}`,
                  trackingParams: product.trackingParameters,
                  term,
                });

                const price =
                  product?.selectedOrFirstAvailableVariant?.price;
                const image =
                  product?.selectedOrFirstAvailableVariant?.image;

                return (
                  <li key={product.id}>
                    <Link
                      prefetch="intent"
                      to={productUrl}
                      className="flex gap-4 rounded-lg border border-gray-200 p-4 transition hover:border-gray-300 hover:shadow-sm"
                    >
                      {image && (
                        <Image
                          data={image}
                          alt={product.title}
                          width={80}
                          className="rounded object-cover"
                        />
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {product.title}
                        </p>

                        {price && (
                          <p className="mt-1 text-sm text-gray-600">
                            <Money data={price} />
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div>
              <NextLink className="text-sm text-gray-600 hover:underline">
                {isLoading ? 'Loading...' : 'Load more ↓'}
              </NextLink>
            </div>
          </div>
        )}
      </Pagination>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty                                                                       */
/* -------------------------------------------------------------------------- */

function SearchResultsEmpty() {
  return (
    <p className="py-12 text-center text-sm text-gray-500">
      No results found. Try a different search.
    </p>
  );
}
