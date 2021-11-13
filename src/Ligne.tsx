import React from "react";
import {ILigne, PassageType} from "./interfaces";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBus} from '@fortawesome/free-solid-svg-icons'
import {Card, Col, ListGroup} from "react-bootstrap";


export default class Ligne extends React.Component<ILigne> {
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

function placeholder(value?: string) {
    if (value === undefined) {
        return <span className="placeholder"/>
    } else {
        return value;
    }
}
