
//!classes for the LAMMPS commands

//*This class is a wraper for the THREE box that will be used to represent the region
//*this is created on the LAMMPS region command
export class Region {
    id: string;
    style: string;
    x: number;
    y: number;
    z: number;

    boundary_x: number;
    boundary_y: number;
    boundary_z: number;

    //*this deals with the input logic for the style parameter
    constructor(id: string, style: string, ...args: string[]) {
        this.id = id;
        this.style = "delete" || "block"    || "cylinder" || "sphere" ||
                        "plane" || "surface"  || "prism"    || "cone"   ||
                        "union" || "intersect"|| "subtract" || "group" ?
                        style : 'block';
    
        if ( style == 'block'){
            //*get the dimensions of the block
            this.x = Math.abs(Number.parseInt(args[0])) + Math.abs(Number.parseInt( args[1]));
            this.y = Math.abs(Number.parseInt(args[2]) + Math.abs(Number.parseInt(args[3])));
            this.z = Math.abs(Number.parseInt(args[4])) + Math.abs(Number.parseInt(args[5]));        
        }
    }


}
















