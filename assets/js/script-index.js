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

const getProducts = async () => {
  // Mostra il loader
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
  } finally {
    clearTimeout(loadingTimer);
    loader.style.display = 'none';
  }
};

// Chiama la funzione per ottenere i prodotti
getProducts();
