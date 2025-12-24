import React, { useState, useReducer } from "react";
import { ShoppingCart, Heart, Package } from "lucide-react";

/* ===================== DATA ===================== */

const PRODUCTS = [
  {
    id: "jute-basket",
    name: "Jute Basket",
    price: 799,
    description: "Handwoven eco-friendly jute basket for storage and decor.",
  },
  {
    id: "jute-carpet",
    name: "Jute Carpet",
    price: 1799,
    description: "Durable handcrafted jute carpet with natural fibers.",
  },
  {
    id: "jute-coasters",
    name: "Jute Coasters",
    price: 299,
    description: "Set of handcrafted jute coasters for dining tables.",
  },
  {
    id: "fruit-basket",
    name: "Fruit Basket",
    price: 649,
    description: "Natural jute fruit basket with breathable weave.",
  },
];

/* ===================== REDUCER ===================== */

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.cart.find(
        (i) => i.id === action.product.id
      );
      return {
        ...state,
        cart: existing
          ? state.cart.map((i) =>
            i.id === action.product.id
              ? { ...i, qty: i.qty + 1 }
              : i
          )
          : [...state.cart, { ...action.product, qty: 1 }],
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        cart: state.cart.filter((i) => i.id !== action.id),
      };

    case "PLACE_ORDER":
      return {
        ...state,
        orders: [...state.orders, action.order],
        cart: [],
      };

    case "ADD_REVIEW":
      return {
        ...state,
        reviews: {
          ...state.reviews,
          [action.productId]: [
            ...(state.reviews[action.productId] || []),
            action.review,
          ],
        },
      };

    default:
      return state;
  }
}

