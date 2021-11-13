import React from 'react';
import './App.css';
import Tcl, {ILigne} from "./Tcl";
import {clearInterval, setInterval} from "timers";
import {Col, Container, Dropdown, DropdownButton, Row} from "react-bootstrap";
import {IStationInfo, IStationsInfoWrapper, IStationsStatusWrapper, IVelovStation} from "./IVelov";
import Velov from "./Velov";


interface ITclFilteredApi {
    passages: ILigne[];
}

interface IAppState {
    passages: ILigne[];
    refreshDate?: string;
    stations: IVelovStation[];
}

class App extends React.Component<{}, IAppState> {
    timerId?: ReturnType<typeof setInterval>;
    refreshSeconds: number;
    monitoredVelovStationIds: string[] = [];

    constructor(props: {}) {
        super(props);
        this.timerId = undefined;
        const urlParams = new URLSearchParams(window.location.search);
        this.refreshSeconds = Number(urlParams.get("refreshSeconds"));
        const velovStationIds = urlParams.get("velovStationIds");
        if (velovStationIds) {
            this.monitoredVelovStationIds = velovStationIds.split(";");
        }
        if (this.refreshSeconds <= 5) {
            this.refreshSeconds = 60;
        }
        this.state = {passages: [{ligne: undefined, delais: [undefined]}], stations: []};
    }

    render() {
        return <div>
            <Container className="main">
                <Row sm={2}>
                    {this.state.passages.map((ligne) => <Tcl key={ligne.ligne} ligne={ligne.ligne}
                                                             delais={ligne.delais}/>)}
                </Row>
                <Row sm={2}>
                    {this.state.stations.map((station) => <Velov key={station.info.station_id} info={station.info} status={station.status}/>)}
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
        const tclPromise = http<ITclFilteredApi>("https://tcl.augendre.info/stop/290", {
            method: "GET",
            headers: headers
        });
        const velovInfoPromise = http<IStationsInfoWrapper>("https://transport.data.gouv.fr/gbfs/lyon/station_information.json", {method: "GET"});
        const velovStatusPromise = http<IStationsStatusWrapper>("https://transport.data.gouv.fr/gbfs/lyon/station_status.json", {method: "GET"});
        Promise.all([tclPromise, velovInfoPromise, velovStatusPromise]).then(values => {
            const tcl = values[0];
            const velovInfo = values[1];
            const stationsInfo: Record<string, IStationInfo> = {};
            for (const stationInfo of velovInfo.data.stations) {
                if (this.monitoredVelovStationIds.includes(stationInfo.station_id)) {
                    stationsInfo[stationInfo.station_id] = stationInfo;
                }
            }
            const velovStatus = values[2];
            const stationsDict = new Map<string, IVelovStation>();
            for (const stationStatus of velovStatus.data.stations) {
                if (this.monitoredVelovStationIds.includes(stationStatus.station_id)) {
                    const velovStation: IVelovStation = {
                        status: stationStatus,
                        info: stationsInfo[stationStatus.station_id]
                    };
                    stationsDict.set(velovStation.info.station_id, velovStation);
                }
            }
            const stations: IVelovStation[] = [];
            for (const monitoredVelovStationId of this.monitoredVelovStationIds) {
                const stationInfo = stationsDict.get(monitoredVelovStationId);
                if (stationInfo) {
                    stations.push(stationInfo);
                }
            }
            this.setState({
                refreshDate: new Date().toLocaleString("fr-fr"),
                passages: tcl.passages,
                stations: stations,
            });
        })
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
