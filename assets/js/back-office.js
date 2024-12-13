const productForm = document.getElementById('productForm');
const productName = document.getElementById('productName');
const productBrand = document.getElementById('productBrand');
const productImg = document.getElementById('productImg');
const productPrice = document.getElementById('productPrice');
const productDescription = document.getElementById('productDescription');
const addItemBtn = document.getElementById('addItemBtn');
const btnReset = document.getElementById('btnReset');
const striveURL = 'https://striveschool-api.herokuapp.com/api/product/';
const authKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzU4NzE4NzA3ZGI3MzAwMTU0MDYzYjQiLCJpYXQiOjE3MzM4NTAxMzksImV4cCI6MTczNTA1OTczOX0.NSvVZdTY9P_SYQYvjZZstE8IE_EdMLB_7V9wGYdUrXk';
const title = document.getElementById('title');
title.innerText = 'Inserisci un nuovo prodotto';
const productID = new URLSearchParams(window.location.search).get('_id');

let productObj = {};

class Product {
  constructor(_name, _brand, _imageUrl, _price, _description) {
    this.name = _name;
    this.description = _description;
    this.brand = _brand;
    this.imageUrl = _imageUrl;
    this.price = _price;
  }
}

btnReset.addEventListener('click', function (e) {
  e.preventDefault;
  if (confirm('Svuotare tutti i Campi?')) {
    productName.value = '';
    productBrand.value = '';
    productImg.value = '';
    productPrice.value = '';
    productDescription.value = '';
  }
});

addItemBtn.addEventListener('click', function (e) {
  e.preventDefault();
  const confirmationMessage = productID
    ? 'Sei sicuro di voler salvare le modifiche?'
    : 'Sei sicuro di voler aggiungere questo prodotto?';

  if (confirm(confirmationMessage)) {
    if (!productID) {
      addProduct();
      window.location.href = 'index.html';
    } else {
      modifyProduct(productID);
      window.location.href = 'index.html';
      addItemBtn.innerText = 'Salva le Modifiche';
      title.innerText = 'Modifica il prodotto selezionato';
    }
  }
});

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

const addProduct = async (id) => {
  let newProduct = new Product(
    productName.value,
    productBrand.value,
    productImg.value,
    productPrice.value,
    productDescription.value
  );
  if (!id) {
    try {
      let response = await fetch(striveURL, {
        method: 'POST',
        headers: {
          Authorization: `bearer ${authKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });
      if (!response.ok) {
        throw new Error('Errore nella risposta: ' + response.status);
      }

      const data = await response.json();
      console.log('Prodotto aggiunto:', data);
    } catch (error) {
      console.log("Errore durante l'invio del prodotto:", error);

      if (error.message.includes('NetworkError')) {
        showError('Errore di rete: Impossibile connettersi al server.');
      } else if (error.message.includes('404')) {
        showError('Errore: Risorsa non trovata.');
      } else {
        showError(
          'Si è verificato un errore durante il caricamento dei prodotti.'
        );
      }
    }

    productForm.reset();
  } else {
    printDetails(id);
  }
};

const getProduct = async (id) => {
  try {
    let response = await fetch(striveURL + id, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Errore nella risposta: ' + response.status);
    }

    let data = await response.json();
    productObj = data;
    console.log('Prodotto recuperato:', productObj);
    addInInput(productObj);
  } catch (error) {
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
  }
};

if (productID) {
  getProduct(productID);
  addItemBtn.innerText = 'Salva le Modifiche';
  title.innerText = 'Modifica il prodotto selezionato';
}

function addInInput(object) {
  productName.value = object.name;
  productBrand.value = object.brand;
  productImg.value = object.imageUrl;
  productPrice.value = parseInt(object.price);
  productDescription.value = object.description;
}

const modifyProduct = async (id) => {
  const prodotto = new Product(
    productName.value,
    productBrand.value,
    productImg.value,
    parseInt(productPrice.value),
    productDescription.value
  );
  try {
    let response = await fetch(striveURL + id, {
      method: 'PUT',
      body: JSON.stringify(prodotto),
      headers: {
        Authorization: `Bearer ${authKey}`,
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Errore nella risposta: ' + response.status);
    }
  } catch (error) {
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
  }
};

const btnRemoveProduct = document.getElementById('btnRemoveProduct');
const btnRemove = document.createElement('button');
btnRemove.textContent = 'Rimuovi Oggetto';
btnRemoveProduct.appendChild(btnRemove);
btnRemove.setAttribute('type', 'button');
btnRemove.classList.add('w-100', 'bg-danger', 'border-0');

btnRemove.addEventListener('click', function (e) {
  e.preventDefault;
  if (confirm('Sei sicuro di voler rimuovere questo prodotto?')) {
    deleteProduct(productID);
    window.location.href = 'index.html';
  }
});

const deleteProduct = async (id) => {
  try {
    await fetch(striveURL + id, {
      method: 'delete',
      headers: {
        Authorization: `bearer ${authKey}`,
      },
    });
  } catch (error) {
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
  }
};

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

    listItem.classList.add('dropdown-item', 'p-0');
    listItem.innerHTML += `
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

  const total = cart.reduce((sum, item) => sum + item.price, 0);

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
