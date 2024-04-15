import React, { useRef, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    let navigate = useNavigate();
    const { currentUser, signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);
    async function handleSubmit(e) {
        e.preventDefault();
        if (image == null) return;
        const ext = image.name.substring(image.name.lastIndexOf("."));
        if (!(ext === ".jpg" || ext === ".jpeg" || ext === ".png" || ext === ".svg")) {
            setError("Unsupported image format. Only jpg, jpeg, png, svg are allowed.");
            return;
        }
        const password = e.target.password.value;
        const confPassword = e.target.confirm_password.value;
        if (password !== confPassword) {
            setError("Passwords do not match");
            return;
        }

        const user = {
            username: e.target.username.value,
            email: e.target.email.value,
            password: password,
            name: e.target.name.value,
            accountType: e.target.accountType.value,
            branch: e.target.branch.value,
            img: image,
        };

        try {
            setError("");
            setLoading(true);
            const cred = await signup(user);
            console.log(cred);
            navigate("/dashboard");
        } catch (err) {
            console.error(err);
            setError("Failed to create an account");
        }
        setLoading(false);
    }

    const changeImage = (event) => {
        setImage(event.target.files[0]);
    };

    if (currentUser) {
        return <Navigate to={"/dashboard"} />;
    }



    return (
        <>{currentUser ? <Navigate to={"/dashboard"}/> :
            <div className="overflow-hidden">

                <div className="row d-flex justify-content-center pt-2 m-0 ">
                    <div className="col-md-4 card p-5" style={{minWidth: "500px"}}>
                        <form onSubmit={handleSubmit}>
                            <h2>Sign Up</h2>
                            <p>Please fill in this form to create an account!</p>
                            <hr/>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                    <span className="input-group-text">
                                    <i className="fa fa-user"></i>
                                        </span>
                                    </div>
                                    <input type="text" style={{margin: "0px"}} className="form-control" name="username"
                                           placeholder="Username" required="required"/>
                                </div>
                            </div>


                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                        <i className="fa fa-paper-plane"></i>
                                        </span>
                                    </div>
                                    <input type="email" className="form-control" name="email"
                                           placeholder="Email Address" required="required"/>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text">
                                        <i className="fa fa-lock"></i>
                                        </span>
                                    </div>
                                    <input type="password" style={{margin: "0px"}} className="form-control" name="password"
                                           placeholder="Password"
                                           required="required"/>
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
                                           name="confirm_password"
                                           placeholder="Confirm Password" required="required"/>
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <i className="fa fa-user"></i>
                                    </span>
                                    </div>
                                    <input type="text" className="form-control" name="name"
                                           placeholder="Full Name" required />
                                </div>
                            </div>

                            <div className="form-group">
                                <select className="form-control" name="accountType" required>
                                    <option value="">Select Account Type</option>
                                    <option value="current">Current</option>
                                    <option value="saving">Saving</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <select className="form-control" name="branch" required>
                                    <option value="">Select branch</option>
                                    <option value="main">Main</option>
                                </select>
                            </div>
                            <div className="col-auto form-group">
                                <label className="visually-hidden" htmlFor="inputImage">Image</label>
                                <input type="file" className="form-control" id="inputImage"
                                       placeholder="Image" required onChange={changeImage}/>
                            </div>
                            <div className="form-group">
                                {error && <div className="row alert-danger px-1"> {error} </div>}
                            </div>

                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-lg">Sign Up</button>
                            </div>
                        </form>
                        <div className="text-center">Already have an account? <a href="login">Login here</a></div>
                    </div>
                </div>

            </div>}
        </>);
}
export default Signup;

