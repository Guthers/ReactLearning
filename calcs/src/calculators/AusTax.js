import React from 'react';

import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import FormControl from 'react-bootstrap/FormControl';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import SelectableContext from "react-bootstrap/SelectableContext";

const invalidAlert = <Alert variant="danger">Please enter a valid number</Alert>;

class AusTax extends React.Component {
  constructor(props) {
    super(props)

    // Setup data
    this.periods = {
      "weekly": 52,
      "fortnightly": 26,
      "monthly": 12,
      "yearly": 1
    }

    this.brackets = {
      //        [Tax %, Lump,   LBound]
      18200:    [0,     0,      0],
      37000:    [0.19,  0,      18201],
      90000:    [0.325, 3572,   37001],
      180000:   [0.37,  20797,  90001],
      infinity: [0.45,  54097,  180001]
    }

    this.state = this.calcState(0, "weekly")
  }
  
  render() {
    return (
      <div>
        <InputGroup>
        <SelectableContext.Provider value={false}> {/* Required as per https://github.com/react-bootstrap/react-bootstrap/issues/4176 */}
          <DropdownButton
            as={InputGroup.Prepend}
            variant="outline-secondary"
            title="Billing Period"
            onSelect={e => this.updatePeriod(e)}
          >
            {Object.keys(this.periods).map((key) => {
              return (
                <Dropdown.Item href="#" key={key} eventKey={key}>{key}</Dropdown.Item>
              )
            })}
          </DropdownButton>
          </SelectableContext.Provider>
          <FormControl onChange={e => this.updateAmount(e.target.value)} defaultValue="0"/>
          <InputGroup.Text>{this.state.period}</InputGroup.Text>
        </InputGroup>
        {this.createTableSpreadOut()}
      </div>
    )
  }

  amountForPeriod(amount, initalPeriod, newPeriod) {
    if (initalPeriod === newPeriod) return amount !== ""? +amount: 0
    
    let yearGross = amount * this.periods[initalPeriod]
    let period = yearGross / this.periods[newPeriod]

    return period
  }

  updatePeriod(period) {
    this.setState(this.calcState(this.state.amount, period))
  }

  updateAmount(amount) {
    if (isNaN(amount)) {
      amount = 0
    }
    this.setState(this.calcState(amount, this.state.period)) 
  }

  getTaxBrackets(amount) {
    let uBounds = Object.keys(this.brackets);
    let bound;
    for(bound of uBounds) {
      if (+amount <= +bound) {
        return bound
      }
    }
    return bound
  }
  calcState(amount, period) { // Period is key
    // Extrapolate to year
    let yearGross = amount * this.periods[period];

    // Calculate tax bracket
    let uBound = this.getTaxBrackets(amount);
    let bracket = this.brackets[uBound];

    let percentage = bracket[0];
    let lump = bracket[1];
    let lBound = bracket[2];

    let alreadyTaxed = +lBound;
    let tax = lump + ((yearGross - alreadyTaxed) *  percentage);

    let tInPeriod = tax/this.periods[period];
    let pPeriod = ((amount !== 0) ? ((tInPeriod/amount)*100) : 0).toFixed(2);

    let bracketStr = (lBound !== 0 ? lBound : 0) + " to " + (uBound===0 ? "infinity" : uBound);
    let implication = "$" + lump + " plus " + percentage*100 + "c for each dollar over $" + lBound; 
    return {
        valid: true,
        period: period,
        amount: amount,
        calc: {
          year: yearGross,
          bracket: bracketStr,
          implication: implication,
          tYear: tax.toFixed(2),
          tPeriod: tInPeriod.toFixed(2),
          rPeriod: (amount - tInPeriod).toFixed(2),
          pPeriod: isNaN(pPeriod)? 0: pPeriod
        }
      }
  }
  
  createTable() {
    return (
      <Table>
          <thead>
            <tr>
              <th>Earnt in year</th>
              <th>Tax Bracket</th>
              <th>Implication</th>
              <th>Tax in year</th>
              <th>Tax in period</th>
              <th>Remainder in period</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{"" + this.state.calc.year}</td>
              <td>{this.state.calc.bracket}</td>
              <td>{this.state.calc.implication}</td>
              <td>{"" + this.state.calc.tYear}</td>
              <td>{"" + this.state.calc.tPeriod}</td>
              <td>{"" + this.state.calc.rPeriod}</td>
            </tr>
          </tbody>
        </Table>
    )
  }

  createTableSpreadOut() {
    return (
      <div>
        <p>Tax Bracket is ({this.state.calc.bracket}) which has the tax implication of {this.state.calc.implication} ({this.state.calc.pPeriod}%)</p>
        <Table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Amount in period</th>
              <th>Tax in period</th>
              <th>Remainder in period</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.periods).map((period, index) => {
              let periodAmount = this.amountForPeriod(this.state.amount,this.state.period,period).toFixed(2);
              let cals = this.calcState(periodAmount, period).calc
              return (
                <tr key={index}>
                  <td>{period}</td>
                  <td>{periodAmount}</td>
                  <td>{cals.tPeriod}</td>
                  <td>{cals.rPeriod}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div> 
    )
  }

}

export default AusTax