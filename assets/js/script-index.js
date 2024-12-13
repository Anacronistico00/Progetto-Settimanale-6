const striveURL = 'https://striveschool-api.herokuapp.com/api/product/';
const authKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzU4NzE4NzA3ZGI3MzAwMTU0MDYzYjQiLCJpYXQiOjE3MzM4NTAxMzksImV4cCI6MTczNTA1OTczOX0.NSvVZdTY9P_SYQYvjZZstE8IE_EdMLB_7V9wGYdUrXk';

const getProducts = async () => {
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

    const products = await response.json();
    console.log('Prodotti ottenuti:', products);

    products.forEach((product) => {
      const main = document.getElementById('main');
      main.innerHTML += `<div class="card m-2" style="width: 18rem;">
                            <img src="${product.imageUrl}" class="card-img-top" alt="${product.brand} ${product.name}">
                            <div class="card-body  d-flex flex-column justify-content-between">
                                <h5 class="card-title">${product.brand} ${product.name}</h5>
                                <p class="card-text">${product.description}</p>
                                <div  class="d-flex flex-column">
                                <a href="details.html?_id=${product._id}" class="btn btn-primary mb-2">Dettagli</a>
                                <a href="#" class="btn btn-danger">Modifica</a>
                            </div>
                            </div>
                        </div>`;
    });
  } catch (error) {
    console.error('Errore durante il recupero dei prodotti:', error);
  }
};

getProducts();
