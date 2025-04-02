export default class Pokemon {
    constructor (name) {
        this.url = `https://pokeapi.co/api/v2/pokemon/${name}`;
        this.name = name;
        this.initialized = false;
    }

    async initialize () {        
        try {
            const res = await fetch(this.url);
            let pokeData = await res.json();

            // console.log(pokeData);

            this.name   = pokeData.name;
            this.sprite = pokeData.sprites.front_default;

            if (pokeData.types.length > 1) {
                this.type1  = pokeData.types[0].type.name;
                this.type2  = pokeData.types[1].type.name;
            }
            else {
                this.type1  = pokeData.types[0].type.name;
                this.type2  = pokeData.types[0].type.name;
            }
        }
        catch (error) {
            console.error("There is an error, dun ask me what broked.");
            console.error(error);
        }

        this.initialized = true;
    }

    logPokemon () {
        if (!this.initialized) {
            console.error (`Pokemonm ${this.name} is uninitialized`);
            return
        }

        console.log(`Name   : ${this.name}`);
        console.log(`Type 01: ${this.type1}`);
        console.log(`Type 02: ${this.type2}`);
    } 
}