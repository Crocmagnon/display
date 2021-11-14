import React from "react";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faBus, faDirections} from '@fortawesome/free-solid-svg-icons'
import {faClock} from '@fortawesome/free-regular-svg-icons'
import {Card, Col, ListGroup} from "react-bootstrap";

export type PassageType = string | undefined;

export interface IStop {
    id: number;
    name: string;
}

export interface ILigne {
    ligne: string;
    delais: PassageType[];
    destination: IStop;
}

export default class Tcl extends React.Component<ILigne> {
    render() {
        return <Col>
            <Card>
                <Card.Header>
                    <FontAwesomeIcon icon={faBus}/> {this.props.ligne}
                </Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <FontAwesomeIcon icon={faDirections}/> {this.props.destination.name}
                    </ListGroup.Item>
                    {this.props.delais.map((passage, index) => <ListGroup.Item key={index}>
                        <FontAwesomeIcon icon={faClock}/> {passage}
                    </ListGroup.Item>)}
                </ListGroup>
            </Card>
        </Col>
    }
}
