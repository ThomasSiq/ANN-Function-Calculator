
document.querySelector("#start").addEventListener("click", Propagation)

function Propagation() {
    if (document.querySelector("#SelecionarTipo").value === "TREINAMENTO") {
        BackPropagation()
    }
    else if (document.querySelector("#SelecionarTipo").value === "CÁLCULO") {
        ForwardPropagation()
    }
    else {
        alert("Selecione um método")
    }
}


function ForwardPropagation() {
    PesosOculta = document.getElementsByClassName("pesoHidden");
    PesosSaida = document.getElementsByClassName("pesoOutput");
    entrada = Number(document.querySelector('#inputValor').value);


    let hidden = new Array;
    let saida = {
        Pesos: new Array,
        output: 0,
        bias: 0,
        erro: 10
    };
    for (let i = 0; i < NumeroPesos; i++) {
        hidden[i] = new Object
        hidden[i].Pesos = exPeso[0][i]
        console.log(hidden[i].Pesos)
        hidden[i].bias = 1;
        saida.Pesos[i] = exPeso[1][i]
    }

    ////////////////////////////FUNCOES////////////////////////////////////////////////

    let sigmoid = function (x) {   // função para aplicar a função de ativação sigmoid  numero de euler = 2,718281
        return (1 / (1 + (Math.pow(2.718281, ((-1) * x)))))
    }

    ////////////////////////////CONSTANTES E VALORES INICIAIS////////////////////////////////////

    /////////FORWARD PROPAGATION//////////////////////////////
    for (let i = 0; i < NumeroPesos; i++) {

        hidden[i].output = sigmoid((hidden[i].Pesos * entrada) + hidden[i].bias)
    }

    //////OUTSIDE NEURON/////////////
    saida.output = 0;
    for (let i = 0; i < NumeroPesos; i++) {
        saida.output += (saida.Pesos[i] * hidden[i].output)
    }
    saida.output += saida.bias
    document.querySelector("#resultsBox").innerHTML = saida.output
}


function BackPropagation() {
    let PesosOculta = document.getElementsByClassName("pesoHidden");
    let PesosSaida = document.getElementsByClassName("pesoOutput");

    let Data = trainingData
    let hidden = new Array;
    let saida = {
        Pesos: new Array,
        output: 0,
        bias: 1,
        erro: 10
    };
    for (let i = 0; i < NumeroPesos; i++) {
        hidden[i] = new Object
        hidden[i].Pesos = exPeso[0][i]
        hidden[i].bias = 1;
        saida.Pesos[i] = exPeso[1][i]
    }

    ////////////////////////////FUNCOES////////////////////////////////////////////////

    let sigmoid = function (x) {   // função para aplicar a função de ativação sigmoid  numero de euler = 2,718281
        return (1 / (1 + (Math.pow(2.718281, ((-1) * x)))))
    }
    function derivada(x) {
        return x * (1 - x)
    }

    ////////////////////////////CONSTANTES E VALORES INICIAIS////////////////////////////////////
    var cont = 0;
    var contador = 0;
    while (contador < 1800) {

        for (let a = 0; a < NumeroData; a++) {
            let x = Data[a][0]
            let y = Data[a][1]
            let n = 0.02;

            /////////FORWARD PROPAGATION//////////////////////////////
            for (let i = 0; i < NumeroPesos; i++) {
                hidden[i].output = sigmoid((hidden[i].Pesos * x) + hidden[i].bias)

            }

            //////OUTSIDE NEURON/////////////

            saida.output = 0;
            for (let i = 0; i < NumeroPesos; i++) {
                saida.output += (saida.Pesos[i] * hidden[i].output)
            }
            saida.output += saida.bias
            console.log(saida.output)
            //////////BACKWARD PROPAGATION///////////
            saida.erro = (y - saida.output);

            for (let i = 0; i < NumeroPesos; i++) {
                hidden[i].erro = (derivada(hidden[i].output) * (saida.erro * saida.Pesos[i]))
            }
            for (let i = 0; i < NumeroPesos; i++) {
                hidden[i].Pesos += (n * hidden[i].erro * x)
                hidden[i].bias += (n * hidden[i].erro)

            }
            for (let i = 0; i < NumeroPesos; i++) {

                saida.Pesos[i] += (n * saida.erro * hidden[i].output)
            }

            saida.bias += (n * saida.erro)
            //console.log(">>>>>>ciclo", saida.erro)

            for (let i = 0; i < NumeroPesos; i++) {
                console.log(">>>>>oculta",hidden[i].Pesos)
                console.log(">>>>>saida",saida.Pesos[i])
            }
            
        }
        cont++
        contador++
        if (cont > 10) {
            document.getElementById("resultsBox").innerHTML = saida.erro;
            cont = 0;
        }

    }

    for (let i = 0; i < NumeroPesos; i++) {
        exPeso[0][i] = hidden[i].Pesos
        exPeso[1][i] = saida.Pesos[i]
        PesosOculta[i].value = exPeso[0][i]
        PesosSaida[i].value = exPeso[1][i]
    }
}
