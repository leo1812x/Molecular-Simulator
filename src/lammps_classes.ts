
//!classes for the LAMMPS commands

//*This class is a wraper for the THREE box that will be used to represent the region
//*this is created on the LAMMPS region command
export class Region {
    id: string;
    style: string;
    x: number;
    y: number;
    z: number;

    

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

//*This class is for the lattice which is the arrangement of the atoms in the simulation
export class Lattice {
    private style: string;
    private scale = 1.0;

    constructor(style: string, scale: number, ...args: string[]) {
        this.style = "none" || "sc" || "bcc" || "fcc" || "hcp" ||
        "diamond" || "sq" || "sq2" || "hex" || "custom" ?
        style : 'none';

        this.scale = scale;
    }

    public getStyle(): string {return this.style;}
    public getScale(): number {return this.scale;}
}


















