"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lammpsRead = exports.cleanInput = exports.input = void 0;
var commands = require("./lammps_commands");
//* This function will convert the input string from LAMMPS output and 
//* convert it into a sequence of outputs that can be used by my program
exports.input = "\n# initialization\nunits           lj\ndimension       3       #only support\natom_style      atomic  #only support\n\n# Atom definition  \nlattice         sq 1.0 \nregion  simbox   block 0 5 0 5 0 5\ncreate_box      1   simbox      \ncreate_atoms    1   box\n        \n# Settings\npair_style      lj/cut 2.5  #not supported yet\npair_coeff      *   *   1.0   1.0    \nmass            *   1.0\nvelocity        all create  1.0 23494\n        \n# Run\nfix             1   all nve\ndump            1 all custom 10 output.txt id xs ys zs \nrun             1000\n";
//*write input file to the DOM
document.querySelector('.input-file').innerHTML = "".concat(exports.input);
//*get eddited input file from the DOM
document.querySelector('.run-button').addEventListener('click', function () {
    var inputFromFile = document.querySelector('.input-file').innerHTML;
    exports.input = inputFromFile;
    lammpsRead(cleanInput(exports.input));
});
function cleanInput(input) {
    //*make each line into an array
    var inputAsArray = input.split((/\r?\n|\r|\n/g));
    var _loop_1 = function (i) {
        //*delete extra spaces
        inputAsArray[i] = inputAsArray[i].replace(/ +/g, ' ');
        //* rule 1, & means line after current line is part of current line
        if (inputAsArray[i].endsWith("&")) {
            inputAsArray[i] = inputAsArray[i].replace("&", " ");
            inputAsArray[i] = inputAsArray[i] + inputAsArray[i + 1];
            inputAsArray.splice(i + 1, 1);
            i--;
        }
        //* rule 2, delete # comments
        if (inputAsArray[i].includes("#") && !inputAsArray[i].includes("\"#\"")) {
            inputAsArray[i] = inputAsArray[i].replace(/#.*/, "");
        }
        //* rule 3, delete $ and use variables
        if (inputAsArray[i].includes("$") && !inputAsArray[i].includes("\"$\"")) {
            var matches = [];
            if (inputAsArray[i].includes("${")) {
                matches.push.apply(matches, Array.from(inputAsArray[i].matchAll(/\$\{(.*?)\}/g)));
            }
            if (inputAsArray[i].includes('$')) {
                matches.push.apply(matches, Array.from(inputAsArray[i].matchAll(/\$([^{])/g)));
            }
            console.log(matches);
            matches.forEach(function (match) {
                if (match[1]) {
                    inputAsArray[i] = inputAsArray[i].replace(match[0], match[1]);
                }
            });
        }
        //*trim the line
        inputAsArray[i] = inputAsArray[i].trim();
        out_i_1 = i;
    };
    var out_i_1;
    for (var i = 0; i < inputAsArray.length; i++) {
        _loop_1(i);
        i = out_i_1;
    }
    //* delete empty lines
    inputAsArray = inputAsArray.filter(function (string) { return string !== ''; });
    return inputAsArray;
}
exports.cleanInput = cleanInput;
function lammpsRead(instructions) {
    //*for each line, get the first instruction
    instructions.forEach(function (instruction) {
        var splittedInstruction = instruction.split(" ");
        var command = splittedInstruction[0];
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
                commands.units(splittedInstruction[1]);
                break;
            //*Setup simulation box
            case 'boundary':
                break;
            case 'change_box':
                break;
            case 'create_box':
                commands.create_box.apply(commands, __spreadArray([splittedInstruction[1], splittedInstruction[2]], splittedInstruction.slice(3), false));
                break;
            case 'dimension':
                commands.dimension1(Number.parseInt(splittedInstruction[1]));
                break;
            case 'lattice':
                commands.lattice(splittedInstruction[1], Number.parseFloat(splittedInstruction[2]));
                break;
            case 'region':
                commands.region.apply(commands, __spreadArray([splittedInstruction[1], splittedInstruction[2]], splittedInstruction.slice(3), false));
                break;
            //*setup atoms
            case 'atom_modify':
                break;
            case 'atom_style':
                commands.atom_styles(splittedInstruction[1]);
                break;
            case 'balance':
                break;
            case 'create_atoms':
                commands.create_atoms(splittedInstruction[1], splittedInstruction[2]);
                break;
            case 'create_bonds':
                break;
            case 'delete_atoms':
                break;
            case 'delete_bonds':
                break;
            case 'displace_atoms':
                break;
            case 'group':
                break;
            case 'mass':
                commands.mass(splittedInstruction[1], Number.parseFloat(splittedInstruction[2]));
                break;
            case 'molecule':
                break;
            case 'read_data':
                break;
            case 'read_dump':
                break;
            case 'read_restart':
                break;
            case 'replicate':
                break;
            case 'set':
                break;
            case 'velocity':
                commands.velocity.apply(commands, __spreadArray([splittedInstruction[1], splittedInstruction[2]], splittedInstruction.slice(3), false));
                break;
            //*force fiels
            case 'angle_coeff':
                break;
            case 'angle_style':
                break;
            case 'bond_coeff':
                break;
            case 'bond_style':
                break;
            case 'band_write':
                break;
            case 'dialectic':
                break;
            case 'dihedral_coeff':
                break;
            case 'diheral_style':
                break;
            case 'improper_coeff':
                break;
            case 'impproper_style':
                break;
            case 'kspace_style':
                break;
            case 'pair_coeff':
                // commands.pair_style(splittedInstruction[1], ...splittedInstruction.slice(2));
                commands.pair_coeff(splittedInstruction[1], splittedInstruction[2], splittedInstruction[3], splittedInstruction[4]);
                break;
            case 'pair_modify':
                break;
            case 'pair_style':
                commands.pair_style.apply(commands, __spreadArray([splittedInstruction[1]], splittedInstruction.slice(2), false));
                break;
            case 'pair_write':
                break;
            case 'special_bonds':
                break;
            //*settings
            //*Operations within timestepping
            case 'compute':
                break;
            case 'compute_modify':
                break;
            case 'fix':
                commands.fix(Number.parseInt(splittedInstruction[1]), splittedInstruction[2], splittedInstruction[3]);
                break;
            case 'fix_modify':
                break;
            case 'uncompute':
                break;
            case 'unfix':
                break;
            //*output
            //*Actions
            case 'run':
                commands.run(Number.parseInt(splittedInstruction[1]), splittedInstruction[2]);
                break;
            //* Input control
        }
    });
}
exports.lammpsRead = lammpsRead;
