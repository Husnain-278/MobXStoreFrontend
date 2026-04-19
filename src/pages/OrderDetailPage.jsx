import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import Button from '../components/Button';
import { useOrders } from '../hooks/useOrders';
import { formatCurrency, formatDate } from '../utils/formatters';
import { formatErrorMessage } from '../utils/errorHandler';

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders, currentOrder, fetchUserOrders, setCurrentOrder, isLoading, error, clearError } = useOrders();

  useEffect(() => {
    fetchUserOrders(1);
  }, [orderId]);

  const order = useMemo(() => {
    if (currentOrder?.order_id === orderId) {
      return currentOrder;
    }

    return orders.find((item) => item.order_id === orderId) || null;
  }, [orders, currentOrder, orderId]);

  useEffect(() => {
    if (order) {
      setCurrentOrder(order);
    }
  }, [order]);

  if (isLoading && !order) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f6f7fb]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!order && !isLoading) {
    return (
      <div className="min-h-screen bg-[#f6f7fb] px-4 py-8 lg:px-6 lg:py-12">
        <div className="mx-auto max-w-4xl">
          {error && (
            <Alert
              type="error"
              message={formatErrorMessage(error)}
              onClose={clearError}
              className="mb-6"
            />
          )}
          <Card className="py-16 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Order not found</h1>
            <p className="mt-2 text-slate-500">We could not find this order in your history.</p>
            <Button className="mt-6" onClick={() => navigate('/orders')}>
              Back to orders
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-8 lg:px-6 lg:py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Order details</h1>
            <p className="mt-2 text-slate-500">{order.order_id}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/orders')}>
            Back to orders
          </Button>
        </div>

        {error && (
          <Alert
            type="error"
            message={formatErrorMessage(error)}
            onClose={clearError}
            className="mt-6"
          />
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">{order.product_name}</h2>
              <Badge variant={order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}>
                {order.status}
              </Badge>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="text-sm text-slate-500">Quantity</div>
                <div className="font-semibold text-slate-900">{order.quantity}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Total</div>
                <div className="font-semibold text-slate-900">{formatCurrency(order.total_price)}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Payment method</div>
                <div className="font-semibold text-slate-900">{order.payment_method}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Payment status</div>
                <div className="font-semibold text-slate-900">{order.payment_status}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Placed on</div>
                <div className="font-semibold text-slate-900">{order.created_at ? formatDate(order.created_at) : 'N/A'}</div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-slate-900">Shipping address</h2>
            <div className="mt-5 space-y-2 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">{order.full_name}</div>
              <div>{order.address_line}</div>
              <div>{order.city}, {order.postal_code}</div>
              <div>{order.country}</div>
              <div>{order.phone}</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
