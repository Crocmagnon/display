import React from 'react';
import './App.css';
import Tcl, {ILigne, IStop} from "./Tcl";
import {clearInterval, setInterval} from "timers";
import {Button, Col, Container, Row} from "react-bootstrap";
import {IStationInfo, IStationsInfoWrapper, IStationsStatusWrapper, IVelovStation} from "./IVelov";
import Velov from "./Velov";


interface ITclFilteredApi {
    passages: ILigne[];
    stop: IStop;
}

interface IAppState {
    tcl?: ITclFilteredApi;
    refreshDate?: string;
    stations: IVelovStation[];
}

class App extends React.Component<{}, IAppState> {
    timerId?: ReturnType<typeof setInterval>;
    refreshSeconds: number;
    monitoredVelovStationIds: string[] = [];
    monitoredTclStopId: string;

    constructor(props: {}) {
        super(props);
        this.timerId = undefined;
        const urlParams = new URLSearchParams(window.location.search);
        this.refreshSeconds = Number(urlParams.get("refreshSeconds"));
        const velovStationIds = urlParams.get("velovStationIds");
        if (velovStationIds) {
            this.monitoredVelovStationIds = velovStationIds.split(";");
        }
        this.monitoredTclStopId = urlParams.get("tclStopId") || "290";
        if (this.refreshSeconds <= 5) {
            this.refreshSeconds = 60;
        }
        this.state = {stations: []};
    }

    render() {
        return <div>
            <Container className="main">
                <Row sm={2} md={3} className="g-4">
                    {this.state.tcl?.passages.map((ligne) => <Tcl key={ligne.ligne} {...ligne}/>)}
                    {this.state.stations.map((station) => <Velov key={station.info.station_id} {...station}/>)}
                </Row>
                <Row>
                    <Col>
                        <Button variant="secondary" size="lg" onClick={this.refreshData}>Refresh</Button>
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
        const tclPromise = http<ITclFilteredApi>(`https://tcl.augendre.info/stop/${this.monitoredTclStopId}`, {
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
                tcl: tcl,
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
