import React from "react";

export default function Instructions({ ratio }) {

  const listStyle = {
    height : '100%',
    fontSize : `${0.3*(100-ratio*100)}vh`,

    display : 'flex',
    flexDirection : 'column',
    justifyContent : 'space-around'
  }

  return (
      <ul style={listStyle}>
        {/* <img src="../resources/React-icon.svg" alt="React Logo" /> */}
        <h1 style={{textAlign : 'center'}}>Minesweeper!</h1>
        <li>The objective is to clear all non-mine squares by clicking them</li>
        <li>Right click to place a flag to keep track of mines</li>
        <li>You are given one flag per mine</li>
      </ul>
  )
}
