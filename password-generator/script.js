const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");
const strengthBar = document.querySelector(".strength-bar");
const strengthText = document.querySelector(".strength-container p");
const strengthLabel = document.getElementById("strength-label")

// Character sets
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{};:,.<>";

lengthSlider.addEventListener("input",() => {
    lengthDisplay.textContent = lengthSlider.value;
});

generateButton.addEventListener("click",generatePassword);

function generatePassword() {
    const length = Number(lengthSlider.value)
    
    const includeUppercase = uppercaseCheckbox.checked;
    const includeLowercase = lowercaseCheckbox.checked;
    const includeNumbers = numbersCheckbox.checked;
    const includeSymbols = symbolsCheckbox.checked;

    if(!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        alert("You need to select at least one value to generate a password!");
        return;
    }

    const newPassword = createRandomPassword(
        length,
        includeLowercase,
        includeUppercase,
        includeNumbers,
        includeSymbols
    )

    passwordInput.value = newPassword;
    updatePasswordStrength(newPassword)
}

function createRandomPassword(length, includeLowercase, includeUppercase, includeNumbers, includeSymbols) {

    let allCharacters = ""

    if(includeLowercase) allCharacters += lowercaseLetters
    if(includeUppercase) allCharacters += uppercaseLetters
    if(includeNumbers) allCharacters += numberCharacters
    if(includeSymbols) allCharacters += symbolCharacters
    
    let password = "";

    for(i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * allCharacters.length);
        password += allCharacters[randomIndex]
    }

    return password;
}

function updatePasswordStrength(password) {
    const passwordLength = password.length
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumbers = /[0-9]/.test(password)
    const hasSymbols = /[!@#$%^&*()-_=+[\]{};:,.<>]/.test(password)

    let strengthScore = 0;
    strengthScore = Math.min(passwordLength * 2, 40);

    if(hasUppercase) strengthScore += 15;
    if(hasLowercase) strengthScore += 15;
    if(hasNumbers) strengthScore += 15;
    if(hasSymbols) strengthScore += 15;

    // THis ensures that any small password has a low score, no matter what
    if(passwordLength < 8) {
        strengthScore = Math.min(strengthScore, 40)
    }

    // This ensures that if the score exceeds 100, it would return 100, else the latter score. 
    const safeScore = Math.max(5, Math.min(100,strengthScore))
    strengthBar.style.width = safeScore + "%";

    let strengthLabelText = "";
    let barColor = "";

    if(strengthScore < 40) {
        barColor = "#ea5454ff";
        strengthLabelText = "Weak";
    } else if (strengthScore < 70) {
        barColor = "#ffb061ff";
        strengthLabelText = "Medium";
    } else {
        barColor = "#35a962ff";
        strengthLabelText = "Strong";
    }

    strengthBar.style.backgroundColor = barColor;
    strengthLabel.textContent = strengthLabelText;
    // strengthLabel.style.color = barColor;
}

copyButton.addEventListener("click",() => {
    if(!passwordInput.value) return

    navigator.clipboard.writeText(passwordInput.value)
    .then(() => showCopySuccess())
    .catch((error) => console.log("could not copy password"));
})

function showCopySuccess() {
    copyButton.classList.remove("far","fa-copy");
    copyButton.classList.add("fas","fa-check");
    copyButton.style.color = "#444"

    setTimeout(() => {
        copyButton.classList.remove("fas","fa-check");
        copyButton.classList.add("far","fa-copy");
        copyButton.style.color = "#5e6e5e"
    },1500);
}

window.addEventListener("DOMContentLoaded",generatePassword)

