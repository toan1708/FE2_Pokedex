const baseUrl = "https://pokeapi.co/api/v2/";

function fetchPokemons() {
  fetch(baseUrl + "pokemon?limit=2000")
    .then((response) => response.json())
    .then((data) => {
      const pokemons = data.results;
      pokemons.forEach((pokemon) => {
        fetchPokemonDetails(pokemon.url);
      });
    });
}

function fetchPokemonDetails(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayPokemon(data);
    });
}

function displayPokemon(pokemon) {
  const pokedex = document.getElementById("pokedex");
  const pokemonCard = document.createElement("div");
  pokemonCard.classList.add("pokemon-card");
  pokemonCard.innerHTML = `
    <img class="pokemon-img" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
    <h2>${pokemon.name}</h2>
    <div class="type">
      ${pokemon.types.map((type) => `<span class="type-${type.type.name}">${type.type.name}</span>`).join("")}
    </div>
    <div class="pokemon-details">
      <div class="pokemon-details-info">
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
        <p>Ability: ${pokemon.abilities
          .map((ability) => ability.ability.name)
          .join(", ")}</p>
      </div>
    </div>`;
  pokedex.appendChild(pokemonCard);
}

function fetchTypes() {
  fetch(baseUrl + "type")
    .then((response) => response.json())
    .then((data) => {
      const types = data.results;
      const typeButtons = document.getElementById("typeButtons");
      
      // Add All Types button
      const allTypesButton = document.createElement("button");
      allTypesButton.classList.add("type-all");
      allTypesButton.textContent = "All Types";
      allTypesButton.addEventListener("click", () => showAllPokemons());
      typeButtons.appendChild(allTypesButton);

      types.forEach((type) => {
        const button = document.createElement("button");
        button.classList.add("type-button");
        button.textContent = type.name;
        button.classList.add(`type-${type.name}`);
        button.addEventListener("click", () => filterPokemonsByType(type.name));
        typeButtons.appendChild(button);
      });
    });
}

function showAllPokemons() {
  const pokedex = document.getElementById("pokedex");
  pokedex.innerHTML = ""; // Clear existing content
  fetch(baseUrl + "pokemon?limit=2000")
    .then((response) => response.json())
    .then((data) => {
      const pokemons = data.results;
      pokemons.forEach((pokemon) => {
        fetchPokemonDetails(pokemon.url);
      });
    });
}

function filterPokemonsByType(type) {
  const pokedex = document.getElementById("pokedex");
  pokedex.innerHTML = "";
  fetch(baseUrl + "type/" + type)
    .then((response) => response.json())
    .then((data) => {
      const pokemons = data.pokemon;
      pokedex.innerHTML = ""; // Thêm dòng này để xóa hết dữ liệu cũ
      pokemons.forEach((pokemon) => {
        fetchPokemonDetails(pokemon.pokemon.url);
      });
    });
}

document.getElementById("searchButton").addEventListener("click", () => {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  if (searchTerm.trim() !== "") {
    const pokedex = document.getElementById("pokedex");
    pokedex.innerHTML = "";
    fetch(baseUrl + "pokemon/" + searchTerm)
      .then((response) => response.json())
      .then((data) => {
        displayPokemon(data);
      })
      .catch((error) => {
        alert("Pokémon not found!");
      });
  }
});

function toggleMode() {
  var icon = document.getElementById("modeToggle");
  var currentMode = icon.alt;

  if (currentMode === "Light Mode") {
    icon.src = "img/dark_mode_icon.png";
    icon.alt = "Dark Mode";
    document.body.classList.add("dark-mode");
  } else {
    icon.src = "img/light_mode_icon.png";
    icon.alt = "Light Mode";
    document.body.classList.remove("dark-mode");
  }
}

fetchPokemons();
fetchTypes();