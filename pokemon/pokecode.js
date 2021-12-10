import { removeChildren } from "../utils/index.js";

function getAPIData(url) {
  try {
    return fetch(url).then((data) => data.json());
  } catch (error) {
    console.error(error);
  }
}

function loadPokemon(offset = 0, limit = 25) {
  getAPIData(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  ).then(async (data) => {
    for (const pokemon of data.results) {
      await getAPIData(pokemon.url).then((pokeData) =>
        populatePokeCard(pokeData)
      );
    }
  });
}

const pokeGrid = document.querySelector(".pokeGrid");
const loadButton = document.querySelector(".loadPokemon");
loadButton.addEventListener("click", () => {
  removeChildren(pokeGrid);
  loadPokemon(0);
  setTimeout(() => loadPokemon(25, 50), 3000);
});

const allPokemon = await getAllSimplePokemon();

async function getAllSimplePokemon() {
  const allPokemon = [];
  await getAPIData(
    `https://pokeapi.co/api/v2/pokemon?limit=1118&offset=0`
  ).then(async (data) => {
    for (const pokemon of data.results) {
      await getAPIData(pokemon.url).then((pokeData) => {
        const mappedPokemon = {
          abilities: pokeData.abilities,
          height: pokeData.height,
          id: pokeData.id,
          name: pokeData.name,
          types: pokeData.types,
          weight: pokeData.weight,
        };
        allPokemon.push(mappedPokemon);
      });
    }
  });
  return allPokemon;
}

function getAllPokemonByType(type) {
  return allPokemon.filter((pokemon) => pokemon.types[0].type.name == type);
}

const sortButton = document.querySelector(".sortButton");
sortButton.addEventListener("click", () => {
  const allByType = getAllPokemonByType("water");
  removeChildren(pokeGrid);
  allByType.forEach((item) => populatePokeCard(item));
});

const typeSelector = document.querySelector("#typeSelector");
typeSelector.addEventListener("change", (event) => {
  const usersTypeChoice = event.target.value.toLowerCase();
  const allByType = getAllPokemonByType(usersTypeChoice);
  removeChildren(pokeGrid);
  allByType.forEach((item) => populatePokeCard(item));
});

const moreButton = document.querySelector(".morePokemon");
moreButton.addEventListener("click", () => {
  let limit = prompt("How many more Pokemon should I load?");
  let offset = prompt("At which Pokemon ID should I start loading?");
  loadPokemon(offset, limit);
});

const newButton = document.querySelector(".newPokemon");
newButton.addEventListener("click", () => {
  let pokeName = prompt("What is the name of your new Pokemon?");
  let pokeHeight = prompt("What is the Pokemon's height?");
  let pokeWeight = prompt("What is the Pokemon's weight?");
  let pokeAbilities = prompt(
    "What are your Pokemon abilities? (use a comma separated list)"
  );
  let pokeTypes = prompt(
    "What are your Pokemon's types? (up to 2 types separated by a space)"
  );
  let newPokemon = new Pokemon(
    pokeName,
    pokeHeight,
    pokeWeight,
    getAbilitiesArray(pokeAbilities),
    getTypesArray(pokeTypes)
  );
  populatePokeCard(newPokemon);
});

function getAbilitiesArray(commaString) {
  let tempArray = commaString.split(",");
  return tempArray.map((abilityName) => {
    return {
      ability: {
        name: abilityName,
      },
    };
  });
}

function getTypesArray(spacedString) {
  let tempArray = spacedString.split(" ");
  return tempArray.map((typeName) => {
    return {
      type: {
        name: typeName,
      },
    };
  });
}

class Pokemon {
  constructor(name, height, weight, abilities, types) {
    (this.id = 9001),
      (this.name = name),
      (this.height = height),
      (this.weight = weight),
      (this.abilities = abilities),
      (this.types = types);
  }
}

function populatePokeCard(singlePokemon) {
  const pokeScene = document.createElement("div");
  pokeScene.className = "scene";
  const pokeCard = document.createElement("div");
  pokeCard.className = "card";
  pokeCard.addEventListener("click", () =>
    pokeCard.classList.toggle("is-flipped")
  );

  const front = populateCardFront(singlePokemon);
  const back = populateCardBack(singlePokemon);

  pokeCard.appendChild(front);
  pokeCard.appendChild(back);
  pokeScene.appendChild(pokeCard);
  pokeGrid.appendChild(pokeScene);
}

