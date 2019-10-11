import React from 'react';

const Store = window.Store;
const store = new Store();

class Setting extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showSetting: '',
            ipAddress: '',
            showSettingButton: '',
            buttonSettingClass: '',
            settingButtonLabel: ''
        }

        this.onShowSettingButtonClicked = this.onShowSettingButtonClicked.bind(this)
        this.onIpAdressSubmit = this.onIpAdressSubmit.bind(this)
    }

    componentDidMount() {        
        let ipAddress = store.get('ipAddress', '')

        if(ipAddress === '') {
            this.setState({
                showSetting: true,
                showSettingButton: false,
                buttonSettingClass: "btn-dark",
            })
        } else {
            this.setState({
                showSetting: false,
                showSettingButton: true,
                buttonSettingClass: "btn-outline-dark",
                ipAddress: ipAddress
            })
        }

        this.setState({
            settingButtonLabel: "Show Setting"
        })
    }

    onShowSettingButtonClicked() {
        if(this.state.showSetting === true) {
            this.setState({
                showSetting: false,
                settingButtonLabel: "Show Setting",
                buttonSettingClass: "btn-outline-dark",
            })
        } else {
            this.setState({
                showSetting: true,
                settingButtonLabel: "Hide Setting",
                buttonSettingClass: "btn-dark",
            })
        }
    }

    onIpAdressSubmit(e) {
        let ipAddress = e.target.ip_address.value;

        store.set('ipAddress', ipAddress)
        
        this.setState({
            ipAddress: ipAddress,
            showSetting: false,
            showSettingButton: true,
            settingButtonLabel: "Show Setting",
            buttonSettingClass: "btn-outline-dark",
        })
    }

    render() {
        return(
            <div>
                <div className="pb-2 mt-4 mb-2 border-bottom">
                    <h1>
                        Arduino + Electron
                        {this.state.showSettingButton === true ? <button type="button" className={`btn ${this.state.buttonSettingClass} btn-sm float-right`} onClick={this.onShowSettingButtonClicked}>{this.state.settingButtonLabel}</button> : ''}
                    </h1>
                </div>
                {this.state.showSetting === true ?
                    <div className="card">
                        <div className="card-body">
                            <form id="windowSizeSetting" onSubmit={this.onIpAdressSubmit}>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label className="form-label" htmlFor="ip_address">Arduino IP Address:</label>
                                    <input className="form-control form-control-lg" type="text" name="ip_address" placeholder={this.state.ipAddress} />
                                </div>
                                <button className="btn btn-success" type="submit"><i className="fa fa-bookmark"></i> Save</button>
                            </div>
                            </form>
                        </div>
                    </div>
                :
                    ''
                }
            </div>
        )
    }
}

export default Setting;