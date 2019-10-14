import React from 'react';

const axios = require('axios');
const Store = window.Store;
const store = new Store();

class LED extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            ipAddress: '',
            stream: '',
            ledStatus: '',
            ledStatusButton: '',
            buttonLedClass: ''
        }

        this.setLampStateIsOff = this.setLampStateIsOff.bind(this)
        this.setLampStateIsOn = this.setLampStateIsOn.bind(this)
        this.initLampState = this.initLampState.bind(this)
        this.streamData = this.streamData.bind(this)
        this.onLedButtonClicked = this.onLedButtonClicked.bind(this)
    }

    componentDidMount() {
      this.initLampState()

      this.setState({
        ipAddress: `http://${store.get('ipAddress', '192.168.100.200')}`,
        stream: setInterval(this.streamData, 10000),
      })
    }

    setLampStateIsOff() {
      this.setState({
        ledStatus: "OFF",
        ledStatusButton: "ON",
        buttonLedClass: "btn-outline-success"
      })
    }

    setLampStateIsOn() {
      this.setState({
        ledStatus: "ON",
        ledStatusButton: "OFF",
        buttonLedClass: "btn-danger"
      })
    }

    initLampState() {
      let url = `http://${store.get('ipAddress', '192.168.100.200')}/lamp_state`

      axios.get(url).then(response => {
        let value = response.data.trim()

        if(value === "ON") {
          this.setLampStateIsOn()
        } else if(value === "OFF") {
          this.setLampStateIsOff()
        }        
      }).catch(function(error) {
        console.log(error);
      })
    }

    streamData() {
      const url = `http://${store.get('ipAddress', '192.168.100.200')}/lamp_state`

      axios.get(url, {timeout: 2000}).then(response => {
        let value = response.data.trim()

        if(value === "ON") {
          this.setLampStateIsOn()
        } else if(value === "OFF") {
          this.setLampStateIsOff()
        }
      }).catch(function(error) {
        console.log(error);
      })
    }

    onLedButtonClicked() {
      if(this.state.ledStatus === "OFF" && this.state.ledStatusButton === "ON") {
        let url = `${this.state.ipAddress}/lamp_on`
  
        axios.get(url).then(response => {
          this.setLampStateIsOn()
        }).catch(function(error) {
          console.log(error);
        })
      } else {
        let url = `${this.state.ipAddress}/lamp_off`
  
        axios.get(url).then(response => {
          this.setLampStateIsOff()
        }).catch(function(error) {
          console.log(error);
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