let charList = []
let currentChar = 0
let maxChar = 0
const prevButton = document.getElementById("navPrev")
const navText = document.getElementById("navName")
const nextButton = document.getElementById("navNext")
function grabChar (name) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let character = this.responseText
            character = character.slice(0, -1) // For some stupid reason my php keeps adding 1 to end of string
            character = JSON.parse(character)
            //document.getElementById("charName").innerText = (character.name+" "+character.surname)
            document.querySelector("#charDesc > #innerDesc").innerText = character.visage.txt
            document.getElementById("charAge").innerText = character.age+" letni "+character.race
            document.getElementById("charHeight").innerText = character.height+" cm"
            let sex = (character.sex=="female" ? "♀" : "♂") // Quick and short sex interpretation
            document.getElementById("charSex").innerText = sex
            document.getElementById("charBelief").innerText = character.belief
            document.getElementById("charStory").innerText = character.backstory
            if(character.visage.type=="img") {
                document.getElementById("portrait").innerHTML = '<img src="'+character.visage.content+'" alt="Portret postaci">'
            }
            else if (character.visage.type=="txt") {
                document.getElementById("portrait").innerText = character.visage.content
            }
            itemRepeater(character.equipment)
            skillRepeater(character.skillset)
            document.getElementById("navName").innerText=charList[currentChar];
        }
    };
    xhttp.open("GET", "/Characters/server?q=char_"+name, true);
    xhttp.send()
}

function initiate () {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let list = this.responseText
            let i=0
            list = JSON.parse(list)
            for (character in list) {
                charList[i++]=list[character]
            }
            maxChar = --i
        }
    };
    xhttp.open("GET", "/Characters/server?q=all", false);
    xhttp.send()
}

function itemRepeater (obj) { // Because going with every category with for loop is a pain
    let weap = document.getElementById("charWeap"),
     cloth = document.getElementById("charArmor"),
      armor = document.getElementById("charCloth"),
       other = document.getElementById("charItems");
    weap.innerHTML = "";
    cloth.innerHTML = "";
    armor.innerHTML = "";
    other.innerHTML = "";
    for (category in obj) {
        let  i=-1
        while (obj[category][++i]!==undefined)
        {
            let newItem = document.createElement("p");
            newItem.innerText = obj[category][i];
            switch (category) {
                case "weapons":  weap.appendChild(newItem); break;
                case "clothing": cloth.appendChild(newItem); break;
                case "armor": armor.appendChild(newItem); break;
                case "other": other.appendChild(newItem); break;
            }
        } 
    }
}

function skillRepeater (obj) {
    let skillset = [], i=0
    for (skill in obj) {
        if (obj[skill]!==undefined) skillset[i++] = "<div class='skillItem' onclick='skillHandler(this)'><h3>"+obj[skill].name+"</h3> <h4>"+obj[skill].level+"</h4>\n<p style='display: none;'>"+obj[skill].description+"</p></div>"
        else break
    }
    document.getElementById("charSkills").innerHTML = ""
    for (n=0;n<i;n++) {
        document.getElementById("charSkills").innerHTML += skillset[n]
    }

}

function charChange(direction) {
    if (direction == "next") {
        if (++currentChar>maxChar) currentChar=0
    }
    else if (direction == "prev") {
        if (--currentChar<0) currentChar=maxChar
    }
    grabChar(charList[currentChar].replace(" ", "_"))
    //document.querySelector(':root').style.setProperty("--gradientBase", "lightblue")
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

function skillHandler (skill) {
    console.log(skill.style.display);
    let checker = skill.lastChild.style.display;
    if (checker == "none") skill.lastChild.style.display = "initial";
    else skill.lastChild.style.display = "none";
}

window.onload = function () {
    initiate()
    grabChar(charList[currentChar].replace(" ", "_"))
}