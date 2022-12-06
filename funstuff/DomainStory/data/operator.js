address = window.location.search;
query = new URLSearchParams(address);
query = query.get("id");
goddamnTriplets = [document.querySelector("#title"), document.querySelector("#banner"), document.querySelector("#content")];
buttons = document.querySelector(".buttons");
messerschmit = document.querySelector("#fancyLoader");
dataSnatcher = "/Misc/DomainStory/API";


function formState (toggle) {
	if (toggle==true) {
		messerschmit.classList.add("disabled");
		messerschmit.children[0].classList.add("stopAnim");
	}
	if (toggle==false) {
		messerschmit.classList.remove("disabled");
		messerschmit.children[0].classList.remove("stopAnim");
	}
}

function loadThisBadBoy() {
	document.querySelector("#grower").classList.add("disabled");
	document.querySelector("#shower").classList.remove("disabled");
	fetch(dataSnatcher+"?id="+query)
	.then(data => data.json())
	.then(data => {
		if(data.success == true) {
			goddamnTriplets[0].innerHTML = data.content.title;
			goddamnTriplets[1].setAttribute("src", data.content.url);
			goddamnTriplets[2].innerHTML = data.content.content;
		}
		else alert("ERROR!\n"+data.content);
	});
}

function saveMeMomma() {
	form = document.querySelector("#articleAdder");
	form.onsubmit = async (e) => {
		e.preventDefault();

		formState(false);

		fetch(dataSnatcher, { method: "POST", body: new FormData(form) })
		.then( result => result.json() )
		.then( result => {
			if (result.success) {
				document.querySelector("#grower").classList.add("disabled");
				document.querySelector("#shower").classList.remove("disabled");

				goddamnTriplets[0].innerHTML = result.content.title;
				goddamnTriplets[1].setAttribute("src", result.content.url);
				goddamnTriplets[2].innerHTML = result.content.content;
				alert("ID: "+result.content.id);
			}
			else alert(result.content);
			formState(true);
		});

		return false;
	}
}
if (query != "undefined" && query != "null" && query != null) loadThisBadBoy();
else saveMeMomma();
