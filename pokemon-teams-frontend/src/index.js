const BASE_URL = "http://localhost:3000";
const TRAINERS_URL = `${BASE_URL}/trainers`;
const POKEMONS_URL = `${BASE_URL}/pokemons`;

// When a user loads the page, they should see all trainers, with their current team of Pokemon.
document.addEventListener("DOMContentLoaded", fetchAndDisplayTrainers);

function fetchAndDisplayTrainers() {
  fetch(TRAINERS_URL)
    .then(res => res.json())
    .then(trainers => {
      addTrainersToPage(trainers);
    })
    .then(addEventsToButons);
}

// Add each Trainer to the page
function addTrainersToPage(trainers) {
  trainers.forEach(trainer => addSingleTrainerToPage(trainer));
}

function addSingleTrainerToPage(trainer) {
  // Grab Main Element from index.html
  mainEl = document.querySelector("main");

  // add each trainer to page via .innerHTML
  mainEl.innerHTML += `
	<div class="card" data-id="${trainer.id}">
		<p>${trainer.name}</p>
  	<button data-trainer-id="${trainer.id}">Add Pokemon</button>
  	<ul>
    	${getAndDisplayTrainersPokemon(trainer)}
  	</ul>
</div>`;
}

function getAndDisplayTrainersPokemon(trainer) {
  return trainer.pokemons
    .map(function(pokemon) {
      return `<li>${
        pokemon.nickname
      } (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`;
    })
    .join(" ");
}

function addEventsToButons() {
  mainEl = document.querySelector("main");
  mainEl.addEventListener("click", handleClickOfButtons);
}

function handleClickOfButtons(e) {
  if (e.target.innerText === "Add Pokemon") {
    addPokemonToTrainer(e.target.dataset.trainerId, e);
  } else if (e.target.innerText === "Release") {
    deletePokemonFromTrainerCard(e);
    deletePokemonFromTrainer(e);
  }
}

function addPokemonToTrainer(trainerId, e) {
  fetch(POKEMONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ trainer_id: trainerId })
  })
    .then(res => res.json())
    .then(pokemon => addPokemonToTrainerCard(pokemon, trainerId, e));
}

function addPokemonToTrainerCard(pokemon, trainerId, e) {
  if (!pokemon.error) {
    e.target.parentElement.children[2].innerHTML += `
  <li>
  ${pokemon.nickname}(${pokemon.species})
  <button class="release" data-pokemon-id="${pokemon.id}">Release</button>
  </li>`;
  } else {
    alert("Party is already Full!");
  }
}

function deletePokemonFromTrainer(e) {
  return fetch(`${POKEMONS_URL}/${e.target.dataset.pokemonId}`, {
    method: "DELETE"
  }).then(res => res.json());
}

function deletePokemonFromTrainerCard(e) {
  e.target.parentElement.remove();
}
