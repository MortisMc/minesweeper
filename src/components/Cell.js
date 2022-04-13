import React from 'react'
import InnerCell from './InnerCell'

export default function Cell({ won, lost, gameOver, mine, flag, neighbourCell, hiddenCell, element, setFlags, unhide, expand, setHidden, setLost, mines, hidden, neighbours, flags, flagsRemaining, ratio }) {

  const cellStyle = {
    border : '0.5px solid black',

    backgroundColor : `${flag ? 'blue' : 'inherit'}`,
    
    display : 'flex',
    justifyContent : 'center',
    alignItems : 'center'
  }



  function handleClick(){
    if (lost || won) return
    if (flag) return

    if (mine) {
      gameOver( setHidden, mines, setLost )
      return
    }

    if (hiddenCell){
      unhide( neighbours, hidden, element, expand, flags, setHidden )
    }
  }

  function handleRightClick(e){
    e.preventDefault()
    if (lost || won) return
    if ( !hiddenCell ) return
    setFlags( current => current.map( (x,i) => {
       return i === element ? 
       flagsRemaining ? !x : 0 
       :
       x
    }) )
  }
  
  const propsObject = {
    // Cell data props
    mine,
    neighbourCell,
    hiddenCell,

    // Layout props
    ratio
  }

  return (
    <div onClick={handleClick} onContextMenu={handleRightClick} style={cellStyle}>
      <InnerCell {...propsObject} />
    </div>
  )
}
