const charList = new Array();
const charNav = new Array();
const charNavNames = new Map ([
    ["prev", document.querySelector("#charPrev")],
    ["current", document.querySelector("#charCur")],
    ["next", document.querySelector("#charNext")]
])
var favlist;
var userPanel;
let currentChar = -1
let maxChar = 0
let imageState = 0
const prevButton = document.getElementById("navPrev")
const navText = document.getElementById("navName")
const nextButton = document.getElementById("navNext")

class Character {
    #name; #surname; #race; #age; #sex; #height; #belief; #maxlvl; #psyche;
    #desc = []; #weapons = []; #armor = []; #clothes = []; #other = [];
    #skills = []; #attributes = []; #dataTable = new Map();

    constructor (dataset) {
        //binding functions
        this.#itemRepeater.bind(this);
        this.#skillRepeater.bind(this);
        this.#attrRepeater.bind(this);
        this.present.bind(this);

        //creating properties
        this.#name = dataset.name;
        this.#surname = dataset.surname;
        this.#race = dataset.race;
        this.#age = dataset.age;
        this.#dataTable.set("charAge", this.#age + ((dataset.sex=="female") ? " letnia " : " letni ") + this.#race);
        this.#sex = dataset.sex;
        this.#dataTable.set("charSex", (this.#sex=="female" ? "♀" : "♂"));
        this.#height = dataset.height;
        this.#dataTable.set("charHeight", this.#height);
        this.#belief = dataset.belief;
        this.#dataTable.set("charBelief", this.#belief);
        this.#desc["visage"] = dataset.visage;
        this.#desc["psyche"] = dataset.psyche;
        this.#dataTable.set("charDesc > #innerDesc", this.#desc["visage"].txt  + "\n\n" + this.#desc["psyche"]);
        // Check whether character has a portait - if not, set portrait to 0 for further processing
        this.#dataTable.set("portrait", this.#desc["visage"].type == "img" ? "Modules/Characters/data/"+this.#desc["visage"].content : 0);

        //running support functions
        this.#itemRepeater(dataset.equipment);
        this.#skillRepeater(dataset.skillset);
        this.#attrRepeater(dataset.attributes);
        this.#backstoryRepeater(dataset.backstory);
    }

    #itemRepeater (obj) {
        for (let category in obj) {
            let  i=0;
            while (obj[category][i]!==undefined)
            {
                let buf = obj[category][i];
                switch (category) {
                    case "weapons":  this.#weapons.push(buf); break;
                    case "clothing":  this.#clothes.push(buf); break;
                    case "armor":  this.#armor.push(buf); break;
                    case "other":  this.#other.push(buf); break;
                }
                i++;
            }
        }
        let buf = new Map();
        buf.set("charWeap", this.#weapons);
        buf.set("charArmor", this.#armor);
        buf.set("charCloth", this.#clothes);
        buf.set("charItems", this.#other);
        this.#dataTable.set("charEquipment", buf);
    }

    #skillRepeater (obj) {
        for (let skill in obj) {
            if (obj[skill]!==undefined) this.#skills.push(obj[skill])
        }
        this.#dataTable.set("charSkills", this.#skills);
    }

    #attrRepeater (obj) {
        for (let attr in obj) {
            if (obj[attr]!==undefined) {
                if (attr=="Maxlvl") this.maxlvl = obj[attr];
                else this.#attributes[attr] = obj[attr];
            }
        }
        this.#dataTable.set("charAttr", this.#attributes);
    }

    #backstoryRepeater (obj) {
        this.#desc["backstory"] = "";
        //Loading the backstory line by line for multiline stories
        if ((obj[0]).length > 1) {
            for (let line in obj) {
                if (obj[line]!==undefined) {
                    this.#desc["backstory"] += obj[line] + "\n\n";
                }
            }
        }
        // Loading whole backstory at once for backward compatibility
        // DEPRECATE later
        else this.#desc["backstory"] = obj;
        this.#dataTable.set("charStory", this.#desc["backstory"]);
    }

