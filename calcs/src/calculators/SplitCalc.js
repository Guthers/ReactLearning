import React from 'react';

import Table from 'react-bootstrap/Table';
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'

class SplitCalc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      km: 0,
      sM: 0,
      sS: 0,
    };
  }

  kmToSplit(event) {
    let v = event.target.value
    // No negatives allowed
    if (!isFinite(v)) {
      return // do nothing
    }

    // Calculate
    // finalise state
    // 1/km equals time per km (in hours)
    let tpk = 1/v;
    let tM = tpk * 60;
    let tS = Math.floor((tM - (Math.floor(tM))) * 60);
    tM = Math.floor(tM);

    this.setState({
      km: v,
      sM: tM,
      sS: tS,
    })
  }

  splitToKm(event, isMin) {
    let v = event.target.value
    // No negatives allowed
    if (!isFinite(v)) {
      return // do nothing
    }

    let km = 60 / (isMin ? (v + this.state.sS*60) : (this.state.sM + v*60))

    this.setState({
      km: km,
      sM: isMin ? v: this.state.tM,
      sS: isMin ? this.state.tS: v,
    })
  }

  render() {
    return (
      <Table striped bordered hover variant="dark">
          <thead>
              <tr>
                <th>Speed</th>
                <th>Split Pace</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <InputGroup>
                    <FormControl 
                      value={this.state.km} // Allows for default
                      onChange={(e) => this.kmToSplit(e)}
                    />
                    <InputGroup.Text>Kilometers per hour</InputGroup.Text>
                  </InputGroup>
                </td>
                <td>
                <InputGroup>
                    <FormControl
                      value={this.state.sM} // Allows for default
                      onChange={(e) => this.splitToKm(e, true)}
                    />
                     <InputGroup.Text>Minutes</InputGroup.Text>
                    <FormControl
                      value={this.state.sS} // Allows for default
                      onChange={(e) => this.splitToKm(e, false)}
                    />
                    <InputGroup.Text>Seconds</InputGroup.Text>
                  </InputGroup>
                </td>
              </tr>
            </tbody>
        </Table>
    )
  }
}

export default SplitCalc;