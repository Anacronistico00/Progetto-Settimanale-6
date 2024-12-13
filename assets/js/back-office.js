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
class product {
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
  addProduct();
});

const addProduct = async () => {
  let newProduct = new product(
    productName.value,
    productBrand.value,
    productImg.value,
    productPrice.value,
    productDescription.value
  );
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
};
