const displayLength = document.querySelector("[data-lengthDisplay]");
const slider = document.querySelector("[data-lengthSlider]");

let passwordLength = 10;

function handleSlider(){
    slider.value = passwordLength;
    displayLength.textContent = passwordLength;

    let min = slider.min;
    let max = slider.max;
    slider.style.backgroundSize = (((passwordLength-min)*100)/(max-min)) + "% 100%";
}

handleSlider();

slider.addEventListener("input", () =>{
    passwordLength = slider.value;
    handleSlider();
});

const upperCaseCheckBox = document.querySelector('#uppercase');
const lowerCaseCheckBox = document.querySelector('#lowercase');
const numberCheckBox = document.querySelector('#number');
const symbolCheckBox = document.querySelector('#symbol');
const indicator = document.querySelector("[data-indicator]")

let checkCount = 1;
upperCaseCheckBox.checked = true;

function strengthIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`
}

strengthIndicator("#ccc");

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (upperCaseCheckBox.checked) {
        hasUpper = true;
    }
    if (lowerCaseCheckBox.checked) {
        hasLower  = true;
    }
    if (numberCheckBox.checked) {
        hasNum = true;
    }
    if (symbolCheckBox.checked) {
        hasSym = true;
    }

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8) {
        strengthIndicator("#0f0");
    } 
    else if ((hasUpper || hasLower) && (hasNum || hasSym) && passwordLength>=6) {
        strengthIndicator("#ff0");
    }
    else{
        strengthIndicator("#f00");
    }
}

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

function handleCheckbox(){
    checkCount = 0;
    allCheckBox.forEach( (checkboxx) => {
        if(checkboxx.checked) {
            checkCount++;
        }
    })

    // special condition
    if (passwordLength<checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    if (checkCount==0) {
        generatePassBtn.classList.add("not-allowed");
    }
    else {
        generatePassBtn.classList.remove("not-allowed");
    }
}


allCheckBox.forEach( (box) => {
    box.addEventListener("change",handleCheckbox)
})

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

function getRndInteger(min,max){
    return (Math.floor(Math.random()*(max-min))+min);
}

function getUppercase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function getLowercase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function getNumber(){
    return getRndInteger(0,9);
}
function getSymbol(){
    let i = getRndInteger(0,symbols.length);
    return symbols.charAt(i);
}

const generatePassBtn = document.querySelector(".generateButton");
const displayPassword = document.querySelector("[data-passwordDisplay]")
let password ="";

function shufflePassword(array){
    // Fisher Yates Method
    for (let i = 0; i < array.length; i++) {
        let j = getRndInteger(0,array.length);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str="";
    // for (let i = 0;i < array.length;i++) {
    //     str += array[i];
    // }

    // good and another generally used way
    array.forEach( (k) => {
        str += k;
    })
    return str;
}

// real work
generatePassBtn.addEventListener("click", () => {
    password ="";

    if (checkCount<= 0) {
        return;
    }

    // special condition
    if (passwordLength<checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    let funcArr=[];
    if(upperCaseCheckBox.checked){
        funcArr.push(getUppercase);
    }
    if(lowerCaseCheckBox.checked){
        funcArr.push(getLowercase);
    }
    if(numberCheckBox.checked){
        funcArr.push(getNumber);
    }
    if(symbolCheckBox.checked){
        funcArr.push(getSymbol);
    }

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();      
    }

    // for remaining values
    for (let i = 0; i < passwordLength-funcArr.length; i++) {
        let j = getRndInteger(0,funcArr.length);
        password += funcArr[j](); 
    }

    password = shufflePassword(Array.from(password));
    displayPassword.value = password;

    calcStrength();
})

const msgCopy = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]")

async function copyMessage() {
    try {
        await navigator.clipboard.writeText(password);
        msgCopy.textContent = "Copied";
    } catch (error) {
        msgCopy.textContent = "Failed";
    }

    msgCopy.classList.add("active");

    setTimeout( () => {
        msgCopy.classList.remove("active");
    },2000);
}

copyBtn.addEventListener("click" ,() => {
    if (password) {
        copyMessage();
    }
})