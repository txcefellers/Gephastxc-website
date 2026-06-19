export let cart = [];

try {
  const savedCart = JSON.parse(localStorage.getItem('cart'));

  if (Array.isArray(savedCart)) {
    cart = savedCart;
  }
} catch (error) {
  cart = [];
}

if (!cart.length) {
  cart = [{
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
  }, {
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1
  }];
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity = 1) {
  if (quantity <= 0) {
    return;
  }

  let matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (matchingItem) {
    matchingItem.quantity += quantity;
  } else {
    cart.push({
      productId: productId,
      quantity
    });
  }

  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = cart.filter((cartItem) => cartItem.productId !== productId);

  cart = newCart;

  saveToStorage();
}

export function updateCartItemQuantity(productId, quantity) {
  if (quantity < 1) {
    removeFromCart(productId);
    return;
  }

  const matchingItem = cart.find((cartItem) => cartItem.productId === productId);

  if (matchingItem) {
    matchingItem.quantity = quantity;
    saveToStorage();
  }
}

export function clearCart() {
  cart = [];
  saveToStorage();
}
