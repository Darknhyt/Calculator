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
    error: false,
}

init();
function init(){
    display();
    eventOperator();
    eventNumber();
    eventControls();
}

function eventControls(){
    const button = {
        invert: document.getElementById("ans"),
        simbol: document.getElementById("neg"),
        clear: document.getElementById("clear"),
        delete: document.getElementById("del"),
        point: document.getElementById("point"),
        equal: document.getElementById("result"),
        div: document.getElementById("div"),
        prod: document.getElementById("prod"),
        rest: document.getElementById("rest"),
        sum: document.getElementById("sum"),
    }
    button.invert.addEventListener("click",(e)=>{
        calc.val1 = calc.val2;
        calc.val2 = calc.last;
        calc.last = calc.val1;
        e.target.blur();
        if (calc.operator =="="){
            calc.operator = "⇅";
        }
        display();
    })
    button.simbol.addEventListener("click",(e)=>{
        e.target.blur();
        if (!disp.value.startsWith("-")){
            if (!disp.value.startsWith("0.")){
                disp.value = disp.value.replace(/^0+/, "");
            }
            disp.value = "-" + disp.value;
        } else {
            disp.value = disp.value.slice(1);
        }
    })
    button.clear.addEventListener("click",(e)=>{
        operation = false;
        e.target.blur();
        reset();
        display();
    })
    button.delete.addEventListener("click",(e)=>{
        e.target.blur();
        disp.value = disp.value.slice(0,-1);
    })
     
     button.point.addEventListener("click", (e)=>{
        e.target.blur();
        if(!disp.value.includes(".")){ 
            disp.value = disp.value + ".";
        }
     })
     button.equal.addEventListener("click", (e)=>{
        e.target.blur();      
        if(calc.operator != ""){
             if(getResult()){ 
                  calc.operator = "=";
                  operation = false;
                  display();
              } else {
                 calError();
              }
        }else{
            calError("Need Operator");
        }})
        document.addEventListener("keydown", (e)=>{
            e.preventDefault;
            console.log(e.key);
            switch(e.key){
                case "Enter": button.equal.dispatchEvent(new MouseEvent("click")); break;
                case "/": button.div.dispatchEvent(new MouseEvent("click")); break;
                case "*": button.prod.dispatchEvent(new MouseEvent("click")); break;
                case "-": button.rest.dispatchEvent(new MouseEvent("click")); break;
                case "+": button.sum.dispatchEvent(new MouseEvent("click")); break;
                case "ArrowUp": button.invert.dispatchEvent(new MouseEvent("click")); break;
                case "ArrowDown": button.invert.dispatchEvent(new MouseEvent("click")); break;
                case "ArrowLeft": button.simbol.dispatchEvent(new MouseEvent("click")); break;
                case "ArrowRight": button.simbol.dispatchEvent(new MouseEvent("click")); break;
                case "Delete": button.clear.dispatchEvent(new MouseEvent("click")); break;
                case "Backspace": button.delete.dispatchEvent(new MouseEvent("click")); break;
                case ".": button.point.dispatchEvent(new MouseEvent("click")); break;
            }
        });
}

function eventNumber(){
    for (const n of num.getElementsByClassName("num")){
        n.addEventListener("click",(e)=>{
            e.target.blur();
            if (!disp.value.startsWith("0.")){
                disp.value = disp.value.replace(/^0+/, "");
            }
            disp.value += n.textContent;
            calc.val2 = disp.value;
            calc.error = false;
        })
        document.addEventListener("keydown",(e)=>{
           e.preventDefault();
           if(e.key == n.textContent){
               n.dispatchEvent(new MouseEvent("click"));
           }
        })
    }
}

function eventOperator(){
    for (const o of num.getElementsByClassName("operator")) {
        o.addEventListener("click", (e)=>{
        let number = disp.value;
        e.target.blur();
        if (operation == false){
             calc.val1 = number;
             calc.last = number;
             calc.error = false;
             operation = true;
         }else{
         calc.val1 = operate();
         }
         calc.operator = o.textContent;
         calc.val2 = 0;
         display();
        });
    }
}

function getResult(){
    try {
        let result = operate();
        if(!calc.error){
            calc.val1 = calc.val1 + calc.operator + calc.val2;
            calc.last = calc.val2;
            calc.val2 = result;
            disp.style.borderColor = "#FFF";
            setTimeout(()=> disp.style.borderColor = "#0FF", 200);
            return true;
        }else{
            calError(calc.error);
        }
    } catch (error) { 
        calError();
        console.log(error);
        return false
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
    disp.style.borderColor = "#E44";
    oper.style.color = "#E00"
    prev.style.color = "#E00";
    setTimeout(()=> {
        disp.style.borderColor = "#0FF";
        oper.style.color = "#0FF"
        prev.style.color = "#DDD";
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
    last = 0;
    error = false;
    display();
}