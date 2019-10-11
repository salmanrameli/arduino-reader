import React from 'react';
import Setting from './Setting';
import LED from './LED';
import Potentiometer0 from './Potentiometer0'
import Potentiometer1 from './Potentiometer1'

const Store = window.Store;
const store = new Store();

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = ({
      ipAddress: ''
    })
  }

  componentDidMount() {
    this.setState({
      ipAddress: `http://${store.get('ipAddress', '0.0.0.0')}`
    })
  }

  render() {
    return(
      this.state.ipAddress === '0.0.0.0' ? 
      <div>
        <Setting /> 
      </div>
      :
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