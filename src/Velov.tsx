import React from "react";
import './Velov.css';
import {Card, Col, ListGroup} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAnchor, faBicycle, faBiking} from "@fortawesome/free-solid-svg-icons";
import {IVelovStation} from "./IVelov";

export default class Velov extends React.Component<IVelovStation> {
    render() {
        return <Col>
            <Card>
                <Card.Header>
                    <FontAwesomeIcon icon={faBiking}/> {this.props.info.name.toLowerCase()}
                </Card.Header>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <FontAwesomeIcon icon={faBicycle}/> {this.props.status.num_bikes_available}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <FontAwesomeIcon icon={faAnchor}/> {this.props.status.num_docks_available}
                    </ListGroup.Item>
                </ListGroup>
            </Card>
        </Col>
    }
}