    name() {
        return this.#name + " " + this.#surname;
    }

    present () {
        let d = document;
        this.#dataTable.forEach((value, key) => {
            switch (key) {
            case "charEquipment" :
                value.forEach((subvalue, subkey) => {
                    // Assign category element to variable to not type so much, clean it of old entries
                    let catBody = d.querySelector("#" + key + " > #" + subkey)
                    catBody.innerHTML = "";
                    for (let item in subvalue) {
                        let buf = d.createElement("p");
                        buf.innerText = subvalue[item];
                        catBody.append(buf);
                    }
                });
                break;
            case "charSkills" :
                // clear skill list before beggining
                d.querySelector("#" + key).innerHTML = "";
                for (let skill in value) {
                    // create main div of single skill item
                    let element = d.createElement("div");
                    element.classList = "skillItem";
                    let buf;
                    // create buffer variable, add header with skill level and append to main div
                    // but only if the level is above 0
                    if (value[skill].level > 0) {
                        buf = d.createElement("h4");
                        buf.innerText = value[skill].level;
                        element.append(buf);
                    }
                    // change buffer to header with skill name and again append 
                    buf = d.createElement("h4");
                    buf.innerText = value[skill].name;
                    element.append(buf);
                    // the same but for skill description
                    buf = d.createElement("p");
                    //buf.style.display = "none";
                    buf.innerText = value[skill].description;
                    element.append(buf);
                    // finally append main div into the document and repeat
                    d.querySelector("#" + key).appendChild(element);
                }
                break;
            case "charAttr" : 
                let attrfield = d.querySelector("#" + key)
                attrfield.innerHTML = "";
                if (this.maxlvl != undefined) {
                    for (let attr in value) {
                        let attribute = d.createElement("div");
                        let label = d.createElement("label");
                        label.innerText = attr;
                        label.setAttribute("for", "#"+attr);
                        attribute.append(label);
                        let bar = d.createElement("meter");
                        bar.setAttribute("min", "0");
                        bar.setAttribute("max", ""+this.maxlvl);
                        bar.setAttribute("value", value[attr]);
                        attribute.append(bar);
                        attribute.setAttribute("title", attr+": "+value[attr]);
                        attrfield.append(attribute);
                    }
                }
                else for (let attr in value) {
                    let buf = d.createElement("p");
                    buf.innerText = attr + ": " + value[attr];
                    attrfield.append(buf);
                }
                break;
            case "portrait" : 
                if (value != 0) {
                    let portrait = d.querySelector("#" + key);
                    let lookup = d.querySelector("#imageHandler");
                    portrait.innerHTML = "";
                    lookup.innerHTML = "";
                    if (value !== undefined && value != "" ) {
                        let buf = document.createElement("img");
                        buf.alt = "Portret postaci";
                        buf.src = value;
                        portrait.append(buf.cloneNode());
                        lookup.append(buf);
                    }
                    portraitSwitcher(true);
                }
                else portraitSwitcher(false);
                break;
            default :
                d.querySelector("#" + key).innerText = value;
                break;
            }
        });
        document.querySelectorAll(".skillItem").forEach(item => item.addEventListener("click", skillHandler));
    }
}

class Favlist {
    #favorites = [];
    #lastVisited = [];
    #lastVisitedLimit = 10;
    navigation = document.getElementById("favlistNavButtons");
    // view = document.getElementById("favlistView");
    favCharacterList = document.getElementById("favlistView");
    lastVisitedList = document.getElementById("lastVisitedView");
    favButton = document.getElementById("favlistAddFavorite");
    #currentview = "favorites";

    constructor () {
        // Load saved data to fill the list
        let cookiedata = document.cookie;
        cookiedata = cookiedata.split(";");
        cookiedata.forEach(cookie => {
            if (cookie.includes("favorites")) this.#cookieReader("favorites", cookie);
            if (cookie.includes("lastVisited"))  this.#cookieReader("lastVisited", cookie);
        });
        this.calculateItemCountLimit();
    }

