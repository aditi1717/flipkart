import React from 'react';
import { NavLink } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

const BottomNav = () => {
    const totalItems = useCartStore((state) => state.getTotalItems());

    const navItems = [
        { name: 'Home', icon: 'home', path: '/' },
        { name: 'Play', icon: 'play_circle_outline', path: '/play' },
        { name: 'Top Deals', icon: 'local_offer', path: '/deals' },
        { name: 'Account', icon: 'person_outline', path: '/account' },
        { name: 'Cart', icon: 'shopping_cart', path: '/cart', badge: totalItems },
    ];

    return (
        <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 py-2 z-50 md:hidden">
            {navItems.map((item) => (
                <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-primary opacity-100' : 'opacity-60 dark:opacity-40'
                        }`
                    }
                >
                    <div className="relative">
                        <span className="material-icons-outlined">
                            {item.name === 'Play' && item.path === '/play' ? 'play_circle' : item.icon}
                        </span>
                        {item.badge > 0 && (
                            <div className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                                {item.badge}
                            </div>
                        )}
                    </div>
                    <span className="text-[10px] font-medium">{item.name}</span>
                </NavLink>
            ))}
        </footer>
    );
};

export default BottomNav;
