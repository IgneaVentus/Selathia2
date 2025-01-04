//=================================|| Global Variables ||=================================

const resultScreen = new Map([
	["screen", document.querySelector("#resultScreen")],
	["won", document.querySelector("#gameWon")],
	["draw", document.querySelector("#gameDraw")],
	["lost", document.querySelector("#gameLost")],
	["summary", document.querySelector("#records")],
	["gamesWon", document.querySelector("#totalGamesWon")],
	["gamesDrew", document.querySelector("#totalGamesDrew")],
	["gamesLost", document.querySelector("#totalGamesLost")]
]);

const sides = new Map([
	["left", document.querySelector("#leftSide")],
	["right", document.querySelector("#rightSide")]
]);

const scoreUI = new Map([
	["round", document.querySelector("#roundNumber")],
	["player", document.querySelector("#scorePlayer")],
	["pc", document.querySelector("#scorePC")]
]);

const buttons = new Map([
	["rock", document.querySelector("#rock")],
	["paper", document.querySelector("#paper")],
	["scissors", document.querySelector("#scissors")]
]);

var cookiePermission = false;

// gameTracker = round, player score, pc score
var gameTracker = [1, 0, 0];

// Rock = 0, Paper = 1, Scissors = 2. Kept as array due to the way of passing choices.
//const svgLinks = ["/funstuff/RPS/svg/fist-svgrepo-com.svg", "/funstuff/RPS/svg/hand-open-svgrepo-com.svg", "/funstuff/RPS/svg/hand-sign-svgrepo-com.svg"]
const svgLinks = ["/funstuff/RPS/png/rock.png", "/funstuff/RPS/png/paper.png", "/funstuff/RPS/png/scissors.png"]

//=================================|| Functions ||=================================

// Game resolver. 0 - rock, 1 - paper, 2 - scissors.
// Returns an array containing pc choice and result. -1 - fail, 0 - draw, 1 - win
function resolveGame (playerChoice) {
	let pcChoice = Math.floor(Math.random()*3);
	if (playerChoice == pcChoice) return [pcChoice, 0];
	else if ((playerChoice == 0 && pcChoice == 2)
		|| (playerChoice == 1 && pcChoice == 0)
		|| (playerChoice == 2 && pcChoice == 1)) {
			return [pcChoice, 1];
	}
	else return [pcChoice, -1];
}

// Display and adapt result screen. Not using classList to not add classes into infinity on repeated states.
function enableResultScreen (result) {
	if (result == 0) {
		resultScreen.get("won").className = "resultText disabled";
		resultScreen.get("draw").className = "resultText";
		resultScreen.get("lost").className = "resultText disabled";
	}
	else if (result > 0) {
		resultScreen.get("won").className = "resultText";
		resultScreen.get("draw").className = "resultText disabled";
		resultScreen.get("lost").className = "resultText disabled";
	}
	else {
		resultScreen.get("won").className = "resultText disabled";
		resultScreen.get("draw").className = "resultText disabled";
		resultScreen.get("lost").className = "resultText";
	}

	resultScreen.get("screen").className = "";
}

function switchButtons (state) {
	if (!state) buttons.forEach( button => {
		button.setAttribute("disabled", "disabled");
	});
	else buttons.forEach( button => {
		button.removeAttribute("disabled");
	});
}

// Cookie and record updater. Check if cookie isn't empty to avoid problems, get old record, update it.
function cookieUpdater (score) {
	let cookie;
	// Why is reading cookies such a pain in the ass in JS? T-T
	document.cookie.split(";").forEach(item => {if (item.includes("RPSscore")) cookie=item.split("=")[1];})
	// lastScore = [wins, draws, loses]
	let lastScore;
	if (cookie!==null && cookie !== undefined) {
		lastScore = cookie.split(",");
	}
	else lastScore = [0,0,0];
	if (score > 0) lastScore[0]++;
	else if (score < 0 ) lastScore[2]++;
	else lastScore[1]++;
	let year = new Date().getFullYear()+10;
	document.cookie = "RPSscore="+lastScore[0]+","+lastScore[1]+","+lastScore[2]+"; expires="+new Date(Date.UTC(year)).toUTCString();
	resultScreen.get("gamesWon").innerHTML = lastScore[0];
	resultScreen.get("gamesDrew").innerHTML = lastScore[1];
	resultScreen.get("gamesLost").innerHTML = lastScore[2];
}

