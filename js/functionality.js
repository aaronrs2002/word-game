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
    playerMoney = passPlayerMoney;
    document.getElementById("playerMoney").innerHTML = passPlayerMoney;
    document.querySelector("#playerMoney").innerHTML = passPlayerMoney;/*SAFARI BUG NEEDS BOTH */
    localStorage.setItem("balance", passPlayerMoney);
}

function startGame() {

    randomNum = Math.floor(Math.random() * words.length);
    wordDef = JSON.stringify(words[randomNum]).split(":");
    wordPrep = wordDef[0].substring(2, wordDef[0].length - 1).replace(" ", "-");
    definitionPrep = wordDef[1].substring(1, wordDef[1].length - 2)

    for (let i = 0; i < wordPrep.length; i++) {/*remeber to check for spaces*/
        let addThis = " ~ ";
        if (wordPrep[i] === "-") {
            addThis = " - ";
        }
        letterSolved.push(addThis);
        wordSolution = wordSolution + addThis;
    }

    gameHTML = gameHTML + "<li class='list-group-item'><div class='d-grid gap-2'><button class='btn btn-primary' onClick='javascript:showNum()' >Cheat</button></div><span class='hide' ><u><b>" + wordPrep
        + "</b></u></span> " + definitionPrep + "<div id='hiddenWordTarget'><h3>" + wordSolution
        + "</h3></div><input type='text' name='userGuess' class='form-control' maxlength='1' placeholder='Is there a...' /><div class='d-grid gap-2'><button class='btn btn-block btn-primary py-2' onClick='javascript:verify()'>Request Letter</button>" +
        "<input type='text' name='solveWord' class='form-control'  placeholder='Solve word' /><button  class='btn btn-block btn-success py-2' onClick='javascript:solve()'>Solve</button></div></li>";



    document.querySelector("#listTarget").innerHTML = gameHTML;
}


startGame();

function showNum() {
    cheated = true;
    document.querySelector(".list-group-item span").classList.remove("hide");
    document.querySelector(".list-group-item .btn").classList.add("hide");
}

function verify() {
    let statusList = "";

    const userGuess = document.querySelector("[name='userGuess']").value;


    for (let i = 0; i < wordPrep.length; i++) {
        console.log("userGuess.toLowerCase(): " + userGuess.toLowerCase() + " - wordPrep[i]: " + wordPrep[i]);
        if (userGuess.toLowerCase() === wordPrep[i].toLowerCase()) {
            // statusList = statusList + userGuess;
            letterSolved[i] = userGuess.toLowerCase();
        }



    }

    for (let i = 0; i < letterSolved.length; i++) {
        statusList = statusList + letterSolved[i];


        if (failedRequests.indexOf(userGuess.toLowerCase()) === -1 && letterSolved.indexOf(userGuess.toLowerCase()) === -1) {
            failedRequests.push(userGuess.toLowerCase());
            requestFailedHTML = requestFailedHTML + userGuess.toLowerCase() + " ";
        }
        console.log("pushed to failedRequests length: " + failedRequests + " failedRequests.indexOf(userGuess.toLowerCase()): " + failedRequests.indexOf(userGuess.toLowerCase()));



    }



    console.log("requestFailedHTML: " + requestFailedHTML);
    document.getElementById("hiddenWordTarget").innerHTML = statusList;
    document.querySelector("[name='userGuess']").value = "";
    document.querySelector("#requestedList").innerHTML = requestFailedHTML;

}

function solve() {
    let percentage = 100;
    for (let i = 0; i < failedRequests.length; i++) {
        percentage = percentage - 5;
    }

    document.querySelector("#winLoseStatus[role='alert']").classList.remove("hide");
    if (document.querySelector("input[name='solveWord']").value.toLowerCase() === wordPrep.toLowerCase()) {

        for (let i = 0; i < requestedList.length; i++) {
            percentage = percentage - 5;
        }

        document.querySelector("#winLoseStatus[role='alert']").classList.add("alert-success");
        if (cheated === false) {
            document.querySelector("#winLoseStatus[role='alert']").innerHTML = "<h3><span class='capitalize'>" + wordPrep + "</span>! YOU DID IT! +$" + percentage + "</h3>";
            setPlayerMoney((playerMoney + percentage));
        } else {
            document.querySelector("#winLoseStatus[role='alert']").innerHTML = "<h3><span class='capitalize'>" + wordPrep + "</span> YOU CHEATED. NO WINNINGS.</h3>";
        }


    } else {
        document.querySelector("#winLoseStatus[role='alert']").classList.add("alert-danger");
        document.querySelector("#winLoseStatus[role='alert']").innerHTML = "<h3><span class='capitalize'>" + wordPrep + "</span>! YOU FAILED! - $50</h3>";

        setPlayerMoney((playerMoney - 50));
    }

    setTimeout(() => {
        gameHTML = "";
        wordSolution = "";
        letterSolved = [];
        document.querySelector("#listTarget").innerHTML = gameHTML;
        document.querySelector("#winLoseStatus[role='alert']").classList.add("hide");
        document.querySelector("#winLoseStatus[role='alert']").classList.remove("alert-success");
        document.querySelector("#winLoseStatus[role='alert']").classList.remove("alert-danger");
        failedRequests = [];

        document.getElementById("requestedList").innerHTML = "Guess the word";


        requestFailedHTML = "";
        cheated = false;

        startGame();
    }, 3000);
}


