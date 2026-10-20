const display = document.getElementById("display");
const previousOperand = document.getElementById("previousOperand");

let currentInput = "0";
let previousInput = null;
let operator = null;
let shouldResetDisplay = false;
let expressionText = "";

// Update calculator display
function updateDisplay() {
    display.value = currentInput;
    previousOperand.textContent = expressionText;
}

// Add a number
function enterNumber(number) {
    if (currentInput === "Error") {
        currentInput = "0";
        expressionText = "";
    }

    if (shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else if (currentInput === "0") {
        currentInput = number;
    } else if (currentInput.length < 15) {
        currentInput += number;
    }

    updateDisplay();
}

// Add decimal point
function enterDecimal() {
    if (currentInput === "Error") {
        currentInput = "0";
    }

    if (shouldResetDisplay) {
        currentInput = "0";
        shouldResetDisplay = false;
    }

    if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

// Choose arithmetic operator
function chooseOperator(nextOperator) {
    if (currentInput === "Error") return;

    if (operator && !shouldResetDisplay) {
        calculate();
    }

    previousInput = Number(currentInput);
    operator = nextOperator;

    expressionText = `${currentInput} ${getSymbol(operator)}`;
    shouldResetDisplay = true;

    updateDisplay();
}

// Display operator symbol
function getSymbol(op) {
    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[op] || op;
}

// Calculate result
function calculate() {
    if (operator === null || previousInput === null) {
        return;
    }

    const firstNumber = previousInput;
    const secondNumber = Number(currentInput);
    let result;

    switch (operator) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                currentInput = "Error";
                expressionText = "Cannot divide by zero";
                previousInput = null;
                operator = null;
                shouldResetDisplay = true;
                updateDisplay();
                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }

    expressionText = `${firstNumber} ${getSymbol(operator)} ${secondNumber} =`;

    if (!Number.isFinite(result)) {
        currentInput = "Error";
    } else {
        currentInput = String(Number(result.toPrecision(12)));
    }

    previousInput = null;
    operator = null;
    shouldResetDisplay = true;

    updateDisplay();
}

// Clear everything
function clearCalculator() {
    currentInput = "0";
    previousInput = null;
    operator = null;
    shouldResetDisplay = false;
    expressionText = "";

    updateDisplay();
}

// Delete last digit
function deleteDigit() {
    if (shouldResetDisplay || currentInput === "Error") {
        currentInput = "0";
        shouldResetDisplay = false;
    } else if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);

        if (currentInput === "-") {
            currentInput = "0";
        }
    } else {
        currentInput = "0";
    }

    updateDisplay();
}

// Percentage
function calculatePercentage() {
    if (currentInput === "Error") return;

    currentInput = String(Number(currentInput) / 100);
    shouldResetDisplay = false;

    updateDisplay();
}

// Change positive to negative and negative to positive
function changeSign() {
    if (currentInput === "Error" || Number(currentInput) === 0) {
        return;
    }

    currentInput = String(Number(currentInput) * -1);

    updateDisplay();
}

// Handle button clicks
document.querySelector(".buttons").addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) return;

    if (button.dataset.number !== undefined) {
        enterNumber(button.dataset.number);
        return;
    }

    if (button.dataset.operator) {
        chooseOperator(button.dataset.operator);
        return;
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;

        case "delete":
            deleteDigit();
            break;

        case "decimal":
            enterDecimal();
            break;

        case "percent":
            calculatePercentage();
            break;

        case "sign":
            changeSign();
            break;

        case "equals":
            calculate();
            break;
    }
});

// Keyboard support
document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (/^[0-9]$/.test(key)) {
        enterNumber(key);
    } else if (key === ".") {
        enterDecimal();
    } else if (["+", "-", "*", "/"].includes(key)) {
        chooseOperator(key);
    } else if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    } else if (key === "Backspace") {
        deleteDigit();
    } else if (key === "Escape") {
        clearCalculator();
    } else if (key === "%") {
        calculatePercentage();
    }
});

// Initial display
updateDisplay();