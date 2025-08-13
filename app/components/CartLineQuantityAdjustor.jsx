import {OptimisticCartLine} from '@shopify/hydrogen';
import {CartApiQueryFragment} from 'storefrontapi.generated';
import CartLineUpdateButton from './CartLineUpdateButton';

const CartLineQuantityAdjustor = ({line}) => {
if (!line || typeof line === 'undefined')  {
return null;
}
const {id: lineId, quantity,isOptimistic} = line;
const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
const nextQuantity = Number(Math.round(quantity) + 1);

  return (<div className='flex items-center gap-2'>
<CartLineUpdateButton>

</CartLineUpdateButton>

<CartLineUpdateButton>

</CartLineUpdateButton>

  </div>)
};
export default CartLineQuantityAdjustor;