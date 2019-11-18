import React from 'react';

import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import SelectableContext from "react-bootstrap/SelectableContext";

class DropdownExpand extends React.Component {
  constructor(props) {
    super(props)

    this.someList = {
      key1: "val1",
      key2: "val1",
      key3: "val1",
      key4: "val1",
    }

    this.state = {
      current_selection: null
    }

    // TODO fix the \n\t as it does nothing
    this.txt = " " +
      "" + 
      "\n\t " +
      "\n\t" +
      "\n\t"
  }

  render() {
    return (
      <div>
        <span>This is a snippet example for a dropdown inside an accordion being able to do three things:
        <br/>1: show outside of its container
        <br/>2: changing the name based on the selection
        <br/>3: not close the accordion when selected
        </span>
        <SelectableContext.Provider value={false}> {/* Required as per https://github.com/react-bootstrap/react-bootstrap/issues/4176 */}
          <DropdownButton
            as={InputGroup.Prepend}
            title={this.state.current_selection === null ? "Selection" : this.state.current_selection}
            onSelect={e => this.doSelection(e)}
            id="dropdown-expand-example"
          >
            {Object.keys(this.someList).map((key) => {
              return (
                <Dropdown.Item key={key} eventKey={key}>{key}</Dropdown.Item>
              )
            })}
          </DropdownButton>
        </SelectableContext.Provider>
        <div>The current selection is: '{this.state.current_selection === null ? "" : this.state.current_selection}'</div>
      </div>

    )
  }

  doSelection(selection) {
    // This should update the title
    this.setState({
      current_selection: selection
    })
  }
}

export default DropdownExpand