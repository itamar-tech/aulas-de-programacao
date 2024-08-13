// Array que guarda os números e as ações (+, -, *, /) para processamento
let count = [];
// Variável que salva a última ação (operação) executada
let saveAction;
// Constante que define o número máximo de caracteres que podem ser exibidos no visor
const MAX_VISOR_CHAR = 10;

// Função chamada quando um número é adicionado ao visor
function AddNumber(num) {
    const totalElement = document.getElementById("total");
    // Exibe o visor se estiver oculto
    totalElement.removeAttribute("hidden");
    // Adiciona o número ao visor se o limite de caracteres não for excedido
    if (totalElement.innerHTML.length < MAX_VISOR_CHAR) {
        totalElement.innerHTML += num;
    }
}

// Função chamada quando uma ação (operação) é selecionada (+, -, *, /)
function CalcAction(action) {
    const currentNumber = document.getElementById("total").innerHTML;
    // Retorna se não houver número no visor
    if (currentNumber.length === 0) return;

    // Adiciona o número atual ao array 'count'
    count.push(Number(currentNumber));
    const accumulator = document.getElementById("accumulator");

    // Adiciona o número e a ação ao acumulador, garantindo que um ponto final seja tratado corretamente
    if (currentNumber.endsWith('.')) {
        accumulator.innerHTML += ` ${currentNumber}0 ${action}`;
    } else {
        accumulator.innerHTML += ` ${currentNumber} ${action}`;
    }

    // Limpa o visor para entrada do próximo número
    document.getElementById("total").innerHTML = "";
    // Adiciona a ação ao array 'count'
    count.push(action);
}

// Função para adicionar uma vírgula (ponto decimal) ao número atual no visor
function AddComma() {
    const currentNumber = document.getElementById("total").innerHTML;
    if (currentNumber === '') {
        // Se o visor estiver vazio, inicia com '0.'
        document.getElementById("total").innerHTML = "0.";
    } else if (!currentNumber.includes(".")) {
        // Se não houver vírgula, adiciona uma ao número
        document.getElementById("total").innerHTML += ".";
    }
}

// Função chamada quando o botão de resultado (=) é pressionado
function Result() {
    const accumulator = document.getElementById("accumulator");
    const total = document.getElementById("total");

    // Se o resultado anterior foi mostrado, repete a última ação com o número atual
    if (accumulator.innerHTML.endsWith("=") && total.innerHTML.length > 0) {
        total.innerHTML = ProcessAction(Number(total.innerHTML), Number(total.innerHTML), saveAction).toString().substring(0, MAX_VISOR_CHAR);
    }

    // Se não houver operações a serem processadas, retorna
    if (count.length === 0) return;

    // Adiciona o número atual ao array 'count' e processa o resultado final
    count.push(Number(total.innerHTML));
    accumulator.innerHTML += ` ${total.innerHTML} =`;
    ProccessResult();
}

// Função que processa o cálculo baseado nos valores e ações armazenados em 'count'
function ProccessResult() {
    let action = null;
    let current = null;
    let total = 0;

    // Remove qualquer ação final não necessária do array
    if (isNaN(count[count.length - 1])) {
        count.pop();
    }

    // Itera através de 'count' para calcular o total
    count.forEach(n => {
        if (!isNaN(n)) {
            // Se 'current' estiver vazio, armazena o número atual
            if (current === null) {
                current = n;
            } else {
                // Realiza a operação com o número atual e o acumulado
                total += ProcessAction(current, n, action);
                current = null;
            }
        } else {
            // Armazena a ação atual
            action = n;
            saveAction = n;
        }
    });

    // Se ainda houver um número pendente, processa a última operação
    if (current !== null) {
        total = ProcessAction(total, current, action);
    }

    // Exibe o total calculado no visor e reinicializa 'count'
    document.getElementById("total").innerHTML = total.toString().substring(0, MAX_VISOR_CHAR);
    count = [];
}

// Função que realiza a operação matemática baseada na ação selecionada
function ProcessAction(num1, num2, action) {
    switch (action) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case 'x': return num1 * num2;
        case '/': return num1 / num2;
    }
}

// Função que limpa apenas a entrada atual no visor
function CleanCurrentEntry() {
    document.getElementById("total").innerHTML = "";
}

// Função que limpa toda a calculadora, incluindo o acumulador e o visor
function CleanAll() {
    document.getElementById("total").innerHTML = "";
    document.getElementById("accumulator").innerHTML = "";
    count = [];
}

// Função que calcula a porcentagem do número atual no visor
function Percentage() {
    const total = document.getElementById("total");
    if (total.innerHTML !== "") {
        total.innerHTML = (Number(total.innerHTML) / 100).toString().substring(0, MAX_VISOR_CHAR);
    }
}

// Função que alterna o tema da calculadora entre claro e escuro
function toggleTheme() {
    document.body.classList.toggle("dark-theme");
}
