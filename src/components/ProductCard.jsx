import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import Button from './Button';
import Badge from './Badge';
import { formatCurrency } from '../utils/formatters';

// Product card component
export default function ProductCard({
  product,
  detailHref,
  onAddToCart,
  onWishlistToggle,
  isInWishlist,
  isLoadingCart,
  isLoadingWishlist,
}) {
  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', variant: 'danger' };
    if (stock < 5) return { text: 'Limited Stock', variant: 'warning' };
    return { text: 'In Stock', variant: 'success' };
  };

  const stockStatus = getStockStatus(product.stock);
  const imageSrc = product.primary_image || 'https://via.placeholder.com/600x600?text=No+Image';

  return (
    <article className="group h-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70">
      {/* Image Container */}
      <div className="relative overflow-hidden border-b border-slate-100 bg-linear-to-br from-slate-50 via-white to-slate-100">
        {detailHref ? (
          <Link to={detailHref} className="block">
            <img
              src={imageSrc}
              alt={product.name}
              className="h-64 w-full object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x600?text=Product+Image';
              }}
            />
          </Link>
        ) : (
          <img
            src={imageSrc}
            alt={product.name}
            className="h-64 w-full object-contain p-4 transition duration-300 group-hover:scale-[1.03]"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/600x600?text=Product+Image';
            }}
          />
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => onWishlistToggle(product.id)}
          disabled={isLoadingWishlist}
          className="absolute right-3 top-3 rounded-full border border-slate-200 bg-white/90 p-2 shadow-sm backdrop-blur transition hover:border-slate-300 hover:bg-white disabled:opacity-50"
        >
          <Heart
            className={`w-5 h-5 transition ${
              isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>

        {/* Stock Badge */}
        <div className="absolute left-3 top-3">
          <Badge variant={stockStatus.variant}>{stockStatus.text}</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex h-[calc(100%-16rem)] flex-col p-5">
        {/* Brand */}
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{product.brand}</p>

        {/* Product Name */}
        {detailHref ? (
          <Link to={detailHref} className="mb-3 line-clamp-2 text-lg font-bold leading-tight text-slate-900 transition hover:text-indigo-600">
            {product.name}
          </Link>
        ) : (
          <h3 className="mb-3 line-clamp-2 text-lg font-bold leading-tight text-slate-900">
            {product.name}
          </h3>
        )}

        {/* Price */}
        <p className="mb-5 text-xl font-black text-indigo-600">
          {formatCurrency(product.price)}
        </p>

        {/* Add to Cart Button */}
        <Button
          onClick={() => onAddToCart(product.id)}
          disabled={product.stock === 0 || isLoadingCart}
          className="mt-auto w-full"
        >
          {isLoadingCart ? 'Adding...' : 'Add to Cart'}
        </Button>
      </div>
    </article>
  );
}
