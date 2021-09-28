const ipc = require('electron').ipcRenderer;
var Chart = require('chart.js');

////////////////////CRIAR NEURONIOS//////////////

let button = document.getElementById("myButton")
button.addEventListener("click", () => {
    let Neuronios = Number(document.getElementById("NumeroNeuronios").value);
    let inputs = document.getElementById("AdicionaPesos")
    document.getElementById("AleatorioButton").style.display = "block"

    inputs.innerHTML = " ";
    for (let i = 1; i <= Neuronios; i++) {
        inputs.insertAdjacentHTML("beforeEnd", '<li><form><label for ="pesoHidden">P ' + i + '</label><input class="pesoHidden" type="number" value="1" id="Peso' + i + '" placeholder="Hid (W)"><input class="biasHidden" type="number" value="1" id="Peso' + i + '" placeholder="Bias (W)"><input class="pesoOutput" type="number" value="1" id="Peso' + i + '" placeholder="Out (W)"></form></li>')
        if (i === (Neuronios)) {
            inputs.insertAdjacentHTML("beforeEnd", '<li><form><label for ="biasSaida">Bias Saida</label><input class="biasSaida" type="number" value="1" id="Peso' + i + '" placeholder="BiasHid (W)"></form></li>')
        }
    }
});
document.getElementById("NumeroNeuronios").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        button.click();
    }
});

/////////////////////SELECIONAR MODO////////////////////////

let SelecionarTipo = document.getElementById("SelecionarTipo");
let SelectionBox = document.getElementById("SelectionBox");

SelecionarTipo.addEventListener("click", () => {
    if (SelectionBox.style.display === "none") {
        SelectionBox.style.display = "block"
    }
    else if (SelectionBox.style.display === "block") {
        SelectionBox.style.display = "none"
    }
    else {
        SelectionBox.style.display = "block"
    }
});
document.getElementById("SelecionarTipoTraining").addEventListener("click", () => {
    SelecionarTipo.value = "TREINAMENTO"
    SelectionBox.style.display = "none"
    document.getElementById("setTraining").style.display = "block"
    document.getElementById("calculo").style.display = "none"
});
document.getElementById("SelecionarTipoCalc").addEventListener("click", () => {
    SelecionarTipo.value = "CÁLCULO"
    SelectionBox.style.display = "none"
    document.getElementById("calculo").style.display = "block"
    document.getElementById("setTraining").style.display = "none"
});

///////////////////////////////////IMPORTAR PESOS/////////////////

let DataButton = document.getElementById("myButtonImportar")
DataButton.addEventListener("click", () => {
    ipc.send('OpenFile');
    ipc.on('DataFile', (event, arg) => {
        let inputs = document.getElementById("AdicionaPesos")
        inputs.innerHTML = " ";
        for (let i = 1; i <= arg.length; i++) {
            inputs.insertAdjacentHTML("beforeEnd", '<li><form><label for ="pesoHidden">P ' + i + '</label><input class="pesoHidden" type="number" value="' + arg[i - 1][0] + '" id="Peso' + i + '" placeholder="Peso (W)"><input class="biasHidden" type="number" value="' + arg[i - 1][1] + '" id="Peso' + i + '" placeholder="Bias (W)"><input class="pesoOutput" type="number" value="' + arg[i - 1][2] + '" id="Peso' + i + '" placeholder="Peso (W)"></form></li>')

            if (i === (arg.length)) {
                inputs.insertAdjacentHTML("beforeEnd", '<li><form><label for ="biasSauda">Bias Saida</label><input class="biasSaida" type="number" value="' + arg[0][3] + '" id="Peso' + i + '" placeholder="BiasHid (W)"></form></li>')
            }
        }
    })
});

///////////////////INPORTAR DATA////////////////////////////

