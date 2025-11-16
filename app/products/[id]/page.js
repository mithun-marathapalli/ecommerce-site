"use client"
import React, { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { fetchProductById } from "@/app/api/products"
import styled from "styled-components"
import Image from "next/image"
import { productData } from "../constants"
import Rating from "@/app/components/Rating"
import cartIcon from "@/app/icons/cart_icon"
import { useCartStore } from "@/app/store/cartStore"
import ProductDetailsLoader from "@/app/components/ProductDetailsLoader"

const StyledProductDetails = styled.div`
    margin: 50px;
    display: flex;
    gap: 20px;
    justify-content: center;
    .product-image {
        max-width: 30%;
    }
    .product-info {
        margin: 40px 20px;
        max-width: 40%;
        .product-title {
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 20px;
        }
        .product-description {
            font-size: 16px;
            color: #555;
            max-width: 75%;
        }
        .product-rating {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            .rating-value {
                font-size: 16px;
                font-weight: 500;
            }
        }
        .product-price {
            display: flex;
            align-items: baseline;
            gap: 12px;
            margin-top: 20px;
            .price-after-discount {
                font-size: 28px;
                font-weight: 800;
                color: #111;
                .currency {
                    font-size: 24px;
                }
            }
            .price-before-discount {
                font-size: 18px;
                text-decoration: line-through;
                color: #777;
            }
            .discount-percentage {
                font-size: 18px;
                color: green;
                font-weight: 600;
            }
        }
        .action-container {
            margin-top: 30px;
            .add-to-cart-button {
                background-color: orange;
                color: #fff;
                border: none;
                padding: 12px 20px;
                font-size: 16px;
                font-weight: 600;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .success-message {
            }
        }
    }
`

export default function ProductDetails({ params }) {
    const { id: productId } = React.use(params)
    const [product, setProduct] = useState(null)
    const { cart, addToCart } = useCartStore((state) => state)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        fetchProductById(productId)
            .then((data) => {
                setProduct(data)
                setLoading(false)
            })
            .catch(() => {
                toast.error("Failed to fetch product details")
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <ProductDetailsLoader />
    }

    const {
        title,
        description,
        thumbnail,
        rating,
        currency = "$",
        stock,
    } = product

    let quantity = cart.find((item) => item.id === product.id)?.quantity || 0

    const handleAddToCart = () => {
        if (quantity >= stock) {
            toast.error("No more stock available for this product")
            return
        }
        addToCart(product.id)
        toast.success("Product added to cart!")
    }

    return (
        <StyledProductDetails>
            <div className="product-image">
                <Image
                    src={thumbnail}
                    alt={`Image of ${title}`}
                    width={700}
                    height={500}
                />
            </div>
            <div className="product-info">
                <div className="product-title">{title}</div>
                <div className="product-rating">
                    <Rating rating={rating} />
                    <span className="rating-value">({rating})</span>
                </div>
                <div className="product-description">{description}</div>
                <div className="product-price">
                    <div className="price-after-discount">
                        <span className="currency">{currency}</span>
                        {Math.round(
                            product.price * (100 - product.discountPercentage)
                        ) / 100}
                    </div>
                    <div className="price-before-discount">
                        {currency}
                        {product.price}
                    </div>
                    <div className="discount-percentage">
                        {product.discountPercentage} % off
                    </div>
                </div>
                <div className="action-container">
                    <button
                        className="add-to-cart-button"
                        onClick={handleAddToCart}
                    >
                        {quantity >= stock ? "Out of Stock" : "Add to Cart"}
                        {cartIcon()}
                    </button>
                </div>
            </div>
        </StyledProductDetails>
    )
}
