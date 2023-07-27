import React from 'react';
import parse from 'html-react-parser';

function Header(props) {

  return (
    <h3 style={{color: props.color, margin: "5% auto", textAlign: "justify", textAlignLast: "center"}}>{parse(props.title)}</h3>
  )
}

export default Header