import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import Pagination from '../components/Pagination';
import Alert from '../components/Alert';
import Button from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { formatCurrency } from '../utils/formatters';
import { formatErrorMessage } from '../utils/errorHandler';

const HERO_STATS = [
  { value: '100+', label: 'Products' },
  { value: '24/7', label: 'Support' },
  { value: 'Fast', label: 'Delivery' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const {
    items,
    categories,
    brands,
    filters,
    totalCount,
    pageSize,
    isLoading,
    error,
    fetch,
    fetchCategories,
    fetchBrands,
    setFilters,
    setPage,
    clearError,
  } = useProducts();
  const { addToCart, isLoading: cartLoading } = useCart();
  const {
    items: wishlistItems,
    fetch: fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isLoading: wishlistLoading,
  } = useWishlist();

  const [localSearch, setLocalSearch] = useState(filters.search);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch({ ...filters });
  }, [filters.page, filters.search, filters.category, filters.brand, filters.min_price, filters.max_price]);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    if (token) {
      fetchWishlist();
    }
  }, []);

  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(totalCount / pageSize)), [totalCount, pageSize]);

  const handleApplyFilters = () => {
    setFilters({ search: localSearch.trim() });
  };

  const handleAddToCart = async (productId) => {
    if (!token) {
      toast.error('Please login to add items to cart');
      navigate('/login', {
        state: {
          pendingCartProductId: productId,
          redirectTo: '/',
        },
      });
      return;
    }

    try {
      const result = await addToCart(productId);
      if (result.meta.requestStatus !== 'fulfilled') {
        toast.error(formatErrorMessage(result.payload || result.error));
        return;
      }
      toast.success('Added to cart');
    } catch (err) {
      toast.error(formatErrorMessage(err));
    }
  };

  const handleWishlistToggle = async (productId) => {
    if (!token) {
      toast.error('Please login to manage your wishlist');
      return;
    }

    try {
      const existing = wishlistItems.find((item) => item.product === productId);
      if (existing) {
        const removeResult = await removeFromWishlist(existing.id);
        if (removeResult.meta.requestStatus !== 'fulfilled') {
          throw new Error('Failed to remove from wishlist');
        }
        fetchWishlist();
        toast.success('Removed from wishlist');
        return;
      }

      const addResult = await addToWishlist(productId);
      if (addResult.meta.requestStatus !== 'fulfilled') {
        throw new Error('Failed to add to wishlist');
      }
      fetchWishlist();
      toast.success('Added to wishlist');
    } catch (err) {
      toast.error(formatErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.16),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f6f7fb_100%)]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 lg:grid-cols-[1.25fr_0.75fr] lg:px-6 lg:py-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Premium mobile marketplace
            </div>
            <h1 className="max-w-2xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
              Smart phones. Sharp prices. Built for serious shopping.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Browse phones from verified brands, compare specs, and place orders with a streamlined checkout flow powered by your Django backend.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to={token ? '/cart' : '/login'}
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {token ? 'Go to Cart' : 'Sign in to shop'}
              </Link>
              <button
                type="button"
                onClick={() => setShowFilters((value) => !value)}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {showFilters ? 'Hide filters' : 'Browse filters'}
              </button>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="text-2xl font-black">{stat.value}</div>
                  <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-4xl border border-slate-200 bg-white p-6 shadow-xl shadow-indigo-100/60">
            <div className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Featured style</div>
            <div className="space-y-4">
              <div className="overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-indigo-700 p-6 text-white shadow-lg">
                <div className="text-xs uppercase tracking-[0.3em] text-indigo-200">MobXStore</div>
                <div className="mt-10 text-3xl font-black">Built for clean buying journeys.</div>
                <p className="mt-4 max-w-sm text-sm text-slate-200">
                  A fast frontend layered over your Django APIs with auth, cart, checkout, and orders.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Starting at</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">{formatCurrency(0)}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Members</div>
                  <div className="mt-1 text-2xl font-bold text-slate-900">Protected</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-12">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Browse products</h2>
            <p className="text-sm text-slate-500">{totalCount > 0 ? `${totalCount} products available` : 'No products found'}</p>
          </div>

          <div className="flex w-full gap-3 lg:max-w-xl">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={localSearch}
                onChange={(event) => setLocalSearch(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleApplyFilters()}
                placeholder="Search mobiles..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500"
              />
            </div>
            <Button onClick={handleApplyFilters}>Search</Button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Category</span>
                <select
                  value={filters.category}
                  onChange={(event) => setFilters({ category: event.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id || category.slug} value={category.slug || category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Brand</span>
                <select
                  value={filters.brand}
                  onChange={(event) => setFilters({ brand: event.target.value })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                >
                  <option value="">All brands</option>
                  {brands.map((brand) => (
                    <option key={brand.id || brand.slug} value={brand.slug || brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Min price</span>
                <input
                  type="number"
                  value={filters.min_price}
                  onChange={(event) => setFilters({ min_price: event.target.value })}
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-slate-700">Max price</span>
                <input
                  type="number"
                  value={filters.max_price}
                  onChange={(event) => setFilters({ max_price: event.target.value })}
                  placeholder="9999"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                />
              </label>
            </div>
          </div>
        )}

        {error && (
          <Alert
            type="error"
            message={formatErrorMessage(error)}
            onClose={clearError}
            className="mb-6"
          />
        )}

        {isLoading ? (
          <div className="flex min-h-[30vh] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white">
            <Spinner size="lg" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <h3 className="text-xl font-bold text-slate-900">No products found</h3>
            <p className="mt-2 text-slate-500">Try clearing your filters or searching with different terms.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  detailHref={`/product/${product.slug}`}
                  onAddToCart={handleAddToCart}
                  onWishlistToggle={handleWishlistToggle}
                  isInWishlist={isInWishlist(product.id)}
                  isLoadingCart={cartLoading}
                  isLoadingWishlist={wishlistLoading}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={setPage} />
            )}
          </>
        )}
      </section>
    </div>
  );
}
