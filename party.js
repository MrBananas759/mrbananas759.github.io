import Pokemon from "./pokemon.js"

export default class Party {    
    constructor() {
        this.chartPartyList = document.querySelector(".chart-party-list")
            .querySelectorAll(".party-pokemon");

        this.party = [];
        console.log(this.party)
    }

    async addPokemon (name) {
        if (this.party.length >= 6) {
            console.error("Party length cannot be more than 6");
            return;
        }
        
        name = name.toLowerCase();

        let pokemon = new Pokemon(name);
        await pokemon.initialize();
        this.party.push(pokemon);
    }

    removePokemon (index) {
        console.log('rmv', this.party.length);
        this.party.splice(index - 1, 1);
    }

    displayParty () {
        this.chartPartyList.forEach((slot) => {
            slot.querySelector("label").innerHTML = "";
            slot.querySelector("img").src = "./images/blank.png";
            slot.style.setProperty(`--type-one`, `#c20303`);
            slot.style.setProperty(`--type-two`, `#b5b5b5`);
        })
        
        this.party.forEach((slot, index) => {
            this.chartPartyList[index].querySelector("label").innerHTML = slot.name;
            this.chartPartyList[index].querySelector("img").src = slot.sprite;
            this.chartPartyList[index].style.setProperty(`--type-one`, `var(--${slot.type1})`);
            this.chartPartyList[index].style.setProperty(`--type-two`, `var(--${slot.type2})`);
        })
    }

    clear() {
        this.party = [];
    }

    logParty() {
        this.party.forEach((pokemon, index) => {
            console.log(`Party memeber: ${index}`)
            pokemon.logPokemon();
        })
    }

    getTypes() {
        let typeList = [];
        
        this.party.forEach((mon) => {
            typeList.push(mon.type1);
            typeList.push(mon.type2);
        })
        
        return typeList;
    }
}