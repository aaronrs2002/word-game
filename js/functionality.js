let playerMoney = 500;
if (localStorage.getItem("balance") && Number(localStorage.getItem("balance"))) {
    playerMoney = Number(localStorage.getItem("balance"));
}
document.querySelector("#playerMoney").innerHTML = playerMoney;
let cheated = false;

////START FUNCTIONALITY

let gameHTML = "";
let randomNum;
let wordDef;
let wordPrep;
let definitionPrep;
let wordSolution = "";
let letterSolved = [];
let failedRequests = [];
let requestFailedHTML = "";

function setPlayerMoney(passPlayerMoney) {
    ckHighScore();
    playerMoney = passPlayerMoney;
    document.getElementById("playerMoney").innerHTML = passPlayerMoney;
    document.querySelector("#playerMoney").innerHTML = passPlayerMoney;/*SAFARI BUG NEEDS BOTH */
    localStorage.setItem("balance", passPlayerMoney);
}

function startGame() {

    if (localStorage.getItem("wordIndex")) {
        randomNum = Number(localStorage.getItem("wordIndex"));
    } else {
        randomNum = Math.floor(Math.random() * words.length);
        localStorage.setItem("wordIndex", randomNum);
    }

    try {
        wordDef = JSON.stringify(words[randomNum]).split(":");
    } catch (error) {
        console.log("no split at colon: " + error + " - wordDef: " + wordDef);
    }
    try {
        wordPrep = wordDef[0].substring(2, wordDef[0].length - 1).trim().replaceAll(" ", "-").replaceAll("'", "");
        definitionPrep = wordDef[1].substring(1, wordDef[1].length - 2).replaceAll("'", "");
        const wordLower = wordPrep.toLowerCase();
        /*HIDING WORD FROM HINT*/
        function capitalizeFirstLetter(str) {
            return str[0].toUpperCase() + str.slice(1);
        }
        while (definitionPrep.indexOf(wordLower) !== -1) {
            definitionPrep = definitionPrep.replace(wordLower, "~~~~~~");
        }
        while (definitionPrep.indexOf(capitalizeFirstLetter(wordLower)) !== -1) {
            definitionPrep = definitionPrep.replace(capitalizeFirstLetter(wordLower), "~~~~~~");
        }
        /*END HIDING WORD FROM HINT*/

        for (let i = 0; i < wordPrep.length; i++) {/*remeber to check for spaces*/
            let addThis = " ~ ";
            if (wordPrep[i] === "-") {
                addThis = " - ";
            }
            letterSolved.push(addThis);
            wordSolution = wordSolution + addThis;
        }
    } catch (error) {
        console.log("Data does not look right:  " + error);
    }

    gameHTML = gameHTML + "<li class='list-group-item'><div class='d-grid gap-2'><button class='btn btn-primary' onClick='javascript:showNum()' >Cheat</button></div><span class='hide' ><u><b>" + wordPrep
        + "</b></u></span> " + definitionPrep + "<div id='hiddenWordTarget'><h3>" + wordSolution
        + "</h3></div><div class='input-group mb-3'><input type='text' class='form-control'  name='userGuess' maxlength='1' placeholder='Is there a...'><button class='btn btn-primary'  id='verifyBt' onClick='javascript:verify()'>Request a letter <i class='fas fa-question-circle'></i></button></div>" +
        "<div class='input-group mb-3'><input type='text' class='form-control'  name='solveWord'  placeholder='Solve word'><button class='btn btn-success'  id='solveWordBt' onClick='javascript:solve()'>Solve word <i class='far fa-lightbulb'></i></button></div></div></li><li><div class='d-grid gap-2'><button class='btn btn-success hide' id='nextWord' onClick='nextWord()'>Next Word</button></div></li>";
    document.querySelector("#listTarget").innerHTML = gameHTML;
    document.querySelector("[name='userGuess']").focus();
}


startGame();

function showNum() {

    cheated = true;
    document.querySelector(".list-group-item span").classList.remove("hide");
    document.querySelector(".list-group-item .btn").classList.add("hide");
    document.querySelector("input[name='solveWord']").value = wordPrep;
    document.getElementById("solveWordBt").focus();
    document.querySelector("[name='userGuess']").classList.add("hide");
    document.getElementById("verifyBt").classList.add("hide");
    document.getElementById("requestedList").innerHTML = "<h4>Click \"Solve\" to move on.</h4>";
}

