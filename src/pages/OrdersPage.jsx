import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { useOrders } from '../hooks/useOrders';
import { formatCurrency, formatDate } from '../utils/formatters';
import { formatErrorMessage } from '../utils/errorHandler';

export default function OrdersPage() {
  const { orders, totalCount, pageSize, isLoading, error, fetchUserOrders, clearError } = useOrders();
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUserOrders(page);
  }, [page]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / pageSize)), [totalCount, pageSize]);

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-8 lg:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">My Orders</h1>
        <p className="mt-2 text-slate-500">Track your order history and statuses.</p>

        {error && (
          <Alert
            type="error"
            message={formatErrorMessage(error)}
            onClose={clearError}
            className="mt-6"
          />
        )}

        {isLoading ? (
          <div className="mt-8 flex min-h-[40vh] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
            <Spinner size="lg" />
          </div>
        ) : orders.length === 0 ? (
          <Card className="mt-8 py-16 text-center">
            <h2 className="text-2xl font-bold text-slate-900">No orders yet</h2>
            <p className="mt-2 text-slate-500">Once you place your first order, it will appear here.</p>
            <Link to="/" className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
              Browse products
            </Link>
          </Card>
        ) : (
          <div className="mt-8 space-y-4">
            {orders.map((order) => (
              <Card key={order.order_id}>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-bold text-slate-900">{order.product_name}</h2>
                      <Badge variant={order.status === 'completed' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">Order ID: {order.order_id}</p>
                    <p className="mt-1 text-sm text-slate-500">Placed on {order.created_at ? formatDate(order.created_at) : 'N/A'}</p>
                    <Link to={`/orders/${order.order_id}`} className="mt-3 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                      View details
                    </Link>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3 md:min-w-[320px]">
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">Quantity</div>
                      <div className="font-semibold text-slate-900">{order.quantity}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">Total</div>
                      <div className="font-semibold text-slate-900">{formatCurrency(order.total_price)}</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-wide text-slate-400">Payment</div>
                      <div className="font-semibold text-slate-900">{order.payment_status}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
