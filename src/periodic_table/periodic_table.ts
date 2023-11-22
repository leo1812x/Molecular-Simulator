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
    for (let i = 0; i < xd.length; i++){           
        if (xd[i].symbol === symbol){            
            return xd[i];
        }
    }
    throw new Error("element not found");
}

function name(name:string):element{
    for (let i = 0; i < xd.length; i++){           
        if (xd[i].name === name){            
            return xd[i];
        }
    }
    throw new Error("element not found");
}

function number(number:number):element | void{

    for (let i = 0; i < xd.length; i++){           
        if (xd[i].atomicNumber === number){            
            return xd[i];
        }
    }
    throw new Error("element not found");
}

export default {number, name, symbol}
