import React, {useState} from 'react';
import {Container, Row, Col, Card} from 'react-bootstrap';
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {Profile} from "./tabs/Profile";
import Transactions from "./tabs/Transactions";
import Cards from "./tabs/Cards";
import ManageUsers from "./ManageUsers";
import ManageCards from "./ManageCards";

export default function AdminComponent() {
    const [key, setKey] = useState('manageusers');

    return (
        <div className="container-fluid mh-100" style={{minHeight: "100vh"}}>
            <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
            >
                <Tab eventKey="manageusers" title="Users">
                    <ManageUsers/>
                </Tab>
                <Tab eventKey="manageCards" title="Cards">
                   <ManageCards/>
                </Tab>
            </Tabs>
        </div>
    );
}
