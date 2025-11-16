"use client"

import { useState, useEffect, useCallback } from "react"
import styled from "styled-components"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useCartStore } from "../store/cartStore"
import CartLoader from "../components/CartLoader"
import { fetchProductById } from "../api/products"

const StyledCart = styled.div`
    display: flex;
    margin: 50px;
    .cart-details {
        width: 70%;
        padding-right: 30px;
        .cart-header {
            font-size: 24px;
            font-weight: 600;
        }
        .cart-column-names {
            display: flex;
            margin: 15px 0px;
            padding: 10px;
            border-top: 1px solid #ddd;
            color: orange;
            font-weight: 600;
            text-align: center;
            .details {
                width: 50%;
                text-align: left;
            }
            .price {
                width: 10%;
            }
            .quantity {
                width: 30%;
            }
            .subtotal {
                width: 10%;
            }
        }
        .cart-items-list {
            overflow-y: auto;
            height: calc(100vh - 230px);
            padding: 0px 10px;
        }
    }
    .cart-summary {
        width: 30%;
        margin: 30px 20px;
        background: #f7f7f7;
        border-radius: 10px;
        padding: 20px;
        height: fit-content;
        .summary-heading {
            font-size: 24px;
            font-weight: 600;
            text-align: center;
            padding: 10px;
            border-bottom: 1px solid #dfdfdf;
        }
        .price-section {
            margin-top: 30px;
            .price-entities {
                display: flex;
                justify-content: space-between;
                margin: 10px 0px;
            }
            .final-price {
                margin-top: 20px;
                border-top: 1px solid #dfdfdf;
                font-size: 20px;
                font-weight: 700;
                padding-top: 10px;
            }
        }
    }
    .empty-cart-zero-state {
        padding: 50px 100px;
        font-size: 20px;
        color: #555;
        > button {
            margin-top: 20px;
            background-color: orange;
            color: #fff;
            border: none;
            padding: 10px 15px;
            font-size: 16px;
            font-weight: 600;
            border-radius: 4px;
            cursor: pointer;
            :hover {
                background-color: #e59400;
            }
        }
    }
`

const StyledCartItem = styled.div`
    display: flex;
    margin: 10px 0px;
    align-items: center;
    text-align: center;
    .details {
        width: 50%;
        display: flex;
        align-items: center;
        .product-title {
            display: flex;
            flex-direction: column;
            align-items: baseline;
            justify-content: space-between;
            margin-left: 5px;
            text-align: left;
            > div {
                font-size: 18px;
                font-weight: 700;
                cursor: pointer;
                &:hover {
                    text-decoration: underline;
                }
            }
            > button {
                color: orange;
                cursor: pointer;
                background: none;
                border: none;
                padding: 0;
                font-size: 14px;
                font-weight: 600;
                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
    .price {
        width: 10%;
    }
    .quantity {
        width: 30%;
        display: flex;
        justify-content: center;
        gap: 5px;
        font-size: 20px;
        font-weight: 700;
        align-items: center;
        .quantity-value {
            padding: 5px 10px;
            border: 1px solid #b9b5b5;
            font-size: 16px;
            border-radius: 5px;
        }
        > button {
            cursor: pointer;
            padding: 5px 10px;
        }
    }
    .subtotal {
        width: 10%;
        font-weight: 600;
        font-size: 18px;
    }
`

