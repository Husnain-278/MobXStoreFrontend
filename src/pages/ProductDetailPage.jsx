import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { formatCurrency, formatDate } from '../utils/formatters';
import { formatErrorMessage } from '../utils/errorHandler';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { currentProduct, fetchDetail, clearCurrentProduct, addReview, isLoading, error } = useProducts();
  const { addToCart, isLoading: cartLoading } = useCart();
  const {
    items: wishlistItems,
    fetch: fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    isLoading: wishlistLoading,
  } = useWishlist();
  const [selectedImage, setSelectedImage] = useState('');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchDetail(slug);
    }

    return () => clearCurrentProduct();
  }, [slug]);

  useEffect(() => {
    if (token) {
      fetchWishlist();
    }
  }, [token]);

  useEffect(() => {
    if (currentProduct?.primary_image && !selectedImage) {
      setSelectedImage(currentProduct.primary_image);
    }
  }, [currentProduct, selectedImage]);

  const images = useMemo(() => {
    const productImages = currentProduct?.images?.map((item) => item.image) || [];
    return currentProduct?.primary_image
      ? [currentProduct.primary_image, ...productImages.filter((image) => image !== currentProduct.primary_image)]
      : productImages;
  }, [currentProduct]);

  const handleAddToCart = async () => {
    if (!token) {
      toast.error('Please login to add items to cart');
      navigate('/login', {
        state: {
          pendingCartProductId: currentProduct.id,
          redirectTo: `/product/${slug}`,
        },
      });
      return;
    }

    try {
      const result = await addToCart(currentProduct.id);
      if (result.meta.requestStatus !== 'fulfilled') {
        toast.error(formatErrorMessage(result.payload || result.error));
        return;
      }
      toast.success('Added to cart');
    } catch (err) {
      toast.error(formatErrorMessage(err));
    }
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      toast.error('Please login to manage your wishlist');
      return;
    }

    try {
      const existing = wishlistItems.find((item) => item.product === currentProduct.id);
      if (existing) {
        const removeResult = await removeFromWishlist(existing.id);
        if (removeResult.meta.requestStatus !== 'fulfilled') {
          throw new Error('Failed to remove from wishlist');
        }
        fetchWishlist();
        toast.success('Removed from wishlist');
        return;
      }

      const addResult = await addToWishlist(currentProduct.id);
      if (addResult.meta.requestStatus !== 'fulfilled') {
        throw new Error('Failed to add to wishlist');
      }
      fetchWishlist();
      toast.success('Added to wishlist');
    } catch (err) {
      toast.error(formatErrorMessage(err));
    }
  };

  const handleReviewChange = (event) => {
    const { name, value } = event.target;
    setReviewForm((current) => ({
      ...current,
      [name]: name === 'rating' ? Number(value) : value,
    }));
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error('Please login to submit a review');
      return;
    }

    if (!reviewForm.rating) {
      toast.error('Please select a rating');
      return;
    }

    try {
      setReviewSubmitting(true);
      const result = await addReview(currentProduct.id, reviewForm.rating, reviewForm.comment.trim());
      if (result.meta.requestStatus !== 'fulfilled') {
        toast.error(formatErrorMessage(result.payload || result.error));
        return;
      }
      toast.success('Review submitted');
      setReviewForm({ rating: 5, comment: '' });
      await fetchDetail(slug);
    } catch (err) {
      toast.error(formatErrorMessage(err));
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (isLoading && !currentProduct) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#f6f7fb]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error && !currentProduct) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Alert
          type="error"
          title="Could not load product"
          message={formatErrorMessage(error)}
          className="mb-6"
        />
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  if (!currentProduct) {
    return null;
  }

  const stockState = currentProduct.stock > 0 ? 'In Stock' : 'Out of Stock';

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-8 lg:px-6 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="p-0 overflow-hidden">
            <div className="bg-white p-4">
              <div className="overflow-hidden rounded-3xl bg-slate-100">
                <img
                  src={selectedImage || currentProduct.primary_image}
                  alt={currentProduct.name}
                  className="h-95 w-full object-contain bg-white p-4"
                />
              </div>
              {images.length > 1 && (
                <div className="mt-4 grid grid-cols-4 gap-3">
                  {images.map((image) => (
                    <button
                      key={image}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`overflow-hidden rounded-2xl border-2 transition ${
                        selectedImage === image ? 'border-indigo-600' : 'border-transparent'
                      }`}
                    >
                      <img src={image} alt="Product thumbnail" className="h-20 w-full bg-white object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Card>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={currentProduct.stock > 0 ? 'success' : 'danger'}>{stockState}</Badge>
                <Badge variant="gray">{currentProduct.brand}</Badge>
                <Badge variant="gray">{currentProduct.category}</Badge>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {currentProduct.name}
              </h1>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <div className="text-sm text-slate-500">Price</div>
                  <div className="text-4xl font-black text-indigo-600">
                    {formatCurrency(currentProduct.price)}
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-right">
                  <div className="text-sm text-slate-500">Stock</div>
                  <div className="text-lg font-bold text-slate-900">{currentProduct.stock}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={cartLoading || currentProduct.stock === 0}
                  className="inline-flex items-center gap-2"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {cartLoading ? 'Adding...' : 'Add to cart'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className="inline-flex items-center gap-2"
                >
                  <Heart className="h-4 w-4" />
                  {isInWishlist(currentProduct.id) ? 'Remove from wishlist' : 'Save to wishlist'}
                </Button>
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-600">{currentProduct.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Added</div>
                  <div className="font-semibold text-slate-900">{currentProduct.created_at ? formatDate(currentProduct.created_at) : 'N/A'}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Average rating</div>
                  <div className="flex items-center gap-2 font-semibold text-slate-900">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {currentProduct.average_rating || 'No ratings yet'}
                  </div>
                </div>
              </div>
            </div>

            {currentProduct.specifications?.length > 0 && (
              <Card>
                <h2 className="text-xl font-bold text-slate-900">Specifications</h2>
                <div className="mt-4 divide-y divide-slate-200">
                  {currentProduct.specifications.map((spec) => (
                    <div key={spec.name} className="flex items-center justify-between py-3 text-sm">
                      <span className="font-medium text-slate-500">{spec.name}</span>
                      <span className="font-semibold text-slate-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <h2 className="text-xl font-bold text-slate-900">Product details</h2>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-slate-500">Brand</dt>
                <dd className="font-semibold text-slate-900">{currentProduct.brand}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Category</dt>
                <dd className="font-semibold text-slate-900">{currentProduct.category}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Reviews</dt>
                <dd className="font-semibold text-slate-900">{currentProduct.total_reviews || 0}</dd>
              </div>
              <div>
                <dt className="text-sm text-slate-500">Price</dt>
                <dd className="font-semibold text-slate-900">{formatCurrency(currentProduct.price)}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-slate-900">Reviews</h2>
            <div className="mt-5 space-y-4">
              {currentProduct.reviews?.length > 0 ? (
                currentProduct.reviews.map((review) => (
                  <div key={review.id} className="rounded-2xl bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-slate-900">{review.user}</div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        {review.rating}
                      </div>
                    </div>
                    {review.comment && <p className="mt-2 text-sm leading-6 text-slate-600">{review.comment}</p>}
                    <p className="mt-2 text-xs text-slate-400">{review.created_at ? formatDate(review.created_at) : ''}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">No reviews yet.</p>
              )}
            </div>

            {token && (
              <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4 rounded-2xl bg-slate-50 p-4">
                <h3 className="text-lg font-bold text-slate-900">Write a review</h3>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Rating</span>
                  <select
                    name="rating"
                    value={reviewForm.rating}
                    onChange={handleReviewChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                  >
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating} star{rating > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-slate-700">Comment</span>
                  <textarea
                    name="comment"
                    rows="4"
                    value={reviewForm.comment}
                    onChange={handleReviewChange}
                    placeholder="Tell other buyers what you think..."
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
                  />
                </label>
                <Button type="submit" disabled={reviewSubmitting} className="w-full">
                  {reviewSubmitting ? 'Submitting...' : 'Submit review'}
                </Button>
              </form>
            )}
          </Card>
        </div>

        <div className="mt-10">
          <Link to="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
