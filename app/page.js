"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { fetchProducts } from "./api/products"
import ListingLoader from "./components/ListingLoader"
import ProductItem from "./components/ProductItem"
import "./products/products.css"

const limit = 10

function ProductsHome() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(null)
    const [offset, setOffset] = useState(0)
    const [loadingMore, setLoadingMore] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetchProducts({ skip: offset, limit })
            .then((response) => {
                setProducts(response.products)
                setTotal(response.total)
                setLoading(false)
            })
            .catch((error) => {
                toast.error("Failed to fetch products")
                setLoading(false)
            })
    }, [])

    function loadMore() {
        setLoadingMore(true)
        fetchProducts({ skip: offset + limit, limit })
            .then((response) => {
                setProducts([...products, ...response.products])
                setOffset(offset + limit)
                setLoadingMore(false)
            })
            .catch((error) => {
                toast.error("Failed to fetch products")
                setLoadingMore(false)
            })
    }

    return (
        <div className="products-main-container">
            <div className="product-listing-header">
                <div>Products</div>
                <div className="pages-count">
                    {loading || loadingMore
                        ? null
                        : `Showing ${Math.min(
                              offset + limit,
                              total
                          )} of ${total}`}
                </div>
            </div>
            {loading || true ? (
                <ListingLoader />
            ) : (
                <div className="product-listing-container">
                    <div className="product-listing">
                        {products.map((product) => (
                            <ProductItem
                                product={product}
                                key={`products_list_item_${product.id}`}
                            />
                        ))}
                    </div>
                    <div className="load-more-button">
                        {offset >= total - limit ? null : (
                            <button onClick={loadMore} disabled={loadingMore}>
                                {loadingMore ? "Loading..." : "Load More"}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductsHome
