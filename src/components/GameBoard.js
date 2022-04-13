import React from 'react'
import Cell from './Cell'
import { v4 as uuid } from 'uuid'
import Instructions from './Instructions'


export default function GameBoard({ won, lost, gameBegan, setFlags, unhide, gameOver, expand, setHidden, setLost, mines, flags, neighbours, hidden, flagsRemaining, dimension, ratio }) {

  const cells = new Array(dimension*dimension).fill(0);

  const gridStyles = {
    backgroundColor : 'darkgrey',
  
    height : `min(${ratio*100}vh, 100vw)`,
    aspectRatio : '1',

    display : 'grid',
    gridTemplateColumns : `repeat(${dimension},1fr)`,
    gridTemplateRows : `repeat(${dimension},1fr)`
  };
  
  const instructionStyles = {
    backgroundColor : 'darkgrey',
  
    height : `min(${ratio*100}vh, 100vw)`,
    aspectRatio : '1',
    padding : '10%',
    
    display : 'flex',
    flexDirection : 'column',
    justifyContent : 'space-evenly',
    alignItems : 'center'
  };
  
  function returnPropsObject(i) {
    return {
      // Status props
      won,
      lost,
      gameOver,

      // Cell data props
      mine: mines[i],
      flag: flags[i],
      neighbourCell: neighbours[i],
      hiddenCell: hidden[i],

      // Cell identifier props
      element: i,
      key: uuid(),

      // Function props
      setFlags,
      unhide,
      expand,
      setHidden,
      setLost,

      // Game data props
      mines, 
      hidden,
      neighbours,
      flags,
      flagsRemaining,

      // Layout props
      ratio
    } 
  }

  return (
    <div style={gameBegan ? gridStyles : instructionStyles}>
      {
      gameBegan ?
        cells.map( (x, i) => <Cell {...returnPropsObject(i)} />)
      :
        <Instructions ratio={ratio} />
      }
    </div>
  )
}
