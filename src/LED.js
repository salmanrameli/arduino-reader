import React from 'react';

const axios = require('axios');
const Store = window.Store;
const store = new Store();

class LED extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            ipAddress: '',
            ledStatus: '',
            ledStatusButton: '',
            buttonLedClass: ''
        }

        this.initLampState = this.initLampState.bind(this)
        this.onLedButtonClicked = this.onLedButtonClicked.bind(this)
    }

    componentDidMount() {
      this.setState({
        ipAddress: `http://${store.get('ipAddress', '192.168.100.200')}`,
        ledStatus: "OFF",
        ledStatusButton: "ON",
        buttonLedClass: "btn-outline-success"
      })

      this.initLampState()
    }

    initLampState() {
      let url = `http://${store.get('ipAddress', '192.168.100.200')}/lamp_off`

      axios.get(url).then(function(_) {
        
      }).catch(function(error) {
        console.log(error);
      })
    }

    onLedButtonClicked() {
      if(this.state.ledStatus === "OFF" && this.state.ledStatusButton === "ON") {
        let url = `${this.state.ipAddress}/lamp_on`
  
        axios.get(url).then(function(_) {
          
        }).catch(function(error) {
          console.log(error);
        })

        this.setState({
          ledStatus: "ON",
          ledStatusButton: "OFF",
          buttonLedClass: "btn-danger"
        })
      } else {
        let url = `${this.state.ipAddress}/lamp_off`
  
        axios.get(url).then(function(_) {
          
        }).catch(function(error) {
          console.log(error);
        })

        this.setState({
          ledStatus: "OFF",
          ledStatusButton: "ON",
          buttonLedClass: "btn-outline-success"
        })
      }
    }

    render() {
      return(
        <div className="card">
            <div className="card-body">
                <h3>
                    LED is {this.state.ledStatus}
                    <button className={`btn ${this.state.buttonLedClass} float-right`} onClick={this.onLedButtonClicked}>Set LED {this.state.ledStatusButton}</button>
                </h3>
            </div>
        </div>
      )
    }
}

export default LED;