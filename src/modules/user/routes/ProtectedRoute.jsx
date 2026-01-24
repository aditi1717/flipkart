import { Navigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useCartStore();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login but save the attempted location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
