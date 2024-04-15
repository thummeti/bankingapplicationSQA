import React, {useState, useEffect} from 'react';
import {Card, Button, Modal, Form, Alert} from 'react-bootstrap';
import {getCards, createCard, deleteCard, transferToCard} from "../../../context/Database";
import {useAuth} from "../../../context/AuthContext";
import bankLogo from '../../pictures/bank.png';

export default function CardsComponent() {
    const {currentUser} = useAuth();
    const [cards, setCards] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [newCardData, setNewCardData] = useState({
        cardType: 'debit', // 'debit' or 'credit'
        cardholderName: '',
        expirationDate: '',
        securityCode: '',
        pin: '',
    });
    const [transferData, setTransferData] = useState({
        amount: 0,
    });

    useEffect(() => {
        getCards()
            .then((res) => {
                setCards(res.data)
            })
            .catch(err => {
                setError('Failed to fetch cards.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleDeleteCard = (cardId) => {
        deleteCard(cardId)
            .then(() => {
                setCards(cards.filter(card => card._id !== cardId));
                setError('');
            })
            .catch(err => {
                setError('Failed to delete card.');
            });
    };

    const handleCreateCard = (event) => {
        event.preventDefault();
        createCard(newCardData)
            .then(card => {
                setCards([...cards, card]);
                setShowCreateModal(false);
                setError('');
                setNewCardData({
                    cardType: 'debit',
                    securityCode: '',
                    pin: '',
                });
            })
            .catch(err => {
                setError('Failed to create card.');
            });
    };

    const handleTransferToCard = (event) => {
        event.preventDefault();
        transferToCard({...transferData, cardId: selectedCard})
            .then(() => {
                setShowTransferModal(false);
                setError('');
                setTransferData({amount: 0});
            })
            .catch(err => {
                setError('Failed to transfer to card.');
            });
    };

    const handleCreateChange = (event) => {
        setNewCardData({...newCardData, [event.target.name]: event.target.value});
    };

    const handleTransferChange = (event) => {
        setTransferData({...transferData, [event.target.name]: event.target.value});
    };

    if (loading) return <div>Loading cards...</div>;

    return (
        <div>
            {error && <Alert variant="danger">{error}</Alert>}
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                Create New Card
            </Button>

            {cards.map((card) => (
                <Card key={card._id} className="my-3" style={{width: '18rem'}}>
                    <Card.Img variant="top" src={bankLogo}/>
                    <Card.Body>
                        <Card.Title>{card.cardholderName}</Card.Title>
                        <Card.Text>
                            Card Number: **** **** **** {card.cardNumber.slice(-4)}
                        </Card.Text>
                        <Card.Text>
                            Expiry: {new Date(card.expirationDate).toLocaleDateString()}
                        </Card.Text>
                        <Button variant="danger" onClick={() => handleDeleteCard(card._id)}>
                            Delete Card
                        </Button>
                        <Button variant="secondary" onClick={() => {
                            setSelectedCard(card._id);
                            setShowTransferModal(true);
                        }}>
                            Transfer Money
                        </Button>
                    </Card.Body>
                </Card>
            ))}

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a New Card</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateCard}>
                        <Form.Group controlId="formCardType">
                            <Form.Label>Card Type</Form.Label>
                            <Form.Control as="select" name="cardType" onChange={handleCreateChange}
                                          value={newCardData.cardType}>
                                <option value="debit">Debit</option>
                                <option value="credit">Credit</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formSecurityCode">
                            <Form.Label>Security Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="securityCode"
                                required
                                maxLength="4"
                                onChange={handleCreateChange}
                                value={newCardData.securityCode}
                                placeholder="Security Code"
                            />
                        </Form.Group>

                        <Form.Group controlId="formPIN">
                            <Form.Label>PIN</Form.Label>
                            <Form.Control
                                type="number"
                                name="pin"
                                required
                                maxLength="4"
                                onChange={handleCreateChange}
                                value={newCardData.pin}
                                placeholder="PIN"
                            />
                        </Form.Group>

                        <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Create Card
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showTransferModal} onHide={() => setShowTransferModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Transfer Money to Card</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleTransferToCard}>
                        <Form.Group controlId="formTransferAmount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                name="amount"
                                required
                                min="1"
                                onChange={handleTransferChange}
                                value={transferData.amount}
                                placeholder="Amount to transfer"
                            />
                        </Form.Group>

                        <Button variant="secondary" onClick={() => setShowTransferModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Transfer
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
