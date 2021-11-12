import React from "react";
import {ILigne, PassageType} from "./interfaces";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBus} from '@fortawesome/free-solid-svg-icons'


export default class Ligne extends React.Component<ILigne> {
    render() {
        return <div className="col-4">
            <div className="card">
                <div className="card-header"><FontAwesomeIcon icon={faBus}/> {placeholder(this.props.ligne)}</div>
                <Passages passages={this.props.delais}/>
            </div>
        </div>
    }
}

interface IPassagesProps {
    passages: PassageType[];
}

class Passages extends React.Component<IPassagesProps> {
    render() {
        return <ul className="list-group list-group-flush">
            {this.props.passages?.map((passage, index) => <Passage key={index} passage={passage}/>)}
        </ul>
    }
}


interface IPassageProps {
    passage: PassageType;
}

class Passage extends React.Component<IPassageProps> {
    render() {
        return <li className="list-group-item">{placeholder(this.props.passage)}</li>
    }
}

function placeholder(value?: string) {
    if (value === undefined) {
        return <span className="placeholder"/>
    } else {
        return value;
    }
}
