const ipc = require('electron').ipcRenderer;
var NumeroPesos = 0
var trainingData = 0
var NumeroData = 0
var exData
var exPeso
/////////////////////////////CRIAR NEURONIOS/////////////////////////////////
function CriaNeuronios() {
    let Neuronios = document.getElementById("NumeroNeuronios").value;
    let inputs = document.getElementById("AdicionaPesos")
    document.getElementById("AleatorioButton").style.display = "block"

    inputs.innerHTML = " ";
    for (let i = 1; i <= Neuronios; i++) {
        inputs.insertAdjacentHTML("beforeEnd", '<li><form><label for ="pesoHidden">Peso ' + i + '</label><input class="pesoHidden" type="number" value="1" id="Peso' + i + '" placeholder="Peso (W)">   <label for ="pesoOutput">Peso ' + i + '</label><input class="pesoOutput" type="number" value="1" id="Peso' + i + '" placeholder="Peso (W)"></form></li>')
    }
}

let button = document.getElementById("myButton")
button.addEventListener("click", CriaNeuronios);
document.getElementById("NumeroNeuronios").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        button.click();
    }
});
///////////////////////////SELECIONA////////////////////////

document.getElementById("SelecionarTipo").addEventListener("click", ()=>{
    if(document.getElementById("SelectionBox").style.display === "none"){
        document.getElementById("SelectionBox").style.display = "block"
    }
    else if(document.getElementById("SelectionBox").style.display === "block"){
        document.getElementById("SelectionBox").style.display = "none"
    }
    else{
        document.getElementById("SelectionBox").style.display = "block"
    }
});
document.getElementById("SelecionarTipoTraining").addEventListener("click", ()=>{
    document.getElementById("SelecionarTipo").value = "TREINAMENTO"
    document.getElementById("SelectionBox").style.display = "none"
});
document.getElementById("SelecionarTipoCalc").addEventListener("click", ()=>{
    document.getElementById("SelecionarTipo").value = "CÁLCULO"
    document.getElementById("SelectionBox").style.display = "none"
});

///////////////////////////////////IMPORTAR PESOS/////////////////

let DataButton = document.getElementById("myButtonImportar")
DataButton.addEventListener("click", OpenFile);

function OpenFile() {
    ipc.send('OpenFile');
    ipc.on('DataFile', (event,arg) => {
        NumeroPesos = arg[1].length;
        exPeso = arg
        let inputs = document.getElementById("AdicionaPesos")
        inputs.innerHTML = " ";
        for (let i = 0; i < NumeroPesos; i++) {
            inputs.insertAdjacentHTML("beforeEnd", '<li><form><label for ="pesoHidden">Peso ' + i + '</label><input class="pesoHidden" type="number" value="' + arg[0][i] + '" id="Peso' + i + '" placeholder="Peso (W)">   <label for ="pesoOutput">Peso ' + i + '</label><input class="pesoOutput" type="number" value="' + arg[1][i] + '" id="Peso' + i + '" placeholder="Peso (W)"></form></li>')
        }
    })
}

document.getElementById("DataColector").addEventListener("click", () =>{
    ipc.send('DataTraining');
    ipc.on('DataTrainingFile', (event,arg) => {
        trainingData = arg;
        exData = arg
        NumeroData = arg.length
        let training = document.getElementById("DataTraining")
        training.innerHTML = " ";
        for (let i = 0; i < trainingData.length; i++) {
            training.insertAdjacentHTML("beforeEnd", '<li><form><label for ="pesoHiddenTraining">Entrada ' + i + '</label><input class="pesoHiddenTraining" type="number" value="' + arg[i][0] + '" id="Peso' + i + '" placeholder="Peso (W)">   <label for ="pesoOutputTraining">Saida ' + i + '</label><input class="pesoOutputTraining" type="number" value="' + arg[i][1] + '" id="Peso' + i + '" placeholder="Peso (W)"></form></li>')
        }
    })

})