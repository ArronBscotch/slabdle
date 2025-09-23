const green = "🟩";
const blue = "🟦";
const red = "🟥";

const guess_input = document.getElementById("guess-input");
const commit = document.getElementById("commit");
const copy = document.getElementById("copy");
const code = document.getElementById("code");
const score = document.getElementById("score");

const keys = [];
const guess = [];
var score_val = 125;

const body = document.getElementById("body");

function cur_date() {
	const today = new Date();
	return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
}

function update_score(guess_string) {
	if (guess_string.length < 5) { return -1; }
	guess_string = guess_string.toLowerCase();

	for (let i = 0; i < guess_string.length; i++) {
		let cur = guess_string.charCodeAt(i) - 97;

		let dist = Math.abs(keys[i] - cur);
		score_val -= dist;

		if (dist == 0) {
			guess.push(green);
		}
		else if (dist <= 3) {
			guess.push(blue);
		}
		else {
			guess.push(red);
		}
	}

	const guess_final = `${guess[0]}${guess[1]}${guess[2]}${guess[3]}${guess[4]}`;
	
	code.innerHTML = guess_final;
	score.innerHTML = `Score: ${score_val}`;
	score.style.visibility = "visible";

	copy.style.visibility = "visible";
	commit.remove();

	return 0;
}

window.onload = function() {
	const date_string = cur_date();

	let hash = 0;

	for (let i = 0; i < date_string.length; i++) {
		hash += date_string.charCodeAt(i);
	}

	hash *= 1103515245;
	hash += 12345;
	hash &= 2147483647;

	for (let i = 0; i < 5; i++) {
		keys.push(((hash & 31) % 26));
		hash = hash >> 5;
	}

	const last_play = localStorage.getItem("last");

	if (last_play) {
		const last = JSON.parse(last_play);

		if (last.last_day == date_string) {
			update_score(last.last_guess);
		}
	}
}

guess_input.onkeypress = function(e) {
	char_regex = RegExp("[A-Za-z]");

	if(!char_regex.test(e.key)) {
		e.preventDefault();
	}
}

commit.onclick = function() {
	let guess_string = guess_input.value;

	let err = update_score(guess_string);

	if (err == -1) {
		return;
	}
	
	const last = {
		last_day: cur_date(),
		last_guess: guess_string
	};
	
	localStorage.setItem("last", JSON.stringify(last));
}

copy.onclick = function() {
	const emoji = code.innerHTML;
	const moments = Math.floor(Math.random() * 11);
	const moment_dot = Math.floor(Math.random() * 10);

	const score_str = `${emoji} | Slabdle \n${cur_date()}\nScore: ${score_val}\n\nGot in: ${moments}.${moment_dot} moments \n\nhttps://arronbscotch.github.io/slabdle/`;

	navigator.clipboard.writeText(score_str);
}
