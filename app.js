const dogList = document.getElementById('dog-list');
const dogDetails = document.getElementById('dog-details');
const filterInput = document.getElementById('breed-filter');

let allBreeds = [];

let favoriteBreeds = JSON.parse(localStorage.getItem('favoriteBreeds')) || [];

async function fetchDogBreeds() {
  try {
    const response = await fetch('https://dog.ceo/api/breeds/list/all');
    const data = await response.json();
    
    allBreeds = Object.keys(data.message);
    
    displayBreeds(allBreeds);
  } catch (error) {
    console.error('Erro ao buscar raças:', error);
  }
}

function displayBreeds(breeds) {
  dogList.innerHTML = '';
  
  breeds.slice(0, 10).forEach(breed => {
    const breedItem = document.createElement('div');
    
    breedItem.classList.add('dog-item');
    
    breedItem.innerHTML = `
      <img src="https://dog.ceo/api/breed/${breed}/images/random" alt="${breed}">
      <p>${capitalizeFirstLetter(breed)}</p>
    `;
    
    breedItem.addEventListener('click', () => showBreedDetails(breed));
    dogList.appendChild(breedItem);
  });
}

async function showBreedDetails(breed) {
  try {
    const response = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
    
    const data = await response.json();
    
    dogDetails.innerHTML = `
      <h3>${capitalizeFirstLetter(breed)}</h3>
      <img src="${data.message}" alt="${breed}">
      <button id="fav-button">${favoriteBreeds.includes(breed) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</button>
    `;
    
    document.getElementById('fav-button').addEventListener('click', () => toggleFavorite(breed));
  } catch (error) {
    console.error('Erro ao buscar imagem da raça:', error);
  }
}

filterInput.addEventListener('input', () => {
  const filteredBreeds = allBreeds.filter(breed => breed.includes(filterInput.value.toLowerCase()));
  
  displayBreeds(filteredBreeds);
});

function toggleFavorite(breed) {
  if (favoriteBreeds.includes(breed)) {
    favoriteBreeds = favoriteBreeds.filter(fav => fav !== breed);
  } else {
    favoriteBreeds.push(breed);
  }
  
  localStorage.setItem('favoriteBreeds', JSON.stringify(favoriteBreeds));
  
  showBreedDetails(breed);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

fetchDogBreeds();
