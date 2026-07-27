import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card from '../components/Card';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import { capturePayPalOrder } from '../api/paymentService';
import { clearPendingPayPalPayment, getPendingPayPalPayment } from '../utils/paymentSession';
import { formatErrorMessage } from '../utils/errorHandler';
import { useOrders } from '../hooks/useOrders';
import { fetchUserOrders } from '../store/slices/ordersSlice';

const handledCaptureKeys = new Set();

export default function PaymentSuccessPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { orders, isLoading: ordersLoading } = useOrders();
  const pendingPayment = getPendingPayPalPayment();
  const paypalOrderId = searchParams.get('token') || searchParams.get('paypal_order_id') || pendingPayment?.paypalOrderId;
  const addressId = Number(searchParams.get('address_id') || pendingPayment?.addressId);
  const hasPaymentSession = Boolean(paypalOrderId && addressId);
  const [isCapturing, setIsCapturing] = useState(hasPaymentSession);
  const [captureError, setCaptureError] = useState('');
  const [capturedOrder, setCapturedOrder] = useState(null);
  const latestOrder = orders[0] || null;

  useEffect(() => {
    if (!hasPaymentSession) {
      dispatch(fetchUserOrders({ page: 1 }));
      return;
    }

    const captureKey = `${paypalOrderId}:${addressId}`;

    if (handledCaptureKeys.has(captureKey)) {
      return;
    }

    handledCaptureKeys.add(captureKey);

    const runCapture = async () => {
      try {
        const response = await capturePayPalOrder(paypalOrderId, addressId);
        const payload = response.data?.data || response.data;

        clearPendingPayPalPayment();
        setCapturedOrder(payload);
        toast.success('Payment captured successfully');
      } catch (error) {
        handledCaptureKeys.delete(captureKey);
        setCaptureError(formatErrorMessage(error));
      } finally {
        setIsCapturing(false);
      }
    };

    runCapture();
  }, [addressId, dispatch, hasPaymentSession, paypalOrderId]);

  if (!hasPaymentSession) {
    if (ordersLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb] px-4">
          <Spinner size="lg" />
        </div>
      );
    }

    if (latestOrder) {
      return (
        <div className="min-h-screen bg-[#f6f7fb] px-4 py-8 lg:px-6 lg:py-12">
          <div className="mx-auto max-w-3xl">
            <Card className="border border-emerald-100 bg-white p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                    <ShieldCheck className="h-4 w-4" />
                    Order confirmed from your account
                  </div>
                  <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">Payment completed</h1>
                  <p className="mt-3 text-slate-600">
                    We found your latest order in your account and confirmed the payment details for you.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid gap-4 rounded-3xl bg-slate-50 p-5 sm:grid-cols-2">
                <div>
                  <div className="text-sm text-slate-500">Order ID</div>
                  <div className="mt-1 font-semibold text-slate-900">{latestOrder.order_id}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Payment status</div>
                  <div className="mt-1 font-semibold text-slate-900">{latestOrder.payment_status}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Product</div>
                  <div className="mt-1 font-semibold text-slate-900">{latestOrder.product_name}</div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Amount</div>
                  <div className="mt-1 font-semibold text-slate-900">{latestOrder.total_price}</div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button onClick={() => navigate('/orders')}>View orders</Button>
                <Button variant="outline" onClick={() => navigate(`/orders/${latestOrder.order_id}`)}>
                  Open order details
                </Button>
              </div>
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#f6f7fb] px-4 py-8 lg:px-6 lg:py-12">
        <div className="mx-auto max-w-3xl">
          <Card className="border border-red-100 bg-white p-8 text-center">
            <Alert
              type="error"
              message="We could not find the pending PayPal payment. Please return to checkout and try again."
              className="mb-6 text-left"
              onClose={() => {}}
            />
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Payment not completed</h1>
            <p className="mt-3 text-slate-600">The PayPal checkout session is missing or expired.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={() => navigate('/checkout')}>Return to checkout</Button>
              <Button variant="outline" onClick={() => navigate('/cart')}>Back to cart</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (isCapturing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb] px-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-8 lg:px-6 lg:py-12">
      <div className="mx-auto max-w-3xl">
        {captureError ? (
          <Card className="border border-red-100 bg-white p-8 text-center">
            <Alert
              type="error"
              message={captureError}
              className="mb-6 text-left"
              onClose={() => setCaptureError('')}
            />
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Payment not completed</h1>
            <p className="mt-3 text-slate-600">The PayPal checkout could not be finalized from this session.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={() => navigate('/checkout')}>Return to checkout</Button>
              <Button variant="outline" onClick={() => navigate('/cart')}>Back to cart</Button>
            </div>
          </Card>
        ) : (
          <Card className="border border-emerald-100 bg-white p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  Verified by backend capture
                </div>
                <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900">Payment completed</h1>
                <p className="mt-3 text-slate-600">
                  Your PayPal payment was approved and captured successfully. The order has been recorded in your account.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 rounded-3xl bg-slate-50 p-5 sm:grid-cols-2">
              <div>
                <div className="text-sm text-slate-500">Order ID</div>
                <div className="mt-1 font-semibold text-slate-900">{capturedOrder?.order_id || 'Processing complete'}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Order status</div>
                <div className="mt-1 font-semibold text-slate-900">{capturedOrder?.status || capturedOrder?.order_status || 'processing'}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Payment status</div>
                <div className="mt-1 font-semibold text-slate-900">{capturedOrder?.payment_status || 'paid'}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">PayPal order ID</div>
                <div className="mt-1 break-all font-semibold text-slate-900">{capturedOrder?.paypal_order_id || searchParams.get('token') || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Amount</div>
                <div className="mt-1 font-semibold text-slate-900">{capturedOrder?.amount || 'Updated in order history'}</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={() => navigate('/orders')}>View orders</Button>
              {capturedOrder?.order_id && (
                <Button variant="outline" onClick={() => navigate(`/orders/${capturedOrder.order_id}`)}>
                  Open order details
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}