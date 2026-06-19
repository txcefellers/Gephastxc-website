import { addToCart } from '../data/carts.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';
import { updateCartCounts } from './site.js';

const productsGrid = document.querySelector('.js-products-grid');
const searchInput = document.querySelector('.search-bar');
const searchButton = document.querySelector('.js-search-button');

const noResultsMessage = document.createElement('div');
noResultsMessage.className = 'no-results-message';
noResultsMessage.textContent = 'No products match your search. Try a different term.';

function createProductCard(product) {
  const container = document.createElement('div');
  container.className = 'product-container';
  container.dataset.productId = product.id;

  const imageContainer = document.createElement('div');
  imageContainer.className = 'product-image-container';
  const image = document.createElement('img');
  image.className = 'product-image';
  image.src = product.image;
  image.alt = product.name;
  imageContainer.appendChild(image);

  const productName = document.createElement('div');
  productName.className = 'product-name limit-text-to-2-lines';
  productName.textContent = product.name;

  const ratingContainer = document.createElement('div');
  ratingContainer.className = 'product-rating-container';
  const ratingImage = document.createElement('img');
  ratingImage.className = 'product-rating-stars';
  ratingImage.src = `images/ratings/rating-${product.rating.stars * 10}.png`;
  ratingImage.alt = `${product.rating.stars} star rating`;
  const ratingCount = document.createElement('div');
  ratingCount.className = 'product-rating-count link-primary';
  ratingCount.textContent = product.rating.count;
  ratingContainer.append(ratingImage, ratingCount);

  const price = document.createElement('div');
  price.className = 'product-price';
  price.textContent = `$${formatCurrency(product.priceCents)}`;

  const quantityContainer = document.createElement('div');
  quantityContainer.className = 'product-quantity-container';
  const quantitySelect = document.createElement('select');
  quantitySelect.className = 'product-quantity-select';
  quantitySelect.setAttribute('aria-label', `Quantity for ${product.name}`);

  for (let i = 1; i <= 10; i += 1) {
    const option = document.createElement('option');
    option.value = String(i);
    option.textContent = String(i);
    quantitySelect.appendChild(option);
  }

  quantityContainer.appendChild(quantitySelect);

  const spacer = document.createElement('div');
  spacer.className = 'product-spacer';

  const addedMessage = document.createElement('div');
  addedMessage.className = 'added-to-cart';
  const checkIcon = document.createElement('img');
  checkIcon.src = 'images/icons/checkmark.png';
  checkIcon.alt = '';
  addedMessage.append(checkIcon, document.createTextNode('Added'));

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'add-to-cart-button button-primary js-add-to-cart';
  button.dataset.productId = product.id;
  button.textContent = 'Add to Cart';

  button.addEventListener('click', () => {
    const quantity = Number(quantitySelect.value) || 1;
    addToCart(product.id, quantity);
    updateCartCounts();
    showAddedFeedback(button, addedMessage);
  });

  container.append(
    imageContainer,
    productName,
    ratingContainer,
    price,
    quantityContainer,
    spacer,
    addedMessage,
    button,
  );

  return container;
}

function showAddedFeedback(button, messageElement) {
  button.disabled = true;
  button.textContent = 'Added';
  messageElement.style.opacity = '1';

  setTimeout(() => {
    button.disabled = false;
    button.textContent = 'Add to Cart';
    messageElement.style.opacity = '0';
  }, 1100);
}

function renderProducts(productList) {
  productsGrid.innerHTML = '';
  if (!productList.length) {
    productsGrid.appendChild(noResultsMessage);
    return;
  }

  const fragment = document.createDocumentFragment();
  productList.forEach((product) => {
    fragment.appendChild(createProductCard(product));
  });
  productsGrid.appendChild(fragment);
}

function normalizeQuery(query) {
  return query.trim().toLowerCase();
}

function filterProducts(query) {
  const lowerCaseQuery = normalizeQuery(query);
  if (!lowerCaseQuery) {
    return products;
  }

  return products.filter((product) => {
    return product.name.toLowerCase().includes(lowerCaseQuery)
      || product.keywords.some((keyword) => keyword.toLowerCase().includes(lowerCaseQuery));
  });
}

function handleSearch() {
  renderProducts(filterProducts(searchInput.value));
}

searchButton.addEventListener('click', handleSearch);
searchInput.addEventListener('input', handleSearch);
searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    handleSearch();
  }
});

renderProducts(products);
updateCartCounts();


 
