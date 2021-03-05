import React from 'react'
import {BrowserRouter as Router} from 'react-router-dom'
import 'materialize-css'
import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import {Navbar} from "./components/Navbar";

function App() {
    const {token, login, logout, userId} = useAuth()
    const isAuthenticated = !!token
    // В routes передаём ключ и в зависиомти от него отрисовываем страницы досутпные пользователю
    const routes = useRoutes(isAuthenticated)
  return (
      <AuthContext.Provider value={{
          token, login, logout, userId, isAuthenticated
      }}>
      <Router>
          { isAuthenticated && <Navbar /> }
        <div className="container">
            {routes}
        </div>
      </Router>
      </AuthContext.Provider>
  );
}

export default App
