const container = document.querySelector('.container')
const title = document.querySelector('.title')
const buttonsDiv = document.querySelector('.buttonsdiv')
const previousBtn = document.querySelector('.previous')
const nextBtn = document.querySelector('.next')
const guess = document.querySelector('.guess')
let difficult = false
const text = " Who's that Pokemon?"
let idx = 1
const kind = {
    fire: '🔥', 
    water: '🌊',
    electric: '⚡', 
    fairy: '😇', 
    normal: '😃', 
    bug: '🐛', 
    poison: '💀',
    ghost: '👻',
    flying: '🦅',
    steel: '🔧',
    dragon: '🐉',
    ice: '❄️',
    dark: '🌙',
    psychic: '👀',
    fighting: '👊🏽',
    ground: '🌋',
    rock: '🪨',
    grass: '🌿'
}

writeText()

function writeText() {
    title.textContent = text.slice(0, idx)
    idx++
    const id = setTimeout(writeText, 200)

    if(idx > text.length + 1) {
        fetchPokemon()
        setTimeout(showButtons, 700)
        clearTimeout(id)
        title.style.display = "none"
    }
}

function fetchPokemon() {
    const promises = [];
    for (let i = 1; i <= 150; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }
    Promise.all(promises).then((results) => {
        const pokemon = results.map((result) => ({
            name: result.name,
            image: result.sprites['front_default'],
            type: result.types.map((type) => type.type.name).join(', '),
            id: result.id
        }));
        displayPokemon(pokemon);
    });
};

function showButtons() {
    buttonsDiv.style.visibility = 'visible';
}

function displayPokemon(pokemon) {

    container.innerHTML = ""

    let page = 0;

    pokemon.forEach(poke => {
        let typeArray = poke.type.split(', ');
        typeArray = typeArray.map(type => type = kind[type]);
        poke.type = typeArray.join('')
    })

    for (let i = 0; i < page + 10; i++) {
        if(!difficult) {
            const html = pokemon.map(makeEasyHTML)
            container.innerHTML += html[i]
        } else {
            const html = pokemon.map(makeDifficultHTML)
            container.innerHTML += html[i]
        }
        
    }

    nextBtn.addEventListener('click', () => {
        page === pokemon.length - 10 ? page = 0 : (page += 10)
        container.innerHTML = ""
        for (let i = page; i < page + 10; i++) {
            if(!difficult) {
                const html = pokemon.map(makeEasyHTML)
                container.innerHTML += html[i]
            } else {
                const html = pokemon.map(makeDifficultHTML)
                container.innerHTML += html[i]
            }
        }
    })

    previousBtn.addEventListener('click', () => {
        page === 0 ? (page = pokemon.length - 10) : (page -= 10)
        container.innerHTML = ""
        for (let i = page; i < page + 10; i++) {
            if(!difficult) {
                const html = pokemon.map(makeEasyHTML)
                container.innerHTML += html[i]
            } else {
                const html = pokemon.map(makeDifficultHTML)
                container.innerHTML += html[i]
            }
        }
    })

}

function makeEasyHTML(poke) {
    return `    
    <div class="card">
        <img src="${poke.image}"/>
        <li>${poke.name}</li>
        <li>${poke.type}</li>
        <li>${poke.id}</li>
    </div>`
}

function makeDifficultHTML(poke) {
    return `    
    <div class="card hidden">
        <img src="${poke.image}"/>
        <li>${poke.name}</li>
        <li>${poke.type}</li>
        <li>${poke.id}</li>
    </div>`
}

guess.addEventListener('click', (e) => {
    if(e.target.classList.contains('clicked')) {
        e.target.classList.remove('clicked')
        difficult = false
        document.body.style.backgroundColor = `#ffcb05`
        guess.textContent = `Guess mode: OFF`
        fetchPokemon()
    } else {
        difficult = true
        guess.classList.add('clicked')
        document.body.style.backgroundColor = `#2a75bb`
        guess.textContent = `Guess mode: ON `
        fetchPokemon()
    }

})

document.body.addEventListener("click", e => {
    if (e.target.classList.contains("card")) { 
        e.target.classList.remove('hidden')
    }
})