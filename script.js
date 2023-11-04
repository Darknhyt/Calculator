const num = document.getElementById("keys");
const disp = document.getElementById("screen");
const prev = document.getElementById("prev");
const oper = document.getElementById("oper");

let operation = false;
const calc = {
    val1: "",
    val2: 0,
    operator: "",
    last: 0,
    error: "No values",
}

init();
function init(){
    display();
    addEvents();
}

function addEvents(){
    num.children[0].addEventListener("click",()=>{
        calc.val1 = calc.val2;
        calc.val2 = calc.last;
        calc.last = calc.val1;
        if (calc.operator =="="){
            calc.operator = "⇅";
        }
        display();
    })
    num.children[1].addEventListener("click",()=>{
        if (!disp.value.startsWith("-")){
            if (!disp.value.startsWith("0.")){
                disp.value = disp.value.replace(/^0+/, "");
            }
            disp.value = "-" + disp.value;
        } else {
            disp.value = disp.value.slice(1);
        }
    })
    num.children[2].addEventListener("click",()=>{
        reset();
        display();
    })
    num.children[3].addEventListener("click",()=>{
        disp.value = disp.value.slice(0,-1);
    })
    for (const w of num.getElementsByClassName("operator")) {
        w.addEventListener("click", ()=>{
         let number = disp.value;
         if (operation == false){
             calc.val1 = number;
             calc.last = number;
             calc.error = false;
             operation = true;
         }else{
         calc.val1 = operate();
         }
         calc.operator = w.textContent;
         calc.val2 = 0;
         display();
        })
     }
     disp.addEventListener("input",()=>{    
         if (!disp.value.startsWith("0.")){
             disp.value = disp.value.replace(/^0+/, "");
         }
     })
     for (const n of num.getElementsByClassName("num")){
         n.addEventListener("click",()=>{
             if (!disp.value.startsWith("0.")){
                 disp.value = disp.value.replace(/^0+/, "");
             }
             disp.value += n.textContent;
             calc.val2 = disp.value;
             calc.error = false;
         })
     }
     document.getElementById("result").addEventListener("click", ()=>{        
         if(calc.operator != "=" && getResult()){ 
             calc.operator = "=";
             operation = false;
             display();
         }  
     })
    document.getElementById("point").addEventListener("click", ()=>{
        if(!disp.value.includes(".")){ 
            disp.value = disp.value + ".";
        }
    })
}

function getResult(){
    try {
        let r = operate();
        if(!calc.error){
            calc.val1 = calc.val1 + calc.operator + calc.val2;
            calc.last = calc.val2;
            calc.val2 = r;
            disp.style.borderColor = "#FFF";
            setTimeout(()=> disp.style.borderColor = "#0FF", 200);
            return true;
        }else{
            calError(calc.error);
            return false
        }
    } catch (error) { 
        console.log(error);
        calError("ERROR");
    } 
}

function operate(){
    let result = 0;
    switch(calc.operator){
        case "+": result = calSum(); break;
        case "-": result = calRest(); break;
        case "x": result = calProd(); break;
        case "÷": result = calDiv(); break;
        case "=": calc.error = "Invalid Operation"; break;
        default : calError();
    }
    return result;
}

function calSum(){
    return Number.parseFloat(calc.val1) + Number.parseFloat(calc.val2);
}

function calRest(){
    return calc.val1 - calc.val2;
}

function calProd(){
    return calc.val1 * calc.val2;
}

function calDiv(){
    if (calc.val2 != 0){
        return calc.val1 / calc.val2;
    }else{
        calc.error = "Divisor ≠ 0";
        return calc.val1;
    }
}

function calError(msj = "ERROR"){
    oper.textContent = "!";
    prev.value = msj;
    oper.style.color = "#E00"
    prev.style.color = "#E00";
    disp.style.borderColor = "#E44";
    setTimeout(()=> {
        disp.style.borderColor = "#0FF";
        oper.style.color = "#0FF"
        prev.style.color = "#CCC";
        display();
    }, 2000);
}

function display() {
    oper.textContent = calc.operator;
    prev.value = calc.val1;
    disp.value = calc.val2;
}

function reset(){
    calc.val1 = "";
    calc.val2 = 0;
    calc.operator = "";
    point = false;
    last = 0;
    error = false;
    display();
}