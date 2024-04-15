import React, {useRef, useState} from 'react';
import {useAuth} from "../../context/AuthContext";
import {Link, Navigate} from "react-router-dom"
import {useNavigate} from 'react-router-dom';

function LoginComponent() {
    let navigate = useNavigate();
    const usernameRef = useRef()
    const passwordRef = useRef()
    const {currentUser, setCurrentUser} = useAuth()
    const {login, getCurrentUser} = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        const email = e.target[0].value;
        const password = e.target[1].value;

        console.log(e.target)

        setError("")
        setLoading(true)
        login(email, password).then((res) => {
            console.log(res.data)
            getCurrentUser().then(() => {
                navigate("/dashboard")
            })
        }).catch((err) => console.log(err))
        setLoading(false)
    }

    return (
        <>{currentUser ? <Navigate to={"/dashboard"}/> :
            <div>


                <div className="row d-flex justify-content-center" style={{paddingTop: "5%"}}>
                    <div className="col-md-4 card h100 p-3">
                        <form onSubmit={handleSubmit}>
                            <h2>Login</h2>
                            <hr/>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                        <i className="fa fa-paper-plane"></i>
                                        </span>
                                    </div>
                                    <input type="text" className="form-control" name="username"
                                           placeholder="Username" required="required"/>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                        <i className="fa fa-lock"></i>
                                        </span>
                                    </div>
                                    <input type="password" style={{margin: "0px"}} className="form-control"
                                           name="password" placeholder="Password"
                                           required="required"/>
                                </div>
                            </div>

                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-lg">Login</button>
                            </div>
                        </form>
                        <div className="text-center">Don't have an account? <a href="register">Signup</a></div>
                    </div>
                </div>
            </div>
        }
        </>
    );
}


export default LoginComponent;
