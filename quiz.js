// Quiz-funktionaliteten är flyttad till en egen fil 


//skapa en klass -- NOTERA att klasser HOISTAS INTE OCH BEHÖVER LIGGA LÄNGST UPP
class Question {
    // vi bygger en constructor:
    constructor(statement, correctAnswer) {
        this.statement = statement;
        this.correctAnswer = correctAnswer;
    }
}

class PlayerScore {
    constructor(name, score) {
        this.name = name;
        this.score = score;
        this.time = Date.now();
    }
}

const qList = document.querySelector("#questions");

const scoreDisplay = document.querySelector("#score");
let score = 0;
let questionsAnswered = 0;

// skapa ett frågeobjekt  i en lista med hjälp av en klass som har en constructor längre ner:

const questions = [];

async function startButtonClick() {
    questionsAnswered = 0;
    // drar frågor från OpenTrivias api:
    const url = new URL(
        `https://opentdb.com/api.php?amount=10&category=20&type=boolean`
    );
    const response = await fetch(url);
    if (response.status === 200) {
        const jsonResponse = await response.json();
        questions.splice(0, questions.length); // kan rensa den här arrayen genom att sätta längden till 0 också

        for (const result of jsonResponse.results) {
            questions.push(
                new Question(result.question, result.correct_answer)
            );
        }; // API-delen slut!

        score = 0;
        scoreDisplay.innerText = score;
        while (qList.childElementCount > 0) {
            qList.children[0].remove();
        };
        displayQuestions();
    }
}

function displayQuestions() {
    // lättare att lägga till och förändra saker i efterhand på detta sätt än att köra med innerHTML, antar att det blir lättare att mainataina
    for (const question of questions) {
        // skapa elementen
        const card = document.createElement("li");
        const cardHeader = document.createElement("div");
        //exvis kan man ju lätt gå in här och lägga till en const header2= document.createElement("div"); -- Typ 
        const cardBody = document.createElement("div");
        const cardText = document.createElement("h4");
        const cardFooter = document.createElement("div")
        const trueButton = document.createElement("button");
        const falseButton = document.createElement("button");

        // styla element
        card.classList.add("card", "border-0", "m-4");
        cardHeader.classList.add("card-header", "bg-warning", "py-3", "fw-bold");
        cardText.classList.add("card-title");
        cardBody.classList.add("card-body", "bg-dark", "text-warning");
        cardFooter.classList.add("footer", "bg-warning");
        trueButton.classList.add("btn", "btn-success", "border-2", "border-dark", "border", "m-2");
        falseButton.classList.add("btn", "btn-danger", "border-2", "border-dark", "border", "m-2");

        //innehåll i element
        cardHeader.innerText = `Fråga ${questions.indexOf(question) + 1}`;
        cardText.innerText = question.statement;
        trueButton.innerText = "True";
        falseButton.innerText = "False";

        //sätta upp events
        trueButton.onclick = () => {
            // kolla om true är rätt svar
            if (question.correctAnswer === "True") {
                score++;
                // uppdatera score
                scoreDisplay.innerText = score;
                // ge grafisk feedback - typ frågerutan blir grön om de svarade rätt
                cardBody.classList.remove("bg-dark", "text-warning");
                cardBody.classList.add("bg-success", "text-light");
            } else {
                cardBody.classList.remove("bg-dark", "text-warning");
                cardBody.classList.add("bg-danger", "text-light");
            }

            // disabla svarsknapparna på frågorna man redan svarat på
            trueButton.disabled = true;
            falseButton.disabled = true;
        };

        // flyttar gissningsknappens funktionalitet till en egen funktion
        // binder också clickeventet på de här knapparna till den funktionen --> Detta innebär att man inte behöver in i htmlen och bråka, utan funktionen binds direkt här i js-filen
        falseButton.onclick = () => {
            guessButtonClick(question, cardBody, falseButton, trueButton, "False");
        };

        trueButton.onclick = () => {
            guessButtonClick(question, cardBody, falseButton, trueButton, "True");
        };

        // lägg till elementen
        cardFooter.append(trueButton, falseButton);
        cardBody.append(cardText);
        card.append(cardHeader, cardBody, cardFooter);
        qList.append(card);
    }

}

function guessButtonClick(question, cardBody, falseButton, trueButton, guess) {
    // kolla om true är rätt svar
    if (question.correctAnswer === guess) {
        score++;
        scoreDisplay.innerText = score;
        cardBody.classList.remove("bg-dark", "text-warning");
        cardBody.classList.add("bg-success", "text-light");
    } else {
        cardBody.classList.remove("bg-dark", "text-warning");
        cardBody.classList.add("bg-danger", "text-light");
    };
    trueButton.disabled = true;
    falseButton.disabled = true;
    questionsAnswered++;
    checkAllQuestionsAnswered();
}

function checkAllQuestionsAnswered() {
    if (questionsAnswered == questions.length) {
        const name = window.prompt("Enter name for highscore:");
        const player = new PlayerScore(name, score);

        const highscoreJson = localStorage.getItem("highscore");
        if (highscoreJson) {
            const highscore = JSON.parse(highscoreJson);
            highscore.push(player);
            localStorage.setItem("highscore", JSON.stringify(highscore));

        } else {
            const highscore = [];
            highscore.push(player);
            localStorage.setItem("highscore", JSON.stringify(highscore));
        }
    }
}
