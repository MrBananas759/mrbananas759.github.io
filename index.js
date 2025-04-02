import Party from "./party.js";

// ===============GOBALS=============== // 
// Is this good practice? Probably not.
const pokeTable     = document.querySelector(".poke-table");
const body          = document.querySelector("body");
const pokeList      = document.querySelector(".poke-list");

const gameToGeneration = {
     "Pokemon Red - Blue - Yellow"               : "generation-i",
     "Pokemon Gold - Silver - Crystal"           : "generation-v",
     "Pokemon Ruby - Sapphire - Emerald"         : "generation-v",
     "Pokemon Fire Red - Leaf Green"             : "generation-v",
     "Pokemon Diamond - Pearl - Platinum"        : "generation-v",
     "Pokemon Heart Gold - Soul Silver"          : "generation-v",
     "Pokemon Black - White"                     : "generation-v",
     "Pokemon Black 2 - White 2"                 : "generation-v",
     "Pokemon X - Y"                             : "generation-vi",
     "Pokemon Omega Ruby - Alpha Sapphire"       : "generation-vi",
     "Pokemon Sun - Moon"                        : "generation-vi",
     "Pokemon Ultra Sun - Ultra Moon"            : "generation-vi",
     "Pokemon Let's Go Pikachu - Let's Go Eevee" : "generation-vi",
     "Pokemon Sword - Sheild"                    : "generation-vi",
     "Pokemon Legends Arceus"                    : "generation-vi",
     "Pokemon Brilliant Diamond - Shining Pearl" : "generation-vi",
     "Pokemon Scarlet - Violet"                  : "generation-vi",
     "National Dex"                              : "generation-vi"
};

let pokeTypeChart = {};
let selected = {
    vBool : false,
    hBool : false,
    vSelected : [],
    hSelected : []
}

let pokeParty = new Party();

// =============END=GOBALS============= // 

window.onload = async function() {
    let gen = gameToGeneration[pokeList.value];
    

    pokeList.addEventListener("change", async (e) => {
        gen = gameToGeneration[pokeList.value];

        await loadTypeChart(gen);
        generateTable();
        
        pokeParty.clear();
        pokeParty.displayParty();
    })

    await loadTypeChart(gen);
    generateTable();

    await pokeParty.addPokemon("12");
    await pokeParty.addPokemon("clefable");
    pokeParty.displayParty();

    updateSelected(pokeParty);

    console.log("Script Loaded.");
}

async function loadTypeChart(gen) {
    try {
        const res = await fetch(`/type-chart-${gen}.json`)
        pokeTypeChart = await res.json();
    }
    catch (error) {
        console.error("There is an error, dun ask me what broked.");
        console.error(error);
    }
}

function generateTable() {
    pokeTable.innerHTML = "";
    
    pokeTypeChart.forEach((row, r_index) => {
        let tableRow = document.createElement("tr");

        row.forEach((cell, c_index) => {
            // console.log(typeof cell);

            let cell_td = document.createElement("td");
            cell_td.addEventListener("mouseenter", mouseHover);
            cell_td.addEventListener("mouseleave", mouseHover);

            if (typeof cell === 'string') {
                cell_td.addEventListener("click", mouseUpdateSelected);

                if (cell !== 'type') {
                    let cell_div = document.createElement("div");
                    cell_div.classList.add("poke-cell");
                    cell_div.classList.add(cell);
                    cell_td.appendChild(cell_div);
                }
                else {
                    cell_td.classList.add(cell);
                }

                if (cell === 'type') {
                    cell_td.addEventListener("click", mouseClearSelected);
                }

                if (r_index === 0 && c_index > 0) {
                    cell_td.classList.add("top");
                }
                else if (r_index > 0 && c_index === 0) {
                    cell_td.classList.add("side");
                }

            }
            else if (typeof cell === 'number') {
                cell_td.classList.add("poke-cell");
                switch (cell) {
                    case 0:
                        cell_td.classList.add("no_damage_to");
                        break;
                    case 0.5:
                        cell_td.classList.add("half_damage_to");
                        break;
                    case 2:
                        cell_td.classList.add("double_damage_to");
                        break;
                }
            }
            
            tableRow.appendChild(cell_td);
        });

        pokeTable.appendChild(tableRow);
    });
}

