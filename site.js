import { cart } from '../data/carts.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

const cartQuantityElements = document.querySelectorAll('.js-cart-quantity');
const itemCountElement = document.querySelector('.js-item-count');
const itemsTotalElement = document.querySelector('.js-items-total');
const shippingTotalElement = document.querySelector('.js-shipping-total');
const subtotalTotalElement = document.querySelector('.js-subtotal-total');
const taxTotalElement = document.querySelector('.js-tax-total');
const orderTotalElement = document.querySelector('.js-order-total');

function getProductById(productId) {
  return products.find((product) => product.id === productId);
}

function getCartSubtotal() {
  return cart.reduce((subtotal, cartItem) => {
    const product = getProductById(cartItem.productId);
    return subtotal + (product ? product.priceCents * cartItem.quantity : 0);
  }, 0) / 100;
}

function getCartShipping() {
  return cart.length ? 4.99 : 0;
}

function getCartTax() {
  return getCartSubtotal() * 0.10;
}

function getCartTotal() {
  return getCartSubtotal() + getCartShipping() + getCartTax();
}

export function updateCartCounts() {
  const cartQuantity = cart.reduce((count, cartItem) => count + cartItem.quantity, 0);

  cartQuantityElements.forEach((element) => {
    element.textContent = cartQuantity;
  });

  if (itemCountElement) {
    itemCountElement.textContent = `${cartQuantity} ${cartQuantity === 1 ? 'item' : 'items'}`;
  }

  if (itemsTotalElement) {
    itemsTotalElement.textContent = `$${formatCurrency(getCartSubtotal())}`;
  }

  if (shippingTotalElement) {
    shippingTotalElement.textContent = `$${formatCurrency(getCartShipping())}`;
  }

  if (subtotalTotalElement) {
    subtotalTotalElement.textContent = `$${formatCurrency(getCartSubtotal())}`;
  }

  if (taxTotalElement) {
    taxTotalElement.textContent = `$${formatCurrency(getCartTax())}`;
  }

  if (orderTotalElement) {
    orderTotalElement.textContent = `$${formatCurrency(getCartTotal())}`;
  }
}

updateCartCounts();

if (cart.length === 0 && document.querySelector('.js-order-summary')) {
  const summaryElement = document.querySelector('.js-order-summary');
  summaryElement.innerHTML = '';
  const emptyMessage = document.createElement('div');
  emptyMessage.className = 'empty-cart-message';
  emptyMessage.innerHTML = 'Your cart is empty. <a class="link-primary" href="amazon.html">Continue shopping</a>.';
  summaryElement.appendChild(emptyMessage);
}
