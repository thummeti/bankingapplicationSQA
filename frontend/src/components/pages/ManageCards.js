import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { getAllCards, enableCard, disableCard } from "../../context/Database";

export default function ManageCards() {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        getAllCards()
            .then(response => {
                setCards(response.data);
            })
            .catch(error => console.error("Error fetching cards:", error));
    }, []);

    const handleEnable = (cardId) => {
        enableCard(cardId).then(() => {
            setCards(cards.map(card => card._id === cardId ? { ...card, status: 'active' } : card));
        });
    };

    const handleDisable = (cardId) => {
        disableCard(cardId).then(() => {
            setCards(cards.map(card => card._id === cardId ? { ...card, status: 'inactive' } : card));
        });
    };

    return (
        <Container>
            <Row>
                {cards.map(card => (
                    <Col md={4} key={card._id}>
                        <Card className="mb-3">
                            <Card.Body>
                                <Card.Title>{card.cardholderName}</Card.Title>
                                <Card.Text>
                                    <b>Card Number:</b> {card.cardNumber}<br />
                                    <b>Type:</b> {card.cardType}<br />
                                    <b>Expires:</b> {new Date(card.expirationDate).toLocaleDateString()}<br />
                                    <b>Status:</b> {card.status}<br />
                                </Card.Text>
                                {card.status === 'active' ?
                                    <button onClick={() => handleDisable(card._id)} className="btn btn-danger">Disable</button> :
                                    <button onClick={() => handleEnable(card._id)} className="btn btn-success">Enable</button>
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
