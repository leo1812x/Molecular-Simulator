import * as THREE from 'three';
import { THREE_LJ, ThreeElement} from './classes';
import { boxForHelper } from './setup';

//!CONSTANTS CONSTANTS
//*Boltzmann constant
const BOLTZMANN_CONSTANT = 1.38064852e-23; 

//!CONSTANTS VARIABLES
//*atomic constants
const K = 1;        //sprig constant
const D = 0.7;        //default distance

//*newton's custom constants
const dt = 0.1;     //time step

const temperature = 0.0005;    //temperature (in kelvin)


export function getVelocity(element:ThreeElement):number{
    //*Thermal Velocity using  the Maxwell-Boltzmann Distribution
    let atomicMass = AMU_TO_KG(Number(element.element.atomicMass.toString().slice(0, 6)));
    let velocity = Math.sqrt((3 * BOLTZMANN_CONSTANT * temperature) / atomicMass);    
    console.log(velocity);
    return velocity
}



export function AMU_TO_KG(AMU:number):number{
    return AMU * 1.66053906660e-27;
}

export function keepInBounds(element:(ThreeElement | THREE_LJ)):void{
    //*get the element position
    let {x, y, z} = element.ball.position;

    //*if the element is out of bounds, reflect it
    if (Math.abs(x) > boxForHelper.parameters.width / 2 ||
        Math.abs(y) > boxForHelper.parameters.height / 2 ||
        Math.abs(z) > boxForHelper.parameters.depth / 2){
        element.velocity *= -1;
    }


}

export function getdistance(thisElement:(ThreeElement | THREE_LJ), otherElement:(ThreeElement | THREE_LJ)):number{
    //*get circles coordenates
    let {x, y, z} = thisElement.ball.position;
    let {x: otherX, y: otherY, z: otherZ} = otherElement.ball.position;

    //*get differences on each axis
    let differenceOnXs = Math.abs(x - otherX);
    let differenceOnYs = Math.abs(y - otherY);
    let differenceOnZs = Math.abs(z - otherZ);    

    //* distance formula (3d pythagoras theorem)
    let distance = Math.sqrt(Math.pow(differenceOnXs, 2) + Math.pow(differenceOnYs, 2) + Math.pow(differenceOnZs, 2));
    return distance;
}

//*get angle using cosine law
export function getAngle(a:ThreeElement, b:ThreeElement, c:ThreeElement):number{
    //*get distances
    let ac = getdistance(a, c);
    let ab = getdistance(a, b);
    let bc = getdistance(b, c);

    //*cosine law
    //in radians
    let angle = Math.acos((Math.pow(ac, 2) + Math.pow(ab, 2) - Math.pow(bc, 2)) / (2 * ac * ab));
    
    return angle;
}

export function radiansToDegrees(radians:number):number{
    return radians * (180 / Math.PI);
}

export function degreesToRadians(degrees:number):number{
    return degrees * (Math.PI / 180);
}

//! Newton's equations of motion
export function generaterandomposition():THREE.Vector3{
    let x = Math.random() * 10;
    let y = Math.random() * 10;
    let z = Math.random() * 10;
    return new THREE.Vector3(x, y, z);   
}

export function updatePosition(element:(ThreeElement | THREE_LJ)):void{
    let newX = element.ball.position.x += element.velocity*dt;
    let newY = element.ball.position.y += element.velocity*dt;
    let newZ = element.ball.position.z += element.velocity*dt;
}





//! hookes law: POTENTIAL ENERGY

export function getPotentialEnergy():number{
    return 0;
}

//*elastic potential energy: distance
export function getDistanceEnergy(first:ThreeElement, second:ThreeElement):number{
    let answer = 0.5 * K * Math.pow(getdistance(first, second) - D, 2);    
    return answer;
}

//*elastic potential energy: angle
export function getAnglesEnergy(first:ThreeElement, second:ThreeElement, third:ThreeElement):number{
    let answer = 0.5 * K * Math.pow(getAngle(first, second, third), 2);    
    return answer;

}

//!force acting
export function getForce(first:ThreeElement, second:ThreeElement):number{
    // let answernode = math.derivative(getDistanceEnergy(first, second).toString(), 'x');

    // let answer = answernode.evaluate({x: getdistance(first, second)});


    // return (answer);
    return 0;
}

