import React from 'react';

const axios = require('axios')
const Store = window.Store;
const store = new Store();

class Servo0 extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: '',
            ipAddress: ''
        }

        this.onSliderValueChange = this.onSliderValueChange.bind(this)
    }

    componentDidMount() {
        this.setState({
            value: '0',
            ipAddress: store.get('ipAddress', '192.168.100.200')
        })
    }

    onSliderValueChange(e) {
        let value = e.target.value

        const url = `http://${this.state.ipAddress}/servo0?value=${value}&`

        axios.get(url, {timeout: 2000}).then(response => {
            let value = response.data

            this.setState({
                value: value
            }).catch(error => {
                console.log(error)
            })
        })
    }

    render() {
        return(
            <div className="card">
                <div className="card-header">
                    Servo 0
                </div>
                <div className="card-body">
                    <h3>Current Value: {this.state.value}</h3>
                    Set: &nbsp;<input type="range" name="points" min="0" max="100" value={this.state.value} onChange={(e) => this.onSliderValueChange(e)} />
                </div>
            </div>
        )
    }
}

export default Servo0;