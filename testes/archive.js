console.log("Hello wolrd");
const xlsxFile= require('read-excel-file/node');


mat = xlsxFile('dados/DAta/pesos.xlsx').then((xxs) => {
    console.log(xxs);
    console.table(xxs);
    return xxs;
    })

mat.then( tr => {
    console.log(tr)
})

