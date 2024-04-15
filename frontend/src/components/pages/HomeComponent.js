import React from 'react';
import { Button, Container, Row, Col, Image } from 'react-bootstrap';

export default function HomePage() {
    const bankImage1 = 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFua3xlbnwwfHwwfHx8MA%3D%3D';
    const bankImage2 = 'https://www.finews.asia/images/news/2022/12/cs-paradeplatz.jpg';

    return (
        <Container>
            <Row className="justify-content-md-center text-center">
                <Col md={12}>
                    <h1>Welcome to MyBank</h1>
                    <p>Your reliable partner for all banking needs.</p>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md={6}>
                    <Image src={bankImage1} thumbnail />
                </Col>
                <Col md={6}>
                    <Image src={bankImage2} thumbnail />
                </Col>
            </Row>
            <Row className="mt-4">
                <Col md={12}>
                    <p>
                        Enjoy seamless banking services including deposits, withdrawals, and 24/7
                        customer support. Manage your finances with ease using our state-of-the-art
                        online banking platform.
                    </p>
                    <p>
                        Stay in control of your money with our secure and easy-to-use virtual card creation system.
                        Transferring money is just a click away. Experience banking that's designed with you in mind.
                    </p>
                </Col>
            </Row>
        </Container>
    );
}
