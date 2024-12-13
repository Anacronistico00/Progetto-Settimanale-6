const striveURL = 'https://striveschool-api.herokuapp.com/api/product/';
const authKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzU4NzE4NzA3ZGI3MzAwMTU0MDYzYjQiLCJpYXQiOjE3MzM4NTAxMzksImV4cCI6MTczNTA1OTczOX0.NSvVZdTY9P_SYQYvjZZstE8IE_EdMLB_7V9wGYdUrXk';

window.onload = function () {
  getProduct();
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
    });
};

const productDetails = function (details) {};
