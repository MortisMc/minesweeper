import React from 'react'

export default function InnerCell({ mine, neighbourCell, hiddenCell, ratio }) {

  const innerCellStyle = {
    width : '100%',
    height : '100%',

    backgroundColor : `${mine ? 'red' : 'white'}`,

    fontSize : `${0.3*(100-ratio*100)}vh`,
    
    display : 'flex',
    justifyContent : 'center',
    alignItems : 'center'
  }

  const hiddenStyle = {
    display : 'none'
  }

  return (
    <div style={hiddenCell ? hiddenStyle : innerCellStyle}>{neighbourCell}</div>
  )
}
