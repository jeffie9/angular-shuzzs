import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { MatTableDataSource } from '@angular/material/table';
import { ListRange } from '@angular/cdk/collections';
import { combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  category: string;
  phase: string;
  appearance: string;
  discoveredBy: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.008, symbol: 'H', category: 'diatomic nonmetal', phase: 'Gas', appearance: 'colorless gas', discoveredBy: 'Henry Cavendish'},
  {position: 2, name: 'Helium', weight: 4.0026022, symbol: 'He', category: 'noble gas', phase: 'Gas', appearance: 'colorless gas, exhibiting a red-orange glow when placed in a high-voltage electric field', discoveredBy: 'Pierre Janssen'},
  {position: 3, name: 'Lithium', weight: 6.94, symbol: 'Li', category: 'alkali metal', phase: 'Solid', appearance: 'silvery-white', discoveredBy: 'Johan August Arfwedson'},
  {position: 4, name: 'Beryllium', weight: 9.01218315, symbol: 'Be', category: 'alkaline earth metal', phase: 'Solid', appearance: 'white-gray metallic', discoveredBy: 'Louis Nicolas Vauquelin'},
  {position: 5, name: 'Boron', weight: 10.81, symbol: 'B', category: 'metalloid', phase: 'Solid', appearance: 'black-brown', discoveredBy: 'Joseph Louis Gay-Lussac'},
  {position: 6, name: 'Carbon', weight: 12.011, symbol: 'C', category: 'polyatomic nonmetal', phase: 'Solid', appearance: 'null', discoveredBy: 'Ancient Egypt'},
  {position: 7, name: 'Nitrogen', weight: 14.007, symbol: 'N', category: 'diatomic nonmetal', phase: 'Gas', appearance: 'colorless gas, liquid or solid', discoveredBy: 'Daniel Rutherford'},
  {position: 8, name: 'Oxygen', weight: 15.999, symbol: 'O', category: 'diatomic nonmetal', phase: 'Gas', appearance: 'null', discoveredBy: 'Carl Wilhelm Scheele'},
  {position: 9, name: 'Fluorine', weight: 18.9984031636, symbol: 'F', category: 'diatomic nonmetal', phase: 'Gas', appearance: 'null', discoveredBy: 'André-Marie Ampère'},
  {position: 10, name: 'Neon', weight: 20.17976, symbol: 'Ne', category: 'noble gas', phase: 'Gas', appearance: 'colorless gas exhibiting an orange-red glow when placed in a high voltage electric field', discoveredBy: 'Morris Travers'},
  {position: 11, name: 'Sodium', weight: 22.989769282, symbol: 'Na', category: 'alkali metal', phase: 'Solid', appearance: 'silvery white metallic', discoveredBy: 'Humphry Davy'},
  {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg', category: 'alkaline earth metal', phase: 'Solid', appearance: 'shiny grey solid', discoveredBy: 'Joseph Black'},
  {position: 13, name: 'Aluminium', weight: 26.98153857, symbol: 'Al', category: 'post-transition metal', phase: 'Solid', appearance: 'silvery gray metallic', discoveredBy: 'null'},
  {position: 14, name: 'Silicon', weight: 28.085, symbol: 'Si', category: 'metalloid', phase: 'Solid', appearance: 'crystalline, reflective with bluish-tinged faces', discoveredBy: 'Jöns Jacob Berzelius'},
  {position: 15, name: 'Phosphorus', weight: 30.9737619985, symbol: 'P', category: 'polyatomic nonmetal', phase: 'Solid', appearance: 'colourless, waxy white, yellow, scarlet, red, violet, black', discoveredBy: 'Hennig Brand'},
  {position: 16, name: 'Sulfur', weight: 32.06, symbol: 'S', category: 'polyatomic nonmetal', phase: 'Solid', appearance: 'lemon yellow sintered microcrystals', discoveredBy: 'Ancient china'},
  {position: 17, name: 'Chlorine', weight: 35.45, symbol: 'Cl', category: 'diatomic nonmetal', phase: 'Gas', appearance: 'pale yellow-green gas', discoveredBy: 'Carl Wilhelm Scheele'},
  {position: 18, name: 'Argon', weight: 39.9481, symbol: 'Ar', category: 'noble gas', phase: 'Gas', appearance: 'colorless gas exhibiting a lilac/violet glow when placed in a high voltage electric field', discoveredBy: 'Lord Rayleigh'},
  {position: 19, name: 'Potassium', weight: 39.09831, symbol: 'K', category: 'alkali metal', phase: 'Solid', appearance: 'silvery gray', discoveredBy: 'Humphry Davy'},
  {position: 20, name: 'Calcium', weight: 40.0784, symbol: 'Ca', category: 'alkaline earth metal', phase: 'Solid', appearance: 'null', discoveredBy: 'Humphry Davy'},
  {position: 21, name: 'Scandium', weight: 44.9559085, symbol: 'Sc', category: 'transition metal', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Lars Fredrik Nilson'},
  {position: 22, name: 'Titanium', weight: 47.8671, symbol: 'Ti', category: 'transition metal', phase: 'Solid', appearance: 'silvery grey-white metallic', discoveredBy: 'William Gregor'},
  {position: 23, name: 'Vanadium', weight: 50.94151, symbol: 'V', category: 'transition metal', phase: 'Solid', appearance: 'blue-silver-grey metal', discoveredBy: 'Andrés Manuel del Río'},
  {position: 24, name: 'Chromium', weight: 51.99616, symbol: 'Cr', category: 'transition metal', phase: 'Solid', appearance: 'silvery metallic', discoveredBy: 'Louis Nicolas Vauquelin'},
  {position: 25, name: 'Manganese', weight: 54.9380443, symbol: 'Mn', category: 'transition metal', phase: 'Solid', appearance: 'silvery metallic', discoveredBy: 'Torbern Olof Bergman'},
  {position: 26, name: 'Iron', weight: 55.8452, symbol: 'Fe', category: 'transition metal', phase: 'Solid', appearance: 'lustrous metallic with a grayish tinge', discoveredBy: '5000 BC'},
  {position: 27, name: 'Cobalt', weight: 58.9331944, symbol: 'Co', category: 'transition metal', phase: 'Solid', appearance: 'hard lustrous gray metal', discoveredBy: 'Georg Brandt'},
  {position: 28, name: 'Nickel', weight: 58.69344, symbol: 'Ni', category: 'transition metal', phase: 'Solid', appearance: 'lustrous, metallic, and silver with a gold tinge', discoveredBy: 'Axel Fredrik Cronstedt'},
  {position: 29, name: 'Copper', weight: 63.5463, symbol: 'Cu', category: 'transition metal', phase: 'Solid', appearance: 'red-orange metallic luster', discoveredBy: 'Middle East'},
  {position: 30, name: 'Zinc', weight: 65.382, symbol: 'Zn', category: 'transition metal', phase: 'Solid', appearance: 'silver-gray', discoveredBy: 'India'},
  {position: 31, name: 'Gallium', weight: 69.7231, symbol: 'Ga', category: 'post-transition metal', phase: 'Solid', appearance: 'silver-white', discoveredBy: 'Lecoq de Boisbaudran'},
  {position: 32, name: 'Germanium', weight: 72.6308, symbol: 'Ge', category: 'metalloid', phase: 'Solid', appearance: 'grayish-white', discoveredBy: 'Clemens Winkler'},
  {position: 33, name: 'Arsenic', weight: 74.9215956, symbol: 'As', category: 'metalloid', phase: 'Solid', appearance: 'metallic grey', discoveredBy: 'Bronze Age'},
  {position: 34, name: 'Selenium', weight: 78.9718, symbol: 'Se', category: 'polyatomic nonmetal', phase: 'Solid', appearance: 'black, red, and gray (not pictured) allotropes', discoveredBy: 'Jöns Jakob Berzelius'},
  {position: 35, name: 'Bromine', weight: 79.904, symbol: 'Br', category: 'diatomic nonmetal', phase: 'Liquid', appearance: 'null', discoveredBy: 'Antoine Jérôme Balard'},
  {position: 36, name: 'Krypton', weight: 83.7982, symbol: 'Kr', category: 'noble gas', phase: 'Gas', appearance: 'colorless gas, exhibiting a whitish glow in a high electric field', discoveredBy: 'William Ramsay'},
  {position: 37, name: 'Rubidium', weight: 85.46783, symbol: 'Rb', category: 'alkali metal', phase: 'Solid', appearance: 'grey white', discoveredBy: 'Robert Bunsen'},
  {position: 38, name: 'Strontium', weight: 87.621, symbol: 'Sr', category: 'alkaline earth metal', phase: 'Solid', appearance: 'null', discoveredBy: 'William Cruickshank (chemist)'},
  {position: 39, name: 'Yttrium', weight: 88.905842, symbol: 'Y', category: 'transition metal', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Johan Gadolin'},
  {position: 40, name: 'Zirconium', weight: 91.2242, symbol: 'Zr', category: 'transition metal', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Martin Heinrich Klaproth'},
  {position: 41, name: 'Niobium', weight: 92.906372, symbol: 'Nb', category: 'transition metal', phase: 'Solid', appearance: 'gray metallic, bluish when oxidized', discoveredBy: 'Charles Hatchett'},
  {position: 42, name: 'Molybdenum', weight: 95.951, symbol: 'Mo', category: 'transition metal', phase: 'Solid', appearance: 'gray metallic', discoveredBy: 'Carl Wilhelm Scheele'},
  {position: 43, name: 'Technetium', weight: 98, symbol: 'Tc', category: 'transition metal', phase: 'Solid', appearance: 'shiny gray metal', discoveredBy: 'Emilio Segrè'},
  {position: 44, name: 'Ruthenium', weight: 101.072, symbol: 'Ru', category: 'transition metal', phase: 'Solid', appearance: 'silvery white metallic', discoveredBy: 'Karl Ernst Claus'},
  {position: 45, name: 'Rhodium', weight: 102.905502, symbol: 'Rh', category: 'transition metal', phase: 'Solid', appearance: 'silvery white metallic', discoveredBy: 'William Hyde Wollaston'},
  {position: 46, name: 'Palladium', weight: 106.421, symbol: 'Pd', category: 'transition metal', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'William Hyde Wollaston'},
  {position: 47, name: 'Silver', weight: 107.86822, symbol: 'Ag', category: 'transition metal', phase: 'Solid', appearance: 'lustrous white metal', discoveredBy: 'unknown, before 5000 BC'},
  {position: 48, name: 'Cadmium', weight: 112.4144, symbol: 'Cd', category: 'transition metal', phase: 'Solid', appearance: 'silvery bluish-gray metallic', discoveredBy: 'Karl Samuel Leberecht Hermann'},
  {position: 49, name: 'Indium', weight: 114.8181, symbol: 'In', category: 'post-transition metal', phase: 'Solid', appearance: 'silvery lustrous gray', discoveredBy: 'Ferdinand Reich'},
  {position: 50, name: 'Tin', weight: 118.7107, symbol: 'Sn', category: 'post-transition metal', phase: 'Solid', appearance: 'silvery-white (beta, β) or gray (alpha, α)', discoveredBy: 'unknown, before 3500 BC'},
  {position: 51, name: 'Antimony', weight: 121.7601, symbol: 'Sb', category: 'metalloid', phase: 'Solid', appearance: 'silvery lustrous gray', discoveredBy: 'unknown, before 3000 BC'},
  {position: 52, name: 'Tellurium', weight: 127.603, symbol: 'Te', category: 'metalloid', phase: 'Solid', appearance: 'null', discoveredBy: 'Franz-Joseph Müller von Reichenstein'},
  {position: 53, name: 'Iodine', weight: 126.904473, symbol: 'I', category: 'diatomic nonmetal', phase: 'Solid', appearance: 'lustrous metallic gray, violet as a gas', discoveredBy: 'Bernard Courtois'},
  {position: 54, name: 'Xenon', weight: 131.2936, symbol: 'Xe', category: 'noble gas', phase: 'Gas', appearance: 'colorless gas, exhibiting a blue glow when placed in a high voltage electric field', discoveredBy: 'William Ramsay'},
  {position: 55, name: 'Cesium', weight: 132.905451966, symbol: 'Cs', category: 'alkali metal', phase: 'Solid', appearance: 'silvery gold', discoveredBy: 'Robert Bunsen'},
  {position: 56, name: 'Barium', weight: 137.3277, symbol: 'Ba', category: 'alkaline earth metal', phase: 'Solid', appearance: 'null', discoveredBy: 'Carl Wilhelm Scheele'},
  {position: 57, name: 'Lanthanum', weight: 138.905477, symbol: 'La', category: 'lanthanide', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Carl Gustaf Mosander'},
  {position: 58, name: 'Cerium', weight: 140.1161, symbol: 'Ce', category: 'lanthanide', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Martin Heinrich Klaproth'},
  {position: 59, name: 'Praseodymium', weight: 140.907662, symbol: 'Pr', category: 'lanthanide', phase: 'Solid', appearance: 'grayish white', discoveredBy: 'Carl Auer von Welsbach'},
  {position: 60, name: 'Neodymium', weight: 144.2423, symbol: 'Nd', category: 'lanthanide', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Carl Auer von Welsbach'},
  {position: 61, name: 'Promethium', weight: 145, symbol: 'Pm', category: 'lanthanide', phase: 'Solid', appearance: 'metallic', discoveredBy: 'Chien Shiung Wu'},
  {position: 62, name: 'Samarium', weight: 150.362, symbol: 'Sm', category: 'lanthanide', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Lecoq de Boisbaudran'},
  {position: 63, name: 'Europium', weight: 151.9641, symbol: 'Eu', category: 'lanthanide', phase: 'Solid', appearance: 'null', discoveredBy: 'Eugène-Anatole Demarçay'},
  {position: 64, name: 'Gadolinium', weight: 157.253, symbol: 'Gd', category: 'lanthanide', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Jean Charles Galissard de Marignac'},
  {position: 65, name: 'Terbium', weight: 158.925352, symbol: 'Tb', category: 'lanthanide', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Carl Gustaf Mosander'},
  {position: 66, name: 'Dysprosium', weight: 162.5001, symbol: 'Dy', category: 'lanthanide', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Lecoq de Boisbaudran'},
  {position: 67, name: 'Holmium', weight: 164.930332, symbol: 'Ho', category: 'lanthanide', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Marc Delafontaine'},
  {position: 68, name: 'Erbium', weight: 167.2593, symbol: 'Er', category: 'lanthanide', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Carl Gustaf Mosander'},
  {position: 69, name: 'Thulium', weight: 168.934222, symbol: 'Tm', category: 'lanthanide', phase: 'Solid', appearance: 'silvery gray', discoveredBy: 'Per Teodor Cleve'},
  {position: 70, name: 'Ytterbium', weight: 173.0451, symbol: 'Yb', category: 'lanthanide', phase: 'Solid', appearance: 'null', discoveredBy: 'Jean Charles Galissard de Marignac'},
  {position: 71, name: 'Lutetium', weight: 174.96681, symbol: 'Lu', category: 'lanthanide', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Georges Urbain'},
  {position: 72, name: 'Hafnium', weight: 178.492, symbol: 'Hf', category: 'transition metal', phase: 'Solid', appearance: 'steel gray', discoveredBy: 'Dirk Coster'},
  {position: 73, name: 'Tantalum', weight: 180.947882, symbol: 'Ta', category: 'transition metal', phase: 'Solid', appearance: 'gray blue', discoveredBy: 'Anders Gustaf Ekeberg'},
  {position: 74, name: 'Tungsten', weight: 183.841, symbol: 'W', category: 'transition metal', phase: 'Solid', appearance: 'grayish white, lustrous', discoveredBy: 'Carl Wilhelm Scheele'},
  {position: 75, name: 'Rhenium', weight: 186.2071, symbol: 'Re', category: 'transition metal', phase: 'Solid', appearance: 'silvery-grayish', discoveredBy: 'Masataka Ogawa'},
  {position: 76, name: 'Osmium', weight: 190.233, symbol: 'Os', category: 'transition metal', phase: 'Solid', appearance: 'silvery, blue cast', discoveredBy: 'Smithson Tennant'},
  {position: 77, name: 'Iridium', weight: 192.2173, symbol: 'Ir', category: 'transition metal', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Smithson Tennant'},
  {position: 78, name: 'Platinum', weight: 195.0849, symbol: 'Pt', category: 'transition metal', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Antonio de Ulloa'},
  {position: 79, name: 'Gold', weight: 196.9665695, symbol: 'Au', category: 'transition metal', phase: 'Solid', appearance: 'metallic yellow', discoveredBy: 'Middle East'},
  {position: 80, name: 'Mercury', weight: 200.5923, symbol: 'Hg', category: 'transition metal', phase: 'Liquid', appearance: 'silvery', discoveredBy: 'unknown, before 2000 BCE'},
  {position: 81, name: 'Thallium', weight: 204.38, symbol: 'Tl', category: 'post-transition metal', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'William Crookes'},
  {position: 82, name: 'Lead', weight: 207.21, symbol: 'Pb', category: 'post-transition metal', phase: 'Solid', appearance: 'metallic gray', discoveredBy: 'Middle East'},
  {position: 83, name: 'Bismuth', weight: 208.980401, symbol: 'Bi', category: 'post-transition metal', phase: 'Solid', appearance: 'lustrous silver', discoveredBy: 'Claude François Geoffroy'},
  {position: 84, name: 'Polonium', weight: 209, symbol: 'Po', category: 'post-transition metal', phase: 'Solid', appearance: 'silvery', discoveredBy: 'Pierre Curie'},
  {position: 85, name: 'Astatine', weight: 210, symbol: 'At', category: 'metalloid', phase: 'Solid', appearance: 'unknown, probably metallic', discoveredBy: 'Dale R. Corson'},
  {position: 86, name: 'Radon', weight: 222, symbol: 'Rn', category: 'noble gas', phase: 'Gas', appearance: 'colorless gas, occasionally glows green or red in discharge tubes', discoveredBy: 'Friedrich Ernst Dorn'},
  {position: 87, name: 'Francium', weight: 223, symbol: 'Fr', category: 'alkali metal', phase: 'Solid', appearance: 'null', discoveredBy: 'Marguerite Perey'},
  {position: 88, name: 'Radium', weight: 226, symbol: 'Ra', category: 'alkaline earth metal', phase: 'Solid', appearance: 'silvery white metallic', discoveredBy: 'Pierre Curie'},
  {position: 89, name: 'Actinium', weight: 227, symbol: 'Ac', category: 'actinide', phase: 'Solid', appearance: 'null', discoveredBy: 'Friedrich Oskar Giesel'},
  {position: 90, name: 'Thorium', weight: 232.03774, symbol: 'Th', category: 'actinide', phase: 'Solid', appearance: 'silvery, often with black tarnish', discoveredBy: 'Jöns Jakob Berzelius'},
  {position: 91, name: 'Protactinium', weight: 231.035882, symbol: 'Pa', category: 'actinide', phase: 'Solid', appearance: 'bright, silvery metallic luster', discoveredBy: 'William Crookes'},
  {position: 92, name: 'Uranium', weight: 238.028913, symbol: 'U', category: 'actinide', phase: 'Solid', appearance: 'null', discoveredBy: 'Martin Heinrich Klaproth'},
  {position: 93, name: 'Neptunium', weight: 237, symbol: 'Np', category: 'actinide', phase: 'Solid', appearance: 'silvery metallic', discoveredBy: 'Edwin McMillan'},
  {position: 94, name: 'Plutonium', weight: 244, symbol: 'Pu', category: 'actinide', phase: 'Solid', appearance: 'silvery white, tarnishing to dark gray in air', discoveredBy: 'Glenn T. Seaborg'},
  {position: 95, name: 'Americium', weight: 243, symbol: 'Am', category: 'actinide', phase: 'Solid', appearance: 'silvery white', discoveredBy: 'Glenn T. Seaborg'},
  {position: 96, name: 'Curium', weight: 247, symbol: 'Cm', category: 'actinide', phase: 'Solid', appearance: 'silvery metallic, glows purple in the dark', discoveredBy: 'Glenn T. Seaborg'},
  {position: 97, name: 'Berkelium', weight: 247, symbol: 'Bk', category: 'actinide', phase: 'Solid', appearance: 'silvery', discoveredBy: 'Lawrence Berkeley National Laboratory'},
  {position: 98, name: 'Californium', weight: 251, symbol: 'Cf', category: 'actinide', phase: 'Solid', appearance: 'silvery', discoveredBy: 'Lawrence Berkeley National Laboratory'},
  {position: 99, name: 'Einsteinium', weight: 252, symbol: 'Es', category: 'actinide', phase: 'Solid', appearance: 'silver-colored', discoveredBy: 'Lawrence Berkeley National Laboratory'},
  {position: 100, name: 'Fermium', weight: 257, symbol: 'Fm', category: 'actinide', phase: 'Solid', appearance: 'null', discoveredBy: 'Lawrence Berkeley National Laboratory'},
  {position: 101, name: 'Mendelevium', weight: 258, symbol: 'Md', category: 'actinide', phase: 'Solid', appearance: 'null', discoveredBy: 'Lawrence Berkeley National Laboratory'},
  {position: 102, name: 'Nobelium', weight: 259, symbol: 'No', category: 'actinide', phase: 'Solid', appearance: 'null', discoveredBy: 'Joint Institute for Nuclear Research'},
  {position: 103, name: 'Lawrencium', weight: 266, symbol: 'Lr', category: 'actinide', phase: 'Solid', appearance: 'null', discoveredBy: 'Lawrence Berkeley National Laboratory'},
  {position: 104, name: 'Rutherfordium', weight: 267, symbol: 'Rf', category: 'transition metal', phase: 'Solid', appearance: 'null', discoveredBy: 'Joint Institute for Nuclear Research'},
  {position: 105, name: 'Dubnium', weight: 268, symbol: 'Db', category: 'transition metal', phase: 'Solid', appearance: 'null', discoveredBy: 'Joint Institute for Nuclear Research'},
  {position: 106, name: 'Seaborgium', weight: 269, symbol: 'Sg', category: 'transition metal', phase: 'Solid', appearance: 'null', discoveredBy: 'Lawrence Berkeley National Laboratory'},
  {position: 107, name: 'Bohrium', weight: 270, symbol: 'Bh', category: 'transition metal', phase: 'Solid', appearance: 'null', discoveredBy: 'Gesellschaft für Schwerionenforschung'},
  {position: 108, name: 'Hassium', weight: 269, symbol: 'Hs', category: 'transition metal', phase: 'Solid', appearance: 'null', discoveredBy: 'Gesellschaft für Schwerionenforschung'},
  {position: 109, name: 'Meitnerium', weight: 278, symbol: 'Mt', category: 'unknown, probably transition metal', phase: 'Solid', appearance: 'null', discoveredBy: 'Gesellschaft für Schwerionenforschung'},
  {position: 110, name: 'Darmstadtium', weight: 281, symbol: 'Ds', category: 'unknown, probably transition metal', phase: 'Solid', appearance: 'null', discoveredBy: 'Gesellschaft für Schwerionenforschung'},
  {position: 111, name: 'Roentgenium', weight: 282, symbol: 'Rg', category: 'unknown, probably transition metal', phase: 'Solid', appearance: 'null', discoveredBy: 'Gesellschaft für Schwerionenforschung'},
  {position: 112, name: 'Copernicium', weight: 285, symbol: 'Cn', category: 'transition metal', phase: 'Gas', appearance: 'null', discoveredBy: 'Gesellschaft für Schwerionenforschung'},
  {position: 113, name: 'Nihonium', weight: 286, symbol: 'Nh', category: 'unknown, probably transition metal', phase: 'Solid', appearance: 'null', discoveredBy: 'RIKEN'},
  {position: 114, name: 'Flerovium', weight: 289, symbol: 'Fl', category: 'post-transition metal', phase: 'Solid', appearance: 'null', discoveredBy: 'Joint Institute for Nuclear Research'},
  {position: 115, name: 'Moscovium', weight: 289, symbol: 'Mc', category: 'unknown, probably post-transition metal', phase: 'Solid', appearance: 'null', discoveredBy: 'Joint Institute for Nuclear Research'},
  {position: 116, name: 'Livermorium', weight: 293, symbol: 'Lv', category: 'unknown, probably post-transition metal', phase: 'Solid', appearance: 'null', discoveredBy: 'Joint Institute for Nuclear Research'},
  {position: 117, name: 'Tennessine', weight: 294, symbol: 'Ts', category: 'unknown, probably metalloid', phase: 'Solid', appearance: 'null', discoveredBy: 'Joint Institute for Nuclear Research'},
  {position: 118, name: 'Oganesson', weight: 294, symbol: 'Og', category: 'unknown, predicted to be noble gas', phase: 'Solid', appearance: 'null', discoveredBy: 'Joint Institute for Nuclear Research'},
  {position: 119, name: 'Ununennium', weight: 315, symbol: 'Uue', category: 'unknown, but predicted to be an alkali metal', phase: 'Solid', appearance: 'null', discoveredBy: 'GSI Helmholtz Centre for Heavy Ion Research'},
];

@Component({
  selector: 'app-virtual-table',
  templateUrl: './virtual-table.component.html',
  styleUrls: ['./virtual-table.component.css']
})
export class VirtualTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'category', 'phase', 'appearance', 'discoveredBy'];
  allElements = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  @ViewChild(CdkVirtualScrollViewport, { static: true }) viewport: CdkVirtualScrollViewport;
  rangeStream = new Subject<ListRange>();
  itemSize = 0;
  dataSource = combineLatest([this.allElements.connect(), this.rangeStream]).pipe(
    map(([data, range]) => {
      const offset = this.itemSize * range.start;
      // const offsetString = `translateY(-${offset}px)`;
      const offsetString = `-${offset}px`;

      this.viewport.elementRef.nativeElement.querySelectorAll('th.mat-table-sticky')
          .forEach((el: HTMLElement) => {
              // el.style.transform = offsetString;
              el.style.top = offsetString;
      });

      return data.slice(range.start, range.end);
    }),
  );

  ngAfterViewInit() {
    this.itemSize = +this.viewport.elementRef.nativeElement.attributes.getNamedItem('itemsize').value;

    this.viewport.renderedRangeStream.subscribe(range => this.rangeStream.next(range));
  }
}