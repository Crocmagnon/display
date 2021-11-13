import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBus} from '@fortawesome/free-solid-svg-icons'
import {Card, Col, ListGroup} from "react-bootstrap";
import {placeholder} from "./utils";

export type PassageType = string | undefined;

export interface ILigne {
    ligne?: string;
    delais: PassageType[];
}

export default class Tcl extends React.Component<ILigne> {
    render() {
        return <Col>
            <Card>
                <Card.Header>
                    <FontAwesomeIcon icon={faBus}/> {placeholder(this.props.ligne)}
                </Card.Header>
                <Passages passages={this.props.delais}/>
            </Card>
        </Col>
    }
}

interface IPassagesProps {
    passages: PassageType[];
}

class Passages extends React.Component<IPassagesProps> {
    render() {
        return <ListGroup variant="flush">
            {this.props.passages?.map((passage, index) => <Passage key={index} passage={passage}/>)}
        </ListGroup>
    }
}


interface IPassageProps {
    passage: PassageType;
}

class Passage extends React.Component<IPassageProps> {
    render() {
        return <ListGroup.Item>{placeholder(this.props.passage)}</ListGroup.Item>
    }
}
