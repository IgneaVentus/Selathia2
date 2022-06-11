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
			this.modal.style.backgroundColor = "var(--glassBG)";
		}
		else if (e.type=="blur") {
			this.modal.style.transform = "translateX(95%)";
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

async function dataFetcher (addr) {
	let response = await fetch(
		document.location.origin + addr,
		{method: "GET", mode: "same-origin", cache: "no-cache", credentials: "same-origin"}
	)
	return response.text();
}

window.onload = async () => {
	const em = new EventManager();
	document.querySelector("main").innerHTML+=await dataFetcher("/api" + document.location.pathname);
}