
const x = 3;
const d = 5;
const n = 0.3;
const NodesHid = 1
let Yout = 0;

let WHid = new Array;
let WOut = new Array;
let sigHid = new Array;
let sigOut = 0;
let biasOut = 1.5
let Yhid = new Array;
let bias = new Array;

for(let i=0;i<NodesHid;i++){
    WHid[i] = 1;
    WOut[i] = 5;
    sigHid[i] = 1;
    Yhid[i] = 0;
    bias[i] = 5;
}

function sigmoid(x){   // função para aplicar a função de ativação sigmoid  numero de euler = 2,718281
    return ((2/(1 + (Math.pow(2.718281,x))))-1)

}

function sigmoidDer(x){  // função para encontrar o fator de erro
    return (2*((1/(1 + (Math.pow(2.718281,x)))) * (1 - (1/(1 + (Math.pow(2.718281,x)))))))
 }


let cont = 0;
while(cont<30){

for(let i=0;i<NodesHid;i++){
    Yhid[i] = sigmoid((WHid[i]*x )+ bias[i])  
}

for(let i=0;i<NodesHid;i++){
    
    Yout += ((Yhid[i]*WOut[i]) + biasOut)   
}
console.log(">>>>>",Yout)
sigOut = (d - Yout);

for(let i=0;i<NodesHid;i++){
    sigHid[i] = ((sigOut*WOut[i])*(sigmoidDer(WHid[i]*x + bias[i])))
    console.log(sigHid)
}
biasOut += (n * sigOut)
for(let i=0;i<NodesHid;i++){
    WOut[i] += (n * sigOut * Yhid[i])
    WHid[i] += (n * sigHid[i] * x)
    bias[i] += (n * sigHid[i])
}

console.log(">hid",WHid)
console.log(">out",WOut) 
cont ++
}