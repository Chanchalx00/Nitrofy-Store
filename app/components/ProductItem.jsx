import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {ArrowRight} from 'lucide-react';
/**
 * @param {{
 *   product:import('storefrontapi.generated').ProductItemFragment
 *   loading?:'eager' | 'lazy'
 *   hidePrice?:boolean;
 * }}
 */

export function ProductItem({product, loading, hidePrice}) {
  

const variant = product?.variants?.nodes?.[0];
const variantUrl = useVariantUrl(product.handle, variant?.selectedOptions);

const secondImage = product?.images?.nodes?.[1]; 
const image = product?.featuredImage;


  const price = variant?.price;
  const compareAtPrice = variant?.compareAtPrice;

  const hasValidPrice = price?.amount != null && price?.currencyCode != null;
  const hasValidCompareAtPrice =
    compareAtPrice?.amount != null && compareAtPrice?.currencyCode != null;

  const hasDiscount =
    hasValidCompareAtPrice &&
    hasValidPrice &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  const discountPercent = hasDiscount
    ? Math.round(
        ((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) /
          parseFloat(compareAtPrice.amount)) *
          100,
      )
    : 0;

  return (
    <Link
      className="group block relative"
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <div className="relative aspect-square overflow-hidden bg-brand-cream mb-6">
        {product.featuredImage && (
          <>
            <Image
              alt={product.featuredImage.altText || product.title}
              aspectRatio="1/1"
              data={product.featuredImage}
              loading={loading}
              sizes="(min-width: 1024px)33vw, (min-width: 768px)50vw ,100vw"
              className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            />
            {secondImage && (
              <Image
                alt={secondImage.altText || product.title + '- Second Image'}
                data={secondImage}
                loading={loading}
                sizes="(min-width: 1024px)33vw, (min-width: 768px)50vw ,100vw"
                className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
            <div className="absolute inset-0 bg-brand-navy/0 group-hover:bg-brand-navy/20 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <div className="bg-white/90 backdrop-blur-sm py-3 px-4 text-center">
                <span className="font-source text-sm font-medium text-brand-navy tracking-wide">
                  View Details
                </span>
              </div>
            </div>
          </>
        )}
        {/*coner accents*/}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      <div className="relative">
        <h4 className="font-medium font-playfair text-brand-navy mb-2 group-hover:text-brand-gold transition-colors duration-500 text-lg">
          {product.title}
        </h4>
        <div className="flex items-baseline justify-between ">
          {!hidePrice && (
            <Money
              className="font-source text-gray-600 group-hover:text-brand-navy transition-colors duration-500"
              data={product.priceRange.minVariantPrice}
            />
          )}
          <span className="flex items-center font-source text-sm text-brand-gold opacity-0 group-hover:opacity-100 transition-opacity duration-100 ">
            Explore
            <ArrowRight className="ml-1 w-4 h-4" />
          </span>

          
        </div>
      </div>
    </Link>
  );
}
