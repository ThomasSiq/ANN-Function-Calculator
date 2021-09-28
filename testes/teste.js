
let hidden = new Array;
let saida = {
    Pesos: new Array,
    output: 0,
    bias: 1,
    erro: 10
};
let NumeroPesos = 3
let NumeroData = 6

let Data = [
    [1, 10], [5,30],[3, 20], [2, 15], [4, 25],[6,35]
]
let = exPeso = [
    [4, 5], [8, 5], [5, 7],[4,6],[4,5]
]
for (let i = 0; i < NumeroPesos; i++) {
    hidden[i] = new Object
    hidden[i].Pesos = exPeso[i][0]
    hidden[i].bias = 1;
    saida.Pesos[i] = exPeso[i][1]
}

////////////////////////////FUNCOES////////////////////////////////////////////////

let sigmoid = function (x) {   // função para aplicar a função de ativação sigmoid  numero de euler = 2,718281
    return (1 / (1 + (Math.pow(2.718281, ((-1) * x)))))
}
function derivada(x) {
    return x * (1 - x)
}

////////////////////////////CONSTANTES E VALORES INICIAIS////////////////////////////////////
var contador = 0;
let deltaPesosHid = 0;
let deltaPesosHidBias = 0
let deltaPesosOutBias = 0
let deltaPesosOut = 0
while (contador < 1800) {

    for (let a = 0; a < NumeroData; a++) {
        let x = Data[a][0]
        let y = Data[a][1]
        let n = 0.02;
        let alfa = 0;

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

            hidden[i].Pesos += ((n * hidden[i].erro * x) + deltaPesosHid * alfa)
            deltaPesosHid = (n * hidden[i].erro * x)
            hidden[i].bias += ((n * hidden[i].erro) + deltaPesosHidBias * alfa)
            deltaPesosHidBias = (n * hidden[i].erro)

        }
        for (let i = 0; i < NumeroPesos; i++) {

            saida.Pesos[i] += ((n * saida.erro * hidden[i].output) + deltaPesosOut * alfa)
            deltaPesosOut = (n * saida.erro * hidden[i].output)
        }
        saida.bias += ((n * saida.erro) + deltaPesosOutBias * alfa)
        deltaPesosOutBias = (n * saida.erro);
        console.log(">>>>>>ciclo", contador, saida.erro)


    }
    contador++


}
for (let i = 0; i < NumeroPesos; i++) {
    console.log(hidden[i].Pesos)
    console.log(saida.Pesos[i])
}
