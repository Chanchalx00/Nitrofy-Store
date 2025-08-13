import {CartForm, Money} from '@shopify/hydrogen';
import {useRef} from 'react';
import {CreditCard, Gift,Ticket} from 'lucide-react';
import {useState, useEffect} from 'react';
import {Loader2} from 'lucide-react';
/**
 * @param {CartSummaryProps}
 */
export function CartSummary({cart, layout}) {
  return (
    <div className="bg-white px-6 py-8">
      {/* Subtotal*/}
      <div className="items-center justify-between mb-4">
        <span className="font-source text-gray-600">Subtotal</span>
        <span className="font-source font-medium">
          {cart.cost?.subtotalAmount ? (
            <Money data={cart.cost.subtotalAmount} />
          ) : (
            '-'
          )}
        </span>
      </div>
      {/* Discounts*/}
      <CartDiscounts />
      {/* Gift Carda*/}
      {/* Checkout*/}
      {/* Extra Information*/}
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
    </div>
  );
}
/**
 * @param {{checkoutUrl?: string}}
 */
function CartCheckoutActions({checkoutUrl}) {
  if (!checkoutUrl) return null;

  return (
    <div>
      <a href={checkoutUrl} target="_self">
        <p>Continue to Checkout &rarr;</p>
      </a>
      <br />
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
  const inputRef = useRef(null);
  const codes =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="py-4 border-t border-gray-100">
      {codes.length > 0 && <div></div>}
      {/*discount input */}
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
                    ref={inputRef}
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
                    className={`px-4 py-2 bg-brand-navy text-white rounded text-sm font-source transition-colors duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-brand-navyLight'}`}
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowInput(false)}
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
          <Ticket className="w-4 h-4" />
          Add promo code
        </button>
      )}
    </div>
  );
}

/**
 * @param {{
 *   discountCodes?: string[];
 *   children: React.ReactNode | ((fetcher:any)=> React.ReactNode)
 * }}
 */
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
 * @param {{
 *   giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
 * }}
 */
function CartGiftCard({giftCardCodes}) {
  const appliedGiftCardCodes = useRef([]);
  const giftCardCodeInput = useRef(null);
  const codes =
    giftCardCodes?.map(({lastCharacters}) => `***${lastCharacters}`) || [];

  function saveAppliedCode(code) {
    const formattedCode = code.replace(/\s/g, ''); // Remove spaces
    if (!appliedGiftCardCodes.current.includes(formattedCode)) {
      appliedGiftCardCodes.current.push(formattedCode);
    }
    giftCardCodeInput.current.value = '';
  }

  function removeAppliedCode() {
    appliedGiftCardCodes.current = [];
  }

  return (
    <div>
      {/* Have existing gift card applied, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt>Applied Gift Card(s)</dt>
          <UpdateGiftCardForm>
            <div className="cart-discount">
              <code>{codes?.join(', ')}</code>
              &nbsp;
              <button onSubmit={() => removeAppliedCode}>Remove</button>
            </div>
          </UpdateGiftCardForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateGiftCardForm
        giftCardCodes={appliedGiftCardCodes.current}
        saveAppliedCode={saveAppliedCode}
      >
        <div>
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
          />
          &nbsp;
          <button type="submit">Apply</button>
        </div>
      </UpdateGiftCardForm>
    </div>
  );
}

/**
 * @param {{
 *   giftCardCodes?: string[];
 *   saveAppliedCode?: (code: string) => void;
 *   removeAppliedCode?: () => void;
 *   children: React.ReactNode;
 * }}
 */
function UpdateGiftCardForm({giftCardCodes, saveAppliedCode, children}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{
        giftCardCodes: giftCardCodes || [],
      }}
    >
      {(fetcher) => {
        const code = fetcher.formData?.get('giftCardCode');
        if (code && saveAppliedCode) {
          saveAppliedCode(code);
        }
        return children;
      }}
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
