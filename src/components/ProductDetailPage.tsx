import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Star, ShoppingCart, Heart, Share2, Package, Truck, Shield, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { productsAPI } from '../utils/api';
import { toast } from 'sonner';
import { formatCurrency, FREE_SHIPPING_THRESHOLD } from '../utils/currency';

interface ProductDetailPageProps {
  onAddToCart?: (product: any) => void;
}

export function ProductDetailPage({ onAddToCart }: ProductDetailPageProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await productsAPI.getById(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        onAddToCart?.(product);
      }
      
      // Show success notification
      toast.success(`${product.name} added to cart!`, {
        description: `Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to your cart`,
        action: {
          label: 'View Cart',
          onClick: () => navigate('/cart'),
        },
      });
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-2xl mb-4">Product not found</h2>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  const images = product.image_url ? [product.image_url] : [product.image || 'https://images.unsplash.com/photo-1596522016734-8e6136fe5cfa'];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
              </CardContent>
            </Card>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`border-2 rounded-lg overflow-hidden transition-all ${
                      selectedImage === idx ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.requires_prescription && (
                <Badge className="mb-3 bg-warning text-warning-foreground">
                  Prescription Required
                </Badge>
              )}
              {product.category && (
                <p className="text-sm text-muted-foreground mb-2 capitalize">{product.category}</p>
              )}
              <h1 className="text-3xl font-semibold mb-3">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating || 4.5)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating || 4.5} ({product.reviews || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-primary">
                  {formatCurrency(product.price || 0)}
                </span>
                {product.original_price && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatCurrency(product.original_price)}
                  </span>
                )}
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || 'High-quality healthcare product from trusted brands. Safe, effective, and recommended by healthcare professionals.'}
              </p>
            </div>

            <Separator />

            {/* Stock Status */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-primary" />
                <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="font-semibold">Quantity:</label>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-muted transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-6 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                  className="px-4 py-2 hover:bg-muted transition-colors"
                  disabled={quantity >= (product.stock || 99)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="flex-1 gap-2"
                onClick={handleAddToCart}
                disabled={!product.stock || product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="gap-2">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <Card className="bg-muted/30">
              <CardContent className="p-6">
                <div className="grid gap-4">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Free Delivery</h4>
                      <p className="text-sm text-muted-foreground">Free shipping on orders over {formatCurrency(FREE_SHIPPING_THRESHOLD)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Authentic Products</h4>
                      <p className="text-sm text-muted-foreground">100% genuine and certified</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Easy Returns</h4>
                      <p className="text-sm text-muted-foreground">30-day return policy</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information Tabs */}
        <div className="mt-12">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Product Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Specifications</h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Category:</dt>
                      <dd className="font-medium capitalize">{product.category || 'N/A'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Stock:</dt>
                      <dd className="font-medium">{product.stock || 0} units</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Prescription:</dt>
                      <dd className="font-medium">{product.requires_prescription ? 'Required' : 'Not Required'}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Usage Instructions</h4>
                  <p className="text-sm text-muted-foreground">
                    Follow the directions provided by your healthcare provider. 
                    Keep out of reach of children. Store in a cool, dry place.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}