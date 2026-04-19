import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import AddressForm from '../components/AddressForm';
import { useAddresses } from '../hooks/useAddresses';
import { formatErrorMessage } from '../utils/errorHandler';

export default function AddressesPage() {
  const { addresses, fetch, create, delete: remove, setDefault, isLoading, error, clearError } = useAddresses();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch();
  }, []);

  const handleCreate = async (addressData) => {
    try {
      const result = await create(addressData);
      if (result.meta.requestStatus !== 'fulfilled') {
        throw new Error('Failed to save address');
      }
      setShowForm(false);
      fetch();
      toast.success('Address saved');
    } catch (err) {
      toast.error(formatErrorMessage(err));
    }
  };

  const handleDelete = async (addressId) => {
    try {
      const result = await remove(addressId);
      if (result.meta.requestStatus !== 'fulfilled') {
        throw new Error('Failed to delete address');
      }
      fetch();
      toast.success('Address deleted');
    } catch (err) {
      toast.error(formatErrorMessage(err));
    }
  };

  const handleDefault = async (addressId) => {
    try {
      const result = await setDefault(addressId);
      if (result.meta.requestStatus !== 'fulfilled') {
        throw new Error('Failed to set default address');
      }
      fetch();
      toast.success('Default address updated');
    } catch (err) {
      toast.error(formatErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-8 lg:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">My Addresses</h1>
            <p className="mt-2 text-slate-500">Manage your shipping addresses and defaults.</p>
          </div>
          <Button onClick={() => setShowForm(true)}>Add address</Button>
        </div>

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
        ) : addresses.length === 0 ? (
          <Card className="mt-8 py-16 text-center">
            <h2 className="text-2xl font-bold text-slate-900">No addresses yet</h2>
            <p className="mt-2 text-slate-500">Add an address to speed up checkout.</p>
            <Button onClick={() => setShowForm(true)} className="mt-6">
              Create address
            </Button>
          </Card>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {addresses.map((address) => (
              <Card key={address.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{address.full_name}</h2>
                    <p className="mt-2 text-sm text-slate-600">{address.address_line}</p>
                    <p className="text-sm text-slate-600">{address.city}, {address.postal_code}</p>
                    <p className="text-sm text-slate-600">{address.country}</p>
                    <p className="mt-2 text-sm text-slate-600">{address.phone}</p>
                  </div>
                  {address.is_default && <Badge variant="success">Default</Badge>}
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  {!address.is_default && (
                    <Button variant="outline" size="sm" onClick={() => handleDefault(address.id)}>
                      Set default
                    </Button>
                  )}
                  <Button variant="danger" size="sm" onClick={() => handleDelete(address.id)}>
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Add Address"
        size="lg"
      >
        <AddressForm onSubmit={handleCreate} isLoading={isLoading} submitText="Save address" />
      </Modal>
    </div>
  );
}
