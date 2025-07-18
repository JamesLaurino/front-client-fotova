export default function cartProductHelper(product:any,cartProductQuantityUser:any) {
  return {
    "id": Number(product.value()?.id),
    "name": String(product.value()?.name),
    "price": Number(product.value()?.price),
    "quantity": Number(cartProductQuantityUser.value),
    "url": String(product.value()?.url),
    "quantityMax":Number(product.value()?.quantity),
  }
}