function updateSelected(party) {
    let pokeTableSide = pokeTable.querySelectorAll(".side");
    let pokeTableSideDiv = pokeTable.querySelectorAll(".side div");
    let typeList = party.getTypes();

    console.log(typeList);
    console.log(pokeTableSideDiv);

    pokeTableSide.forEach((cell) => {
        cell.classList.remove("selected");
    });

    typeList.forEach((pokeType) => {
        pokeTableSideDiv.forEach((div, index) => {
            if (div.classList.contains(pokeType)) {
                pokeTableSide[index].classList.add("selected");
            }
        });
    });

    updateSelectedTop();
}

function mouseUpdateSelected(e) {
    if (e.target.localName === 'div') {
        e.target.parentElement.classList.toggle("selected")
    }
    else {
        e.target.classList.toggle("selected");
    }

    updateSelectedTop();
}

function updateSelectedTop() {
    let pokeTableSide = pokeTable.querySelectorAll(".side");
    let pokeTableTop  = pokeTable.querySelectorAll(".top");
    
    pokeTableTop.forEach((ptt) => {
        ptt.classList.remove("selected");
    });

    pokeTableSide.forEach((td) => {
        if (td.classList.contains("selected")) {
            let row_children = td.parentElement.childNodes;
            row_children.forEach((child, index) => {
                if (child.classList.contains("double_damage_to")) {
                    pokeTableTop[index - 1].classList.add("selected");
                }
            });
        }
    });
}

function mouseClearSelected() {
    let pokeTableSide = pokeTable.querySelectorAll(".side");
    let pokeTableTop  = pokeTable.querySelectorAll(".top");
    
    pokeTableSide.forEach((pts) => {
        pts.classList.remove("selected");
    });

    pokeTableTop.forEach((ptt) => {
        ptt.classList.remove("selected");
    });
}

function mouseHover(event) {
    let posX = event.target.cellIndex + 1;
    let posY = event.target.parentElement.rowIndex + 1;

    if (event.target.classList.contains("top")) {
        colHightlight(posX);
    }
    else if (event.target.classList.contains("top")) {
        rowHightlight(posY);
    }
    else {
        colHightlight(posX);
        rowHightlight(posY);
        pokeTable.querySelector(`tr:nth-child(${posY}) td:nth-child(${posX})`)
            .classList.toggle("highlight");
    }
} 

function rowHightlight(posY) {
    let row = pokeTable.querySelectorAll(`tr:nth-child(${posY}) td`);
    
    row.forEach((cell, index) => {
        if (index !== 0) {
            cell.classList.toggle("highlight");
        }
    });
}

function colHightlight(posX) {
    let col = pokeTable.querySelectorAll(`tr td:nth-child(${posX})`);

    col.forEach((cell, index) => {
        if (index !== 0) {
            cell.classList.toggle("highlight");
        }
    });
}

// =============TAB-MANAGEMENT============= //

const tabsContainer = document.querySelector(".tabs-container");
const tabsList = tabsContainer.querySelector("ul");
const tabButtons = tabsList.querySelectorAll("li");
const tabPanels = tabsContainer.querySelectorAll(".tabs_panels > div");

tabButtons.forEach((tab, index) => {
    if (index === 0) {
        // TODO: Something
    }
    else {
        tabPanels[index].classList.add("hidden", true);
    }
});

tabsContainer.addEventListener("click", (e) => {
    const clickedTab = e.target.closest("li");
    // console.log(clickedTab);

    if (!clickedTab) return;
    e.preventDefault();

    const activePanelId = clickedTab.children[0].getAttribute('href');
    const activePanel = tabsContainer.querySelector(activePanelId);
    const activeTab = clickedTab;

    tabPanels.forEach((panel) => {
        panel.classList.add("hidden");
    });
    activePanel.classList.remove("hidden");

    tabButtons.forEach((tab) => {
        tab.classList.remove("active");
    });
    activeTab.classList.add("active");
});