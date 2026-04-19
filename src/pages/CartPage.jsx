import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { useCart } from '../hooks/useCart';
import { formatCurrency, formatDate } from '../utils/formatters';
import { formatErrorMessage } from '../utils/errorHandler';

export default function CartPage() {
  const navigate = useNavigate();
  const { item, fetch, updateQuantity, remove, isLoading, error, clearError } = useCart();

  useEffect(() => {
    fetch();
  }, []);

  const handleQuantityChange = async (action) => {
    try {
      const result = await updateQuantity(action);
      if (result.meta.requestStatus !== 'fulfilled') {
        throw new Error('Failed to update cart');
      }
      toast.success(action === 'increase' ? 'Quantity increased' : 'Quantity decreased');
    } catch (err) {
      toast.error(formatErrorMessage(err));
    }
  };

  const handleRemove = async () => {
    try {
      const result = await remove();
      if (result.meta.requestStatus !== 'fulfilled') {
        throw new Error('Failed to remove cart');
      }
      toast.success('Cart removed');
    } catch (err) {
      toast.error(formatErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-8 lg:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Shopping Cart</h1>
            <p className="mt-2 text-slate-500">Your backend allows one active cart item per user.</p>
          </div>
          <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Continue shopping
          </Link>
        </div>

        {error && (
          <Alert
            type="error"
            message={formatErrorMessage(error)}
            onClose={clearError}
            className="mb-6"
          />
        )}

        {isLoading && !item ? (
          <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
            <Spinner size="lg" />
          </div>
        ) : !item ? (
          <Card className="py-16 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Your cart is empty</h2>
            <p className="mt-2 text-slate-500">Add a phone from the product catalog to start checkout.</p>
            <Button onClick={() => navigate('/')} className="mt-6">
              Browse products
            </Button>
          </Card>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <Card className="space-y-6">
              <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">{item.product_name}</h2>
                  <p className="text-sm text-slate-500">Added {item.created_at ? formatDate(item.created_at) : 'recently'}</p>
                </div>
                <Badge variant="gray">Cart item</Badge>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Unit price</div>
                  <div className="mt-1 text-lg font-bold text-slate-900">{formatCurrency(item.product_price)}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Quantity</div>
                  <div className="mt-1 text-lg font-bold text-slate-900">{item.quantity}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Total</div>
                  <div className="mt-1 text-lg font-bold text-indigo-600">{formatCurrency(item.total_price)}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => handleQuantityChange('decrease')} disabled={item.quantity <= 1 || isLoading}>
                  - Decrease
                </Button>
                <Button variant="outline" onClick={() => handleQuantityChange('increase')} disabled={isLoading}>
                  + Increase
                </Button>
                <Button variant="danger" onClick={handleRemove} disabled={isLoading}>
                  Remove cart
                </Button>
              </div>
            </Card>

            <Card className="h-fit">
              <h3 className="text-xl font-bold text-slate-900">Order summary</h3>
              <div className="mt-5 space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Product</span>
                  <span className="font-semibold text-slate-900">{item.product_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Quantity</span>
                  <span className="font-semibold text-slate-900">{item.quantity}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base">
                  <span className="font-semibold text-slate-900">Grand total</span>
                  <span className="font-black text-indigo-600">{formatCurrency(item.total_price)}</span>
                </div>
              </div>

              <Button className="mt-6 w-full" onClick={() => navigate('/checkout')}>
                Proceed to checkout
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
