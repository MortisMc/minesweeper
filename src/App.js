import React, { useState, useEffect } from 'react';

// Import Components
import GameBoard from './components/GameBoard';
import Controls from './components/Controls';

// Parameters ########################################################################################################################

const ratio = 0.9;                                                        // How much of the vertical screen is taken up by the gameboard

const dimension = 15;                                                     // How many cells are in a width/height of the gameboard
const numberOfCells = dimension * dimension;                              // Total number of cells in the gameboard

const minePercentage = 10;                                                // Percentage of cells that contain mines
const numberOfMines = Math.ceil(numberOfCells * minePercentage / 100);    // Total number of cells in the gameboard

// Styles ########################################################################################################################

const gameBoardStyle = {
  height: '100%'
};

// Functions ########################################################################################################################

// Function that updates states when a new game is started
function resetBoard( setFlagsRemaining, numberOfMines, setWon, setLost, setHidden, setFlags, setMines, setNeighbours ){
  // Stops a false value flashing upon starting the game
  setFlagsRemaining(numberOfMines);

  // Resets game state
  setWon(false);
  setLost(false);

  // Hides all elements
  const hiddenArray = new Array(numberOfCells).fill(1);
  setHidden(hiddenArray);

  // Unflags all elements
  const flagArray = new Array(numberOfCells).fill(0);
  setFlags(flagArray);
  
  // Defines which cells will contain a mine
  const mineArray = new Array(numberOfCells).fill(0);
  let i = 1;
  while(i <= numberOfMines){
    const mineCoordinate = Math.floor(Math.random()*numberOfCells);
    // If already a mine, try again (tally is not incremented)
    if (mineArray[mineCoordinate]) continue;
    mineArray[mineCoordinate] = 1;
    i++;
  }
  setMines(mineArray);

  // Uses splicing to create a 2D matrix to be used to count neighbours
  const mineArrayCopy = [...mineArray]; // mineArray must be cloned because setMines(mineArray) above is async so it mustn't be mutated
  const mineMatrix = [];
  while(mineArrayCopy.length) mineMatrix.push(mineArrayCopy.splice(0,dimension));

  // For non-mine cells with mine neighbours, it counts the number of surrounding mines
  const neighbourArray = new Array(numberOfCells).fill(null)
  for ( let column=0; column<mineMatrix.length; column++ ){
    for ( let row=0; row<mineMatrix.length; row++ ){
      // Ignore mine cells as they should remain blank (null)
      if ( mineMatrix[row][column] ) continue;
      neighbourArray[row*dimension + column] = countNeighbours(mineMatrix, column, row);
    }
  }
  setNeighbours(neighbourArray);
}

// Function that takes an array and an index of an element then returns the number of cells around it containing a 1 (a mine)
function countNeighbours( array, col, row ){
  let count = 0;
  for ( let j=-1; j<=1; j++){
    for ( let k=-1; k<=1; k++){
      // Ignores undefined elements
      if (!array[row+j]) continue;
      if (!array[row+j][col+k]) continue;
      count += array[row+j][col+k]; // Adds the value of the cell (1 for mines, 0 for non-mines)
    }
  }
  return count ? count : null; // Returns the number of mines surrounding the specified cell or null if there are none
}

// Function that handles the clicking of an unflagged non-mine
function unhide( neighbours, hidden, element, expand, flags, setHidden ){
  // Clones the arrays ready for splicing into matrices
  let neighboursArray = [...neighbours];
  let hiddenArray = [...hidden];

  // Creates empty matrix variables ready to be filled 
  let neighboursMatrix = [];
  let hiddenMatrix = [];

  // Trims the arrays row by row and places them in their matrices
  while (neighboursArray.length) neighboursMatrix.push(neighboursArray.splice(0,dimension));
  while (hiddenArray.length) hiddenMatrix.push(hiddenArray.splice(0,dimension));

  // Reclone the array after splicing
  hiddenArray = [...hidden];
  
  // Starts at the clicked cell then expands outward unveiling all adjacent empty neighbourless cells
  const coordinates = [ Math.floor(element/dimension), element%dimension ];
  expand( flags, coordinates, neighbours, hiddenMatrix, hiddenArray );

  // Updates the hiddenArray state once the recursive expand function has complete
  setHidden(hiddenArray);
}

