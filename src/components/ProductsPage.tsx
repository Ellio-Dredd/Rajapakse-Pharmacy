import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { ProductCard } from './ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { productsAPI } from '../utils/api';
import { toast } from 'sonner';

interface ProductsPageProps {
  onAddToCart?: (product: any) => void;
}

export function ProductsPage({ onAddToCart }: ProductsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll();
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products. Please try again.');
        // Fallback to demo data if API fails
        setProducts([
          {
            id: 1,
            name: 'Paracetamol 500mg - 20 Tablets',
            price: 5.99,
            rating: 4.5,
            reviews: 234,
            image_url: 'https://images.unsplash.com/photo-1596522016734-8e6136fe5cfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwcGlsbHMlMjBtZWRpY2luZSUyMHBoYXJtYWN5fGVufDF8fHx8MTc3MDA1MjcyNnww&ixlib=rb-4.1.0&q=80&w=1080',
            requires_prescription: false,
            category: 'medicines',
          },
          {
            id: 2,
            name: 'Digital Blood Pressure Monitor',
            price: 49.99,
            rating: 4.8,
            reviews: 156,
            image_url: 'https://images.unsplash.com/photo-1763070282912-08b63e2eb427?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZGV2aWNlJTIwaGVhbHRoY2FyZSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzAwNTI3MjZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
            requires_prescription: false,
            category: 'devices',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = [
    { id: 'medicines', label: 'Medicines' },
    { id: 'devices', label: 'Medical Devices' },
    { id: 'wellness', label: 'Wellness' },
    { id: 'personal-care', label: 'Personal Care' },
  ];

  const brands = [
    'PharmaCare',
    'HealthPlus',
    'MediTech',
    'WellnessLab',
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl mb-2">Medical Products</h1>
          <p className="text-muted-foreground">Browse our extensive collection of healthcare products</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <h4 className="mb-3">Category</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, category.id]);
                            } else {
                              setSelectedCategories(selectedCategories.filter(c => c !== category.id));
                            }
                          }}
                        />
                        <Label htmlFor={category.id} className="text-sm cursor-pointer">
                          {category.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div>
                  <h4 className="mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-1" />
                      <Label htmlFor="price-1" className="text-sm cursor-pointer">Under $10</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-2" />
                      <Label htmlFor="price-2" className="text-sm cursor-pointer">$10 - $25</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-3" />
                      <Label htmlFor="price-3" className="text-sm cursor-pointer">$25 - $50</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="price-4" />
                      <Label htmlFor="price-4" className="text-sm cursor-pointer">$50+</Label>
                    </div>
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <h4 className="mb-3">Brand</h4>
                  <div className="space-y-2">
                    {brands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox id={brand} />
                        <Label htmlFor={brand} className="text-sm cursor-pointer">{brand}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border p-4 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                ))
              ) : (
                products
                  .filter(product => 
                    selectedCategories.length === 0 || selectedCategories.includes(product.category)
                  )
                  .filter(product =>
                    searchQuery === '' || 
                    product.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      image={product.image_url || product.image}
                      requiresPrescription={product.requires_prescription}
                      onAddToCart={() => onAddToCart?.(product)}
                    />
                  ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2 mt-8">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">1</Button>
              <Button size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}