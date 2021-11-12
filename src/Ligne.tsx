import React from "react";
import {ILigne, PassageType} from "./interfaces";

export default class Ligne extends React.Component<ILigne> {
    render() {
        return <div>
            <p>Prochains passages de la ligne {placeholder(this.props.ligne)} :</p>
            <Passages passages={this.props.delais}/>
        </div>
    }
}

interface IPassagesProps {
    passages: PassageType[];
}

class Passages extends React.Component<IPassagesProps> {
    render() {
        return <ul>
            {this.props.passages?.map((passage, index) => <Passage key={index} passage={passage}/>)}
        </ul>
    }
}


interface IPassageProps {
    passage: PassageType;
}

class Passage extends React.Component<IPassageProps> {
    render() {
        return <li>{placeholder(this.props.passage)}</li>
    }
}

function placeholder(value?: string) {
    if (value === undefined) {
        return <span className="placeholder"/>
    }
    else {
        return value;
    }
}
