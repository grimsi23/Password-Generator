const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const lengthDisplay= document.querySelector("[data-lengthNumber]");
const lengthSlider = document.querySelector("[data-lengthSlider]");
const UppercaseCheck = document.querySelector("#uppercase");
const LowercaseCheck = document.querySelector("#lowercase");
const NumbersCheck = document.querySelector("#numbers");
const SymbolsCheck = document.querySelector("#symbols");
const Indicator = document.querySelector("[data-colorIndicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let password= " ";
let passwordLength= 10;
let checkCount= 0;
handleSlider() ;
//set indicator to grey
setIndicator("#ccc");

function handleSlider() {
    lengthSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = lengthSlider.min ;
    const max = lengthSlider.max ;
    lengthSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}

function setIndicator(color) {
    Indicator.style.backgroundColor = color;
    Indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

function getrandomInteger(min,max) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function getrandomNumber(){
    return getrandomInteger(0,9);
}
function getrandomUppercase(){
    return String.fromCharCode(getrandomInteger(65,91));
}
function getrandomLowercase(){
    return String.fromCharCode(getrandomInteger(97,123));
}
function getrandomSymbols(){
    const randNum = getrandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(UppercaseCheck.checked) hasUpper = true;
    if(LowercaseCheck.checked) hasLower = true;
    if(NumbersCheck.checked) hasNum = true;
    if(SymbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if( (hasUpper || hasLower) && (hasNum || hasSym) && passwordLength>= 6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);           
}

function shufflePassword(array){
    // Fisher-yates method
    for(let i= array.length-1;i>0;i--){
        //random J, find out using random function
        const j = Math.floor(Math.random() *(i+1));
        //swaping 
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str= "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckboxChange(){
    checkCount= 0;
    allCheckbox.forEach( (checkbox) => {
        if(checkbox.checked){ checkCount ++ }
    });

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckbox.forEach( (checkbox)=> {
    checkbox.addEventListener('change',handleCheckboxChange);
})

lengthSlider.addEventListener('input', (e)=> {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', ()=> {
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click', ()=> {
    if(checkCount == 0) 
        return;
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    let funcArr = [];

    if(UppercaseCheck.checked){
        funcArr.push(getrandomUppercase);
    }
    if(LowercaseCheck.checked) {
        funcArr.push(getrandomLowercase);
    }
    if(NumbersCheck.checked){
        funcArr.push(getrandomNumber);
    }
    if(SymbolsCheck.checked){
        funcArr.push(getrandomSymbols);
    }

    //compulsory addition
    for(let i=0; i<funcArr.length;i++){
        password += funcArr[i]();
    }

    //remanining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randomIndex = getrandomInteger(0,funcArr.length);
        password += funcArr[randomIndex]();
    }
    //shuffling the password
    password = shufflePassword(Array.from(password));
    //display the password to UI
    passwordDisplay.value = password;
    calcStrength();


})