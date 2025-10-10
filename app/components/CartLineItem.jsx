import {CartForm, Image} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {Link} from 'react-router';
import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import {Feather, Loader2, Minus, Plus, X} from 'lucide-react';
import {useEffect, useState} from 'react';


/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 * @param {{
 *   layout: CartLayout;
 *   line: CartLine;
 * }}
 */
export function CartLineItem({layout, line}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <div className="flex gap-4 py-6 border-b border-gray-100">
      {/* Image */}
      <div className="relative w-24 h-24 bg-gray-50 rounded-lg overflow-hidden">
        {image && (
          <Image
            alt={title}
            aspectRatio="1/1"
            data={image}
            loading="lazy"
            className="object-cover w-full h-full"
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          />
        )}
      </div>
      {/* Product details*/}

      <div className="flex-1 min-w-0">
        <Link
          to={lineItemUrl}
          onClick={close}
          prefetch="intent"
          className="block"
        >
          {' '}
          <h3 className="font-playfair text-base text-brand-navy mb-1 truncate">
            {product.title}
          </h3>
        </Link>
        {/** Product options */}
        <div className="mt-1 space-y-1">
          {selectedOptions.map((option) => (
            <p
              key={`${product.id}-${option.name}`}
              className="font-source text-sm text-gray-500"
            >
              {option.name}: {option.value}
            </p>
          ))}
        </div>
        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <CartLineQuantityAdjustor line={line} />
          <div className="font-source font-medium">
            <ProductPrice price={line?.cost?.totalAmount} />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 * @param {{line: CartLine}}
 */
function CartLineQuantityAdjustor({line}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="flex items-center gap-2">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          disabled={quantity <= 1}
          className={`w-8 h-8 flex items-center justify-center rounded border transition-colors ${
            quantity <= 1
              ? 'border-gray-200 text-gray-300'
              : 'border-gray-200 hover:border-gray-400 text-gray-500'
          }`}
        >
          <Minus className="w-4 h-4" />
        </button>
      </CartLineUpdateButton>
      <span className="font-source w-8 text-center">{quantity}</span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          className={`w-8 h-8 flex items-center justify-center rounded border transition-colors
          border-gray-200  hover:border-gray-400 text-gray-500'
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </CartLineUpdateButton>

      <CartLineRemoveButton
        lineIds={[lineId]}
        disabled={isOptimistic === true}
      />
    </div>
  );
}

/**
 * A button that removes a line item from the cart. It is disabled
 * when the line item is new, and the server hasn't yet responded
 * that it was successfully added to the cart.
 * @param {{
 *   lineIds: string[];
 *   disabled: boolean;
 * }}
 */
function CartLineRemoveButton({lineIds, disabled}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button
        disabled={disabled}
        className={`ml-3 text-gray-400 hover:text-gray-500 transition-colors ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <X className="w-4 h-4" />
      </button>
    </CartForm>
  );
}

/**
 * @param {{
 *   children: React.ReactNode;
 *   lines: CartLineUpdateInput[];
 * }}
 */
function CartLineUpdateButton({children, lines}) {
  const [updating, setUpdating] = useState(false);

  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {(fetcher) => {
        useEffect(() => {
          if (fetcher.state === 'loading') {
            setUpdating(true);
          } else if (fetcher.state === 'idle') {
            setTimeout(() => setUpdating(false), 200);
          }
        }, [fetcher.state]);
        if (updating) {
          return (
            <div className="relative inline-flex items-center justify-center ">
              <div className="opacity-50 pointer-events-none">{children}</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-brand-gold" />
              </div>
            </div>
          );
        }
        return children;
      }}
    </CartForm>
  );
}

/**
 * Returns a unique key for the update action. This is used to make sure actions modifying the same line
 * items are not run concurrently, but cancel each other. For example, if the user clicks "Increase quantity"
 * and "Decrease quantity" in rapid succession, the actions will cancel each other and only the last one will run.
 * @returns
 * @param {string[]} lineIds - line ids affected by the update
 */
function getUpdateKey(lineIds) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

/** @typedef {OptimisticCartLine<CartApiQueryFragment>} CartLine */

/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartLineUpdateInput} CartLineUpdateInput */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLine} OptimisticCartLine */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
