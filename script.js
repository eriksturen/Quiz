

// för att välja med querySelector och id skriv så (den drar via css:en):
const highscoreList = document.querySelector("#highscore-list");

const highscore = [];

// I JS kan vi skapa JSON direkt - men notera att sista attributet ej får sluta på komma
const highscoreJson = `
[
    {
        "name":"Benke",
        "score": 12
    },
    {
        "name": "Rufus",
        "score": 5   
    },
    {
        "name": "Grisen",
        "score": 9
    }
]
`;

populateHighscore();


// funktionen populerar highscorelistan (finns hårdkodad lista med poäng i den just nu)
function populateHighscore() {
    const scoreEntries = JSON.parse(highscoreJson);
    // sortfunctionen i javascript verkar helt kajko, men den vill ha både den som ska sorteras (c -> current) och den innan (p -> previous). Sen ska man ha differensen mellan de två (gör minus) OM det blir positivt så ska det current upp. Vi kör reverse på det för att lägga störst först
    scoreEntries.sort((c, p) => c.score - p.score).reverse();


    for (const entry of scoreEntries) {
        const li = document.createElement('li');
        // såhär kan man lägga till klasser på ett element man skapat:
        li.classList.add("list-group-item", "bg-dark", "text-warning");
        li.innerText = `${entry.name} ${entry.score}`;
        //appendChild istället skulle bara kunna lägga till en grej åt gången, append kan lägga till flera (append är nyare)
        highscoreList.append(li);
    }
}

