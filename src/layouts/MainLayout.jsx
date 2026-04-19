import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function MainLayout() {
  const { user, token, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-indigo-600">📱 MobXStore</div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-600 hover:text-indigo-600 transition">
                Home
              </Link>
              {token && (
                <>
                  <Link to="/wishlist" className="text-gray-600 hover:text-indigo-600 transition">
                    Wishlist
                  </Link>
                  <Link to="/orders" className="text-gray-600 hover:text-indigo-600 transition">
                    Orders
                  </Link>
                  <Link to="/addresses" className="text-gray-600 hover:text-indigo-600 transition">
                    Addresses
                  </Link>
                </>
              )}
            </div>

            {/* Right Side - Cart & Auth */}
            <div className="flex items-center gap-6">
              {/* Cart */}
              {token && (
                <Link to="/cart" className="relative">
                  <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-indigo-600 transition" />
                  {cartCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Auth */}
              {token && user ? (
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600 hidden sm:block">
                    Hi, {user.email?.split('@')[0] || 'User'}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-indigo-600 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-indigo-600 transition hidden sm:block"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition hidden sm:block"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-4 border-t pt-4">
              <Link
                to="/"
                className="block text-gray-600 hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              {token && (
                <>
                  <Link
                    to="/wishlist"
                    className="block text-gray-600 hover:text-indigo-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/orders"
                    className="block text-gray-600 hover:text-indigo-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link
                    to="/addresses"
                    className="block text-gray-600 hover:text-indigo-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Addresses
                  </Link>
                </>
              )}
              {!token && (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-600 hover:text-indigo-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">📱 MobXStore</h3>
              <p className="text-gray-400 text-sm">
                Your trusted source for the latest mobile phones
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
                <li><Link to="/register" className="hover:text-white">Sign Up</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white">Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MobXStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
