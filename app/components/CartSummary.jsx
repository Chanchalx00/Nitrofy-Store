import {CartForm, Money} from '@shopify/hydrogen';
import {useRef, useState} from 'react';
import {CreditCard, Gift, Ticket} from 'lucide-react';
import {Loader2} from 'lucide-react';

/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart /*, layout*/}) {
  return (
    <div className="bg-white px-6 py-8">
      {/* Subtotal */}
      <div className="items-center justify-between mb-4 flex">
        <span className="font-source text-gray-600">Subtotal</span>
        <span className="font-source font-medium">
          {cart.cost?.subtotalAmount ? (
            <Money data={cart.cost.subtotalAmount} />
          ) : (
            '-'
          )}
        </span>
      </div>

      {/* Discounts */}
      <CartDiscounts discountCodes={cart.discountCodes} />

      {/* Gift Cards */}
      <CartGiftCard giftCardCodes={cart.appliedGiftCards} />

      {/* Extra Information */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Gift className="w-4 h-4" />
          <span>Complimentary gift wrapping available</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <CreditCard className="w-4 h-4" />
          <span>Secure checkout powered by Shopify</span>
        </div>
      </div>
      {/* Buy Now / Checkout Button */}
      {cart.checkoutUrl && (
        <a
          href={cart.checkoutUrl}
          className="mt-6 block w-full bg-brand-gold hover:bg-brand-goldDark text-white text-center py-3 rounded-lg font-medium transition-colors duration-300"
        >
          Proceed to Payment
        </a>
      )}
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: CartApiQueryFragment['discountCodes'];
 * }}
 */
function CartDiscounts({discountCodes}) {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="py-4 border-t border-gray-100">
      {codes.length > 0 && (
        <div className="mb-2 text-sm text-gray-700">
          {codes.map((code) => (
            <div key={code}>Promo: {code}</div>
          ))}
        </div>
      )}

      {showInput ? (
        <UpdateDiscountForm discountCodes={codes}>
          {(fetcher) => {
            const isLoading = fetcher.state !== 'idle';
            return (
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    name="discountcode"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter promo code"
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-brand-navy font-source text-sm"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className={`px-4 py-2 bg-brand-navy text-white rounded text-sm font-source transition-colors duration-300 ${
                      isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-brand-navyLight'
                    }`}
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowInput(false);
                      setInputValue('');
                    }}
                    className="px-4 py-2 border border-gray-200 rounded text-sm font-source hover:border-gray-300 transition-colors duration-300"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }}
        </UpdateDiscountForm>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="text-sm text-brand-gold hover:text-brand-goldDark font-source transition-colors inline-flex items-center gap-2"
        >
          <Ticket className="w-4 h-4" /> Add promo code
        </button>
      )}
    </div>
  );
}

function UpdateDiscountForm({discountCodes, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

/**
 * Gift Card Section
 */
function CartGiftCard({giftCardCodes}) {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const codes =
    giftCardCodes?.map(({lastCharacters, id}) => ({
      code: `****${lastCharacters}`,
      id,
    })) || [];

  return (
    <div className="py-4 border-t border-gray-100">
      {codes.length > 0 && (
        <div className="mb-2 text-sm text-gray-700">
          {codes.map(({code, id}) => (
            <div key={id || code}>Gift Card: {code}</div>
          ))}
        </div>
      )}

      {showInput ? (
        <UpdateGiftCardForm>
          {(fetcher) => {
            const isLoading = fetcher.state !== 'idle';
            return (
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    name="giftCardCode"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter gift card code"
                    className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-brand-navy font-source text-sm"
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className={`px-4 py-2 bg-brand-navy text-white rounded text-sm font-source transition-colors duration-300 ${
                      isLoading
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:bg-brand-navyLight'
                    }`}
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowInput(false);
                      setInputValue('');
                    }}
                    className="px-4 py-2 border border-gray-200 rounded text-sm font-source hover:border-gray-300 transition-colors duration-300"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }}
        </UpdateGiftCardForm>
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="text-sm text-brand-gold hover:text-brand-goldDark font-source transition-colors inline-flex items-center gap-2"
        >
          <Ticket className="w-4 h-4" /> Add Gift Card
        </button>
      )}
    </div>
  );
}

function UpdateGiftCardForm({children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
    >
      {children}
    </CartForm>
  );
}

/**
 * @typedef {{
 *   cart: OptimisticCart<CartApiQueryFragment | null>;
 *   layout: CartLayout;
 * }} CartSummaryProps
 */

/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
/** @typedef {import('~/components/CartMain').CartLayout} CartLayout */
/** @typedef {import('@shopify/hydrogen').OptimisticCart} OptimisticCart */