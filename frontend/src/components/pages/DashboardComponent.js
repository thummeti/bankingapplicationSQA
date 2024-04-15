import React, {useState, useEffect} from 'react';
import {useAuth} from '../../context/AuthContext';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import {Profile} from "./tabs/Profile";
import Transactions from "./tabs/Transactions";
import Cards from "./tabs/Cards";
import Loans from "./tabs/Loans";
import {useNavigate} from "react-router-dom";
import AdminComponent from "./AdminComponent";
import UserComponent from "./UserComponent";

export default function DashboardComponent() {
    const [key, setKey] = useState('profile');
    const {currentUser} = useAuth();
    console.log(currentUser)
    const navigate = useNavigate()


    return (
        <div>
            {currentUser.role === "admin" ?
                <AdminComponent/>:<UserComponent/>}
        </div>
    );
}
