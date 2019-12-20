import React, { Component } from "react";
import ShoppingCart from "../Components/ShoppingCart/ShoppingCart";
import HeaderNavbar from "../Components/HeaderNavbar/HeaderNavbar";

class ShoppingCartView extends Component {
    render() {
        return (
            <div className="SelectDish">
                <HeaderNavbar/>
                <h2>This is the Shopping Cart View</h2>

                {/* We pass the model as property to the BookList component */}
                <ShoppingCart model={this.props.model} />
            </div>
        );
    }
}

export default ShoppingCartView;
