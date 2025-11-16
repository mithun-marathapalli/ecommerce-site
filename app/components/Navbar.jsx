"use client"

import { useRouter } from "next/navigation"
import Styled from "styled-components"
import appIcon from "../icons/app_icon"
import cartIcon from "../icons/cart_icon"
import { useCartStore } from "../store/cartStore"

const StyledNavBar = Styled.div`
    position: fixed;
    top: 0;
    height: 60px;
    width: 100%;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    padding: 0 40px;
    box-sizing: border-box;
    z-index: 1000;
    justify-content: space-between;
    .home-icon {
        cursor: pointer;
    }
    .cart-icon {
        position: relative;
        cursor: pointer;
        .cart-count {
            cursor: pointer;
            position: absolute;
            top: -8px;
            right: -4px;
            font-size: 13px;
            color: #fff;
            font-weight: 600;
            border-radius: 20px;
            padding: 0px 5px;
            background: orange;
        }
    }
`

function Navbar() {
    const router = useRouter()
    const goToHome = () => {
        router.push("/products")
    }
    const goToCart = () => {
        router.push("/cart")
    }
    return (
        <div className="navbar-container">
            <div
                className="home-icon"
                tabIndex={0}
                aria-label="Home"
                onClick={goToHome}
            >
                {appIcon()}
            </div>
            <div className="cart-icon">
                <NavbarCart goToCart={goToCart} />
            </div>
        </div>
    )
}

function NavbarCart({ goToCart }) {
    const cart = useCartStore((state) => state.cart)
    return (
        <button style={{ cursor: "pointer" }} onClick={goToCart}>
            {cartIcon()}
            {cart.length ? (
                <span className="cart-count">{cart.length}</span>
            ) : null}
        </button>
    )
}

export default Navbar