    calculateItemCountLimit() {
        let item = document.querySelector(".favlistViewItem");
        if (item != null) {
            item = item.getBoundingClientRect();
            if (item !== null && item !== undefined) {
                this.#lastVisitedLimit = Math.floor(this.lastVisitedList.children[0].getBoundingClientRect().height / item.height);
                return 0;
            }
        }
        this.#lastVisitedLimit = 10;
    }

    listUpdate() {
        switch(this.#currentview) {
            case "favorites": 
                this.favCharacterList.children[0].innerHTML = "";
                this.#favorites.forEach( (entry) => { this.#listItemGenerator(entry[0], entry[1], true, "favorites");});
                break;
            case "lastVisited":
                this.lastVisitedList.children[0].innerHTML = "";
                this.#lastVisited.forEach( (entry) => { this.#listItemGenerator(entry[0], entry[1], false, "lastVisited");});
                break;
        }
    }

    viewChange (e) {
        let view = e.target.getAttribute("value");
        if (view != this.#currentview) {
            if (view == "favorites") {
                this.#currentview = view;
                this.listUpdate();
                this.#changeActiveNav();
            }
            if (view == "lastVisited") {
                this.#currentview = view;
                this.listUpdate();
                this.#changeActiveNav();
            }
        }
    }

    addLastVisited (id, name) {
        let leftover = null;
        
        // Check whether we do not have that record already
        let alreadyHere = -1;
        if (this.#lastVisited.length > 0) { 
            for (let i=0; i<this.#lastVisited.length; i++) { 
                if (this.#lastVisited[i][0].trim() == id.trim()) alreadyHere = i; 
            }
        }
        if (alreadyHere != -1) {
            this.#lastVisited.splice(alreadyHere, 1);
            this.#lastVisited.unshift([id.trim(), name]);
        }
        else if (this.#lastVisited.unshift([id.trim(), name]) > this.#lastVisitedLimit ) leftover = this.#lastVisited.pop();
        
        this.#cookieSaver("lastVisited");
        if (this.#currentview == "lastViewed") this.listUpdate();
    }

    addFavorite (e) {
        // Get data
        let id, name;
        id = charNav[currentChar].trim();
        name = charList[id].name();
        
        // Check whether we do not have that record already
        let alreadyHere = -1;
        if (this.#favorites.length > 0) { 
            for (let i=0; i<this.#favorites.length; i++) { 
                if (this.#favorites[i][0].trim() == id.trim()) alreadyHere = i; 
            }
        }

        // If it doesn't exist, add it. If it does, ignore.
        if (alreadyHere == -1) {
            this.#favorites.unshift([id, name]);
            this.#cookieSaver("favorites");
            this.listUpdate();
        }
    }

    // If the character is already loaded, switch to it. Else load it.
    loadDemanded (e) {
        let id = e.target.getAttribute("value").trim();

        if (charNav.includes(id)) {
            charChange(charNav.indexOf(id))
        }
        else {
            document.querySelector("#charID").value = id;
            charGrabber();
        }
    }

    removeFavorite (e) {
        let id = e.target.getAttribute("value").trim();

        // Check whether we do not have that record already
        let alreadyHere = -1;
        if (this.#favorites.length > 0) { 
            for (let i=0; i<this.#favorites.length; i++) { 
                if (this.#favorites[i][0].trim() == id.trim()) alreadyHere = i; 
            }
        }

        if (alreadyHere != -1) {
            this.#favorites.splice(alreadyHere, 1);
            this.#cookieSaver("favorites");
            this.listUpdate();
        }
    }

    #changeActiveNav () {
        for (let button of this.navigation.children) {
            button.classList.toggle("active");
        }
        this.favCharacterList.classList.toggle("hidden");
        this.lastVisitedList.classList.toggle("hidden");
        this.favButton.classList.toggle("hidden");
    }

    #cookieReader (target, cookie) {
        let buffer = cookie.replace(target+"=", "").split(",");
        buffer.forEach((record) => {
            let data = record.split("|");
            if (target=="favorites") this.#favorites[data[2]] = [data[0],data[1]];
            else if (target=="lastVisited") this.#lastVisited[data[2]] = [data[0],data[1]];
        })
    }

    #cookieSaver (target) {
        // Create expiration date string to append to cookie. By default expires after a year (365 days)
        let date = new Date();
        let dateAppend = "; expires=" + date.toUTCString( date.setTime( date.getTime() + ( 365*24*60*60*1000 ) ) );
        
        let cookie = "";
        if (target == "favorites") {
            cookie = "favorites=";
            for (let i=0; i<this.#favorites.length; i++) {
                cookie += `${this.#favorites[i][0]}|${this.#favorites[i][1]}|${i}`;
                if (i!=this.#favorites.length-1) cookie+=",";
            }
        }
        else if (target == "lastVisited") {
            cookie = "lastVisited=";
            for (let i=0; i<this.#lastVisited.length; i++) {
                cookie += `${this.#lastVisited[i][0]}|${this.#lastVisited[i][1]}|${i}`;
                if (i!=this.#lastVisited.length-1) cookie+=",";
            }
        }
        else return 0;
        cookie += dateAppend;
        document.cookie = cookie;
    }

    #listItemGenerator (id, name, deleteButton, view) {
        id = id.trim();
        let item = document.createElement("div");
        item.classList.add("favlistViewItem");

        let buf = document.createElement("button");
        buf.setAttribute("value", id);
        buf.classList.add("load");
        buf.innerText = name;
        buf.addEventListener("click", favlist.loadDemanded.bind(favlist));
        item.appendChild(buf);

        if (deleteButton) { 
            buf = document.createElement("button");
            buf.setAttribute("value", id);
            buf.classList.add("delete");
            buf.innerText = "Usuń";
            buf.addEventListener("click", favlist.removeFavorite.bind(favlist));
            item.appendChild(buf);
        }

        switch (view) {
            case "favorites": this.favCharacterList.children[0].appendChild(item); break;
            case "lastVisited": this.lastVisitedList.children[0].appendChild(item); break;
        }
        
    }
}

class UserPanel {
    #nickname; #isLoggedIn = false;
    #userLoginModule = document.getElementById("userLoginModule");
    #userInfoModule = document.getElementById("userInfoModule");
    #userControlModule =  document.getElementById("userControlModule");

    login (e) {
        if (e.detail == "success") {
            this.#userLoginModule.classList.add("hidden");
            this.#userInfoModule.children[0].innerText = sessionStorage.getItem("loggedIn");
            this.#userInfoModule.classList.remove("hidden");
            this.#userControlModule.classList.remove("hidden");
        }
        else alert("Błędna nazwa użytkownika lub hasło!");
    }

}

async function charGrabber () {
    let id = document.querySelector("#charID").value.trim();
    if (id !== undefined) {
        if (!charNav.includes(id)) {
            fetch("/Characters/API?q="+id)
            .then(data => data.json())
            .then(data => {
                charList[id] = new Character(data);
                charNav.push(id);
                maxChar++;
                charChange("next");
                // Add to the list of last visited
                favlist.addLastVisited(id, data.name + " " + data.surname);
                favlist.listUpdate();
            })
        }
    }
}

// Updating character names in navbar and current character tracker in this script
function charNavUpdate () {
    let IDs = [ (currentChar-1 < 0 ? maxChar-1 : currentChar-1), currentChar, (currentChar+1 >= maxChar ? 0 : currentChar+1)];
    charNavNames.get("prev").innerText = charList[charNav[IDs[0]]].name();
    charNavNames.get("next").innerText = charList[charNav[IDs[2]]].name();
    charNavNames.get("current").innerText = charList[charNav[IDs[1]]].name();
}

// Detecting user changing characters via UI
function charChange(direction) {
    if (direction == "next") {
        if (++currentChar>maxChar-1) currentChar=0
    }
    else if (direction == "prev") {
        if (--currentChar<0) currentChar=maxChar-1
    }
    // Load direct id
    else currentChar = direction;

    charList[charNav[currentChar]].present();
    charNavUpdate();
}

function switchViewChar(target) {
    if (target!=null && target!=undefined && target!="undefined") {
        let optionList = ["#charDesc", "#charSkills", "#charStory"], buttonList = [".left", ".middle", ".right"]
        for (option in optionList) {
            document.querySelector(optionList[option]).style.display = "none"
        }
        for (button in buttonList) {
            document.querySelector("#charButtons > " + buttonList[button]).classList.remove("active")
        }
        switch(target) {
            case "desc": document.querySelector("#charDesc").style.display = "flex"; document.querySelector(".middle").classList.add("active"); break;
            case "skills": document.querySelector("#charSkills").style.display = "flex"; document.querySelector(".left").classList.add("active"); break;
            case "story": document.querySelector("#charStory").style.display = "initial"; document.querySelector(".right").classList.add("active"); break;
        }
    }
}

function switchViewEq(target) {
    if (target!=null && target!=undefined && target!="undefined") {
        let optionList = ["#charWeap", "#charArmor", "#charCloth", "#charItems"], buttonList = [".left", ".left-middle", ".right-middle", ".right"]
        for (option in optionList) {
            document.querySelector(optionList[option]).style.display = "none"
        }
        for (button in buttonList) {
            document.querySelector("#charEquipmentButtons > " + buttonList[button]).classList.remove("active")
        }
        switch(target) {
            case "weap": document.querySelector("#charWeap").style.display = "flex"; document.querySelector("#charEquipmentButtons .left").classList.add("active"); break;
            case "armor": document.querySelector("#charArmor").style.display = "flex"; document.querySelector("#charEquipmentButtons .left-middle").classList.add("active"); break;
            case "cloth": document.querySelector("#charCloth").style.display = "flex"; document.querySelector("#charEquipmentButtons .right-middle").classList.add("active"); break;
            case "misc": document.querySelector("#charItems").style.display = "flex"; document.querySelector("#charEquipmentButtons .right").classList.add("active"); break;
        }
    }
}

function skillHandler (e) {
    let skill = e.target;
    skill.classList.toggle("active");
    // let checker = skill.lastChild.style.display;
    // if (checker == "none") skill.lastChild.style.display = "initial";
    // else skill.lastChild.style.display = "none";
}

function portraitSwitcher ( state ) {
    let isDisplayed = !document.querySelector("main").classList.contains("noPortrait");
    if (state != isDisplayed) document.querySelector("main").classList.toggle("noPortrait");
}

function imageEnlarger (e) {
    let image = document.querySelector("#imageHandler");
    if (imageState == 0) {
        image.style.display = "flex";
        imageState = 1;
    }
    else {
        image.style.display = "none";
        imageState = 0;
    }
}

window.addEventListener("load", (e) => {
    document.querySelector("#charIDSubmit").addEventListener("click", charGrabber);
    document.querySelector("#imageHandler").addEventListener("click", imageEnlarger);
    document.querySelector("#portrait").addEventListener("click", imageEnlarger);
    // Allow to preload characters with "load" GET parameter containing ID number
    let params = new URLSearchParams(document.location.search);
    if (params.size > 0) {
        let id = params.get("load");
        if (id != "" && id !== undefined && id!== null) {
            document.querySelector("#charID").value = id.trim();
            charGrabber();
        }
        history.pushState({"preloadID": id}, "", (document.location.href).split("?")[0]);
    }
    favlist = new Favlist();
    userPanel = new UserPanel();
    for (const button of favlist.navigation.children) {
        button.addEventListener("click", favlist.viewChange.bind(favlist))
    }
    favlist.favButton.addEventListener("click", favlist.addFavorite.bind(favlist));
    favlist.listUpdate();
    window.addEventListener("resize", favlist.calculateItemCountLimit.bind(favlist));
    document.addEventListener("loginAttempt", userPanel.login.bind(userPanel));
});