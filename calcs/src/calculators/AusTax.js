import React from 'react';

import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import FormControl from 'react-bootstrap/FormControl';
import Table from 'react-bootstrap/Table';
import SelectableContext from "react-bootstrap/SelectableContext";

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
      18200: [0, 0],
      37000: [0.19, 0],
      90000: [0.325, 3572],
      180000: [0.45, 54097]
    }

    this.state = {
      period: "weekly",
      amount: 0,
      calc: {
        year: 0,
        bracket: "",
        implication: "",
        tYear: 0,
        tPeriod: 0,
      }
    }
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
          <FormControl onChange={e => this.updateAmount(e.target.value)}/>
          <InputGroup.Text>{this.state.period}</InputGroup.Text>
        </InputGroup>
        {this.createTable()}
      </div>

    )
  }

  updatePeriod(period) {
    this.reCalculate(this.state.amount, period)
  }

  updateAmount(amount) {
    this.reCalculate(amount, this.state.period)
  }

  reCalculate(amount, period) { // Period is key
    // Extrapolate to year
    let yearGross = amount * this.periods[period]

    // Calculate tax bracket
    let i = 0
    let cutoffs = Object.keys(this.brackets)
    // Progress up the tax brackets until we find the one
    while (yearGross > cutoffs[i]) {
      i += 1
      if (i === cutoffs.length) {
        i -= 1
        break
      }
    }

    let bracket = this.brackets[cutoffs[i]]
    let percentage = bracket[0]
    let lump = bracket[1]

    let alreadyTaxed = (i === 0) ? 0 : cutoffs[i-1]
    let tax = lump + ((yearGross - alreadyTaxed) *  percentage)
  
    let lBound = ((i === 0) ? 0 : cutoffs[i-1])

    this.setState({
      period: period,
      amount: amount,
      calc: {
        year: yearGross,
        bracket: (lBound + 1) + " to " + cutoffs[i],
        implication: "Paying: " + lump + " plus " + percentage*100 + "c for each dollar over $" + lBound,
        tYear: tax,
        tPeriod: tax/this.periods[period],
      }
    })
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
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{"" + this.state.calc.year}</td>
              <td>{this.state.calc.bracket}</td>
              <td>{this.state.calc.implication}</td>
              <td>{"" + this.state.calc.tYear}</td>
              <td>{"" + this.state.calc.tPeriod}</td>
            </tr>
          </tbody>
        </Table>
    )
  }

}

export default AusTax