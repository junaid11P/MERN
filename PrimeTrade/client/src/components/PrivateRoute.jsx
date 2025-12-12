import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const authContext = useContext(AuthContext);
    const { isAuthenticated, loading } = authContext;

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