function populateCardFront(pokemon) {
  const pokeFront = document.createElement("figure");
  pokeFront.className = "cardFace front";

  const pokeImg = document.createElement("img");
  if (pokemon.id === 9001) {
    pokeImg.src = "../images/pokeball.png";
  } else {
    pokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`;
  }

  const pokeCaption = document.createElement("figcaption");
  pokeCaption.textContent = pokemon.name;

  const pokeId = document.createElement("id");
  pokeId.textContent = pokemon.id;
  pokeId.className = "id";

  pokeFront.appendChild(pokeId);
  pokeFront.appendChild(pokeImg);
  pokeFront.appendChild(pokeCaption);

  typesBackground(pokemon, pokeFront);
  return pokeFront;
}

function typesBackground(pokemon, card) {
  let pokeType1 = pokemon.types[0].type.name;
  let pokeType2 = pokemon.types[1]?.type.name;
  console.log(pokeType1, pokeType2);
  if (!pokeType2) {
    card.style.setProperty("background", getPokeTypeColor(pokeType1));
  } else {
    card.style.setProperty(
      "background",
      `linear-gradient(${getPokeTypeColor(pokeType1)}, ${getPokeTypeColor(
        pokeType2
      )})`
    );
  }
}

function getPokeTypeColor(pokeType) {
  let color;
  switch (pokeType) {
    case "bug":
      color = "#629756";
      break;
    case "dark":
      color = "#595976";
      break;
    case "dragon":
      color = "#89C9D7";
      break;
    case "electric":
      color = "#F7F07A";
      break;
    case "fairy":
      color = "#C81A66";
      break;
    case "fighting":
      color = "#D2623E";
      break;
    case "fire":
      color = "#D64D59";
      break;
    case "flying":
      color = "#9CB1C5";
      break;
    case "ghost":
      color = "#85678E";
      break;
    case "grass":
      color = "#79c95a";
      break;
    case "ground":
      color = "#654B27";
      break;
    case "ice":
      color = "#DEF0F9";
      break;
    case "normal":
      color = "#BC96A4";
      break;
    case "poison":
      color = "#8E69D6";
      break;
    case "psychic":
      color = "#D5238E";
      break;
    case "rock":
      color = "#7A4028";
      break;
    case "steel":
      color = "#76BB95";
      break;
    case "water":
      color = "#8FA6F8";
      break;
    default:
      color = "#888888";
  }
  return color;
}

function populateCardBack(pokemon) {
  const pokeBack = document.createElement("div");
  pokeBack.className = "cardFace back";

  const namelabel = document.createElement("h3");
  namelabel.textContent = pokemon.name;
  pokeBack.appendChild(namelabel);

  const abilitieslabel = document.createElement("h4");
  abilitieslabel.textContent = "Abilities:";
  pokeBack.appendChild(abilitieslabel);
  const abilityList = document.createElement("ul");
  pokemon.abilities.forEach((abilityItem) => {
    let listItem = document.createElement("li");
    listItem.textContent = abilityItem.ability.name;
    abilityList.appendChild(listItem);
  });
  const typelabel = document.createElement("h4");
  typelabel.textContent = "Type:";
  pokeBack.appendChild(typelabel);
  const typesList = document.createElement("ol");
  pokemon.types.forEach((pokeType) => {
    let typeItem = document.createElement("li");
    typeItem.textContent = pokeType.type.name;
    typesList.appendChild(typeItem);
  });

  abilitieslabel.appendChild(abilityList);
  typelabel.appendChild(typesList);

  if (pokemon.stats) {
    const pokeHP = document.createElement("h2");
    pokeHP.textContent = `HP: ${pokemon.stats[0].base_stat}`;

    const pokeHeight = document.createElement("h5");
    pokeHeight.textContent = `Height: ${pokemon.height}`;

    const pokeWeight = document.createElement("h5");
    pokeWeight.textContent = `Weight: ${pokemon.weight}`;

    pokeBack.appendChild(pokeHeight);
    pokeBack.appendChild(pokeWeight);
    pokeBack.appendChild(pokeHP);
  }
  return pokeBack;
}
