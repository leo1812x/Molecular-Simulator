import * as main from './main';
import * as classes from './classes';
import {Region}  from './lammps_classes';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import * as converter from './lammps_parser';


//* Initialization of variables
//? i should organize this
export let STYLE = 'lj';
export let dimension = 3;
export let atom_style = 'atomic';
export let lattice_tyle = 'none';
export let lattice_scale = 1.0;
export let region_id;
export let region_style;
export let createbox_n;
export let createbox_regionid;
export let currentRegion: Region 
export let pairStyle_func = '4*e*(((o/r)^12) - ((o/r)^6))'
export let pairStyle_cutoff = 2.5;
export let pair_style_style;
export let timesteps = 1.0;
export let boxForHelper: THREE.BoxGeometry;





//? i should organize this too
//* Initialation
function newton (){

}

//can't use package as a function name
function packages (){

}
function processors (){

}
function suffix (){

}

//* define the type of units to be used
function units (style: string){
    let styles = ['lj', 'real', 'metal', 'si', 'cgs', 'electron', 'micro', 'nano'];

    //* check for invalid unit style
    if (!styles.includes(style)){
        throw new Error('Invalid unit style');
    } 

    //? something is wrong here
    style = style;

    //* set the unit variables style to lj variables 
    if (style == 'lj'){
        for (let i = 0; i < main.AllElements.length; i++){
            let element = main.AllElements[i];
            element.mass = 1.0;
            element.distance = 1.0;
            element.Boltzmann = 1.0;
        }
    } 
}




//* Setup simulation box
function boundary (x: string, y: string, z: string){
    let styles = ['p', 'f', 's', 'm', 'f', 'p', 'm', 's', 'f', 'p', 'm', 's'];

    //* check for invalid boundary style
    if (!styles.includes(x) || !styles.includes(y) || !styles.includes(z)){
        throw new Error('Invalid boundary style');
    } 

    currentRegion.boundary_x = Number.parseInt(x);
    currentRegion.boundary_y = Number.parseInt(y);
    currentRegion.boundary_z = Number.parseInt(z);    

}
function change_box (){

}

//*if the region id is correct, create a THREE box
function create_box (id: string, ...args: string[]){          
        if ( currentRegion.style == 'block'){
            
            //*create a box helper with the dimensions of the block
            boxForHelper = new THREE.BoxGeometry(currentRegion.x, currentRegion.y, currentRegion.z);
            const object = new THREE.Mesh( boxForHelper, new THREE.MeshBasicMaterial() );
            const BoxHelper = new THREE.BoxHelper( object, 0xffff00 );
    
            //*add the box helper to the scene
            main.scene.add( BoxHelper );
        }


}

//? this is not doing anything right now
//? only supports 3d right now
export function dimension1 ( dim: number){

    dimension = 2 || 3 ? dim : dimension;
}


//  lattice         sq  1.0
function lattice (style: string, scale: number, ...args: any[]){
    lattice_tyle = "none" || "sc" || "bcc" || "fcc" || "hcp" ||
                "diamond" || "sq" || "sq2" || "hex" || "custom" ?
                style : lattice_tyle;

    lattice_scale = scale;

}

function region (id: string, style: string, ...args: string[]){
    
    currentRegion = new Region(id, style, ...args);
}







//* Setup atoms
function atom_modify (){

}

//? not doing anything right now
//? only supports atomic right now
export function atom_styles ( style: string, ...args: any[]){
    atom_style ="amoeba"||"angle"     ||"atomic"    ||"body"     ||
                "bond"  ||"charge"    ||"dielectric"||"dipole"   ||
                "dpd"   ||"edpd"      ||"electron"  ||"ellipsoid"||
                "full"  ||"line"      ||"mdpd"      ||"molecular"||
                "oxdna" ||"peri"      ||"smd"       ||"sph"      ||
                "sphere"||"bpm/sphere"||"spin"      ||"tdpd"     ||
                "tri"   ||"template"  ||"wavepacket"||"hybrid" ? 
                style : atom_style;



}
function balance (){

}

