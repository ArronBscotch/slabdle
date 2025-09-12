const green = "🟩";
const blue = "🟦";
const red = "🟥";

const guess_input = document.getElementById("guess-input");
const commit = document.getElementById("commit");
const copy = document.getElementById("copy");
const code = document.getElementById("code");

const keys = [];
const guess = [];

const body = document.getElementById("body");

function cur_date() {
	const today = new Date();
	return `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
}

window.onload = function() {
	const date_string = cur_date();

	const last_play = localStorage.getItem("last");

	if (last_play) {
		const last = JSON.parse(last_play);

		if (last.last_day == date_string) {
			commit.remove();
			copy.style.visibility = "visible";

			code.innerHTML = last.last_guess;
		}
	}

	let hash = 0;

	for (let i = 0; i < date_string.length; i++) {
		hash += date_string.charCodeAt(i);
	}

	hash *= 1103515245;
	hash += 12345;
	hash &= 2147483647;

	for (let i = 0; i < 5; i++) {
		keys.push(((hash & 31) % 27));
		hash = hash >> 5;
	}
}

guess_input.onkeypress = function(e) {
	char_regex = RegExp("[A-Za-z]");

	if(!char_regex.test(e.key)) {
		e.preventDefault();
	}
}

commit.onclick = function() {
	var guess_string = guess_input.value;

	if (guess_string.length < 5) { return; }
	guess_string = guess_string.toLowerCase();

	for (let i = 0; i < guess_string.length; i++) {
		let cur = guess_string.charCodeAt(i) - 97;
		console.log(cur);
		console.log(keys);

		if ((keys[i] - cur) == 0) {
			guess.push(green);
		}
		else if (Math.abs(keys[i] - cur) <= 3) {
			guess.push(blue);
		}
		else {
			guess.push(red);
		}
	}

	const guess_final = `${guess[0]}${guess[1]}${guess[2]}${guess[3]}${guess[4]}`;

	code.innerHTML = guess_final;

	copy.style.visibility = "visible";
	commit.remove();

	const last = {
		last_day: cur_date(),
		last_guess: code.innerHTML
	};
	
	localStorage.setItem("last", JSON.stringify(last));

}

copy.onclick = function() {
	const emoji = code.innerHTML;
	const moments = Math.floor(Math.random() * 11);
	const moment_dot = Math.floor(Math.random() * 10) + 1;

	const score = `${emoji} | Slabdle \n${cur_date()}\n\nGot in: ${moments}.${moment_dot} moments \n\nhttps://arronbscotch.github.io/slabdle/`;

	navigator.clipboard.writeText(score);
}
