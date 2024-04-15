import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

export default function About() {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12}>
                    <h1 className="text-center mt-4">About MyBank</h1>
                    <p className="text-center text-muted">
                        Your one-stop solution for modern banking needs.
                    </p>
                </Col>
            </Row>
            <Row className="g-4">
                <Col md={6} lg={4}>
                    <Card>
                        <Card.Img variant="top" src="https://cdn-icons-png.flaticon.com/512/2721/2721121.png" />
                        <Card.Body>
                            <Card.Title>Deposit Money</Card.Title>
                            <Card.Text>
                                Effortlessly deposit money into your account with real-time crediting and enjoy seamless transactions.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card>
                        <Card.Img variant="top" src="https://www.apers.org/images/Blog_Images/Withdraw_From_Fund_Blog_101819.jpg" />
                        <Card.Body>
                            <Card.Title>Withdraw Funds</Card.Title>
                            <Card.Text>
                                Withdraw your funds at any time, without any hassle. Your money is always accessible.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card>
                        <Card.Img variant="top" src="https://mma.prnewswire.com/media/1801784/Bank_of_America_Recycle.jpg" />
                        <Card.Body>
                            <Card.Title>Debit Card Services</Card.Title>
                            <Card.Text>
                                Shop online or in-store with our secure debit cards. Enjoy widespread acceptance and convenience.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card>
                        <Card.Img variant="top" src="https://mma.prnewswire.com/media/1801784/Bank_of_America_Recycle.jpg" />
                        <Card.Body>
                            <Card.Title>Virtual Cards</Card.Title>
                            <Card.Text>
                                Create virtual cards for safe and private online shopping, keeping your main card details secure.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} lg={4}>
                    <Card>
                        <Card.Img variant="top" src="https://totalbalance.blog/wp-content/uploads/2018/12/money_transfer-e1544123010732.jpg" />
                        <Card.Body>
                            <Card.Title>Transfer Money</Card.Title>
                            <Card.Text>
                                Transfer money to anyone, anywhere, at any time. Our digital solutions make it fast and easy.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
