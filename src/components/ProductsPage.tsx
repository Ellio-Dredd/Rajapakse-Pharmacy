import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { ProductCard } from './ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { productsAPI, categoriesAPI } from '../utils/api';
import { toast } from 'sonner';

interface ProductsPageProps {
  onAddToCart?: (product: any) => void;
}

export function ProductsPage({ onAddToCart }: ProductsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 9; // 3x3 grid

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getAll();
        setProducts(response.data || []);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
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
        setTotalPages(Math.ceil(2 / itemsPerPage));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to extracting from products if API fails
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const brands = [
    'PharmaCare',
    'HealthPlus',
    'MediTech',
    'WellnessLab',
  ];

  // Dynamically extract unique brands from products
  const availableBrands = Array.from(
    new Set(products.map(p => p.brand).filter(Boolean))
  );

  // Calculate filtered products
  const filteredProducts = products
    .filter(product => {
      if (selectedCategories.length === 0) return true;
      // Handle category as object or string
      const categoryId = typeof product.category === 'object' && product.category !== null
        ? String(product.category.id)
        : String(product.category);
      return selectedCategories.includes(categoryId);
    })
    .filter(product =>
      searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(product => {
      if (selectedPriceRanges.length === 0) return true;
      if (selectedPriceRanges.includes('price-1') && product.price < 500) return true;
      if (selectedPriceRanges.includes('price-2') && product.price >= 500 && product.price < 2000) return true;
      if (selectedPriceRanges.includes('price-3') && product.price >= 2000 && product.price < 5000) return true;
      if (selectedPriceRanges.includes('price-4') && product.price >= 5000) return true;
      return false;
    })
    .filter(product => {
      if (selectedBrands.length === 0) return true;
      return product.brand && selectedBrands.includes(product.brand);
    });

  // Update total pages when filters change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredProducts.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [selectedCategories, searchQuery, products.length, selectedPriceRanges, selectedBrands]);

  // Get paginated products
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    Filters
                    {(selectedCategories.length + selectedPriceRanges.length + selectedBrands.length) > 0 && (
                      <span className="ml-1 px-2 py-0.5 text-xs bg-primary text-white rounded-full">
                        {selectedCategories.length + selectedPriceRanges.length + selectedBrands.length}
                      </span>
                    )}
                  </CardTitle>
                  {(selectedCategories.length + selectedPriceRanges.length + selectedBrands.length) > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCategories([]);
                        setSelectedPriceRanges([]);
                        setSelectedBrands([]);
                      }}
                      className="text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
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
                          {category.name}
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
                      <Checkbox
                        id="price-1"
                        checked={selectedPriceRanges.includes('price-1')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPriceRanges([...selectedPriceRanges, 'price-1']);
                          } else {
                            setSelectedPriceRanges(selectedPriceRanges.filter(c => c !== 'price-1'));
                          }
                        }}
                      />
                      <Label htmlFor="price-1" className="text-sm cursor-pointer">Under LKR 500</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="price-2"
                        checked={selectedPriceRanges.includes('price-2')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPriceRanges([...selectedPriceRanges, 'price-2']);
                          } else {
                            setSelectedPriceRanges(selectedPriceRanges.filter(c => c !== 'price-2'));
                          }
                        }}
                      />
                      <Label htmlFor="price-2" className="text-sm cursor-pointer">LKR 500 - 2,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="price-3"
                        checked={selectedPriceRanges.includes('price-3')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPriceRanges([...selectedPriceRanges, 'price-3']);
                          } else {
                            setSelectedPriceRanges(selectedPriceRanges.filter(c => c !== 'price-3'));
                          }
                        }}
                      />
                      <Label htmlFor="price-3" className="text-sm cursor-pointer">LKR 2,000 - 5,000</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="price-4"
                        checked={selectedPriceRanges.includes('price-4')}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPriceRanges([...selectedPriceRanges, 'price-4']);
                          } else {
                            setSelectedPriceRanges(selectedPriceRanges.filter(c => c !== 'price-4'));
                          }
                        }}
                      />
                      <Label htmlFor="price-4" className="text-sm cursor-pointer">LKR 5,000+</Label>
                    </div>
                  </div>
                </div>

                {/* Brand Filter */}
                <div>
                  <h4 className="mb-3">Brand</h4>
                  <div className="space-y-2">
                    {availableBrands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={brand}
                          checked={selectedBrands.includes(brand)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedBrands([...selectedBrands, brand]);
                            } else {
                              setSelectedBrands(selectedBrands.filter(c => c !== brand));
                            }
                          }}
                        />
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
              {loading ? (
                // Loading skeleton
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg border p-4 animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                  </div>
                ))
              ) : paginatedProducts.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground text-lg mb-2">No products found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
                </div>
              ) : (
                paginatedProducts.map((product) => (
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
            {!loading && filteredProducts.length > 0 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {/* Show first page */}
                {totalPages > 0 && (
                  <Button
                    size="sm"
                    variant={currentPage === 1 ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(1)}
                  >
                    1
                  </Button>
                )}
                
                {/* Show ellipsis if needed */}
                {currentPage > 3 && totalPages > 5 && (
                  <span className="px-2 text-muted-foreground">...</span>
                )}
                
                {/* Show middle pages */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    if (totalPages <= 5) return page > 1 && page < totalPages;
                    return page > 1 && page < totalPages && Math.abs(page - currentPage) <= 1;
                  })
                  .map(page => (
                    <Button
                      key={page}
                      size="sm"
                      variant={currentPage === page ? 'default' : 'outline'}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                
                {/* Show ellipsis if needed */}
                {currentPage < totalPages - 2 && totalPages > 5 && (
                  <span className="px-2 text-muted-foreground">...</span>
                )}
                
                {/* Show last page */}
                {totalPages > 1 && (
                  <Button
                    size="sm"
                    variant={currentPage === totalPages ? 'default' : 'outline'}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
                
                {/* Page info */}
                <span className="text-sm text-muted-foreground ml-2">
                  Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}