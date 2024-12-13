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

let productObj = {};
let product;

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
  if (!productID) {
    addProduct();
  } else {
    modifyProduct(productID);
    addItemBtn.innerText = 'Salva le Modifiche';
    title.innerText = 'Modifica il prodotto selezionato';
  }
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
  }
};

const btnRemoveProduct = document.getElementById('btnRemoveProduct');
const btnRemove = document.createElement('button');
btnRemove.textContent = 'Rimuovi Oggetto';
btnRemoveProduct.appendChild(btnRemove);
btnRemove.setAttribute('type', 'reset');
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
