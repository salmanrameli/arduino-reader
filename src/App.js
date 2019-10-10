import React from 'react';
import Setting from './Setting';
import LED from './LED';
import Potentiometer0 from './Potentiometer0'
import Potentiometer1 from './Potentiometer1'

class App extends React.Component {
  render() {
    return(
      <div>
        <Setting />
        <LED />
        <Potentiometer0 />
        <Potentiometer1 />
      </div>
    );
  }
}

export default App;