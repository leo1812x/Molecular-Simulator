import * as pt from './data.json';

type element = {
    "atomicNumber":number;
    "symbol":string,
    "name":string,
    "atomicMass":string,
    "cpkHexColor":string,
    "electronicConfiguration":string,
    "electronegativity":number,
    "atomicRadius":number,
    "ionRadius":string,
    "vanDelWaalsRadius":number,
    "ionizationEnergy":number,
    "electronAffinity":number,
    "oxidationStates":string,
    "standardState":string,
    "bondingType":string,
    "meltingPoint":number,
    "boilingPoint":number,
    "density":number,
    "groupBlock":string,
    "yearDiscovered":number
}

let xd = JSON.parse(JSON.stringify(pt)).default;

function symbol(symbol:string):element{
    xd.forEach((element) => {
        if (element.symbol == symbol){
            return element;
        }
    })
    throw new Error("element not found");
}

function name(name:string):element{
    xd.forEach((element) =>{
        if (element.name == name){
            return element;
        }
    })
    throw new Error("element not found");
}

function number(number:number):element | void{

    let element = xd
    for (let i = 0; i < xd.length; i++){
                
        if (element[i].atomicNumber === number){            
            return element[i];
        }
    }

}

export default {number, name, symbol}
