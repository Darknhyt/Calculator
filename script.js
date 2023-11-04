const num = document.getElementById("keys");
const disp = document.getElementById("screen");
const prev = document.getElementById("prev");
const oper = document.getElementById("oper");

let operation = false;  //To chain operations
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
            switch(e.key){
                case "Enter": eventKey(button.equal); break;
                case "/": eventKey(button.div); break;
                case "*": eventKey(button.prod); break;
                case "-": eventKey(button.rest); break;
                case "+": eventKey(button.sum); break;
                case "ArrowUp": eventKey(button.invert); break;
                case "ArrowDown": eventKey(button.invert); break;
                case "ArrowLeft": eventKey(button.simbol); break;
                case "ArrowRight": eventKey(button.simbol); break;
                case "Delete": eventKey(button.clear); break;
                case "Backspace": eventKey(button.delete); break;
                case ".": eventKey(button.point); break;
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
               eventKey(n);
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
         oper.style.color = "#FFF";
         setTimeout(()=> oper.style.color = "#0FF", 200);
         }
         calc.operator = o.textContent;
         calc.val2 = 0;
         display();
        });
    }
}

function eventKey(button){
    button.classList.add('active');
    button.dispatchEvent(new MouseEvent("click"));
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