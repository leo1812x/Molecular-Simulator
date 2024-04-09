import './styles/index.css';
import './styles/simulator.css';


import { THREE_LJ } from './classes';
import * as setUp from './setup';
import * as lammps from  './lammps_converter';
import * as THREE from 'three';


// !lammps TEST

//* element control
let lj = new THREE_LJ();
lj.ball.position.x += 12;

///*read lammps input
lammps.lammpsRead(lammps.cleanInput(lammps.input));


let ts = 0.000005;

//*animation loop
function animate() {
	requestAnimationFrame( animate );
    //!TEST ANIMATIONS HERE:

    setUp.AllElements.forEach( element => {
        setUp.AllElements.forEach( element2 => {
            if(element != element2){
                element.stormerVerlet(ts,element2);
            }
                
        });
    });



    //!
	setUp.renderer.render( setUp.scene, setUp.camera );
} animate();






