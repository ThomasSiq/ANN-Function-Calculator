const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const xlsxFile = require('read-excel-file/node');


function createWindow() {
    const win = new BrowserWindow({
        width: 1300,
        height: 900,
        webPreferences: {
            nativeWindowOpen: true,
            nodeIntegration: true,
            contextIsolation: false
            //enableRemoteModule: true,
        }
    });

    win.loadFile('index.html');
    win.webContents.openDevTools()
}

const template = [
    {
        label: "File",
        submenu: [
            {
                label: "New Project"
            },
            {
                label: "Open Project",
            },
            {
                label: "Save Project"
            },
            {
                label: "Save Project As"
            },
            {
                type: "separator"
            },
            {
                label: "Open Data"
            },
            {
                type: "separator"
            },
            {
                label: "Exit"
            }

        ]
    }

]

app.whenReady().then(() => {
    createWindow()

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

})
/////////////////////////////////////////////////////
//////////// CONTENT
/////////////////////////////////////////////////////

/////////////////OPEN PESOS////////////////////////
ipcMain.on('OpenFile', (event) => {
    let fileNames = dialog.showOpenDialogSync((fileNames) => {
        if (fileNames === undefined) {
            console.log("Erro")
            return;
        }
        return fileNames[0];
    })

    xlsxFile(fileNames[0]).then((xxs) => {
        event.reply('DataFile', xxs)
    })
})

/////////////////////////OPEN DATA/////////////////////////
ipcMain.on('DataTraining', (event) => {
    let fileNames = dialog.showOpenDialogSync((fileNames) => {
        if (fileNames === undefined) {
            console.log("Erro")
            return;
        }
        return fileNames;
    })

    xlsxFile(fileNames[0]).then((xxs) => {
        event.reply('DataTrainingFile', xxs)
    })

})


////////////////////START FORWARD PROPAGATION/////////////////
ipcMain.on("ForwardPropagation", (event, PesosOculta, PesosSaida, entrada, biasOculta, biasSaida) => {
    let NumeroPesos = PesosOculta.length

    let hidden = new Array;
    let saida = {
        Pesos: new Array,
        output: 0,
        bias: biasSaida,
        erro: 10
    };
    for (let i = 0; i < NumeroPesos; i++) {
        hidden[i] = new Object
        hidden[i].Pesos = Number(PesosOculta[i])
        hidden[i].bias = biasOculta[i];
        saida.Pesos[i] = Number(PesosSaida[i])
    }

    //==========================FUNCOES==========================//

    let sigmoid = function (x) {   // função para aplicar a função de ativação sigmoid  numero de euler = 2,718281
        return (1 / (1 + (Math.pow(2.718281, ((-1) * x)))))
    }

    //===============CONSTANTES E VALORES INICIAIS========================//

    //=====================FORWARD PROPAGATION=========================///
    for (let i = 0; i < NumeroPesos; i++) {

        hidden[i].output = sigmoid((hidden[i].Pesos * entrada) + hidden[i].bias)
    }

    //=======================OUTSIDE NEURON=============================//
    saida.output = 0;
    for (let i = 0; i < NumeroPesos; i++) {
        saida.output += (saida.Pesos[i] * hidden[i].output)
    }
    saida.output += saida.bias
    event.reply('ForwardOutput', saida.output)
})

////////////////////START BACKWARD PROPAGATION/////////////////

ipcMain.on("BackPropagation", (event, PesosOculta, PesosSaida, InputTraining, OutputTraining, biasOculta, biasSaida, alfa, n, ciclos, erroMax) => {

    let NumeroPesos = PesosSaida.length
    let NumeroData = InputTraining.length

    let exPeso = new Array
    let hidden = new Array;
    let saida = {
        Pesos: new Array,
        output: 0,
        bias: biasSaida,
        erro: 10
    };
    for (let i = 0; i < NumeroPesos; i++) {
        hidden[i] = new Object
        hidden[i].Pesos = Number(PesosOculta[i])
        hidden[i].bias = biasOculta[i];
        saida.Pesos[i] = Number(PesosSaida[i])
    }
    //==========================FUNCOES=======================================//

    let sigmoid = function (x) {   // função para aplicar a função de ativação sigmoid  numero de euler = 2,718281
        return (1 / (1 + (Math.pow(2.718281, ((-1) * x)))))
    }
    function derivada(x) {
        return x * (1 - x)
    }

    //===============CONSTANTES E VALORES INICIAIS====================//

    var cont = 0;
    let contador = 0;
    let erroTotal = 10;
    let deltaPesosHid = 0;
    let deltaPesosHidBias = 0
    let deltaPesosOutBias = 0
    let deltaPesosOut = 0
    console.log(">>>>>>>>>>",alfa, n, ciclos, erroMax)
    
    //=====================ciclo==============================//
    while (Math.abs(erroTotal) > erroMax && contador < ciclos) {
        erroTotal = 0
        for (let a = 0; a < NumeroData; a++) {
            let x = Number(InputTraining[a])
            let y = Number(OutputTraining[a])


            //====================FORWARD PROPAGATION==========================//
            for (let i = 0; i < NumeroPesos; i++) {
                hidden[i].output = sigmoid((hidden[i].Pesos * x) + hidden[i].bias)
            }

            //=======================OUTSIDE NEURON===============================//

            saida.output = 0;
            for (let i = 0; i < NumeroPesos; i++) {
                saida.output += (saida.Pesos[i] * hidden[i].output)
            }
            saida.output += saida.bias
            //=======================BACKWARD PROPAGATION==========================//
            saida.erro = (y - saida.output);
            for (let i = 0; i < NumeroPesos; i++) {
                hidden[i].erro = (derivada(hidden[i].output) * (saida.erro * saida.Pesos[i]))
            }
            for (let i = 0; i < NumeroPesos; i++) {
                hidden[i].Pesos += ((n * hidden[i].erro * x) + deltaPesosHid * alfa)
                hidden[i].bias += ((n * hidden[i].erro) + deltaPesosHidBias * alfa)
                deltaPesosHid = (n * hidden[i].erro * x)
                deltaPesosHidBias = (n * hidden[i].erro)

            }
            for (let i = 0; i < NumeroPesos; i++) {

                saida.Pesos[i] += ((n * saida.erro * hidden[i].output) + deltaPesosOut * alfa)
                deltaPesosOut = (n * saida.erro * hidden[i].output)
            }

            saida.bias += ((n * saida.erro) + deltaPesosOutBias * alfa)
            deltaPesosOutBias = (n * saida.erro);
            erroTotal += Math.abs(saida.erro)
            
        }
        
        erroTotal = (erroTotal / NumeroData)
        cont++
        contador++
        if (cont > 300 || contador === 5 || contador === 20 || contador === 80 || contador === 150) {
            event.reply('ChangeError', erroTotal, contador, )
            cont = 0;
        }
        
    }
    exPeso[0] = new Array
    exPeso[1] = new Array
    exPeso[2] = new Array
    exPeso[3] = new Array
    for (let i = 0; i < NumeroPesos; i++) {

        exPeso[0][i] = hidden[i].Pesos
        exPeso[2][i] = saida.Pesos[i]
        exPeso[1][i] = hidden[i].bias
    }
    exPeso[3][0] = saida.bias
    event.reply('BackOutput', exPeso)
    

})