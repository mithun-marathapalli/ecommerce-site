"use client"
import { useState } from "react"
import Image from "next/image"
import Styled from "styled-components"
import Rating from "./Rating"
import { useRouter } from "next/navigation"
import { useCartStore } from "../store/cartStore"
import toast from "react-hot-toast"

const StyledProductItem = Styled.div`
    position: relative;
    padding: 12px;
    border-radius: 6px;
    border: 1px solid #ddd;
    box-shadow: 1px 1px 0.1px 0.1px #ddd;
    .product-title {
        font-size: 16px;
        font-weight: 600;
        margin: 6px 0;
        max-width: 250px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
            text-decoration: underline;
        }
    }
    .product-rating {
        display: flex;
        align-items: center;
        gap: 6px;
        margin: 6px 0;
        font-size: 14px;
    }
    .product-price {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 6px 0;
        .price-after-discount {
            font-size: 18px;
            font-weight: 700;
            color: #111;
            .currency {
                font-size: 15px;
            }
        }
        .price-before-discount {
            font-size: 14px;
            text-decoration: line-through;
            color: #777;
        }
        .discount-percentage {
            font-size: 14px;
            color: green;
            font-weight: 600;
        }
    }
    .add-to-cart {
        position: absolute;
        top: 12px;
        right: 5px;
        color: #fff;
        font-weight: 600;
        cursor: pointer;
        > button {
            display: flex;
            background-color: orange;
            align-items: center;
            font-size: 12px;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s;
            &:hover {
                background-color: #e69500;
            }
        }
    }
`

function ProductItem({ product }) {
    const [showCart, setShowCart] = useState(false)
    const [outOfStock, setOutOfStock] = useState(false)
    const { cart, addToCart } = useCartStore((state) => state)
    const router = useRouter()
    const goToProductDetails = () => {
        router.push(`/products/${product.id}`)
    }
    const handleAddToCart = () => {
        let quantity =
            cart.find((item) => item.id === product.id)?.quantity || 0
        if (quantity >= product.stock) {
            toast.error("No more stock available for this product")
            setOutOfStock(true)
            return
        }
        addToCart(product.id)
        toast.success("Product added to cart!")
    }
    return (
        <StyledProductItem
            onMouseEnter={() => setShowCart(true)}
            onMouseLeave={() => setShowCart(false)}
        >
            <Image
                src={product.thumbnail}
                alt={`Image of ${product.title}`}
                width={300}
                height={300}
            />
            <div className="product-title" onClick={goToProductDetails}>
                {product.title}
            </div>
            <div className="product-rating">
                <div>{product.rating}</div>
                <Rating rating={product.rating} />
            </div>
            <div className="product-price">
                <div className="price-after-discount">
                    <span className="currency">$</span>
                    {Math.round(
                        product.price * (100 - product.discountPercentage)
                    ) / 100}
                </div>
                <div className="price-before-discount">{product.price}</div>
                <div className="discount-percentage">
                    {product.discountPercentage} %
                </div>
            </div>
            {showCart && (
                <div className="add-to-cart">
                    {outOfStock ? (
                        <button>Out of Stock</button>
                    ) : (
                        <button onClick={handleAddToCart}>Add to Cart</button>
                    )}
                </div>
            )}
        </StyledProductItem>
    )
}

export default ProductItem
