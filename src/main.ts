import './styles/index.css';
import './styles/simulator.css';


import { THREE_LJ, ThreeElement } from './classes';
import * as setUp from './setup';
import * as functions from './functions';
import periodic_table from './periodic_table/periodic_table';
import * as lammps from  './LAMMPS/lammps_converter';



//!TESTING: LJ PARTICLES
let lj = new THREE_LJ();
lj.ball.position.x += 12;

// !lammps TEST
lammps.lammpsRead(lammps.cleanInput(lammps.input));




//*animation loop
function animate() {
	requestAnimationFrame( animate );
    //!TEST ANIMATIONS HERE:

    // setUp.AllElements.forEach(element => {
    //     functions.updatePosition(element);
    //     functions.keepInBounds(element);
        
    // });



    //!
	setUp.renderer.render( setUp.scene, setUp.camera );
} animate();






