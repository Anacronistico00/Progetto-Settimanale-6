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
    'px-3',
    'py-1',
    'rounded-4'
  );

  const descriptionDetails = document.createElement('p');
  descriptionDetails.textContent = `${details.description}`;
  descriptionDetails.classList.add('mt-2');

  descriptionDiv.appendChild(descriptionH5);
  descriptionDiv.appendChild(descriptionH2);
  descriptionDiv.appendChild(descriptionPrice);
  descriptionDiv.appendChild(descriptionDetails);
  mainDiv.appendChild(img);
  mainDiv.appendChild(descriptionDiv);
};
