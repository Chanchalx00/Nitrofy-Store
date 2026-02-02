import {useOptimisticCart} from '@shopify/hydrogen';
import {Link} from 'react-router';
import {useAside} from '~/components/Aside';
import {CartLineItem} from '~/components/CartLineItem';
import {CartSummary} from './CartSummary';
import {ShoppingBag, ArrowRight} from 'lucide-react';


/**
 * The main cart component that displays the cart items and summary.
 * It is used by both the /cart route and the cart aside dialog.
 * @param {CartMainProps}
 */
export function CartMain({layout, cart: originalCart}) {
  // The useOptimisticCart hook applies pending actions to the cart
  // so the user immediately sees feedback when they modify the cart.
  const cart = useOptimisticCart(originalCart);

  const linesCount = Boolean(cart?.lines?.nodes?.length || 0);
  const withDiscount =
    cart &&
    Boolean(cart?.discountCodes?.filter((code) => code.applicable)?.length);
  const className = `cart-main min-h-screen ${withDiscount ? 'with-discount' : ''}`;
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className={className}>
      { !cartHasItems && <CartEmpty layout={layout} />}
      <div className="cart-details">
        <div aria-labelledby="cart-lines">
          <ul>
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartLineItem key={line.id} line={line} layout={layout} />
            ))}
          </ul>
        </div>
        {cartHasItems && <CartSummary cart={cart} layout={layout} />}
      </div>
    </div>
  );
}

//emptyjsx
/**
 * @param {{
 *   hidden: boolean;
 *   layout?: CartMainProps['layout'];
 * }}
 */
function CartEmpty() {
  const {close} = useAside();
   return (
    <div
      className={`flex flex-col items-center justify-center text-center h-full p-6`}
    >
      {/* Icon*/}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-brand-cream rounded-full scale-[1.8] blur-xl opacity-50" />
        <div className="relative w-20 h-20 bg-brand-cream rounded-full flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-brand-navy" />
        </div>
      </div>
      {/* Content */}
      <div className="max-w-md space-y-4">
        <h2 className="font-playfair text-2xl text-brand-navy">
          Your Shopping Cart is Empty{' '}
        </h2>
        <p className="font-source text-gray-500 leading-relaxed">
          Discover our collection of products to fill your cart.
        </p>
        {/* Primary CTA */}
        <Link 
        to="/collections/all"
        onClick={close}
        prefetch="intent"
        className="inline-flex items-center px-8 py-4 mt-6 bg-brand-navy text-white font-source font-medium hover:bg-brand-navyLight transition-all duration-300 justify-center "
        >
          Explore Our Products
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
        {/* Collections CTA */}
        <div className='pt-8 space-y-3 border-t border-gray-100 mt-8'> <p className='font-source text-sm text-gray-400 uppercase tracking-wide'>
          Featured Products
        </p>
        <div className='flex flex-wrap justify-center gap-4 text-sm'>
          <Link to="/collections/all" onClick={close} prefetch="intent" className='text-brand-gold hover:text-brand-goldDark transition-colors duration-300'> View All
          </Link>
        </div>
        </div>

        {/* Contact Information */}
          <div className='text-sm text-gray-500 pt-6'>
            <p className='font-source'>If you have any questions, feel free to reach out to our support team.</p>
            <a 
            href="mailto:support@example.com"
            className='font-source text-brand-gold hover:text-brand-goldDark transition-colors duration-300'>
              support@example.com
            </a>
          </div>
      </div>
    </div>
  );
};



/** @typedef {'page' | 'aside'} CartLayout */
/**
 * @typedef {{
 *   cart: CartApiQueryFragment | null;
 *   layout: CartLayout;
 * }} CartMainProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
