export async function fetchProducts({ limit = 10, skip = 0 } = {}) {
    const response = await fetch(
        `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
    )
    return response.json()
}

export async function fetchProductById(id) {
    const response = await fetch(`https://dummyjson.com/products/${id}`)
    return response.json()
}
