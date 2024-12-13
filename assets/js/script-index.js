const striveURL = 'https://striveschool-api.herokuapp.com/api/product/';
const authKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzU4NzE4NzA3ZGI3MzAwMTU0MDYzYjQiLCJpYXQiOjE3MzM4NTAxMzksImV4cCI6MTczNTA1OTczOX0.NSvVZdTY9P_SYQYvjZZstE8IE_EdMLB_7V9wGYdUrXk';

const main = document.getElementById('cards');
const title = document.getElementById('title');

const loader = document.createElement('span');
loader.textContent = 'Caricamento in corso...';
loader.style.fontSize = '1rem';
loader.style.marginLeft = '10px';
loader.style.color = 'gray';
loader.style.display = 'none';
title.appendChild(loader);

const showError = (message) => {
  const alertContainer = document.getElementById('alert-container');

  const errorAlert = document.createElement('div');
  errorAlert.classList.add(
    'alert',
    'alert-danger',
    'alert-dismissible',
    'fade',
    'show'
  );
  errorAlert.role = 'alert';
  errorAlert.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>`;

  alertContainer.appendChild(errorAlert);
};

const getProducts = async () => {
  loader.style.display = 'inline';

  const loadingTimer = setTimeout(() => {
    loader.textContent = 'Sto ancora caricando...';
  }, 2000);

  try {
    let response = await fetch(striveURL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Errore nella risposta: ${response.status}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 3500));

    const products = await response.json();
    console.log('Prodotti ottenuti:', products);

    products.forEach((product) => {
      main.innerHTML += `<div class="card m-2" style="width: 18rem;">
                            <img src="${product.imageUrl}" class="card-img-top" alt="${product.brand} ${product.name}">
                            <div class="card-body  d-flex flex-column justify-content-between">
                                <h3 class="card-title fw-bolder">${product.brand} ${product.name}</h3>
                                <p class="card-text">${product.description} </p>
                                
                                <div><h4 class="text-center bg-secondary text-white border border-5 p-2">€${product.price}</h4>
                                <div  class="d-flex flex-column">
                                <a href="details.html?_id=${product._id}" class="btn btn-primary mb-2">Dettagli</a>
                                <a href="back-office.html?_id=${product._id}" class="btn btn-warning">Modifica</a>
                            </div>
                            </div>
                            </div>
                        </div>`;
    });
  } catch (error) {
    console.error('Errore durante il recupero dei prodotti:', error);

    if (error.message.includes('NetworkError')) {
      showError('Errore di rete: Impossibile connettersi al server.');
    } else if (error.message.includes('404')) {
      showError('Errore: Risorsa non trovata.');
    } else {
      showError(
        'Si è verificato un errore durante il caricamento dei prodotti.'
      );
    }
  } finally {
    clearTimeout(loadingTimer);
    loader.style.display = 'none';
  }
};

getProducts();

const dropdown = document.getElementById('dropdown');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const updateDropdown = () => {
  dropdown.innerHTML = '';
  if (cart.length === 0) {
    const emptyMessage = document.createElement('li');
    emptyMessage.classList.add('dropdown-item', 'text-center');
    emptyMessage.textContent = 'Il carrello è vuoto.';
    dropdown.appendChild(emptyMessage);
    return;
  }

  cart.forEach((item) => {
    const listItem = document.createElement('li');
    listItem.classList.add('dropdown-item');
    listItem.innerHTML = `
      <li class="d-flex align-items-center my-2">
        <img src="${item.imageUrl}" alt="${item.name}" class="img-thumbnail me-3" style="width: 50px; height: 50px; object-fit: cover;">
        <div>
          <h6 class="mb-0">${item.name}</h6>
          <small class="text-muted">${item.brand}</small>
          <p class="mb-0 fw-bold">€${item.price}</p>
          <button class="btn btn-danger btn-sm ms-3 remove-item">Rimuovi</button>
        </div>
      </li>
    `;
    dropdown.appendChild(listItem);
  });
  const removeButtons = dropdown.querySelectorAll('.remove-item');
  removeButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      const index = this.getAttribute('data-index');
      removeFromCart(index);
    });
  });
};

const removeFromCart = (index) => {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateDropdown();
};

updateDropdown();
