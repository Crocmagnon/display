export interface IStationInfo {
    address: string;
    capacity: number;
    lat: number;
    lon: number;
    name: string;
    station_id: string;
}

export interface IStationsInfo {
    stations: IStationInfo[];
}

export interface IStationsInfoWrapper {
    data: IStationsInfo;
}

export interface IStationStatus {
    is_installed: number;
    is_renting: number;
    is_returning: number;
    last_reported: number;
    num_bikes_available: number;
    num_docks_available: number;
    station_id: string;
}

export interface IStationsStatus {
    stations: IStationStatus[];
}

export interface IStationsStatusWrapper {
    data: IStationsStatus;
}

export interface IVelovStation {
    info: IStationInfo;
    status: IStationStatus;
}
