import React from 'react';
import './App.css';
import Ligne from "./Ligne";
import {ILigne} from "./interfaces";
import {setInterval} from "timers";


interface IAppState {
    passages: ILigne[];
}

class App extends React.Component<{}, IAppState> {
    timerId?: ReturnType<typeof setInterval>;

    constructor(props: {}) {
        super(props);
        this.state = {passages: [{ligne: undefined, delais: [undefined]}]};
        this.timerId = undefined;
    }

    render() {
        return <div className="container">
            <div className="row">
                {this.state.passages.map((ligne) => <Ligne key={ligne.ligne} ligne={ligne.ligne} delais={ligne.delais}/>)}
            </div>
            <div className="row">
                <div className="col-12">
                    <button className="btn btn-block btn-secondary" onClick={this.reload}>Refresh</button>
                </div>
            </div>
        </div>;
    }

    componentDidMount() {
        this.refresh();
        this.timerId = setInterval(this.refresh.bind(this), 60000);
    }

    componentWillUnmount() {
        if (this.timerId) {
            clearInterval(this.timerId);
        }
    }

    refresh() {
        const headers = new Headers();
        headers.set("Authorization", `Basic ${process.env.REACT_APP_TCL_AUTH}`);
        http<IAppState>("https://tcl.augendre.info/stop/290", {method: "GET", headers: headers}).then(json => {
            this.setState(json);
        });
    }

    reload() {
        window.location.reload();
    }
}

async function http<T>(request: RequestInfo, init?: RequestInit): Promise<T> {
    const response = await fetch(request, init);
    return await response.json();
}


export default App;
