import React, {useState, useEffect} from 'react';
import {Button, Card, Modal, Form, Alert, Row, Col} from 'react-bootstrap';
import {getTransactions, makeDeposit, makeWithdraw, makePayment} from "../../../context/Database";
import {useAuth} from "../../../context/AuthContext";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showDepositModal, setShowDepositModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const {currentUser} = useAuth()
    useEffect(() => {
        fetchTransactions();
    }, []);

    console.log(currentUser)

    const fetchTransactions = () => {
        getTransactions()
            .then(res => {
                setTransactions(res.data);
            })
            .catch(err => {
                setErrorMessage("Failed to fetch transactions. " + err.message);
            });
    };

    const handleTransactionResponse = promise => {
        promise
            .then(() => {
                setSuccessMessage("Operation successful.");
                fetchTransactions(); // Re-fetch transactions to reflect the changes
            })
            .catch(err => {
                setErrorMessage("Operation failed. " + err.message);
            })
            .finally(() => {
                setShowPaymentModal(false);
                setShowWithdrawModal(false);
                setShowDepositModal(false);
            });
    };

    const sendPayment = event => {
        event.preventDefault();
        const {email, amount} = event.target.elements;
        const transaction = {email: email.value, amount: parseInt(amount.value), sender: currentUser.username};
        handleTransactionResponse(makePayment(transaction));
    };

    const withdraw = event => {
        event.preventDefault();
        const {amount} = event.target.elements;
        if (parseInt(amount.value) > currentUser.account.balance) {
            setErrorMessage("Not enough funds.");
            return;
        }
        const transaction = {amount: parseInt(amount.value), username: currentUser.username};
        handleTransactionResponse(makeWithdraw(transaction));
    };

    const deposit = event => {
        event.preventDefault();
        const {amount} = event.target.elements;
        const transaction = {amount: parseInt(amount.value), username: currentUser.username};
        handleTransactionResponse(makeDeposit(transaction));
    };

    const TransactionCards = transactions.map((transaction, index) => (
        <Card
            key={index}
            className={`mb-3 ${transaction.type === 'Deposit' ? 'text-success' : 'text-danger'}`}
            border={transaction.type === 'Deposit' ? 'success' : 'danger'}
        >
            <Card.Body>
                <Card.Title>Transaction {index + 1} - {transaction.type}</Card.Title>
                <Card.Text>
                    Amount: ${transaction.amount}
                    <br />
                    Type: {transaction.type}
                    <br />
                    Date: {new Date(transaction.date).toLocaleDateString()}
                    <br />
                    {transaction.type === 'Transfer' && (
                        <>
                            Sender: {transaction.sender}
                            <br />
                            Receiver: {transaction.receiver}
                            <br />
                            From Account: {transaction.accountFrom}
                            <br />
                            To Account: {transaction.accountTo}
                            <br />
                        </>
                    )}
                </Card.Text>
            </Card.Body>
        </Card>
    ));


    const alertMessage = errorMessage ? (
        <Alert variant="danger" onClose={() => setErrorMessage("")} dismissible>
            {errorMessage}
        </Alert>
    ) : successMessage ? (
        <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
            {successMessage}
        </Alert>
    ) : null;

    return (
        <div>
            {alertMessage}
            <Row className="mb-3">
                <Col>
                    <Button variant="primary" onClick={() => setShowDepositModal(true)}>
                        Deposit
                    </Button>
                </Col>
                <Col>
                    <Button variant="secondary" onClick={() => setShowWithdrawModal(true)}>
                        Withdraw
                    </Button>
                </Col>
                <Col>
                    <Button variant="success" onClick={() => setShowPaymentModal(true)}>
                        Make Transfer
                    </Button>
                </Col>
            </Row>
            {TransactionCards}

            {/* Deposit Modal */}
            <Modal show={showDepositModal} onHide={() => setShowDepositModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Make a Deposit</Modal.Title>
                </Modal.Header>
                <Form onSubmit={deposit}>
                    <Modal.Body>
                        <Form.Group controlId="depositAmount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                required
                                name="amount"
                                placeholder="Enter amount to deposit"
                            />
                        </Form.Group>
                        {errorMessage && <div className="text-danger">{errorMessage}</div>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDepositModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Deposit
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Withdraw Modal */}
            <Modal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Make a Withdrawal</Modal.Title>
                </Modal.Header>
                <Form onSubmit={withdraw}>
                    <Modal.Body>
                        <Form.Group controlId="withdrawAmount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                required
                                name="amount"
                                placeholder="Enter amount to withdraw"
                            />
                        </Form.Group>
                        {errorMessage && <div className="text-danger">{errorMessage}</div>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowWithdrawModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" type="submit">
                            Withdraw
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/* Payment Modal */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Make a Payment</Modal.Title>
                </Modal.Header>
                <Form onSubmit={sendPayment}>
                    <Modal.Body>
                        <Form.Group controlId="paymentEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                required
                                name="email"
                                placeholder="Enter receiver's email"
                            />
                        </Form.Group>
                        <Form.Group controlId="paymentAmount">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                                type="number"
                                required
                                name="amount"
                                placeholder="Enter amount to transfer"
                            />
                        </Form.Group>
                        {errorMessage && <div className="text-danger">{errorMessage}</div>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                            Close
                        </Button>
                        <Button variant="success" type="submit">
                            Transfer
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        </div>
    );
}
