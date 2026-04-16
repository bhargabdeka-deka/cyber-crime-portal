import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Catch any render errors and show a fallback instead of white screen
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight:"100vh", background:"#0a0f1e", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"Segoe UI", color:"white", gap:16, padding:24 }}>
          <div style={{ fontSize:48 }}>⚠️</div>
          <h2 style={{ fontSize:22, fontWeight:700, margin:0 }}>Something went wrong</h2>
          <p style={{ color:"#64748b", margin:0 }}>Please refresh the page or go back home.</p>
          <a href="/" style={{ background:"linear-gradient(135deg,#3b82f6,#8b5cf6)", color:"white", padding:"10px 22px", borderRadius:8, textDecoration:"none", fontWeight:600 }}>Go Home</a>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