document.getElementById("DataColector").addEventListener("click", () => {
    ipc.send('DataTraining');
    ipc.on('DataTrainingFile', (event, arg) => {
        let training = document.getElementById("DataTraining")
        training.innerHTML = " ";
        for (let i = 0; i < arg.length; i++) {
            training.insertAdjacentHTML("beforeEnd", '<li><form><label for ="InputTraining">Entrada ' + i + '</label><input class="InputTraining" type="number" value="' + arg[i][0] + '" id="Peso' + i + '" placeholder="Peso (W)">   <label for ="OutputTraining">Saida ' + i + '</label><input class="OutputTraining" type="number" value="' + arg[i][1] + '" id="Peso' + i + '" placeholder="Peso (W)"></form></li>')
        }
    })

});
//////////////////////////////START////////////////////////////
document.querySelector("#start").addEventListener("click", () => {
    if (document.querySelector("#SelecionarTipo").value === "CÁLCULO") {
        let PesosOculta = new Array
        let PesosSaida = new Array
        let biasOculta = new Array
        let biasSaida = Number(document.getElementsByClassName("biasSaida")[0].value);
        for (let i = 0; i < document.getElementsByClassName("pesoHidden").length; i++) {
            PesosOculta[i] = Number(document.getElementsByClassName("pesoHidden")[i].value);
            PesosSaida[i] = Number(document.getElementsByClassName("pesoOutput")[i].value);
            biasOculta[i] = Number(document.getElementsByClassName("biasHidden")[i].value);
        }

        let entrada = Number(document.querySelector('#inputValor').value);

        ipc.send("ForwardPropagation", PesosOculta, PesosSaida, entrada, biasOculta, biasSaida);
    }
    else if (document.querySelector("#SelecionarTipo").value === "TREINAMENTO") {
        grafico.update(0)

        let InputTraining = new Array
        let OutputTraining = new Array
        let PesosOculta = new Array
        let PesosSaida = new Array
        let biasOculta = new Array

        let alfa = Number(document.getElementById("inputAlfa").value);
        let n = Number(document.getElementById("inputAprendizado").value);
        let ciclos = Number(document.getElementById("inputCiclos").value);
        let erroMax = Number(document.getElementById("inputErro").value);
        let biasSaida = Number(document.getElementsByClassName("biasSaida")[0].value);

        for (let i = 0; i < document.getElementsByClassName("pesoHidden").length; i++) {
            PesosOculta[i] = Number(document.getElementsByClassName("pesoHidden")[i].value);
            PesosSaida[i] = Number(document.getElementsByClassName("pesoOutput")[i].value);
            biasOculta[i] = Number(document.getElementsByClassName("biasHidden")[i].value);
        }
        for (let i = 0; i < document.getElementsByClassName("InputTraining").length; i++) {
            InputTraining[i] = Number(document.getElementsByClassName("InputTraining")[i].value);
            OutputTraining[i] = Number(document.getElementsByClassName("OutputTraining")[i].value);
        }



        ipc.send("BackPropagation", PesosOculta, PesosSaida, InputTraining, OutputTraining, biasOculta, biasSaida, alfa, n, ciclos, erroMax);
    }
    else {
        alert("Selecione um método")
    }
})

///////////////////GRAFICO//////////////////
let achaGrafico = document.getElementById("graficoErro").getContext("2d");
let contador = 0
let grafico = new Chart(achaGrafico, {
    type: "line",
    data: {
        labels: new Array,

        datasets: [{
            label: "Erro",
            data: new Array,
            backgroundColor: "rgb(190, 80, 85)",
            borderColor: "rgb(190, 80, 85)",
        }],
    },
})
/*
let achaGraficoSaida = document.getElementById("graficoErroSaida").getContext("2d");
let DataInput = document.getElementsByClassName("InputTraining").getContext("2d");
let DataOutput = document.getElementsByClassName("OutputTraining").getContext("2d");

let graficoSaida = new Chart(achaGraficoSaida, {
    type: "line",
    data: {
        labels: new Array,

        datasets: [{
            label: "Output",
            data: new Array,
            backgroundColor: "rgb(190, 80, 85)",
            borderColor: "rgb(190, 80, 85)",
        },
        {
            label: "Data",
            data: DataOutput.value,
            backgroundColor: "rgb(43, 182, 16)",
            borderColor: "rgb(43, 182, 16)",
        }
        ],
    },
})*/

/////////////////LISTENERS/////////////////////

ipc.on('ForwardOutput', (event, output) => {
    document.querySelector("#resultsBox").innerHTML = "Saida: " + output
})
ipc.on('ChangeError', (event, output, ciclosContados) => {
    document.querySelector("#resultsBox").innerHTML = "Erro: " + output

    grafico.data.labels[contador] = ciclosContados
    grafico.data.datasets[0].data[contador] = output
    contador++;
    grafico.update(0)

})

ipc.on('BackOutput', (event, output) => {
    for (let i = 0; i < output[0].length; i++) {
        document.getElementsByClassName("pesoHidden")[i].value = output[0][i];
        document.getElementsByClassName("biasHidden")[i].value = output[1][i];
        document.getElementsByClassName("pesoOutput")[i].value = output[2][i];
    }
    document.getElementsByClassName("biasSaida")[0].value = output[3][0];
    grafico.data.labels = []
    grafico.data.datasets[0].data = []
    contador = 0;

})