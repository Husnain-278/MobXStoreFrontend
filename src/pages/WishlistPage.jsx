import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import * as productService from '../api/productService';
import { formatCurrency, formatDate } from '../utils/formatters';
import { formatErrorMessage } from '../utils/errorHandler';

const normalizeProductCatalog = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.results?.data)) {
    return payload.results.data;
  }

  if (Array.isArray(payload?.data?.results)) {
    return payload.data.results;
  }

  return [];
};

export default function WishlistPage() {
  const { items, fetch, removeFromWishlist, isLoading, error, clearError } = useWishlist();
  const { addToCart } = useCart();
  const [catalog, setCatalog] = useState([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [catalogError, setCatalogError] = useState('');

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        setCatalogLoading(true);
        const response = await productService.getProducts({ page_size: 1000 });
        setCatalog(normalizeProductCatalog(response.data));
      } catch (err) {
        setCatalogError(formatErrorMessage(err));
      } finally {
        setCatalogLoading(false);
      }
    };

    loadCatalog();
  }, []);

  const productMap = useMemo(() => {
    const map = new Map();
    catalog.forEach((product) => {
      map.set(product.id, product);
    });
    return map;
  }, [catalog]);

  const handleRemove = async (wishlistId) => {
    try {
      const result = await removeFromWishlist(wishlistId);
      if (result.meta.requestStatus !== 'fulfilled') {
        throw new Error('Failed to remove item');
      }
      await fetch();
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error(formatErrorMessage(err));
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const result = await addToCart(productId);
      if (result.meta.requestStatus !== 'fulfilled') {
        throw new Error('Failed to add to cart');
      }
      toast.success('Added to cart');
    } catch (err) {
      toast.error(formatErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-8 lg:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">My Wishlist</h1>
            <p className="mt-2 text-slate-500">Saved products and quick actions.</p>
          </div>
          <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Continue shopping
          </Link>
        </div>

        {(error || catalogError) && (
          <Alert
            type="error"
            message={formatErrorMessage(error || catalogError)}
            onClose={clearError}
            className="mt-6"
          />
        )}

        {(isLoading || catalogLoading) ? (
          <div className="mt-8 flex min-h-[40vh] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
            <Spinner size="lg" />
          </div>
        ) : items.length === 0 ? (
          <Card className="mt-8 py-16 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Your wishlist is empty</h2>
            <p className="mt-2 text-slate-500">Save products here to compare them later.</p>
            <Link to="/" className="mt-6 inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
              Browse products
            </Link>
          </Card>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((wishlistItem) => {
              const product = productMap.get(wishlistItem.product);

              return (
                <Card key={wishlistItem.id} className="flex flex-col overflow-hidden p-0">
                  <div className="relative h-52 bg-slate-100">
                    <Link to={product?.slug ? `/product/${product.slug}` : '/'} className="block h-full">
                      <img
                        src={product?.primary_image || 'https://via.placeholder.com/600x400?text=Wishlist+Item'}
                        alt={product?.name || 'Wishlist item'}
                        className="h-full w-full object-cover"
                      />
                    </Link>
                    <div className="absolute left-3 top-3">
                      <Badge variant="gray">Saved</Badge>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={product?.slug ? `/product/${product.slug}` : '/'} className="text-lg font-bold text-slate-900 hover:text-indigo-600">
                          {product?.name || `Product #${wishlistItem.product}`}
                        </Link>
                        <p className="mt-1 text-sm text-slate-500">{product?.brand || 'Unknown brand'}</p>
                      </div>
                      {product?.stock !== undefined && (
                        <Badge variant={product.stock > 0 ? 'success' : 'danger'}>
                          {product.stock > 0 ? 'In stock' : 'Out of stock'}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                      <span>Saved on</span>
                      <span>{wishlistItem.created_at ? formatDate(wishlistItem.created_at) : 'N/A'}</span>
                    </div>

                    <div className="mt-4 text-2xl font-black text-indigo-600">
                      {product?.price ? formatCurrency(product.price) : 'Unavailable'}
                    </div>

                    <div className="mt-5 flex gap-3">
                      <Button
                        className="flex-1"
                        onClick={() => handleAddToCart(wishlistItem.product)}
                        disabled={!product || product.stock === 0}
                      >
                        Add to cart
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRemove(wishlistItem.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
