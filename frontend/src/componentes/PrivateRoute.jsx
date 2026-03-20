import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {

    const auth = localStorage.getItem("auth");

    // Si no hay login echa para fuera
    if (!auth) {
        return <Navigate to="/login" />;
    }

    //  Si hay login pues entra
    return children;
}

export default PrivateRoute;