const HOST = '127.0.0.1:24050';
const socket = new ReconnectingWebSocket(`ws://${HOST}/ws`);

let bg = document.getElementById("bg");
let star = document.getElementById("star");
let pp = document.getElementById("pp");
let hun = document.getElementById("h100");
let fifty = document.getElementById("h50");
let miss = document.getElementById("h0");
let time = document.getElementById("time");

socket.onopen = () => {
	console.log("Successfully Connected");
};

socket.onclose = event => {
	console.log("Socket Closed Connection: ", event);
	socket.send("Client Closed!")
};

socket.onerror = error => {
	console.log("Socket Error: ", error);
};

let tempState;
let tempImg;
socket.onmessage = event => {
	let data = JSON.parse(event.data);
	if (tempState !== data.menu.bm.path.full) {
		tempState = data.menu.bm.path.full
		bg.setAttribute('src', `http://${HOST}/Songs/${data.menu.bm.path.full}?a=${Math.random(10000)}`)
	}
	if (data.menu.bm.time.current > 1000) {
		let seconds = (data.menu.bm.time.current/1000).toFixed(0);
		let minutes = Math.floor(seconds % 3600 / 60).toString();

		if (seconds > 60) {
			time.innerHTML = `${minutes}m ${seconds-(minutes*60)}s`
		} else {
			time.innerHTML = `${seconds}s`
		}
	}
	if (data.gameplay.pp.current != '') {
		let ppData = data.gameplay.pp.current;
		pp.innerHTML = Math.round(ppData) + "pp"
	} else {
		pp.innerHTML = 0 + "pp"
	}
	if (data.menu.bm.stats.SR != '') {
		let SR = data.menu.bm.stats.SR;
		star.innerHTML = SR.toFixed(2)
	} else {
		star.innerHTML = 0
	}
	if (data.gameplay.hits[100] > 0) {
		hun.innerHTML = data.gameplay.hits[100];
	} else {
		hun.innerHTML = 0
	}
	if (data.gameplay.hits[50] > 0) {
		fifty.innerHTML = data.gameplay.hits[50];
	} else {
		fifty.innerHTML = 0
	}
	if (data.gameplay.hits[0] > 0) {
		miss.innerHTML = data.gameplay.hits[0];
	} else {
		miss.innerHTML = 0
	}
}