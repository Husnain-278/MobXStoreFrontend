import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, ShoppingCart } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { clearPendingPayPalPayment } from '../utils/paymentSession';

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  useEffect(() => {
    clearPendingPayPalPayment();
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-8 lg:px-6 lg:py-12">
      <div className="mx-auto max-w-3xl">
        <Card className="border border-slate-200 bg-white p-8 text-center">
          <div className="mx-auto inline-flex rounded-2xl bg-amber-50 p-3 text-amber-600">
            <XCircle className="h-8 w-8" />
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight text-slate-900">Payment cancelled</h1>
          <p className="mt-3 text-slate-600">
            The PayPal checkout was cancelled before the payment could be completed.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button onClick={() => navigate('/checkout')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to checkout
            </Button>
            <Button variant="outline" onClick={() => navigate('/cart')}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Back to cart
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}