export function VSEPRtheory(lonePairs?,...elements:ThreeElement[]){
    //*atoms bonded to central atom
    let bondedAtoms = elements.length - 1;

    lonePairs = lonePairs || 0;
    
    let angle;
    let str = `${bondedAtoms}${lonePairs}${bondedAtoms + lonePairs}`;


    

        //*Kepert model for transition metals
        //https://en.wikipedia.org/wiki/VSEPR_theory#Transition_metals_(Kepert_model)
        if (elements[0].element.groupBlock === "transition metal"){
            console.log('transition metal');
            //? will do some day
        }

        else{
            switch (lonePairs) {          
                case 0:
                    switch (elements.length - 1){
                        case 2: 
                            angle = 180;
                            angle = degreesToRadians(angle);

                            //*move the second element to the right position
                            elements[1].ball.position.x = Math.cos(angle) * D + elements[0].ball.position.x;
                            elements[1].ball.position.y = Math.sin(angle) * D + elements[0].ball.position.y;

                            //*move the third element to the right position
                            elements[2].ball.position.x = Math.cos(angle * 2) * D + elements[0].ball.position.x;
                            elements[2].ball.position.y = Math.sin(angle * 2) * D + elements[0].ball.position.y;
                        break;

                        case 3:
                            angle = 120;
                            angle = degreesToRadians(angle);

                            //*move the second element to the right position
                            elements[1].ball.position.x = Math.cos(angle) * D + elements[0].ball.position.x;
                            elements[1].ball.position.y = Math.sin(angle) * D + elements[0].ball.position.y;

                            //*move the third element to the right position
                            elements[2].ball.position.x = Math.cos(angle * 2) * D + elements[0].ball.position.x;
                            elements[2].ball.position.y = Math.sin(angle * 2) * D + elements[0].ball.position.y;

                            //*move the fourth element to the right position
                            elements[3].ball.position.x = Math.cos(angle * 3) * D + elements[0].ball.position.x;
                            elements[3].ball.position.y = Math.sin(angle * 3) * D + elements[0].ball.position.y;
                        break;

                        case 4:
                            //https://en.wikipedia.org/wiki/Tetrahedral_molecular_geometry#
                            angle = 109.5;
                            angle = degreesToRadians(angle);

                            //*get element[i] to  distance D pythagoras theorem
                            let distance = Math.sqrt(3);
                            

                            //*move the second element to the right position
                            elements[1].ball.position.x = elements[0].ball.position.x - D / distance;
                            elements[1].ball.position.y = elements[0].ball.position.y + D / distance;
                            elements[1].ball.position.z = elements[0].ball.position.z + D / distance;

                            //*move the third element to the right position
                            elements[2].ball.position.x = elements[0].ball.position.x + D / distance;
                            elements[2].ball.position.y = elements[0].ball.position.y + D / distance;
                            elements[2].ball.position.z = elements[0].ball.position.z - D / distance;
                        
                            //*move the fourth element to the right position
                            elements[3].ball.position.x = elements[0].ball.position.x + D / distance;
                            elements[3].ball.position.y = elements[0].ball.position.y - D / distance;
                            elements[3].ball.position.z = elements[0].ball.position.z + D / distance;
                        
                            //*move the fifth element to the right position
                            elements[4].ball.position.x = elements[0].ball.position.x - D / distance;
                            elements[4].ball.position.y = elements[0].ball.position.y - D / distance;
                            elements[4].ball.position.z = elements[0].ball.position.z - D / distance;
                        break;

                        case 5:

                    }
                break;
    
                case 1:
                    //*get angle in radians
                    angle = 104.45;
                    angle = degreesToRadians(angle);
    
                    //*
                    //*move the second element to the right position
                    elements[2].ball.position.x = Math.cos(angle) * D + elements[0].ball.position.x;
                    elements[2].ball.position.y = Math.sin(angle) * D + elements[0].ball.position.y;
    
                    //*get angle in radians
                    let angle2 = 0;
                    angle2 = degreesToRadians(angle2);
    
                    //*move the third element to the right position
                    elements[1].ball.position.x = Math.cos(angle2) * D + elements[0].ball.position.x;
                    elements[1].ball.position.y = Math.sin(angle2) * D + elements[0].ball.position.y;
    
    
                break;
    
                case 2:
                    
                    switch (elements.length - 1){
                        case 2:
                            //*get angle in radians
                            let angle = 104.45;
                            angle = degreesToRadians(angle);

                            //*move the second element to the right position
                            elements[2].ball.position.x = Math.cos(angle) * D + elements[0].ball.position.x;
                            elements[2].ball.position.y = Math.sin(angle) * D + elements[0].ball.position.y;

                            //*get angle in radians
                            let angle2 = 0;
                            angle2 = degreesToRadians(angle2);

                            //*move the third element to the right position
                            elements[1].ball.position.x = Math.cos(angle2) * D + elements[0].ball.position.x;
                            elements[1].ball.position.y = Math.sin(angle2) * D + elements[0].ball.position.y;
                        break;
                    }
                break;
    
                case 3:
                break;
    
                default:
                    console.error('No molecular geometry found');
                break;
                }
            }
    }
