import {Money} from '@shopify/hydrogen';

/**
 * @param {{
 *   price?: MoneyV2;
 *   compareAtPrice?: MoneyV2 | null;
 *   className?:string;
 * }}
 */
export function ProductPrice({price, compareAtPrice,className}) {
  const isValidMoney = (money) =>
    money &&
    typeof money.amount === 'string' &&
    typeof money.currencyCode === 'string';

  const hasDiscount =
    isValidMoney(compareAtPrice) &&
    isValidMoney(price) &&
    parseFloat(compareAtPrice.amount) > parseFloat(price.amount);

  const discountPercent = hasDiscount
    ? Math.round(
        ((parseFloat(compareAtPrice.amount) - parseFloat(price.amount)) /
          parseFloat(compareAtPrice.amount)) *
          100,
      )
    : 0;

  return (
    <div className={`product-price ${className}`}>
      {hasDiscount ? (
        <div className="flex items-center gap-2">
          <span className="text-red-600 font-semibold text-lg">
            <Money data={price} />
          </span>
          <s className="text-gray-500 text-sm">
            <Money data={compareAtPrice} />
          </s>
          <span className="text-green-600 text-xs font-medium">
            ({discountPercent}% OFF)
          </span>
        </div>
      ) : isValidMoney(price) ? (
        <span className="text-red-600 font-semibold text-lg">
          <Money data={price} />
        </span>
      ) : (
        <span>&nbsp;</span>
      )}
    </div>
  );
}