export default function Cart() {
    const { cart, removeItem, updateQuantity } = useCartStore((state) => state)
    const [productsInCart, setProductsInCart] = useState([])
    const [fetching, setFetching] = useState(true)
    const router = useRouter()

    useEffect(() => {
        setFetching(true)
        let productIds = cart.map((item) => item.id)
        let promises = productIds.map((id) => fetchProductById(id))
        Promise.all(promises)
            .then((products) => {
                setProductsInCart(products)
                setFetching(false)
            })
            .catch(() => setFetching(false))
    }, [cart.length])

    const goToProducts = (id) => {
        router.push(`/products/${id}`)
    }

    if (fetching) {
        return <CartLoader />
    }

    const calculateTotalPrice = useCallback(() => {
        let totalPrice = 0
        let discountedPrice = 0
        productsInCart.forEach((product) => {
            let cartItem = cart.find((item) => item.id === product.id)
            if (cartItem) {
                let currentDiscountedPrice =
                    Math.round(
                        product.price *
                            (100 - (product.discountPercentage || 0))
                    ) / 100
                totalPrice += product.price * cartItem.quantity
                discountedPrice += currentDiscountedPrice * cartItem.quantity
            }
        })
        return {
            totalPrice: Math.round(totalPrice * 100) / 100,
            discountedPrice: Math.round(discountedPrice * 100) / 100,
            discount: Math.round((totalPrice - discountedPrice) * 100) / 100,
        }
    }, [cart, productsInCart])

    const { totalPrice, discountedPrice, discount } = calculateTotalPrice()
    return (
        <StyledCart>
            <div className="cart-details">
                <div className="cart-header">My Cart</div>
                {cart.length === 0 ? (
                    <div className="empty-cart-zero-state">
                        <Image
                            src="/icons/empty_cart.svg"
                            alt="Empty Cart"
                            width={200}
                            height={200}
                        />
                        <div>Your cart is empty!</div>
                        <button onClick={() => router.push("/products")}>
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="cart-column-names">
                            <div className="details">Product Details</div>
                            <div className="price">Price</div>
                            <div className="quantity">Quantity</div>
                            <div className="subtotal">Sub Total</div>
                        </div>
                        <div className="cart-items-list">
                            {productsInCart.map((product) => (
                                <CartItem
                                    product={product}
                                    quantity={
                                        cart?.find(
                                            (item) => item.id === product.id
                                        )?.quantity
                                    }
                                    removeItem={removeItem}
                                    updateQuantity={updateQuantity}
                                    key={`cart_item_${product.id}`}
                                    goToProducts={goToProducts}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div className="cart-summary">
                <div className="summary-heading">Order Summary</div>
                <div className="price-section">
                    <div className="price-entities">
                        <div>ITEMS ({cart.length})</div>
                        <div>${totalPrice}</div>
                    </div>
                    <div className="price-entities">
                        <div>Discount</div>
                        <div>${discount}</div>
                    </div>
                    <div className="price-entities">
                        <div>Shipping Charges</div>
                        <div>free</div>
                    </div>
                    <div className="price-entities final-price">
                        <div>Total</div>
                        <div>${discountedPrice}</div>
                    </div>
                </div>
            </div>
        </StyledCart>
    )
}

function CartItem({
    product,
    quantity = 0,
    removeItem,
    updateQuantity,
    goToProducts,
}) {
    const { title, thumbnail, stock, discountPercentage = 0 } = product
    const discountedPrice =
        Math.round(product.price * (100 - discountPercentage)) / 100
    const increment = () => {
        if (quantity < stock) {
            updateQuantity(product.id, quantity + 1)
        }
    }
    const decrement = () => {
        if (quantity > 1) {
            updateQuantity(product.id, quantity - 1)
        }
        if (quantity === 1) {
            removeItem(product.id)
        }
    }
    return (
        <StyledCartItem>
            <div className="details">
                <Image
                    src={thumbnail}
                    alt={`Image of ${title}`}
                    width={100}
                    height={100}
                />
                <div className="product-title">
                    <div
                        className="title"
                        onClick={() => goToProducts(product.id)}
                    >
                        {title}
                    </div>
                    <button onClick={() => removeItem(product.id)}>
                        Remove
                    </button>
                </div>
            </div>
            <div className="price">${discountedPrice}</div>
            <div className="quantity">
                <button className="decrement-btn" onClick={decrement}>
                    -
                </button>
                <div className="quantity-value">{quantity}</div>
                <button
                    className="increment-btn"
                    disabled={stock === quantity}
                    onClick={increment}
                >
                    +
                </button>
            </div>
            <div className="subtotal">
                ${Math.round(discountedPrice * quantity * 100) / 100}
            </div>
        </StyledCartItem>
    )
}