function play(playerChoice) {
	// Disable buttons to avoid fuckery
	switchButtons(0);

	// Reset images to "rocks" and start CSS animations
	sides.get("left").children[0].setAttribute("src", svgLinks[0]);
	sides.get("right").children[0].setAttribute("src", svgLinks[0]);

	// Resolve the game
	let results = resolveGame(playerChoice);

	// Run the animation as late as possible because the fucking milisecond lag makes the animation suck ass
	sides.get("left").className = "animated";
	sides.get("right").className = "animated";
	// Set a timed response to allow animation to play fully before changing things
	// In said response change score and round counts and change images to corresponding choices
	setTimeout(() => {
		// STOP THE FUKKEN ANIMATION AHHHHHHHHHHHH HATE CSS
		sides.get("left").className = "";
		sides.get("right").className = "";

		// Block the round from going above 3
		if (++gameTracker[0] != 4) {
			scoreUI.get("round").innerHTML = gameTracker[0];
			switchButtons(1);
		}
		if (results[1] > 0) scoreUI.get("player").innerHTML = ++gameTracker[1];
		if (results[1] < 0) scoreUI.get("pc").innerHTML = ++gameTracker[2];
		
		sides.get("left").children[0].setAttribute("src", svgLinks[playerChoice]);
		sides.get("right").children[0].setAttribute("src", svgLinks[results[0]]);

		// If third round passed, reset everything and run result screen
		if (gameTracker[0] > 3) setTimeout( () => {
			let score = gameTracker[1]-gameTracker[2]
			if (cookiePermission) cookieUpdater(score);
			enableResultScreen(score);

			scoreUI.get("round").innerHTML = gameTracker[0] = 1;
			scoreUI.get("player").innerHTML = gameTracker[1] = 0;
			scoreUI.get("pc").innerHTML = gameTracker[2] = 0;

			sides.get("left").children[0].setAttribute("src", svgLinks[0]);
			sides.get("right").children[0].setAttribute("src", svgLinks[0]);
			
		switchButtons(1);
		}, 1000)
	}, 1000)
}

//=================================|| Interfaces ||=================================

function rocked (e) {
	play(0);
}


function papercut (e) {
	play(1);
}


function scissorRunner (e) {
	play(2);
}
//=================================|| Initialisation ||=================================

window.onload = () => {

	switchButtons(0);
	if (confirm("Ta strona używa ciasteczek do śledzenia Twojego wyniku. Brak akceptacji oznacza brak śledzenia wyniku i, jeśli wcześniej była udzielona zgoda, usunięcie ciasteczka.")) {
		alert("Zaakceptowano ciasteczko!");
		cookiePermission = true;
	}
	else {
		alert ("Ciasteczko odwołane, rekordy nie będą śledzone!");
		document.cookie = "RPSscore=0; expires="+new Date(Date.UTC(1996)).toUTCString();
		resultScreen.get("summary").className = "disabled";
	}
	switchButtons(1);
	sides.get("left").children[0].setAttribute("src", svgLinks[0]);
	sides.get("right").children[0].setAttribute("src", svgLinks[0]);

	buttons.get("rock").addEventListener("click", rocked);
	buttons.get("paper").addEventListener("click", papercut);
	buttons.get("scissors").addEventListener("click", scissorRunner);
	document.querySelector("#resetButton").addEventListener("click", () => {
		resultScreen.get("screen").className = "disabled";
	});
}