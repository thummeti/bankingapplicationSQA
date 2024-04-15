import React, {useState, useEffect} from 'react';
import {useAuth} from '../../context/AuthContext';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {Profile} from "./tabs/Profile";
import Transactions from "./tabs/Transactions";
import Cards from "./tabs/Cards";
import Loans from "./tabs/Loans";

export default function UserComponent() {
    const [key, setKey] = useState('profile');
    const {currentUser} = useAuth()


    return (
        <>

            {currentUser.status==="active"?<div className="container-fluid mh-100" style={{minHeight:"100vh"}}>
                    <Tabs
                        id="controlled-tab-example"
                        activeKey={key}
                        onSelect={(k) => setKey(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="profile" title="Profile">
                            <Profile/>
                        </Tab>
                        <Tab eventKey="transactions" title="Transactions">
                            <Transactions/>
                        </Tab>
                        <Tab eventKey="cards" title="Cards">
                            <Cards/>
                        </Tab>
                    </Tabs>
                </div>:
                <div>
                    Account disabled by admin, please contact admin@gmail.com
                </div>
            }

        </>
    );
}
