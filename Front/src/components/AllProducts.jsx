import React, { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { addToStoreCart } from "../store/currentCartItems"

const AllProducts = () => {
  const [products, setProducts] = useState("loading")
  const currentCart = useSelector((state) => state.currentCart)
  const dispatch = useDispatch()

  React.useEffect(() => {
    axios
      .get("/api/products/")
      .then(({ data }) => {
        setProducts(data)
      })
      .catch((err) => console.log(err))
    return () => setProducts("loading")
  }, [])

  const addToCart = function (product) {
    axios
      .post("/api/transactionitems", {
        transactionId: currentCart.id,
        productId: product.id,
        quantity: 1,
      })
      .then(() =>
        dispatch(
          addToStoreCart({
            name: product.name,
            urlPicture: product.urlPicture,
            price: product.price,
            quantity: 1,
          })
        )
      )
  }

  return (
    <>
      {products === "loading" ? (
        <div className="loader"></div>
      ) : (
        <div className="results-container">
          {products.map((product, index) => (
            <div className="single-result">
              <div className="picture-container">
                <Link key={index} to={`/products/${product.id}`}>
                  <img src={product.urlPicture} />
                </Link>
              </div>
              <hr />
              <div className="single-result-specs">
                <div className="single-result-name-and-brand">
                  <div className="single-result-name">{product.name}</div>
                  <div className="single-result-brand">{product.brand}</div>
                </div>
                <hr />
                <div className="single-result-price">{"$" + product.price}</div>
              </div>
              <button
                onClick={() => addToCart(product)}
                className="add-to-cart-results"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default AllProducts
