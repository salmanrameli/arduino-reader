import React from 'react';
import CanvasJSReact from '../src/lib/canvasjs.react';

const { ipcRenderer } = window.electronObject;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;
const axios = require('axios');
const Store = window.Store;
const store = new Store();

let dps = []

class Potentiometer1 extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: '',
            isReading: '',
            buttonLabel: '',
            buttonStreamClass: '',
            buttonSettingClass: '',
            settingButtonLabel: '',
            settingIsOpen: '',
            stream: '',
            p1Interval: '',
            ipAddress: '',
            alertFlag: '',
            numberOfSuccessReplies: '',
            numberOfErrors: '',
            potentialNetworkIssues: '',
            isDisconnected: ''
        }

        this.streamData = this.streamData.bind(this)
        this.startStream = this.startStream.bind(this)
        this.stopStream = this.stopStream.bind(this)
        this.onButtonSettingClicked = this.onButtonSettingClicked.bind(this)
        this.onButtonStartReadClicked = this.onButtonStartReadClicked.bind(this)
        this.onIntervalSettingSubmit = this.onIntervalSettingSubmit.bind(this)
    }

    componentDidMount() {
        this.setState({
            isReading: false,
            buttonLabel: "Start Reading",
            buttonStreamClass: "btn-outline-success",
            buttonSettingClass: "btn-outline-dark",
            settingButtonLabel: "Open Setting",
            settingIsOpen: false,
            p1Interval: store.get('p1Interval', 1000),
            value: "Not Started",
            ipAddress: store.get('ipAddress', '192.168.100.200'),
            alertFlag: true,
            numberOfSuccessReplies: 0,
            numberOfErrors: 0,
            potentialNetworkIssues: false,
            isDisconnected: false
        })
    }

    streamData() {
        const url = `http://${this.state.ipAddress}/p1`

        axios.get(url, {timeout: 2000}).then(response => {
            let value = response.data

            let i = this.state.numberOfSuccessReplies
            let numberOfSuccessReplies = parseInt(i, 10)

            numberOfSuccessReplies++

            this.setState({
                numberOfSuccessReplies: numberOfSuccessReplies
            })

            if(this.state.numberOfSuccessReplies > 5) {
                this.setState({
                    numberOfErrors: 0,
                    numberOfSuccessReplies: 6,
                    potentialNetworkIssues: false
                })
            }

            this.setState({
                value: value
            })

            dps.push({
                x: new Date(),
                y: value
            })

            if(dps.length > 10) {
                dps.shift();
            }

            this.chart.render()
        }).catch(error => {
            let i = this.state.numberOfErrors
            let numberOfErrors = parseInt(i, 10)

            numberOfErrors++

            this.setState({
                numberOfErrors: numberOfErrors
            })

            if(this.state.numberOfErrors > 5) {
                this.setState({
                    potentialNetworkIssues: true
                })
            }

            if(numberOfErrors > 10) {
                this.stopStream()

                this.setState({
                    potentialNetworkIssues: false,
                    isDisconnected: true
                })

                if(this.state.alertFlag) {
                    ipcRenderer.send('connection-error', 'Potentiometer 1')
                    
                    this.setState({
                        alertFlag: false
                    })
                }
            }
        })
    }

    startStream() {
        this.setState({
            stream: setInterval(this.streamData, this.state.p1Interval),
            isReading: true,
            buttonLabel: "Stop Reading",
            buttonStreamClass: "btn-danger",
            alertFlag: true
        })
    }

    stopStream() {
        clearInterval(this.state.stream)

        this.setState({
            isReading: false,
            buttonLabel: "Start Reading",
            buttonStreamClass: "btn-outline-success",
        })
    }

    onButtonStartReadClicked() {
        if(this.state.isReading) {
            this.stopStream()
        } else {
            this.startStream()
        }
    }

    onButtonSettingClicked() {
        if(this.state.settingIsOpen) {
            this.setState({
                settingIsOpen: false,
                settingButtonLabel: "Show Setting",
                buttonSettingClass: "btn-outline-dark"
            })
        } else {
            this.setState({
                settingIsOpen: true,
                settingButtonLabel: "Hide Setting",
                buttonSettingClass: "btn-dark"
            })
        }
    }

    onIntervalSettingSubmit(e) {
        let p1Interval = e.target.interval.value;

        store.set('p1Interval', p1Interval)
        
        this.setState({
            p1Interval: p1Interval,
            settingIsOpen: false,
            settingButtonLabel: "Show Setting",
            buttonSettingClass: "btn-outline-dark"
        })
    }

    render() {
        const options = {
			title: {
				text: ""
            },
            axisY: {
                maximum: 1100,
                interval: 100
            },
			data: [{
				type: "line",
				dataPoints : dps
			}]
        }
        
        return(
            <div className="card">
                <div className="card-header">
                    Potentiometer 1 Reading
                    {this.state.isReading ?
                        <button type="button" className="btn btn-outline-secondary btn-sm float-right" onClick={this.onButtonSettingClicked} disabled>{this.state.settingButtonLabel}</button>
                        :
                        <button type="button" className={`btn ${this.state.buttonSettingClass} btn-sm float-right`} onClick={this.onButtonSettingClicked}>{this.state.settingButtonLabel}</button>
                    }
                </div>
                <div className="card-body">
                    {this.state.potentialNetworkIssues ? 
                        <div className="alert alert-warning" role="alert">
                            Warning! There might be some network issues that delayed responses from Arduino.
                        </div>
                        :
                        ''
                    }
                    {this.state.isDisconnected ? 
                        <div className="alert alert-danger" role="alert">
                            Device was disconnected due to problems either from the network or the device itself.
                        </div>
                        :
                        ''
                    }
                    <h3>
                        Reading value: {this.state.value}
                        <button type="button" className={`btn ${this.state.buttonStreamClass} float-right`} onClick={this.onButtonStartReadClicked}>{this.state.buttonLabel}</button>
                    </h3>
                    <small>Interval: {this.state.p1Interval}ms</small>
                    <br></br>
                    <br></br>
                    <CanvasJSChart options={options} onRef={ref => this.chart = ref} />
                    {this.state.settingIsOpen && this.state.isReading === false ? 
                        <form id="windowSizeSetting" onSubmit={this.onIntervalSettingSubmit}>
                            <br></br>
                            <hr></hr>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label className="form-label" htmlFor="interval">Interval:</label>
                                    <input className="form-control form-control-lg" type="text" name="interval" placeholder={this.state.p1Interval} />
                                </div>
                                <button className="btn btn-success" type="submit"><i className="fa fa-bookmark"></i> Set</button>
                            </div>
                        </form>
                        :
                        '' 
                    }
                </div>
            </div>
        )
    }
}

export default Potentiometer1;