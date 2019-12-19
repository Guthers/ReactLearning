import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
 
const AnyReactComponent = ({ text }) => <p>{text}</p>

class MyMap extends Component {
  static defaultProps = {
    center: {
      lat: -27.471885, 
      lng: 153.030886
    },
    zoom: 11
  };
 
  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: /* YOUR KEY HERE */ ""}}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={-27.471885}
            lng={153.030886}
            text="My Marker"
            onClick={this.clicked()}
          />
        </GoogleMapReact>
      </div>
    );
  }
  
  clicked() {
    console.log("clciked!");
  };
}

export default MyMap