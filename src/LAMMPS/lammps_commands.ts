export let style = 'lj';
export let dimension = 3;
export let atom_style = 'atomic';

export let lattice_tyle = 'fcc';
export let lattice_scale = 1.0;

export let region_id;
export let region_style;

export let createbox_n;
export let createbox_regionid;

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
function units (style: string){
    let styles = ['lj', 'real', 'metal', 'si', 'cgs', 'electron', 'micro', 'nano'];

    if (!styles.includes(style)){
        throw new Error('Invalid unit style');
    } 

    style = style;
}





//* Setup simulation box
function boundary (){

}
function change_box (){

}
function create_box (n: number, id: string, ...args: any[]){
    createbox_n;
    createbox_regionid = id;

    //? missing keyword, value...

}

export function dimension1 ( dim: number){

    dimension = 2 || 3 ? dim : dimension;
}

function lattice (style: string, scale: number, ...args: any[]){
    lattice_tyle = "none" || "sc" || "bcc" || "fcc" || "hcp" ||
                "diamond" || "sq" || "sq2" || "hex" || "custom" ?
                style : lattice_tyle;

    lattice_scale = scale;

    //? missing args or "values"    
}

function region (id: string, style: string, ...args: any[]){
    region_id = id;
    region_style = "delete" || "block"    || "cylinder" || "sphere" ||
                    "plane" || "surface"  || "prism"    || "cone"   ||
                    "union" || "intersect"|| "subtract" || "group" ?
                    style : region_style;

    if ( region_style == 'block'){
        let xlo = args[0];
        let xhi = args[1];
        let ylo = args[2];
        let yhi = args[3];
        let zlo = args[4];
        let zhi = args[5];
    }
    
    //? missing args, keyword, args...

}







//* Setup atoms
function atom_modify (){

}
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
function create_atoms (){

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
function mass (){

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
function velocity (){

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
function pair_coeff (){

}
function pair_modify (){

}
function pair_style (){

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
function fix (){

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
function run (){

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































































































