import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import { Container } from "react-bootstrap";
import HomeScreen from "./screens/HomeScreen.js";
import ProductScreen from "./screens/ProductScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import CartScreen from "./screens/CartScreen";
import Header from "./Components/Header.js";
import Footer from "./Components/Footer.js";

function App() {
  return (
    <Router>
      <div>
        <Header />
        <main className="py-3">
          <Container>
            <Route path="/register" component={RegisterScreen} />
            <Route path="/profile" component={ProfileScreen} />
            <Route path="/login" component={LoginScreen} />
            <Route path="/" component={HomeScreen} exact />
            <Route path="/products/:id" component={ProductScreen} />
            <Route path="/cart/:id?" component={CartScreen} />
          </Container>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