// Function that takes in a starting coordinate and a hiddenArray to updateafter unveiling all adjacent empty neighbourless cells
function expand( flags, [row, column], neighbours, hiddenMatrix, hiddenArray ){
  // Ignore flags
  if (flags[dimension*row+column]) return;
  // Ignore unveiled cells
  if (!hiddenArray[dimension*row+column]) return;

  // Unveil the current cell
  hiddenArray[dimension*row+column] = 0;
  // Ignore cells with mine neighbours
  if (neighbours[dimension*row+column]) return;

  // Call the function again for the cells surrounding the current cell
  for(let i=-1; i<=1; i++ ){
    for(let j=-1; j<=1; j++){
      // Guard clauses to ignore undefineds and already unveiled cells
      if (!hiddenMatrix[row+i]) continue;
      if (!hiddenMatrix[row+i][column+j]) continue;
      // Recurse the function
      expand( flags, [row+i, column+j], neighbours, hiddenMatrix, hiddenArray);
    }
  }
}

// Function that handles the clicking of an unflagged mine 
function gameOver( setHidden, mines, setLost ){
  // Check all cells, if it's a mine? unveil it. If not? then keep it's current value
  setHidden(current => current.map((x, i)=>{
    return mines[i] ? 0 : x;
  }))
  setLost(true);
}

export default function App() {

  // States ########################################################################################################################

  const [mines, setMines] = useState([]);                                   // Array that keeps track of mines and non-mines (1 or 0 respectively)
  const [neighbours, setNeighbours] = useState([]);                         // Array that keeps track of the number of mines surrounding each cell (null if no mines)

  const [hidden, setHidden] = useState([]);                                 // Array that keeps track of hidden and non-hidden cells (1 or 0 respectively)

  const [flags, setFlags] = useState([]);                                   // Array that keeps track of flagged and non-flagged cells (1 or 0 respectively)
  const [flagsRemaining, setFlagsRemaining] = useState(numberOfMines);      // Number of flags left to be assigned

  const [gameBegan, setGameBegan] = useState(false);                        // Boolean stating whether or not the game has began
  const [won, setWon] = useState(false);                                    // Boolean stating whether or not the game has been won
  const [lost, setLost] = useState(false);                                  // Boolean stating whether or not the game has been lost

  // UseEffects ########################################################################################################################

  // Defines winning condition
  useEffect(() => {
    const numberOfMines = mines.reduce((current, previous) => previous + current, 0);
    const numberOfHidden = hidden.reduce((current, previous) => previous + current, 0);
    if (gameBegan && numberOfMines === numberOfHidden) setWon(true);
  },[gameBegan, hidden, mines]);

  // Sets number of flags left available
  useEffect(() => {
    const numberOfMines = mines.reduce((current, previous) => previous + current, 0);
    if (!numberOfMines) return;
    const numberOfFlags = flags.reduce((current, previous) => previous + current, 0);

    setFlagsRemaining(numberOfMines - numberOfFlags);
  },[flags, mines]);

  // Prop objects ########################################################################################################################

  const gameBoardPropsObject = {
    // Status props
    gameBegan,
    won,
    lost,

    // Function props
    setFlags,
    unhide,
    gameOver,
    expand,
    setHidden,
    setLost,

    // Game data props
    mines,
    flags,
    neighbours,
    hidden,
    flagsRemaining,

    // Layout props
    dimension,
    ratio
  }

  const controlsPropsObject = {
    // Status props
    gameBegan,
    won,
    lost,

    // Function props
    setGameBegan,
    resetBoard,
    setFlagsRemaining,
    setWon,
    setLost,
    setHidden,
    setFlags,
    setMines,
    setNeighbours,

    // Game data props
    flagsRemaining,
    numberOfMines,

    // Layout props
    ratio
  }

  return (
    <div style={gameBoardStyle}>
      <GameBoard {...gameBoardPropsObject} />
      <Controls {...controlsPropsObject} />      
    </div>
  )
}