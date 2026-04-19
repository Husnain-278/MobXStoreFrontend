import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { validateEmail } from '../utils/validators';
import { formatErrorMessage } from '../utils/errorHandler';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Input from '../components/Input';
import Alert from '../components/Alert';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error } = useAuth();
  const { addToCart } = useCart();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      if (result.meta.requestStatus !== 'fulfilled' || !result.payload?.access) {
        return;
      }

      const pendingCartProductId = location.state?.pendingCartProductId;
      const redirectTo = location.state?.redirectTo || '/';

      if (pendingCartProductId) {
        const addResult = await addToCart(pendingCartProductId);
        if (addResult.meta.requestStatus === 'fulfilled') {
          toast.success('Login successful! Product added to cart.');
        } else {
          toast.success('Login successful!');
          toast.error(formatErrorMessage(addResult.payload || addResult.error));
        }
      } else {
        toast.success('Login successful!');
      }

      navigate(redirectTo, { replace: true });
    } catch (err) {
      // Error handled in reducer
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">Sign In</h2>

        {error && (
          <Alert
            type="error"
            message={formatErrorMessage(error)}
            className="mb-6"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="your@email.com"
            required
          />

          <div>
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline font-semibold">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
