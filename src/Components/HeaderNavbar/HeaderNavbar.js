import React, { Component } from "react";
import "./HeaderNavbar.css";
import {Link} from "react-router-dom";
import firebase, {auth, provider} from "../../firebaseConfig/firebaseConfig";
import ShoppingCart from "../ShoppingCart/ShoppingCart";
import "../ShoppingCart/ShoppingCart.css";

class HeaderNavbar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: '',
            shoppingCartTriggered: false
        };
        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
        this.triggerShoppingCart = this.triggerShoppingCart.bind(this);
    }

    async componentDidMount() {
        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user});
            }
        });
    }

    triggerShoppingCart() {
        this.setState({
            shoppingCartTriggered: !this.state.shoppingCartTriggered
        })
    }

    logout() {
        firebase.auth().signOut();
        this.setState({user: null});
    }

    login() {
        auth.signInWithPopup(provider)
            .then((result) => {
                const user = result.user;
                this.setState({user});
            });
    }

    render() {
        return (
            <div className="NavBar">
                <ul className="navigationBar">
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/bookCategory">Categories</Link>
                    </li>
                    <li>
                        <Link to="/bookList">My Book List</Link>
                    </li>
                    <li>
                        <Link to="/search">Search</Link>
                    </li>
                    <li className="shoppingCart">
                        <button onClick={this.triggerShoppingCart}>&#x1F6D2;</button>
                    </li>
                    <Link to="/profile">
                        <li className="dropdown">
                            {this.state.user ?
                                <div>
                                    <a href="javascript:void(0)" className="dropbtn">
                                        <img className="dish-image-shoppingCart"  alt="" src={this.state.user.photoURL}/>
                                    </a>
                                    <div className="dropdown-content">
                                        <Link to="/profile">Profile</Link>
                                        <Link to="/logout" onClick={this.logout}>Logout</Link>
                                    </div>
                                </div>
                                : <Link to="/login" onClick={this.login}>Login</Link>
                            }

                        </li>
                    </Link>
                </ul>
                {
                    this.state.shoppingCartTriggered ? (
                        <ShoppingCart model={this.modelInstance} />
                    )
                    : null
                }
            </div>
        );
    }
}

export default HeaderNavbar;
