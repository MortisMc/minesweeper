import React from 'react'

export default function Controls({ gameBegan, won, lost, setGameBegan, resetBoard, setFlagsRemaining, setWon, setLost, setHidden, setFlags, setMines, setNeighbours, flagsRemaining, numberOfMines, ratio }) {
  
  const controlHeight = `max(${ (1-ratio) * 100 }vh, calc(100vh - 100vw))`

  const controlsStyle = {
    backgroundColor: 'black',

    height : controlHeight,
    minHeight: '10vh',
  
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: `${0.2*(100-ratio*100)}vh`
  }

  const boxStyle = {
    backgroundColor: 'white',

    height: '50px',
    maxHeight: `calc(${controlHeight} * 0.7)`,
    margin: `auto 0`,
    padding: `${0.05*(100-ratio*100)}vh`,
    fontSize : `${0.3*(100-ratio*100)}vh`,

    textAlign: 'center',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const buttonStyle = {
    backgroundColor : 'green',
    color : 'white'
  }


  function handleClick(){
    if (!gameBegan) {
      resetBoard(setFlagsRemaining, numberOfMines, setWon, setLost, setHidden, setFlags, setMines, setNeighbours)
    }
    setGameBegan( current => !current)
  }

  function handleDisplayOutput(){
    if (!gameBegan) return 'Good Luck!'
    if (lost) return 'GAME OVER'
    if (won) return 'YOU WON!'

    return `Flags Remaining: ${flagsRemaining}` 
  }


  function chooseColour(){
    if (!gameBegan || (!won && !lost)) return { backgroundColor : 'white'}
    if (won) return { backgroundColor : 'green', color : 'white' }
    if (lost) return { backgroundColor : 'red', color : 'white' }
  }
  

  return (
    <div style={controlsStyle}>
      <button onClick={handleClick} style={{...boxStyle, ...buttonStyle}} >{gameBegan ? 'Restart' : 'Start'}</button>
      <div style={{...boxStyle, ...chooseColour()}}>{handleDisplayOutput()}</div>
    </div>
  )
}
