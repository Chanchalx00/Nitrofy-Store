import {Link, useFetcher} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import React, {useRef, useEffect} from 'react';
import {
  getEmptyPredictiveSearchResult,
  urlWithTrackingParams,
} from '~/lib/search';
import {useAside} from './Aside';

/**
 * Component that renders predictive search results
 */
export function SearchResultsPredictive({children}) {
  const aside = useAside();
  const {term, inputRef, fetcher, total, items} = usePredictiveSearch();

  function resetInput() {
    if (inputRef.current) {
      inputRef.current.blur();
      inputRef.current.value = '';
    }
  }

  function closeSearch() {
    resetInput();
    aside.close();
  }

  return (
    <div className="flex max-h-[70vh] flex-col overflow-y-auto">
      {children({
        items,
        closeSearch,
        inputRef,
        state: fetcher.state,
        term,
        total,
      })}
    </div>
  );
}

SearchResultsPredictive.Articles = SearchResultsPredictiveArticles;
SearchResultsPredictive.Collections = SearchResultsPredictiveCollections;
SearchResultsPredictive.Pages = SearchResultsPredictivePages;
SearchResultsPredictive.Products = SearchResultsPredictiveProducts;
SearchResultsPredictive.Queries = SearchResultsPredictiveQueries;
SearchResultsPredictive.Empty = SearchResultsPredictiveEmpty;

/* -------------------------------------------------------------------------- */
/* Articles                                                                    */
/* -------------------------------------------------------------------------- */

function SearchResultsPredictiveArticles({term, articles, closeSearch}) {
  if (!articles.length) return null;

  return (
    <div className="flex flex-col gap-2" key="articles">
      <h5 className="px-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Articles
      </h5>

      <ul className="divide-y divide-gray-100">
        {articles.map((article) => {
          const articleUrl = urlWithTrackingParams({
            baseUrl: `/blogs/${article.blog.handle}/${article.handle}`,
            trackingParams: article.trackingParameters,
            term: term.current ?? '',
          });

          return (
            <li key={article.id}>
              <Link
                to={articleUrl}
                onClick={closeSearch}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                {article.image?.url && (
                  <Image
                    alt={article.image.altText ?? ''}
                    src={article.image.url}
                    width={48}
                    height={48}
                    className="rounded object-cover"
                  />
                )}

                <span className="min-w-0 truncate text-sm font-medium text-gray-900">
                  {article.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Collections                                                                 */
/* -------------------------------------------------------------------------- */

function SearchResultsPredictiveCollections({term, collections, closeSearch}) {
  if (!collections.length) return null;

  return (
    <div className="flex flex-col gap-2" key="collections">
      <h5 className="px-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Collections
      </h5>

      <ul className="divide-y divide-gray-100">
        {collections.map((collection) => {
          const collectionUrl = urlWithTrackingParams({
            baseUrl: `/collections/${collection.handle}`,
            trackingParams: collection.trackingParameters,
            term: term.current,
          });

          return (
            <li key={collection.id}>
              <Link
                to={collectionUrl}
                onClick={closeSearch}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                {collection.image?.url && (
                  <Image
                    alt={collection.image.altText ?? ''}
                    src={collection.image.url}
                    width={48}
                    height={48}
                    className="rounded object-cover"
                  />
                )}

                <span className="min-w-0 truncate text-sm font-medium text-gray-900">
                  {collection.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Pages                                                                       */
/* -------------------------------------------------------------------------- */

function SearchResultsPredictivePages({term, pages, closeSearch}) {
  if (!pages.length) return null;

  return (
    <div className="flex flex-col gap-2" key="pages">
      <h5 className="px-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Pages
      </h5>

      <ul className="divide-y divide-gray-100">
        {pages.map((page) => {
          const pageUrl = urlWithTrackingParams({
            baseUrl: `/pages/${page.handle}`,
            trackingParams: page.trackingParameters,
            term: term.current,
          });

          return (
            <li key={page.id}>
              <Link
                to={pageUrl}
                onClick={closeSearch}
                className="block px-4 py-3 transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                <span className="block truncate text-sm font-medium text-gray-900">
                  {page.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Products                                                                    */
/* -------------------------------------------------------------------------- */

function SearchResultsPredictiveProducts({term, products, closeSearch}) {
  if (!products.length) return null;

  return (
    <div className="flex flex-col gap-2" key="products">
      <h5 className="px-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Products
      </h5>

      <ul className="divide-y divide-gray-100">
        {products.map((product) => {
          const productUrl = urlWithTrackingParams({
            baseUrl: `/products/${product.handle}`,
            trackingParams: product.trackingParameters,
            term: term.current,
          });

          const price = product?.selectedOrFirstAvailableVariant?.price;
          const image = product?.selectedOrFirstAvailableVariant?.image;

          return (
            <li key={product.id}>
              <Link
                to={productUrl}
                onClick={closeSearch}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                {image && (
                  <Image
                    alt={image.altText ?? ''}
                    src={image.url}
                    width={48}
                    height={48}
                    className="rounded object-cover"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {product.title}
                  </p>

                  {price && (
                    <small className="block text-xs text-gray-500">
                      <Money data={price} />
                    </small>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Queries                                                                     */
/* -------------------------------------------------------------------------- */

function SearchResultsPredictiveQueries({queries, queriesDatalistId}) {
  if (!queries.length) return null;

  return (
    <datalist id={queriesDatalistId}>
      {queries.map((suggestion) =>
        suggestion ? (
          <option key={suggestion.text} value={suggestion.text} />
        ) : null
      )}
    </datalist>
  );
}

/* -------------------------------------------------------------------------- */
/* Empty state                                                                 */
/* -------------------------------------------------------------------------- */

function SearchResultsPredictiveEmpty({term}) {
  if (!term.current) return null;

  return (
    <p className="px-4 py-6 text-sm text-gray-500">
      No results found for <q className="font-medium">{term.current}</q>
    </p>
  );
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                        */
/* -------------------------------------------------------------------------- */

function usePredictiveSearch() {
  const fetcher = useFetcher({key: 'search'});
  const term = useRef('');
  const inputRef = useRef(null);

  if (fetcher?.state === 'loading') {
    term.current = String(fetcher.formData?.get('q') || '');
  }

  useEffect(() => {
    if (!inputRef.current) {
      inputRef.current = document.querySelector('input[type="search"]');
    }
  }, []);

  const {items, total} =
    fetcher?.data?.result ?? getEmptyPredictiveSearchResult();

  return {items, total, inputRef, term, fetcher};
}