/* ===================== APP ===================== */

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [state, dispatch] = useReducer(reducer, {
    cart: [],
    orders: [],
    reviews: {},
    wishlist: [
      {
        id: "coming-lamp",
        name: "Jute Hanging Lamp",
        eta: "Coming Next Week",
      },
    ],
  });

  const cartCount = state.cart.reduce((s, i) => s + i.qty, 0);

  /* ===================== HEADER ===================== */

  const Header = () => (
  <header className="flex justify-between items-center p-4 border-b bg-white">
    <h1
      className="text-2xl font-bold cursor-pointer"
      onClick={() => setPage("home")}
    >
      Joot Products
    </h1>

    <nav className="flex gap-4 items-center">
      <button onClick={() => setPage("wishlist")}>
        <Heart />
      </button>

      <button onClick={() => setPage("track")}>
        <Package />
      </button>

      <button onClick={() => setPage("cart")} className="relative">
        <ShoppingCart />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full px-1">
            {cartCount}
          </span>
        )}
      </button>
    </nav>
  </header>
);


  /* ===================== HOME ===================== */

  const Home = () => (
    <div>
      <div className="bg-amber-100 p-10 rounded-xl text-center mb-10">
        <h2 className="text-4xl font-bold mb-2">
          Sustainable Jute Products
        </h2>
        <p className="text-gray-600">
          Handmade. Eco-friendly. Indian craftsmanship.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {PRODUCTS.map((p) => (
          <div
            key={p.id}
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-xl transition"
          >
            <div className="h-40 bg-gray-200 rounded mb-3 flex items-center justify-center text-gray-500">
              Image
            </div>
            <h3 className="font-semibold">{p.name}</h3>
            <p className="mb-2">₹{p.price}</p>
            <button
              className="w-full bg-black text-white py-2 rounded"
              onClick={() => {
                setSelectedProduct(p);
                setPage("product");
              }}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  /* ===================== PRODUCT ===================== */

  const ProductPage = () => {
    const reviews = state.reviews[selectedProduct.id] || [];
    const avg =
      reviews.reduce((s, r) => s + r.rating, 0) /
      (reviews.length || 1);

    return (
      <div className="max-w-3xl mx-auto">
        <div className="h-72 bg-gray-200 rounded mb-6 flex items-center justify-center">
          Image
        </div>

        <h2 className="text-3xl font-bold mb-2">
          {selectedProduct.name}
        </h2>
        <p className="mb-2">{selectedProduct.description}</p>
        <p className="text-xl mb-4">₹{selectedProduct.price}</p>

        <button
          className="bg-black text-white px-6 py-3 rounded"
          onClick={() =>
            dispatch({
              type: "ADD_TO_CART",
              product: selectedProduct,
            })
          }
        >
          Add to Cart
        </button>

        <div className="mt-10">
          <h3 className="font-semibold mb-3">
            Reviews (⭐ {avg.toFixed(1)})
          </h3>

          {reviews.map((r, i) => (
            <div key={i} className="border p-3 mb-2 rounded">
              <p className="font-semibold">
                {r.name} – {r.rating}⭐
              </p>
              <p>{r.comment}</p>
            </div>
          ))}

          <ReviewForm
            onSubmit={(review) =>
              dispatch({
                type: "ADD_REVIEW",
                productId: selectedProduct.id,
                review,
              })
            }
          />
        </div>
      </div>
    );
  };

  /* ===================== REVIEW FORM ===================== */

  const ReviewForm = ({ onSubmit }) => {
    const [name, setName] = useState("");
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");

    return (
      <div className="mt-4 border p-4 rounded">
        <input
          className="border p-2 w-full mb-2"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="border p-2 w-full mb-2"
          onChange={(e) => setRating(+e.target.value)}
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Comment"
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={() =>
            onSubmit({
              name,
              rating,
              comment,
              date: new Date().toDateString(),
            })
          }
        >
          Submit Review
        </button>
      </div>
    );
  };

  /* ===================== CART ===================== */

  const Cart = () => {
    const total = state.cart.reduce(
      (s, i) => s + i.price * i.qty,
      0
    );

    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl mb-4">Cart</h2>
        {state.cart.map((i) => (
          <div
            key={i.id}
            className="flex justify-between mb-2"
          >
            <span>
              {i.name} × {i.qty}
            </span>
            <span>₹{i.price * i.qty}</span>
          </div>
        ))}
        <p className="font-bold mt-4">Total: ₹{total}</p>
        <button
          className="mt-4 bg-black text-white px-6 py-3 rounded"
          onClick={() => setPage("checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    );
  };

  /* ===================== CHECKOUT ===================== */

  const Checkout = () => {
    const [name, setName] = useState("");
    const [mobile, setMobile] = useState("");
    const [address, setAddress] = useState("");

    const placeOrder = () => {
      if (mobile.length < 10) return alert("Invalid mobile");

      dispatch({
        type: "PLACE_ORDER",
        order: {
          id: Date.now().toString(),
          items: state.cart,
          name,
          mobile,
          address,
          status: "Confirmed",
        },
      });

      setPage("home");
    };

    return (
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl mb-4">Checkout</h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-2"
          placeholder="Mobile"
          onChange={(e) => setMobile(e.target.value)}
        />
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Address"
          onChange={(e) => setAddress(e.target.value)}
        />
        <button
          className="bg-black text-white px-6 py-3 rounded"
          onClick={placeOrder}
        >
          Place Order
        </button>
      </div>
    );
  };

  /* ===================== TRACK ===================== */

  const TrackOrder = () => {
    const [id, setId] = useState("");
    const order = state.orders.find((o) => o.id === id);

    return (
      <div className="max-w-xl mx-auto">
        <h2 className="text-2xl mb-4">Track Order</h2>
        <input
          className="border p-2 w-full mb-3"
          placeholder="Order ID"
          onChange={(e) => setId(e.target.value)}
        />
        {order && (
          <div className="border p-4 rounded">
            <p>Status: {order.status}</p>
            <p>Name: {order.name}</p>
          </div>
        )}
      </div>
    );
  };

  /* ===================== WISHLIST ===================== */

  const Wishlist = () => (
    <div>
      <h2 className="text-2xl mb-4">Coming Soon</h2>
      {state.wishlist.map((i) => (
        <div
          key={i.id}
          className="border p-4 mb-2 rounded"
        >
          <p>{i.name}</p>
          <p className="text-gray-500">{i.eta}</p>
        </div>
      ))}
    </div>
  );

  /* ===================== ROUTER ===================== */

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6">
        {page === "home" && <Home />}
        {page === "product" && <ProductPage />}
        {page === "cart" && <Cart />}
        {page === "checkout" && <Checkout />}
        {page === "track" && <TrackOrder />}
        {page === "wishlist" && <Wishlist />}
      </main>
    </div>
  );
}
