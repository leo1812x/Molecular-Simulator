

//* This function will convert the input string from LAMMPS output and 
//* convert it into a sequence of outputs that can be used by my program
    export let input =`

                # initialization
                    units           lj&
                    dimension       2
                    atom_style      atomic  #test
                    test \$T
                # Atom definition
                    
                    lattice         sq  0.1
                    region          simbox  block   0   20  0   20  -0.1 0.1
                    create_box      1   simbox      
                    create_atoms    1   box
                    
                # Settings
                    pair_style      lj/cut 2.5
                    pair_coeff      *   *   1   1
                    
                    mass            *   1.0
                    velocity        all create  1.0 23494
                    
                # Run
                    fix             1   all nve
                    dump            1 all custom 10 output.txt id xs ys zs
                    
                    run             1000

                `

interface variables {
    key: string
    value: string
}
    
let inputVariables: variables[]

export function cleanInput (input: string){
    //*make each line into an array
    let inputAsArray = input.split((/\r?\n|\r|\n/g));
    
    for (let i = 0;  i < inputAsArray.length; i++){
        //*delete extra spaces
        inputAsArray[i] = inputAsArray[i].replace(/ +/g, ' ');

        //* rule 1, & means line after current line is part of current line
        if (inputAsArray[i].endsWith("&")){
            inputAsArray[i] = inputAsArray[i].replace("&", " ");
            inputAsArray[i] =  inputAsArray[i] + inputAsArray[i + 1];
            inputAsArray.splice(i + 1,1);
            i--;
        }

        //* rule 2, delete # comments
        if (inputAsArray[i].includes("#") && !inputAsArray[i].includes(`"#"`)){
            inputAsArray[i] = inputAsArray[i].replace(/#.*/,"");
        }

        //? WILL NEED TO IMPROVE THIS
        //* rule 3, $ call variables
        if (inputAsArray[i].includes("$") && !inputAsArray[i].includes(`"$"`)){
            let match
            if (inputAsArray[i].includes("${")){
                match = inputAsArray[i].match(/\$\{(.*?)\}/)[1];
            }
            else {
                match = inputAsArray[i].match(/\$(.)/)[1];
            }
            console.log(match);
            
        }

        //*trim the line
        inputAsArray[i] = inputAsArray[i].trim();

    }

    //* delete empty lines
    inputAsArray = inputAsArray.filter(string => string !== '')

    console.log(inputAsArray);
    return inputAsArray;

}











export function lammpsRead(instructions: string[]) {
    //*for each line, get the first instruction
    instructions.forEach(instruction => {
        let splittedInstruction = instruction.split(" ");
        let command = splittedInstruction[0];

        let units : number, keyword: string, ID: string;
        let dimension = 2;
        let atom_style = 'atomic';
        let style = 'none';
        let scale = 1.0;
        let regionStyle;

        switch (command) {
            //!BY CATEGORY
            //*Initialization
            case 'newton':
                break;

            case 'package':
                break;
        
            case 'processors':
                
                break;
            case 'suffix':
                
                break;
            case 'units':
                units = Number.parseInt( splittedInstruction[1]);                
                break;


            //*Setup simulation box
            case 'boundary':
                break;

            case 'change_box':
                break;
        
            case 'create_box':
                
                break;
            case 'dimension':
                dimension = Number.parseInt( splittedInstruction[1]);  

                break;
            case 'lattice':
                style = "none" || "sc" || "bcc" || "fcc" || "hcp" ||
                     "diamond" || "sq" || "sq2" || "hex" || "custom" ?
                     splittedInstruction[1] : style;

                scale = Number.parseInt(splittedInstruction[2]);

                if (splittedInstruction[3]){
                    keyword = "origin" || "orient" || "spacing" ||
                              "a1"     || "a2"     || "a3" || "basis" ? 
                              splittedInstruction[3] :  null;
                }

                break;

            case 'region':
                ID = splittedInstruction[1];

                regionStyle = "delete"    || "block" || "cone" || "cylinder" ||
                              "ellipsoid" || "plane" || "prism" || "sphere" ||
                              "union"     || "intersect" ?
                              splittedInstruction[2] : null;

                              

                break;
    
            //*setup atoms
            case 'atom_modify':
                break;

            case 'atom_style':
                atom_style = splittedInstruction[1] == 
                "amoeba"||"angle"     ||"atomic"    ||"body"     ||
                "bond"  ||"charge"    ||"dielectric"||"dipole"   ||
                "dpd"   ||"edpd"      ||"electron"  ||"ellipsoid"||
                "full"  ||"line"      ||"mdpd"      ||"molecular"||
                "oxdna" ||"peri"      ||"smd"       ||"sph"      ||
                "sphere"||"bpm/sphere"||"spin"      ||"tdpd"     ||
                "tri"   ||"template"  ||"wavepacket"||"hybrid" ? 
                splittedInstruction[1] : atom_style;
                break;
        
            case 'balance':
                
                break;
            case 'create_atoms':

                break;
            case 'create_bonds':

                break;

            case 'delete_bonds':

                break;

        }
        
        
        

    });
}

