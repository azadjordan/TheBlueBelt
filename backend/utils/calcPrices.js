function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export function calcPrices(orderItems, discountPercentage) {
  // Calculate the items price
  const itemsPriceBeforeDiscount = addDecimals(
    orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );
  const itemsPrice = itemsPriceBeforeDiscount - (itemsPriceBeforeDiscount * discountPercentage)
  // Calculate the shipping price
  const shippingPrice = addDecimals(itemsPrice > 800 ? 0 : 30);
  // Calculate the tax price
  const taxPrice = addDecimals(Number((0.05 * itemsPrice).toFixed(2)));
  // Calculate the total price
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
}