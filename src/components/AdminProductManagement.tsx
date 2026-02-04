import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { productsAPI, categoriesAPI } from '../utils/api';
import { toast } from 'sonner';
import { formatCurrency } from '../utils/currency';

export function AdminProductManagement() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    stock: '',
    sku: '',
    description: '',
    image_url: '',
    requires_prescription: false,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category_id: '',
      price: '',
      stock: '',
      sku: '',
      description: '',
      image_url: '',
      requires_prescription: false,
    });
    setEditingProduct(null);
  };

  const handleAddProduct = async () => {
    try {
      if (!formData.name || !formData.price || !formData.stock) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Find the selected category to get its name
      const selectedCategory = categories.find(cat => cat.id === formData.category_id);

      const productData = {
        name: formData.name,
        category: selectedCategory?.name || 'Uncategorized',
        category_id: formData.category_id || null,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sku: formData.sku || null,
        description: formData.description || null,
        image_url: formData.image_url || null,
        requires_prescription: formData.requires_prescription,
      };

      await productsAPI.create(productData);
      toast.success('Product added successfully');
      setIsAddDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product');
    }
  };

  const handleEditProduct = async () => {
    try {
      if (!formData.name || !formData.price || !formData.stock) {
        toast.error('Please fill in all required fields');
        return;
      }

      // Find the selected category to get its name
      const selectedCategory = categories.find(cat => cat.id === formData.category_id);

      const productData = {
        name: formData.name,
        category: selectedCategory?.name || 'Uncategorized',
        category_id: formData.category_id || null,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        sku: formData.sku || null,
        description: formData.description || null,
        image_url: formData.image_url || null,
        requires_prescription: formData.requires_prescription,
      };

      await productsAPI.update(editingProduct.id, productData);
      toast.success('Product updated successfully');
      setIsEditDialogOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productsAPI.delete(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };

  const openEditDialog = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      category_id: product.category_id || (typeof product.category === 'object' ? product.category?.id : '') || '',
      price: product.price?.toString() || '',
      stock: product.stock?.toString() || '',
      sku: product.sku || '',
      description: product.description || '',
      image_url: product.image_url || '',
      requires_prescription: product.requires_prescription || false,
    });
    setIsEditDialogOpen(true);
  };

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Product Management</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Add a new product to your inventory</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-productName">Product Name *</Label>
                  <Input
                    id="add-productName"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-category">Category</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="add-price">Price (LKR) *</Label>
                  <Input
                    id="add-price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-stock">Stock *</Label>
                  <Input
                    id="add-stock"
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-sku">SKU</Label>
                  <Input
                    id="add-sku"
                    placeholder="PROD-001"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-description">Description</Label>
                <Textarea
                  id="add-description"
                  placeholder="Product description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="add-image">Product Image URL</Label>
                <Input
                  id="add-image"
                  placeholder="https://..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="add-prescription"
                  type="checkbox"
                  checked={formData.requires_prescription}
                  onChange={(e) => setFormData({ ...formData, requires_prescription: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="add-prescription" className="cursor-pointer">Requires Prescription</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setIsAddDialogOpen(false); resetForm(); }}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) resetForm(); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Edit the product details</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-productName">Product Name *</Label>
                <Input
                  id="edit-productName"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price (LKR) *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock *</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sku">SKU</Label>
                <Input
                  id="edit-sku"
                  placeholder="PROD-001"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Product description"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-image">Product Image URL</Label>
              <Input
                id="edit-image"
                placeholder="https://..."
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="edit-prescription"
                type="checkbox"
                checked={formData.requires_prescription}
                onChange={(e) => setFormData({ ...formData, requires_prescription: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="edit-prescription" className="cursor-pointer">Requires Prescription</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleEditProduct}>Update Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Products</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Prescription</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{product.name}</div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {typeof product.category === 'object' ? product.category?.name : product.category}
                    </td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(product.price)}</td>
                    <td className="py-3 px-4">{product.stock}</td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          product.status === 'In Stock'
                            ? 'bg-success/10 text-success'
                            : product.status === 'Low Stock'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-destructive/10 text-destructive'
                        }
                      >
                        {product.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {product.requires_prescription ? (
                        <Badge variant="outline">Required</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">No</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}