//           create_atoms    1   box
function create_atoms (type: string, style: string,){

    //*check for exceptions
    if (boxForHelper != undefined && lattice_tyle != null){
        
        //* Pre-calculate half of the dimensions to avoid doing it in every iteration
        const halfHeight = boxForHelper.parameters.height / 2;
        const halfWidth = boxForHelper.parameters.width / 2;
        const halfDepth = boxForHelper.parameters.depth / 2;


        //* Define bounds based on half the box dimensions
        const bounds = {
            x: [0, halfWidth],
            y: [0, halfHeight],
            z: [0, halfDepth]
        };

        // Iterate over each dimension
        for (let i = bounds.x[0]; i <= bounds.x[1]; i += lattice_scale) {
            for (let j = bounds.y[0]; j <= bounds.y[1]; j += lattice_scale) {
                for (let k = bounds.z[0]; k <= bounds.z[1]; k += lattice_scale) {

                    //* Calculate positions ensuring not to exceed box dimensions
                    const positions = [];

                    //* Calculate all symmetrical positions
                    for (let dx of (i === 0 ? [0] : [-i, i])) {
                        for (let dy of (j === 0 ? [0] : [-j, j])) {
                            for (let dz of (k === 0 ? [0] : [-k, k])) {
                                // Skip the origin which was already added
                                if (dx === 0 && dy === 0 && dz === 0) continue;
                                
                                positions.push({ x: dx, y: dy, z: dz });
                            }
                        }
                    }

                    //* Create and add atoms for all calculated positions
                    positions.forEach(pos => {
                        const atom = new classes.THREE_LJ();
                        atom.ball.position.set(pos.x, pos.y, pos.z);
                        main.scene.add(atom.ball);
                    });
                }
            }
        }
    }
}
 
function create_bonds (){

}
function delete_atoms (){

}
function delete_bonds (){

}
function displace_atoms (){

}
function group (){

}

//* Set the mass of the atoms by type
function mass (I: string, value: number){

    for (let i = 0; i < main.AllElements.length; i++){
        let element = main.AllElements[i];

        if (element.constructor.name == main.AllElementTypes[I] || I == '*'){
            element.mass = value;            
        }
    }
}
function molecule (){

}
function read_data (){

}
function read_dump (){

}
function read_restart (){

}
function replicate (){

}
function set (){

}

//?this function does not uses args[1], akka random seed
function velocity (group:string, style:string, ...args: string[]){
    if (group == 'all'){
        if (style == 'create'){

            for (let i = 0; i < main.AllElements.length; i++){
                let element = main.AllElements[i];
                let temp = parseFloat(args[0]);
                let randomSeed = parseFloat(args[1]);

                

                main.AllElements[i].velocity = new THREE.Vector3(Math.random() * 2 -1 * temp, 
                                                                  Math.random() * 2 -1 * temp,
                                                                  Math.random() * 2 -1 * temp);
                

            }

        }
    }
}







//* Force fields
function angle_coeff (){

}
function angle_style (){

}
function bond_coeff (){

}
function bond_style (){

}
function bond_write (){

}
function dielectric (){

}
function dihedral_coeff (){

}
function dihedral_style (){

}
function improper_coeff (){

}
function improper_style (){

}
function kspace_modify (){

}
function kspace_style (){

}

//pair_coeff      *   *   1.0   1.0
function pair_coeff (I: string, J: string, ...args: string[]){
    //* i need to grab the atom types who's the potential will be computed
    //* i also need to grab the atom's who's proximity is less than the cutoff
    //* i also need to grab the right potential function
    //* then i need to finally calculate the potential of each atom pair

    for (let i = 0; i < main.AllElements.length; i++){
        let atomA = main.AllElements[i];

        atomA.energy = Number.parseInt(args[0]);
        atomA.distance = Number.parseInt(args[1]);

        for (let j = 0; j < main.AllElements.length; j++){
            let atomB = main.AllElements[j];

            //* skip if atomA and atomB are the same
            if (atomA == atomB) continue;

            //* if atom is I or *
            if (atomA.constructor.name == main.AllElementTypes[I] || I == '*'){
                
                //* if atom is J or *
                if (atomB.constructor.name == main.AllElementTypes[J] || J == '*'){
                    

                }
            }
        }

    }
}

