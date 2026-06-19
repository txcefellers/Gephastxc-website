import { cart, removeFromCart, updateCartItemQuantity, clearCart } from '../data/carts.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { updateCartCounts } from './site.js';

const orderSummary = document.querySelector('.js-order-summary');
const placeOrderButton = document.querySelector('.place-order-button');

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function createDeliveryOption(name, label, checked = false) {
  const optionWrapper = document.createElement('div');
  optionWrapper.className = 'delivery-option';

  const input = document.createElement('input');
  input.type = 'radio';
  input.className = 'delivery-option-input';
  input.name = name;
  input.checked = checked;

  const labelContainer = document.createElement('div');
  const dateLabel = document.createElement('div');
  dateLabel.className = 'delivery-option-date';
  dateLabel.textContent = label.date;
  const priceLabel = document.createElement('div');
  priceLabel.className = 'delivery-option-price';
  priceLabel.textContent = label.price;

  labelContainer.append(dateLabel, priceLabel);
  optionWrapper.append(input, labelContainer);

  return optionWrapper;
}

function createCartItemElement(cartItem) {
  const product = getProduct(cartItem.productId);
  if (!product) {
    return null;
  }

  const container = document.createElement('div');
  container.className = `cart-item-container js-cart-item-container-${product.id}`;

  const deliveryDate = document.createElement('div');
  deliveryDate.className = 'delivery-date';
  deliveryDate.textContent = 'Delivery date: Tuesday, June 21';

  const detailsGrid = document.createElement('div');
  detailsGrid.className = 'cart-item-details-grid';

  const productImage = document.createElement('img');
  productImage.className = 'product-image';
  productImage.src = product.image;
  productImage.alt = product.name;

  const details = document.createElement('div');
  details.className = 'cart-item-details';

  const productName = document.createElement('div');
  productName.className = 'product-name';
  productName.textContent = product.name;

  const productPrice = document.createElement('div');
  productPrice.className = 'product-price';
  productPrice.textContent = `$${formatCurrency(product.priceCents)}`;

  const productQuantity = document.createElement('div');
  productQuantity.className = 'product-quantity';
  const quantityLabel = document.createElement('span');
  quantityLabel.innerHTML = 'Quantity: <span class="quantity-label"></span>';
  quantityLabel.querySelector('.quantity-label').textContent = String(cartItem.quantity);

  const updateQuantityLink = document.createElement('span');
  updateQuantityLink.className = 'update-quantity-link link-primary';
  updateQuantityLink.textContent = 'Update';

  const deleteLink = document.createElement('span');
  deleteLink.className = 'delete-quantity-link link-primary js-delete-link';
  deleteLink.dataset.productId = product.id;
  deleteLink.textContent = 'Delete';

  const quantitySelect = document.createElement('select');
  quantitySelect.className = 'cart-item-quantity-select';
  quantitySelect.setAttribute('aria-label', `Quantity for ${product.name}`);
  for (let i = 1; i <= 10; i += 1) {
    const option = document.createElement('option');
    option.value = String(i);
    option.textContent = String(i);
    option.selected = i === cartItem.quantity;
    quantitySelect.appendChild(option);
  }

  updateQuantityLink.addEventListener('click', () => {
    const newQuantity = Number(quantitySelect.value);
    updateCartItemQuantity(product.id, newQuantity);
    quantityLabel.querySelector('.quantity-label').textContent = String(newQuantity);
    updateCartCounts();
  });

  quantitySelect.addEventListener('change', () => {
    const newQuantity = Number(quantitySelect.value);
    updateCartItemQuantity(product.id, newQuantity);
    quantityLabel.querySelector('.quantity-label').textContent = String(newQuantity);
    updateCartCounts();
  });

  deleteLink.addEventListener('click', () => {
    removeFromCart(product.id);
    const row = document.querySelector(`.js-cart-item-container-${product.id}`);
    if (row) {
      row.remove();
    }
    updateCartCounts();
    if (!cart.length) {
      renderCart();
    }
  });

  productQuantity.append(quantityLabel, updateQuantityLink, deleteLink);
  details.append(productName, productPrice, productQuantity, quantitySelect);

  const deliveryOptions = document.createElement('div');
  deliveryOptions.className = 'delivery-options';

  const deliveryTitle = document.createElement('div');
  deliveryTitle.className = 'delivery-options-title';
  deliveryTitle.textContent = 'Choose a delivery option:';

  const option1 = createDeliveryOption(`delivery-option-${product.id}`, { date: 'Tuesday, June 21', price: 'FREE Shipping' }, true);
  const option2 = createDeliveryOption(`delivery-option-${product.id}`, { date: 'Wednesday, June 15', price: '$4.99 - Shipping' });
  const option3 = createDeliveryOption(`delivery-option-${product.id}`, { date: 'Monday, June 13', price: '$9.99 - Shipping' });

  deliveryOptions.append(deliveryTitle, option1, option2, option3);
  detailsGrid.append(productImage, details, deliveryOptions);
  container.append(deliveryDate, detailsGrid);

  return container;
}

function renderCart() {
  orderSummary.innerHTML = '';

  if (!cart.length) {
    const emptyMessage = document.createElement('div');
    emptyMessage.className = 'empty-cart-message';
    emptyMessage.innerHTML = 'Your cart is empty. <a class="link-primary" href="amazon.html">Continue shopping</a>.';
    orderSummary.appendChild(emptyMessage);

    if (placeOrderButton) {
      placeOrderButton.disabled = true;
      placeOrderButton.textContent = 'No items in cart';
    }
    return;
  }

  if (placeOrderButton) {
    placeOrderButton.disabled = false;
    placeOrderButton.textContent = 'Place your order';
  }

  const fragment = document.createDocumentFragment();
  cart.forEach((cartItem) => {
    const itemElement = createCartItemElement(cartItem);
    if (itemElement) {
      fragment.appendChild(itemElement);
    }
  });
  orderSummary.appendChild(fragment);
}

function showOrderSuccess() {
  const confirmation = document.createElement('div');
  confirmation.className = 'order-success-message';
  confirmation.textContent = 'Thank you! Your order has been placed successfully.';

  placeOrderButton.insertAdjacentElement('afterend', confirmation);
  placeOrderButton.disabled = true;
  placeOrderButton.textContent = 'Order placed';
  clearCart();
  updateCartCounts();
  renderCart();
}

renderCart();
updateCartCounts();

if (placeOrderButton) {
  placeOrderButton.addEventListener('click', showOrderSuccess);
}
