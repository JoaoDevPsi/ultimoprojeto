const showProductsButton = document.getElementById('showProducts');
const productContainer = document.getElementById('productContainer');
const cartList = document.getElementById('cartList');
const clearCartButton = document.getElementById('clearCart');
const buyCart = document.getElementById('buyCart')

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartDisplay() {
  cartList.innerHTML = '';
  let totalItems = 0;
  let totalPrice = 0;

  if (cart.length === 0) {
    cartList.innerHTML = '<li>Seu carrinho está vazio.</li>';
  } else {
    cart.forEach(item => {
      const listItem = document.createElement('li');
      listItem.className = 'cart-item';
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.title;
      const title = document.createElement('span');
      title.textContent = item.title;
      const quantityControls = document.createElement('div');
      quantityControls.className = 'quantity-controls';
      const decreaseButton = document.createElement('button');
      decreaseButton.textContent = '-';
      decreaseButton.addEventListener('click', () => {
        if (item.quantity > 1) {
          item.quantity--;
          updateCartDisplay();
        }
      });


      const quantity = document.createElement('span');
      quantity.textContent = item.quantity;
      const increaseButton = document.createElement('button');
      increaseButton.textContent = '+';
      increaseButton.addEventListener('click', () => {
        item.quantity++;
        updateCartDisplay();
      });


      const price = document.createElement('span');
      price.className = "preco"
      price.textContent = `$ ${(item.price * item.quantity).toFixed(2)}`;

      quantityControls.appendChild(decreaseButton);
      quantityControls.appendChild(quantity);
      quantityControls.appendChild(increaseButton);

      listItem.appendChild(img);
      listItem.appendChild(title);
      listItem.appendChild(quantityControls);
      listItem.appendChild(price);
      cartList.appendChild(listItem);
      totalItems += item.quantity;
      totalPrice += item.price * item.quantity;
    });

    const totalItemsElement = document.createElement('p');
    totalItemsElement.id = 'cart-total';
    totalItemsElement.textContent = `Total de Itens: ${totalItems}`;
    totalItemsElement.textContent= `Total valor:${totalPrice}`
    cartList.appendChild(totalItemsElement);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
}


clearCartButton.addEventListener('click', () => {
  cart = [];
  localStorage.removeItem('cart');
  updateCartDisplay();
});

showProductsButton.addEventListener('click', () => {
  fetch('https://fakestoreapi.com/products')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      productContainer.innerHTML = '';
      data.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.title;
        image.className = 'product-image';
        const title = document.createElement('h3');
        title.textContent = product.title;
        const price = document.createElement('p');
        price.textContent = `$ ${product.price}`;
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Adicionar ao Carrinho';
        addToCartButton.addEventListener('click', () => {
          const existingItem = cart.find(item => item.id === product.id);
          if (existingItem) {
            existingItem.quantity++;
          } else {
            cart.push({ id: product.id, title: product.title, price: product.price, image: product.image, quantity: 1 });
          }
          updateCartDisplay();
        });
        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(addToCartButton);
        productContainer.appendChild(card);
      });
      updateCartDisplay();
    })
    .catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
      productContainer.innerHTML = '<p>Erro ao carregar os produtos. Por favor, tente novamente mais tarde.</p>';
    });
});

buyCart.addEventListener('click', ()=>{
  alert('Parabens por concluir sua compra')
})