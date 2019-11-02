const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`


document.addEventListener('DOMContentLoaded', () => {
    fetchTrainers(); // loads Trainers & their Pokemon

    addPokemonListener();
    deletePokemonListener();

})

function deletePokemonListener() {
    mainContainer().addEventListener('click', event => {
        if (event.target.textContent === "Release") {
            
            fetch(POKEMONS_URL + `/${parseInt(event.target.dataset.pokemonId)}`, {
                method: "DELETE"
            })
            .then(resp => resp.json())
            .then(result => {
                event.target.parentElement.remove()
            })
        }   

    })

}

function addPokemonListener() {
    mainContainer().addEventListener("click", event => {
        const trainerCard = event.target.parentElement
        const pokemonList = trainerCard.querySelector("ul")
        const pokeCount = pokemonList.childElementCount
        const trainerId = parseInt(trainerCard.dataset.id)
        
        if (event.target.textContent === "Add Pokemon" && pokeCount < 6) {
            getNewPokemonInfo(pokemonList, trainerId);
        } else if (pokeCount >= 6) {
            alert("TOO MANY POKEMON!  DEATH IMMINENT!!!")
        }
    })

}

function getNewPokemonInfo(pokemonList, trainerId) {

    fetch(POKEMONS_URL, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "trainer_id": trainerId
        })
    })
        .then(resp => resp.json())
        .then(newpoke => {
           pokemonList.innerHTML += drawTrainersPokemon(newpoke)
        })
}


function mainContainer() {
    return document.querySelector("main")
}

function fetchTrainers() {
    fetch('http://localhost:3000/trainers')
        .then(resp => resp.json())
        .then(data => {
            
            mainContainer().innerHTML = data.map(trainer => {
                return drawTrainer(trainer)
            }).join("");
                
            data.map(trainer => {
                const containerLocation = document.querySelector(`[data-id="${trainer.id}"]`)
                const pokemonContainer = containerLocation.querySelector("ul")
                pokemonContainer.innerHTML = trainer.pokemons.map(pokemon => {
                    return drawTrainersPokemon(pokemon);

                }).join("");
            })
        })
    ; // end of fetch
}

function drawTrainer(trainerData){
    
    return `<div class="card" data-id="${trainerData.id}"><p>${trainerData.name}</p>
    <button data-trainer-id="${trainerData.id}">Add Pokemon</button>
        <ul>
        </ul>
</div>`
}

function drawTrainersPokemon(pokemon){
    return `<li>${pokemon.nickname} (${pokemon.species}) <button class="release" data-pokemon-id="${pokemon.id}">Release</button></li>`
}