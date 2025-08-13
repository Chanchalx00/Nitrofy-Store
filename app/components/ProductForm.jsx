import {Link} from 'react-router';
import {AddToCartButton} from './AddToCartButton';
import {useAside} from './Aside';
import {VariantSelector, RichText} from '@shopify/hydrogen';

/**
 * @param {{
 *  product: any;
 *  selectedVariant: any;
 *  variants: any[];
 *  className?: string;
 * }}
 */
export function ProductForm({product, selectedVariant, variants, className}) {
  const {open} = useAside();

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="space-y-8">
        {/* Variant Options */}
        <VariantSelector
          handle={product.handle}
          options={product.options.filter(
            (option) => option.optionValues.length > 1,
          )}
          variants={variants}
        >
          {({option}) => <ProductOptions key={option.name} option={option} />}
        </VariantSelector>

        {/* Add to cart */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-source text-brand-navy/60">
              {selectedVariant?.availableForSale
                ? 'Ready to ship'
                : 'Currently unavailable'}
            </div>
            {selectedVariant?.sku && (
              <div className="text-sm font-source text-brand-navy/60">
                SKU: {selectedVariant.sku}
              </div>
            )}
          </div>

          <AddToCartButton
            disabled={!selectedVariant || !selectedVariant.availableForSale}
            afterAddToCart={() => open('cart')}
            lines={
              selectedVariant
                ? [{merchandiseId: selectedVariant.id, quantity: 1}]
                : []
            }
          >
            {selectedVariant?.availableForSale ? 'Add to Cart' : 'Sold Out'}
          </AddToCartButton>
        </div>

        {/* Product details */}
        <div className="mt-12 border-t border-brand-navy/10">
          <div className="grid grid-cols-1 divide-y divide-brand-navy/10">
            {product.materials?.value && (
              <details className="group py-6">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-playfair text-lg text-brand-navy">
                    Materials & Construction
                  </h3>
                  <span className="relative flex-shrink-0 ml-4 w-4 h-4">▼</span>
                </summary>
                <div className="pt-4 prose font-source text-brand-navy/80">
                  <RichText data={product.materials.value} />
                  {product.construction?.value && (
                    <div className="mt-4">
                      <h4 className="font-playfair text-base text-brand-navy">
                        Construction
                      </h4>
                      <p>{product.construction.value}</p>
                    </div>
                  )}
                </div>
              </details>
            )}
            {product.sizingNotes?.value && (
              <details className="group py-6">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-playfair text-lg text-brand-navy">
                    Size & Fit
                  </h3>
                  <span className="relative flex-shrink-0 ml-4 w-4 h-4">▼</span>
                </summary>
                <div className="pt-4 prose font-source text-brand-navy/80">
                  <p>{product.sizingNotes.value}</p>
                </div>
              </details>
            )}
            {product.careInstructions?.value && (
              <details className="group py-6">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-playfair text-lg text-brand-navy">
                    Care Guide
                  </h3>
                  <span className="relative flex-shrink-0 ml-4 w-4 h-4">▼</span>
                </summary>
                <div className="pt-4 prose font-source text-brand-navy/80">
                  <RichText data={product.careInstructions.value} />
                </div>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductOptions({option}) {
  return (
    <div className="product-options">
      <h5>{option.name}</h5>
      <div className="product-options-grid">
        {option.values.map(({value, isAvailable, isActive, to}) => (
          <Link
            key={option.name + value}
            prefetch="intent"
            preventScrollReset
            replace
            to={to}
            style={{
              border: isActive ? '2px solid black' : '1px solid black',
              opacity: isAvailable ? 1 : 0.3,
            }}
          >
            {value}
          </Link>
        ))}
      </div>
    </div>
  );
}