function verify() {
    let statusList = "";
    const userGuess = document.querySelector("[name='userGuess']").value;
    if (userGuess === "") {
        globalAlert("alert-warning", "Type a letter into the field to see if it is in the word.");
        return false;
    }
    for (let i = 0; i < wordPrep.length; i++) {
        if (userGuess.toLowerCase() === wordPrep[i].toLowerCase()) {
            letterSolved[i] = userGuess.toLowerCase();
        }
    }

    for (let i = 0; i < letterSolved.length; i++) {
        statusList = statusList + letterSolved[i];

        if (failedRequests.indexOf(userGuess.toLowerCase()) === -1 && letterSolved.indexOf(userGuess.toLowerCase()) === -1) {
            failedRequests.push(userGuess.toLowerCase());
            requestFailedHTML = requestFailedHTML + "<span class='badge bg-warning text-light mx-1 text-capitalize'>" + userGuess.toLowerCase() + "</span> ";
        }
        window.location = "#listTarget";
    }

    document.getElementById("hiddenWordTarget").innerHTML = statusList;
    document.querySelector("[name='userGuess']").value = "";

    if (requestFailedHTML.length === 0) {
        document.querySelector("#requestedList").innerHTML = "<h4>So far, so good.<h4>";
    } else {
        document.querySelector("#requestedList").innerHTML = "<ul class='list-unstyled'><li><label><span class='mobileBlock'>$" + (100 - (10 * failedRequests.length)) + " possible </span></label></li><li> <label> Failed letter attempts: <span class='failedLetters'>" + requestFailedHTML + "</span></label></li></ul>";
    }


    if (letterSolved.indexOf(" ~ ") === -1) {
        document.querySelector("input[name='solveWord']").value = wordPrep;
        document.querySelector("#hiddenWordTarget").classList.add("text-success");
        document.getElementById("solveWordBt").focus();
        document.querySelector("[name='userGuess']").classList.add("hide");
        document.getElementById("verifyBt").classList.add("hide");
    }
    document.querySelector("[name='userGuess']").focus();

}

function nextWord() {
    document.getElementById("solveWordBt").disabled = false;
    localStorage.removeItem("wordIndex");
    gameHTML = "";
    wordSolution = "";
    letterSolved = [];
    document.querySelector("#listTarget").innerHTML = gameHTML;
    document.querySelector("#winLoseStatus[role='alert']").classList.add("hide");
    document.getElementById("requestedList").classList.remove("hide");
    document.querySelector("#winLoseStatus[role='alert']").classList.remove("alert-success");
    document.querySelector("#winLoseStatus[role='alert']").classList.remove("alert-danger");
    failedRequests = [];
    document.getElementById("requestedList").innerHTML = "<h4>Guessing a wrong letter will deduct from your possible end score.</h4>";
    requestFailedHTML = "";
    cheated = false;
    startGame();

}

function solve() {
    let percentage = 100;
    for (let i = 0; i < failedRequests.length; i++) {
        percentage = percentage - 10;
    }
    if (percentage === 100) {
        percentage = 200;
    }
    document.getElementById("nextWord").classList.remove("hide");
    document.getElementById("solveWordBt").disabled = true;
    document.querySelector("#winLoseStatus[role='alert']").classList.remove("hide");

    if (document.querySelector("input[name='solveWord']").value.toLowerCase().replaceAll(" ", "-") === wordPrep.toLowerCase().replaceAll(" ", "-")) {
        document.getElementById("requestedList").classList.add("hide");
        document.querySelector("#winLoseStatus[role='alert']").classList.add("alert-success");
        if (cheated === false) {
            document.querySelector("#winLoseStatus[role='alert']").innerHTML = "<h3><span class='capitalize'>" + wordPrep + "</span>! YOU DID IT! +$" + percentage + "</h3>";

            setPlayerMoney((playerMoney + percentage));
        } else {
            document.querySelector("#winLoseStatus[role='alert']").classList.add("alert-danger");
            document.querySelector("#winLoseStatus[role='alert']").innerHTML = "<h3><span class='capitalize'>" + wordPrep + "</span>. YOU CHEATED. YOU LOST $25.</h3>";
            setPlayerMoney((playerMoney - 25));
        }


    } else {
        document.querySelector("#winLoseStatus[role='alert']").classList.add("alert-danger");
        document.querySelector("#winLoseStatus[role='alert']").innerHTML = "<h3><span class='capitalize'>" + wordPrep + "</span>! YOU FAILED! YOU LOST $50</h3>";

        setPlayerMoney((playerMoney - 50));
    }





}

function chooseDictionary(option) {
    localStorage.removeItem("wordIndex");
    if (option == 1) {
        document.getElementById("wordsVar").setAttribute('src', "data/dictionary.js");
        document.querySelector("[data-word='1']").classList.add("active");
        document.querySelector("[data-word='2']").classList.remove("active");
        localStorage.setItem("dictionary", "1");
        globalAlert("alert-success", "Set to \"Harder\" list.");
    }
    if (option == 2) {
        document.getElementById("wordsVar").setAttribute('src', "data/dictionary2.js");
        document.querySelector("[data-word='2']").classList.add("active");
        document.querySelector("[data-word='1']").classList.remove("active");
        localStorage.setItem("dictionary", "2");
        globalAlert("alert-success", "Set to \"Easier\" list.");
    }

    if (option == 3) {
        let balance = 500;
        let setTheme = "united";
        if (localStorage.getItem("theme")) {
            setTheme = localStorage.getItem("theme");
        }
        if (localStorage.getItem("balance")) {
            balance = localStorage.getItem("balance");
        }
        window.location.href = "https://aaronrs2002.github.io/build-your-own-word-trivia/?" + gaParam + "&theme=" + setTheme + "&";
    }
}

if (localStorage.getItem("dictionary")) {
    chooseDictionary(localStorage.getItem("dictionary"));
}
