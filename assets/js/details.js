const striveURL = 'https://striveschool-api.herokuapp.com/api/product/';
const authKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzU4NzE4NzA3ZGI3MzAwMTU0MDYzYjQiLCJpYXQiOjE3MzM4NTAxMzksImV4cCI6MTczNTA1OTczOX0.NSvVZdTY9P_SYQYvjZZstE8IE_EdMLB_7V9wGYdUrXk';

window.onload = function () {
  getProduct();
};

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

const getProduct = function () {
  const productID = new URLSearchParams(window.location.search).get('_id');

  fetch(striveURL + productID, {
    headers: {
      Authorization: `Bearer ${authKey}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Errore nel caricamento del prodotto');
      }
    })
    .then((details) => {
      productDetails(details);
    })
    .catch((error) => {
      console.log(error);

      if (error.message.includes('NetworkError')) {
        showError('Errore di rete: Impossibile connettersi al server.');
      } else if (error.message.includes('404')) {
        showError('Errore: Risorsa non trovata.');
      } else {
        showError(
          'Si è verificato un errore durante il caricamento dei prodotti.'
        );
      }
    });
};

const productDetails = function (details) {
  const mainDiv = document.getElementById('main');

  const img = document.createElement('img');
  img.src = `${details.imageUrl}`;
  img.classList.add('col-3');

  const descriptionDiv = document.createElement('div');
  descriptionDiv.classList.add('container', 'col-9');

  const descriptionH5 = document.createElement('h5');
  descriptionH5.textContent = `${details.brand}`;

  const descriptionH2 = document.createElement('h2');
  descriptionH2.textContent = `${details.name}`;

  const descriptionPrice = document.createElement('span');
  descriptionPrice.textContent = `€${details.price}`;
  descriptionPrice.classList.add(
    'bg-black',
    'text-warning',
    'border-0',
    'px-3',
    'py-1',
    'rounded-4'
  );

  const descriptionDetails = document.createElement('p');
  descriptionDetails.textContent = `${details.description}`;
  descriptionDetails.classList.add('mt-2');

  const toCartBtn = document.createElement('button');
  toCartBtn.innerHTML = ' 🛒 Aggiungi al carrello 🛒';
  toCartBtn.id = 'addToCart';
  toCartBtn.classList.add(
    'bg-black',
    'text-white',
    'border-0',
    'px-3',
    'py-1',
    'rounded-4',
    'mt-5'
  );

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

  const addToCart = () => {
    cart = JSON.parse(localStorage.getItem('cart')) || [];

    localStorage.setItem('cart', JSON.stringify(cart));
    updateDropdown();
  };

  toCartBtn.addEventListener('click', function (e) {
    e.preventDefault();
    cart.push(details);
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log('Prodotto aggiunto al carrello:', details);
    addToCart(details);
  });

  descriptionDiv.appendChild(descriptionH5);
  descriptionDiv.appendChild(descriptionH2);
  descriptionDiv.appendChild(descriptionPrice);
  descriptionDiv.appendChild(descriptionDetails);
  descriptionDiv.appendChild(toCartBtn);
  mainDiv.appendChild(img);
  mainDiv.appendChild(descriptionDiv);
};