function pair_modify (){

}

//pair_style  lj/cut 2.5
//* set the cutoff distance for the interactions
function pair_style (style: string, ...args: string[]): void{
    
    pair_style_style = "lj/cut" || "eam/alloy" ||
        "hybrid lj/charmm/coul/long 10.0 eam" ||
         "table linear 1000" || "none" ? style : "none";

    pairStyle_cutoff = Number.parseFloat(args[0]) || 2.5;
        
}

function pair_write (){

}

function special_bonds (){

}








//* Settings
function comm_modify (){

}
function comm_style (){

}
function info (){

}
function min_modify (){

}
function min_style (){

}
function neigh_modify (){

}
function neighbor (){

}
function partition (){

}
function reset_timestep (){

}
function run_style (){

}
function timer (){

}
function timestep (){

}






//* Operations within timestepping (fixes) and diagnostics (computes)
function compute (){

}
function compute_modify (){

}

//fix             1   all nve
//*working on this yk
function fix (ID: number, groupID: string, style: string){


}
function fix_modify (){

}
function uncompute (){

}
function unfix (){

}











//* Output
// called as dump image
function dump_image (){

}
//calles as dump movie
function dump_movie (){

}
function dump (){

}
function dump_modify (){

}
function restart (){

}
function thermo (){

}
function thermo_modify (){

}
function thermo_style (){

}
function undump (){

}
function write_coeff (){

}
function write_data (){

}
function write_dump (){

}
function write_restartv (){

}







//* Actions 
function minimize (){

}
function neb (){

}
function neb_spin (){

}
function prd (){

}
function rerun (){

}

//run             1000
//*working on this yk
function run (N:number, keyword: string, ...args: String[]){
    //*start simulation controls
    const controls = new OrbitControls(main.camera, main.renderer.domElement);

    //*get the input from the DOM
    converter.callCommands(converter.parseInput(converter.getInput()));

    
//    let ts = 0.000005;
     let ts = 0.0000025;
    //*animation loop
    function animate() {
        //*keep THREE.JS running
        requestAnimationFrame( animate );

        //* run the simulation for N timesteps
        if (N > 0){

            //*check each pair
            main.AllElements.forEach( element => {
                
                main.AllElements.forEach( element2 => {
                    if(element != element2){
                        element.runMotion(ts,element2);
                    }
                });
            });
            N--;
        }


        //!
        main.renderer.render( main.scene, main.camera );
    } animate();

    console.log(currentRegion.x);
    // main.scene.add(new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5), new THREE.MeshBasicMaterial({color: 0x00ff00})));


}
function tad (){

}
function temper (){

}












//* Input script control
function clear (){

}
function echo (){

}

//called as if
function if_ (){

}
function include (){

}

//there are 2 info, called as info
function info_ (){

}
function jump (){

}
function label (){

}
function log (){

}
function next (){

}
function print (){

}
function python (){

}
function quit (){

}
function shell (){

}
function variable (){

}


export { newton, packages, processors, suffix, units, boundary, change_box, create_box,  lattice, region, atom_modify, balance, create_atoms, create_bonds, delete_atoms, delete_bonds, displace_atoms, group, mass, molecule, read_data, read_dump, read_restart, replicate, set, velocity, angle_coeff, angle_style, bond_coeff, bond_style, bond_write, dielectric, dihedral_coeff, dihedral_style, improper_coeff, improper_style, kspace_modify, kspace_style, pair_coeff, pair_modify, pair_style, pair_write, special_bonds, comm_modify, comm_style, info, min_modify, min_style, neigh_modify, neighbor, partition, reset_timestep, run_style, timer, timestep, compute, compute_modify, fix, fix_modify, uncompute, unfix, dump_image, dump_movie, dump, dump_modify, restart, thermo, thermo_modify, thermo_style, undump, write_coeff, write_data, write_dump, write_restartv, minimize, neb, neb_spin, prd, rerun, run, tad, temper, clear, echo, if_, include, info_, jump, label, log, next, print, python, quit, shell, variable };




























































































