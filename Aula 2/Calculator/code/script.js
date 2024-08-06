let count = [];
let saveAction;
const MAX_VISOR_CHAR = 10;

function AddNumber(num) {
    const totalElement = document.getElementById("total");
    totalElement.removeAttribute("hidden");
    if (totalElement.innerHTML.length < MAX_VISOR_CHAR) {
        totalElement.innerHTML += num;
    }
}

function CalcAction(action) {
    const currentNumber = document.getElementById("total").innerHTML;
    if (currentNumber.length === 0) return;

    count.push(Number(currentNumber));
    const accumulator = document.getElementById("accumulator");

    if (currentNumber.endsWith('.')) {
        accumulator.innerHTML += ` ${currentNumber}0 ${action}`;
    } else {
        accumulator.innerHTML += ` ${currentNumber} ${action}`;
    }

    document.getElementById("total").innerHTML = "";
    count.push(action);
}

function AddComma() {
    const currentNumber = document.getElementById("total").innerHTML;
    if (currentNumber === '') {
        document.getElementById("total").innerHTML = "0.";
    } else if (!currentNumber.includes(".")) {
        document.getElementById("total").innerHTML += ".";
    }
}

function Result() {
    const accumulator = document.getElementById("accumulator");
    const total = document.getElementById("total");

    if (accumulator.innerHTML.endsWith("=") && total.innerHTML.length > 0) {
        total.innerHTML = ProcessAction(Number(total.innerHTML), Number(total.innerHTML), saveAction).toString().substring(0, MAX_VISOR_CHAR);
    }

    if (count.length === 0) return;

    count.push(Number(total.innerHTML));
    accumulator.innerHTML += ` ${total.innerHTML} =`;
    ProccessResult();
}

function ProccessResult() {
    let action = null;
    let current = null;
    let total = 0;

    if (isNaN(count[count.length - 1])) {
        count.pop();
    }

    count.forEach(n => {
        if (!isNaN(n)) {
            if (current === null) {
                current = n;
            } else {
                total += ProcessAction(current, n, action);
                current = null;
            }
        } else {
            action = n;
            saveAction = n;
        }
    });

    if (current !== null) {
        total = ProcessAction(total, current, action);
    }

    document.getElementById("total").innerHTML = total.toString().substring(0, MAX_VISOR_CHAR);
    count = [];
}

function ProcessAction(num1, num2, action) {
    switch (action) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case 'x': return num1 * num2;
        case '/': return num1 / num2;
    }
}

function CleanCurrentEntry() {
    document.getElementById("total").innerHTML = "";
}

function CleanAll() {
    document.getElementById("total").innerHTML = "";
    document.getElementById("accumulator").innerHTML = "";
    count = [];
}

function Percentage() {
    const total = document.getElementById("total");
    if (total.innerHTML !== "") {
        total.innerHTML = (Number(total.innerHTML) / 100).toString().substring(0, MAX_VISOR_CHAR);
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-theme");
}
