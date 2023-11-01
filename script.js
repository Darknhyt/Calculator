const num = document.getElementById("keys");
const disp = document.getElementById("screen");
const buttons = "()+789-456*123/0.";

init();
function init(){
    for (const w of buttons) {
        addButton(w);
    }
    let e = document.createElement("button");
    e.textContent = "=";
    e.addEventListener("click",()=>{
        getResult();
    })
    num.appendChild(e);
}

addEvents()
function addButton(w){
    let n = document.createElement("button");
    n.textContent = w;
    n.addEventListener("click",()=>{
        disp.value += w;
    })
    num.appendChild(n);
}

function addEvents(){
    num.children[0].addEventListener("click",()=>{
        disp.value = "";
    })
    num.children[1].addEventListener("click",()=>{
        disp.value = disp.value.slice(0,-1);
    })
}

function getResult(){
    try {
        let res = eval(disp.value); //Temporal code
        disp.value = res;
        disp.style.borderColor = "#FFF";
        setTimeout(()=> disp.style.borderColor = "#0FF", 200);
    } catch (error) { 
        disp.style.borderColor = "#b44";
        setTimeout(()=> disp.style.borderColor = "#0FF", 400);
    } 
}