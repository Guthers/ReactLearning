import React from 'react';
// import logo from './logo.svg';
// import styles from './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Card';

import SplitCalc from './calculators/SplitCalc';
import AusTax from './calculators/AusTax';
import ButtonClose from './examples/DropdownExpand'

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1 className="App-title">Hello!</h1>
        <p>This page is just a few calculators!</p>
        <div>
          {this.buildAccordion()}
        </div>
      </div>
    );
  }

  buildAccordion() {
    const aList = [[
        <Card.Header>Simple Aus Tax Calculator</Card.Header>,
        <AusTax />
      ], [
        <Card.Header>Split Calculator</Card.Header>,
        <SplitCalc />
      ], [
        <Card.Header>Dropdown Test</Card.Header>,
        <ButtonClose />
      ], [
        <Card.Header>Foo</Card.Header>,
        <p>Bar</p>
      ]];

    return (
      <Accordion defaultActiveKey={0}>
        {aList.map((p, index) => {
          return (
            <Card key={index} style={{overflow: "visible"}}>
              <Accordion.Toggle as={Button} eventKey={index}>
                {p[0]}
              </Accordion.Toggle>
              <Accordion.Collapse eventKey={index}>
                {p[1]}
              </Accordion.Collapse>
            </Card>
          )
        })}
      </Accordion>
    )
  }
}

export default App;
