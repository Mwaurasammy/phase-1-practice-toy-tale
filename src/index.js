let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys();
  const newToyForm = document.querySelector('.add-toy-form');
  newToyForm.addEventListener('submit', handleNewToySubmit);
});

const toyCollection = document.getElementById('toy-collection');
const apiUrl = 'http://localhost:3000/toys';

function fetchToys() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(toys => renderToys(toys))
    .catch(error => console.error('Error fetching toys:', error));
}

function renderToys(toys) {
  toyCollection.innerHTML = '';
  toys.forEach(toy => createToyCard(toy));
}

function createToyCard(toy) {
  const card = document.createElement('div');
  card.className = 'card';

  const h2 = document.createElement('h2');
  h2.textContent = toy.name;

  const img = document.createElement('img');
  img.src = toy.image;
  img.className = 'toy-avatar';

  const p = document.createElement('p');
  p.textContent = `${toy.likes} Likes`;

  const button = document.createElement('button');
  button.className = 'like-btn';
  button.id = toy.id;
  button.textContent = 'Like ❤️';
  button.addEventListener('click', () => handleLikeButtonClick(toy, p));

  card.append(h2, img, p, button);
  toyCollection.appendChild(card);
}

function handleNewToySubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const toyData = {
    name: formData.get('name'),
    image: formData.get('image'),
    likes: 0
  };

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(toyData)
  })
  .then(response => response.json())
  .then(newToy => {
    createToyCard(newToy);
    event.target.reset();
    toyFormContainer.style.display = "none";
    addToy = false;
  })
  .catch(error => console.error('Error adding toy:', error));
}

function handleLikeButtonClick(toy, likesElement) {
  const newLikes = toy.likes + 1;

  fetch(`${apiUrl}/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ likes: newLikes })
  })
  .then(response => response.json())
  .then(updatedToy => {
    toy.likes = updatedToy.likes;
    likesElement.textContent = `${updatedToy.likes} Likes`;
  })
  .catch(error => console.error('Error updating likes:', error));
}
