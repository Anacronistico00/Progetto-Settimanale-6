const productForm = document.getElementById('productForm');
const productName = document.getElementById('productName');
const productBrand = document.getElementById('productBrand');
const productImg = document.getElementById('productImg');
const productPrice = document.getElementById('productPrice');
const productDescription = document.getElementById('productDescription');
const addItemBtn = document.getElementById('addItemBtn');
const striveURL = 'https://striveschool-api.herokuapp.com/api/product/';
const authKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzU4NzE4NzA3ZGI3MzAwMTU0MDYzYjQiLCJpYXQiOjE3MzM4NTAxMzksImV4cCI6MTczNTA1OTczOX0.NSvVZdTY9P_SYQYvjZZstE8IE_EdMLB_7V9wGYdUrXk';
const title = document.getElementById('title');
title.innerText = 'Inserisci un nuovo prodotto';
const productID = new URLSearchParams(window.location.search).get('_id');

let product;
let productsList = [];

class Product {
  constructor(_name, _brand, _imageUrl, _price, _description) {
    this.name = _name;
    this.description = _description;
    this.brand = _brand;
    this.imageUrl = _imageUrl;
    this.price = _price;
  }
}

addItemBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (!product) {
    addProduct();
  } else if (product) {
    modifyProduct(product._id);
  } else return;
});

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
    }

    productForm.reset();
  } else {
    printDetails(id);
  }
};

const getProduct = function (id) {
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
      console.log(details);
      modifyProduct(details, productID);

      productName.value = details.name;
      productBrand.value = details.brand;
      productImg.value = details.imageUrl;
      productPrice.value = details.price;
      productDescription.value = details.description;
    })
    .catch((error) => {
      console.log(error);
    });
};

const modifyProduct = async (details, id) => {
  if (!details) {
    console.error('Dettagli del prodotto non validi:', details);
    return;
  }

  product.name = productName.value;
  product.brand = productBrand.value;
  product.imageUrl = productImg.value;
  product.price = productPrice.value;
  product.description = productDescription.value;

  try {
    await fetch(striveURL + id, {
      method: 'PUT',
      body: JSON.stringify(product),
      headers: {
        Authorization: `bearer ${authKey}`,
        'Content-Type': 'application/json; charset=utf-8',
      },
    });
  } catch (error) {
    console.log(error);
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
  deleteProduct(productID);
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
  }
};

if (productID) {
  getProduct();
  addItemBtn.innerText = 'Salva le Modifiche';
  title.innerText = 'Modifica il prodotto selezionato';
}
