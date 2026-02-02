import {CartForm} from '@shopify/hydrogen';
import {useEffect} from 'react';
import {useState} from 'react';
import {Loader2, Check, ShoppingBag} from 'lucide-react';

/**
 * @param {{
 *   analytics?: unknown;
 *   children: React.ReactNode;
 *   disabled?: boolean;
 *   lines: Array<OptimisticCartLineInput>;
 *   onClick?: () => void;
 *  afterAddToCart?: () => void;
 * }}
 */
export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  afterAddToCart,
}) {
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    let timeout;
    if (addedToCart) {
      timeout = setTimeout(() => {
        setAddedToCart(false);
      }, 2500);
    }
    return () => clearTimeout(timeout);
  }, [addedToCart]);

  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher) => {
        const isLoading = fetcher.state !== 'idle';
        useEffect(() => {
          if (
            fetcher.state === 'idle' &&
            fetcher.data &&
            !fetcher.data.errors
          ) {
            setAddedToCart(true);
            if (afterAddToCart) {
              afterAddToCart();
            }
          }
        }, [fetcher.state, fetcher.data]);
        return (
          <div className="relative">
            <input
              type="hidden"
              name="analytics"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
              onClick={onClick}
              disabled={disabled ?? isLoading}
              className='w-full py-5 px-8 bg-brand-navy hover:bg-brand-navyLight disabled:bg-brand-gray disabled:cursor-not-allowed text-white font-source text-base transition-all tracking-wider flex duration-300 ease-in-out justify-center items-center gap-3 relative overflow-hidden before:content-[""] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-white/10 before:translate-x-[-100%] hover:before:translate-x-[100%] before:duration-700 before:transition-transform  disabled:before:hidden'
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span className="font-medium">Adding to Cart</span>
                </>
              ) : addedToCart ? (
                <>
                  <Check className="w-5 h-5 " />
                  <span className="font-medium">Added to Cart</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium">{children}</span>
                </>
              )}
            </button>
            {/*Loading*/}
            {/* {isLoading && (
              <div className="absolute bottom-0 left-0 h-0.5 bg-brand-cream">
                <div className="h-full bg-gradient-to-r from-brand-gold to-brand-navy animate-progress" />
                <Loader2 className="animate-spin h-5 w-5 text-brand-gold" />
              </div>
            )} */}
          </div>
        );
      }}
    </CartForm>
  );
}

/** @typedef {import('react-router').FetcherWithComponents} FetcherWithComponents */
/** @typedef {import('@shopify/hydrogen').OptimisticCartLineInput} OptimisticCartLineInput */
