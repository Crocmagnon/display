import React from 'react';
import './App.css';
import Ligne from "./Ligne";
import {ILigne} from "./interfaces";
import {setInterval, clearInterval} from "timers";
import {Col, Row, Container, Dropdown, DropdownButton} from "react-bootstrap";


interface IAppState {
    passages: ILigne[];
    refreshDate?: string;
}

class App extends React.Component<{}, IAppState> {
    timerId?: ReturnType<typeof setInterval>;
    refreshSeconds: number;

    constructor(props: {}) {
        super(props);
        this.timerId = undefined;
        const urlParams = new URLSearchParams(window.location.search);
        this.refreshSeconds = Number(urlParams.get("refreshSeconds"));
        if (this.refreshSeconds <= 5) {
            this.refreshSeconds = 60;
        }
        this.state = {passages: [{ligne: undefined, delais: [undefined]}]};
    }

    render() {
        return <div>
            <Container className="main">
                <Row md={3}>
                    {this.state.passages.map((ligne) => <Ligne key={ligne.ligne} ligne={ligne.ligne}
                                                               delais={ligne.delais}/>)}
                </Row>
                <Row>
                    <Col>
                        <DropdownButton variant="secondary" size="lg" title="Refresh">
                           <Dropdown.Item onClick={this.refreshData}>Data</Dropdown.Item>
                           <Dropdown.Item onClick={this.reload}>Full page</Dropdown.Item>
                        </DropdownButton>
                    </Col>
                </Row>
            </Container>
            <footer>
                <Container>
                    {process.env.REACT_APP_VERSION} built on {process.env.REACT_APP_DATE}.
                    Refreshed: {this.state.refreshDate}.
                </Container>
            </footer>
        </div>;
    }

    componentDidMount() {
        this.refreshAndSetupTimer();
    }

    componentWillUnmount() {
        this.resetTimer();
    }

    private refreshData = () => {
        this.resetTimer();
        this.refreshAndSetupTimer();
    }

    private resetTimer() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = undefined;
        }
    }

    private refreshAndSetupTimer() {
        this.refresh();
        this.timerId = setInterval(this.refresh.bind(this), this.refreshSeconds * 1000);
    }

    private refresh() {
        const headers = new Headers();
        headers.set("Authorization", `Basic ${process.env.REACT_APP_TCL_AUTH}`);
        http<IAppState>("https://tcl.augendre.info/stop/290", {method: "GET", headers: headers}).then(json => {
            json.refreshDate = new Date().toLocaleString("fr-fr");
            this.setState(json);
        });
    }

    private reload = () => {
        window.location.reload();
    }
}

async function http<T>(request: RequestInfo, init?: RequestInit): Promise<T> {
    const response = await fetch(request, init);
    return await response.json();
}


export default App;
