import * as React from 'react';
import {useAuth} from "../../../context/AuthContext";
import "../../css/dashboard.css"
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import "../../css/summary.css"
import "../../css/checkout.css"
import {makePayment, makeWithdraw, getTransactions, makeDeposit} from "../../../context/Database";


export function Profile() {
    const {logout, currentUser} = useAuth();
    const navigation = useNavigate()
    const [paymentStatus, setPaymentStatus] = useState(false)
    const [transactions, setTransactions] = useState([])
    const [showTransactions, setShowTransactions] = useState(false)
    const dummy = "data:image/jpeg;base64,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";


    function transferMoney() {
        setPaymentStatus(true)
    }

    function viewTransactions() {
        getTransactions().then(res => {
            setTransactions(res.data)
            setShowTransactions(true)
        })
    }

        const closeSummary = () => {
            setPaymentStatus(false)
        }
        const closeTransactions = () => {
            setShowTransactions(false)
        }


        function sendPayment(event) {
            event.preventDefault()
            const email = event.target[0].value
            const amount = event.target[1].value
            const transaction = {email: email, amount: amount, sender: currentUser.username}

            makePayment(transaction).then(res => {
                console.log(res)
                alert("Amount transfered")
                navigation('/dashboard')
            }).catch(err =>
            alert("user doesnt exist"))
        }

        function withdraw() {
            let input = parseInt(prompt("Enter amount"))
            if (input > currentUser.account.balance) {
                alert("Not enough funds")
                return
            }
            if (input <= 0) {
                alert("Invalid input")
                return
            }

            const transaction = {amount: input, username: currentUser.username}
            makeWithdraw(transaction).then(res => {
                console.log(res)
                alert("Amount Withdrawn")
                window.location.reload(false);
            })

        }

        function deposit() {
            let input = parseInt(prompt("Enter amount"))
            if (input <= 0) {
                alert("Invalid input")
                return
            }
            const transaction = {amount: input, username: currentUser.username}
            makeDeposit(transaction).then(res => {
                console.log(res)
                alert("Amount Debitted")
                window.location.reload(false);
            })
        }

        return (
            <div>
                {showTransactions && <div>
                    <div id="myModal" className="m-modal">
                        <div className="m-modal-content">
                            <a onClick={closeTransactions}><span className="close">&times;</span></a>
                            <div style={{width: "100%", height: "55vh", marginTop: "30px", display: "block"}}>

                                <table className="table-dark">
                                    <thead>
                                    <td className="col-2">
                                        From
                                    </td >
                                    <td className="col-2">
                                        TO
                                    </td>
                                    <td className="col-2">
                                        Amount
                                    </td>
                                    </thead>
                                    <tbody>
                                    {transactions.map((transaction) =>  <tr className="table-light" key={transaction.date}>
                                        <td>{transaction.sender}</td>
                                        <td>{transaction.receiver}</td>
                                        <td>{transaction.amount }</td>
                                    </tr>)}
                                    </tbody>

                                </table>

                            </div>
                        </div>
                    </div>
                </div>}

                {paymentStatus && <div>
                    <div id="myModal" className="m-modal">
                        <div className="m-modal-content">
                            <a onClick={closeSummary}><span className="close">&times;</span></a>
                            <div style={{width: "100%", height: "55vh", marginTop: "30px", display: "block"}}>

                                <form onSubmit={sendPayment} className="form">
                                    <div className="form-group">
                                        <label className="form-label">Receiver Email</label>
                                        <input className="form-control" placeholder="Email" type="email" name="email"
                                               required/>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Amount</label>
                                        <input className="form-control" required placeholder="Amount"
                                               type="number" min={1} max={currentUser.account.balance} name="amount"/>
                                        <small>Balance is {currentUser.account.balance}</small>
                                    </div>
                                    <div className="form-group">

                                        <input className="btn btn-primary" type="submit" value="Send"/>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>}

                <div className="page-content page-container" id="page-content">
                    <div className="padding">
                        <div className="row p-2 d-flex justify-content-center">
                            <div className="col-xl-6 col-md-12">
                                <div className="card user-card-full">
                                    <div className="row m-l-0 m-r-0">
                                        <div className="col-sm-4 bg-c-lite-green user-profile">
                                            <div className="card-block p-4 text-center text-white">
                                                <div className="m-b-25"><img
                                                    src={currentUser.img?currentUser.img:dummy}
                                                    width="140px"
                                                    height="140px"
                                                    className="rounded-circle"
                                                    alt="User-Profile-Image"/></div>
                                                <p>{currentUser.username}</p> <i
                                                className=" mdi mdi-square-edit-outline feather icon-edit m-t-10 f-16"></i>
                                            </div>
                                        </div>
                                        <div className="col-sm-8">
                                            <div className="card-block">
                                                <h6 className="m-b-20 p-b-5 b-b-default f-w-600">Information</h6>
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <p className="m-b-10 f-w-600">Email</p>
                                                        <h6 className="text-muted f-w-400">{currentUser.email}</h6>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <p className="m-b-10 f-w-600">username</p>
                                                        <h6 className="text-muted f-w-400">{currentUser.username}</h6>
                                                    </div>
                                                </div>
                                                <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">Account
                                                    details</h6>
                                                <div className="row">
                                                    <div className="col-sm-6">
                                                        <p className="m-b-10 f-w-600">Balance</p>
                                                        <h6 className="text-muted f-w-400">${currentUser.account.balance}</h6>
                                                    </div>
                                                    <div className="col-sm-6">
                                                        <p className="m-b-10 f-w-600">Account
                                                            Type</p>
                                                        <h6 className="text-muted f-w-400">Current</h6>
                                                    </div>
                                                </div>

                                                <h6 className="m-b-20 m-t-40 p-b-5 b-b-default f-w-600">Actions</h6>
                                                <div className="row center">
                                                    <div className="col-sm-4">
                                                        <button className="btn btn-primary"
                                                                onClick={transferMoney}>Transfer
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
