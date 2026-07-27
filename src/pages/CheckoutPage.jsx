import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import AddressForm from '../components/AddressForm';
import { useCart } from '../hooks/useCart';
import { useAddresses } from '../hooks/useAddresses';
import { createPayPalOrder } from '../api/paymentService';
import { formatCurrency } from '../utils/formatters';
import { formatErrorMessage } from '../utils/errorHandler';
import { savePendingPayPalPayment } from '../utils/paymentSession';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { item, fetch: fetchCart, isLoading: cartLoading, error: cartError, clearError: clearCartError } = useCart();
  const { addresses, fetch: fetchAddresses, create: createAddress, isLoading: addressesLoading, error: addressesError, clearError: clearAddressesError } = useAddresses();
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, []);

  const defaultAddress = useMemo(() => addresses.find((address) => address.is_default) || addresses[0] || null, [addresses]);
  const activeAddressId = selectedAddressId || (defaultAddress ? String(defaultAddress.id) : '');

  const subtotal = useMemo(() => (item ? Number(item.total_price) : 0), [item]);

  const handleAddressSubmit = async (addressData) => {
    try {
      const result = await createAddress({ ...addressData, is_default: addresses.length === 0 });
      if (result.meta.requestStatus !== 'fulfilled') {
        throw new Error('Failed to save address');
      }
      toast.success('Address saved');
      setShowAddressForm(false);
      fetchAddresses();
    } catch (err) {
      toast.error(formatErrorMessage(err));
    }
  };

  const handlePayWithPayPal = async () => {
    if (!activeAddressId) {
      toast.error('Select a delivery address first');
      return;
    }

    try {
      setPaymentLoading(true);

      const response = await createPayPalOrder(Number(activeAddressId));
      const payload = response.data?.data || response.data;
      const approvalUrl = payload?.approval_url;
      const paypalOrderId = payload?.paypal_order_id;

      if (!approvalUrl || !paypalOrderId) {
        throw new Error('PayPal approval link is missing');
      }

      savePendingPayPalPayment({
        addressId: Number(activeAddressId),
        paypalOrderId,
        amount: payload?.amount,
        currency: payload?.currency,
      });

      window.location.assign(approvalUrl);
    } catch (err) {
      toast.error(formatErrorMessage(err));
      setPaymentLoading(false);
    }
  };

  if (cartLoading && !item) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f6f7fb]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-8 lg:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Checkout</h1>
        <p className="mt-2 text-slate-500">Confirm your address and place the order.</p>

        {(cartError || addressesError) && (
          <Alert
            type="error"
            message={formatErrorMessage(cartError || addressesError)}
            onClose={() => {
              clearCartError();
              clearAddressesError();
            }}
            className="mt-6"
          />
        )}

        {!item ? (
          <Card className="mt-8 py-16 text-center">
            <h2 className="text-2xl font-bold text-slate-900">No cart item found</h2>
            <p className="mt-2 text-slate-500">Add a product to cart before checking out.</p>
            <Button onClick={() => navigate('/')} className="mt-6">
              Browse products
            </Button>
          </Card>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Delivery address</h2>
                <div className="mt-5 space-y-3">
                  {addresses.map((address) => (
                    <label key={address.id} className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-500">
                      <input
                        type="radio"
                        name="address"
                        value={address.id}
                        checked={String(activeAddressId) === String(address.id)}
                        onChange={() => setSelectedAddressId(String(address.id))}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{address.full_name}</div>
                        <div className="text-sm text-slate-600">{address.address_line}</div>
                        <div className="text-sm text-slate-600">{address.city}, {address.country}</div>
                        <div className="text-sm text-slate-600">{address.phone}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button variant="outline" onClick={() => setShowAddressForm((value) => !value)}>
                    {showAddressForm ? 'Hide address form' : 'Add new address'}
                  </Button>
                </div>

                {showAddressForm && (
                  <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <AddressForm onSubmit={handleAddressSubmit} isLoading={addressesLoading} submitText="Save address" />
                  </div>
                )}

                {!addresses.length && !showAddressForm && (
                  <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                    No address yet. Add one to continue checkout.
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Order summary</h2>
                <div className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Product</span>
                    <span className="font-semibold text-slate-900">{item.product_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Quantity</span>
                    <span className="font-semibold text-slate-900">{item.quantity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="font-black text-indigo-600">{formatCurrency(subtotal)}</span>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  You’ll finish payment securely on PayPal, and we’ll confirm your order automatically when you return.
                </div>

                <Button
                  className="mt-6 w-full"
                  onClick={handlePayWithPayPal}
                  disabled={paymentLoading || !activeAddressId || !item}
                >
                  {paymentLoading ? 'Redirecting to PayPal...' : 'Continue with PayPal'}
                </Button>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
