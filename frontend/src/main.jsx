import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserProvider } from './UserContext.jsx'
import { AuthProvider } from './AuthContext.jsx'
import { CombinedProvider } from './CombinedContext.jsx'
import { BrowserRouter, Routes, Route, Router, RouterProvider } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
          <App />
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>,
)
