
////////////////////////////FUNCOES////////////////////////////////////////////////
function NovoNeuronio(Nome, FuncaoAtivacao, NumeroEntradas){      
        Nome.Pesos = new Array,
        Nome.bias =  1,
        Nome.function = FuncaoAtivacao
        Nome.output = 0
        Nome.erro = 0; 

    for(let i = 0; i<NumeroEntradas;i++){
        Nome.Pesos[i] = 1;
    };
}

let sigmoid = function(x){   // função para aplicar a função de ativação sigmoid  numero de euler = 2,718281
    return ((2/(1 + (Math.pow(2.718281,((-1)*x))))) -1)
}

function Unitaria(){
   return x
}

function derivada(x){
    return x*(1-x)
}

////////////////////////////CONSTANTES E VALORES INICIAIS////////////////////////////////////

const n = 0.3 //taxa de aprendizado

    const hidNode = 2; //neuronio na camada oculta
    var x = 1;
    var d = 6;
    const y = 5;

////////////////////////CRIAR RNA/////////////////////////////////////////////
let hidden = []
for (let i = 0; i<hidNode; i++){
    hidden[i] = new Object
    NovoNeuronio(hidden[i], sigmoid, 1)
}

////////////////SAIDA COM APENAS UM NEURONIO/////////////////////////

let saida = new Object
NovoNeuronio(saida, Unitaria, hidNode)

let cont = 0;
while(cont < 30){
/////////FORWARD PROPAGATION//////////////////////////////
for (let i = 0; i<hidNode; i++){
    hidden[i].output  = hidden[i].function((hidden[i].Pesos[0] * x) + hidden[i].bias)
}

//////OUTSIDE NEURON/////////////
saida.output = 0 
for (let i = 0; i<hidNode; i++){
    saida.output += ((saida.Pesos[i] * hidden[i].output) + saida.bias)
     
}
    console.log("\noutput >", saida.output) 
//////////BACKWARD PROPAGATION///////////

saida.erro = d - saida.output;

for (let i = 0; i<hidNode; i++){
    hidden[i].erro = (derivada(hidden[i].output)*(saida.erro * saida.Pesos[i]))
}

for (let i = 0; i<hidNode; i++){
    hidden[i].Pesos[0] += (n * hidden[i].erro * x)
    hidden[i].bias += (n * hidden[i].erro)
}

for (let i = 0; i<hidNode; i++){
    saida.Pesos[i] += (n * saida.erro * hidden[i].output)
    saida.bias += (n * saida.erro)
}

cont++;
}