class EventManager {
	wallpaperState = 0;
	
	constructor () {
		this.search = document.querySelector("#searchbox");
		this.modal = document.querySelector("#searchmod");
		this.root = document.querySelector(":root")
		this.audio = document.querySelector("footer > audio");
		this.trackList = []
		this.search.addEventListener("focus", this.searchmod.bind(this));
		this.search.addEventListener("blur", this.searchmod.bind(this));
		window.addEventListener("keydown", this.keyboardManager.bind(this));
		this.audio.volume=0.5;
	}

	searchmod (e) {
		if (e.type=="focus") {
			this.modal.style.transform = "translateX(0%)";
			this.modal.style.width = "clamp(300px, 60vw, 600px)";
			this.modal.style.backgroundColor = "var(--glassBG)";
		}
		else if (e.type=="blur") {
			this.modal.style.transform = "translateX(95%)";
			this.modal.style.width = "";
			this.modal.style.backgroundColor = "var(--glassBGinactive)";
		}
	}

	soundManager(operation) {
		switch (operation) {
			case "higher":
				if (this.audio.volume <= 0.9) this.audio.volume += 0.1;
				else if (this.audio.volume > 0.9) this.audio.volume = 1;
				break;
			case "lower":
				if (this.audio.volume >= 0.1) this.audio.volume -= 0.1;
				else if (this.audio.volume < 0.1) this.audio.volume = 0;
				break;
			case "nextTrack":

		}

	}

	keyboardManager(e) {
		if (e.keyCode == 36) {
			if (this.wallpaperState) {
				this.root.style.setProperty("--wallpaper", "1");
				this.root.style.setProperty("cursor", "auto");
				this.wallpaperState = 0;
			}
			else {
				this.root.style.setProperty("--wallpaper", "0");
				this.root.style.setProperty("cursor", "none");
				this.wallpaperState = 1;
			}
		}
		if (e.keyCode == 35) {
			if (this.audio.paused) {
				this.audio.play();
			}
			else this.audio.pause();
		}
		if (e.keyCode == 46) {
			if (this.audio.volume > 0.2) {
				this.audio.volume -= 0.1;
			}
		}
		if (e.keyCode == 45) {
			if (this.audio.volume < 0.9) {
				this.audio.volume += 0.1;
			}
		}
	}
}

async function dataFetcher (addr, method, bodyData) {
	let response;
	if (bodyData != null && bodyData != "undefined" && method != "GET") {
		response = await fetch (
			document.location.origin + "/api/" + addr,
			{
				method: method,
				mode: "same-origin",
				cache: "no-cache",
				credentials: "same-origin",
				body: bodyData
			}
		)
	}
	else {
		response = await fetch (
			document.location.origin + "/api/" + addr,
			{
				method: method,
				mode: "same-origin",
				cache: "no-cache",
				credentials: "same-origin"
			}
		)
	}
	return response.json();
}

function dataFieldUpdate () {
	const opTarget = document.querySelector("#optarget");
	const opType = document.querySelector("#optype");
	switch(opTarget.value) {
		case "category":
			switch(opType.value) {
				case "create":
					let input = document.createElement("input");
					input.name="catName";
					input.id="catName";
					input.type="text";
					let label = document.createElement("label");
					label.for = "catName";
					label.innerText = "Nazwa kategorii: ";
					buf = [label, input];
					formLoader(buf);
				break;
				case "update":
				break;
				case "delete":
				break;
				default: break;
			}
			break;
		case "tag":
			break;
		case "article":
			break;
		default: break;
	}
}

function formLoader (dataArray) {
	let form = document.querySelector("#cheekyField");
	let execList = form.parentNode.children;
	console.log(execList);
	if (execList.length > 1) execList.forEach(item => {
		if (item.type != "legend") item.remove();
	});
	dataArray.forEach(item => {
		form.before(item);
	});
}

window.onload = async () => {
	const em = new EventManager();
	if (document.location.pathname.includes("CRUD")) {
		const uniSelect = document.querySelector("#uniselect");
		let options = await dataFetcher("CRUD", "GET", null);
		options.forEach(universe => {
			let buf = document.createElement("option");
			buf.innerText = universe.name + " by " + universe.author;
			buf.value = universe.id;
			uniSelect.appendChild(buf);
		});
		const opTarget = document.querySelector("#optarget");
		const opType = document.querySelector("#optype");
		opType.addEventListener("change", dataFieldUpdate);
		opTarget.addEventListener("change", dataFieldUpdate);
	}
}