import { useState, useEffect } from 'react';
import { Search, Eye, MoreHorizontal, Package, Truck, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { ordersAPI } from '../utils/api';
import { toast } from 'sonner';
import { formatCurrency } from '../utils/currency';
import { Separator } from './ui/separator';

export function AdminOrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
      // Fallback to demo data
      setOrders([
        {
          id: '#ORD-1234',
          customer: 'John Doe',
          email: 'john.doe@example.com',
          items: 3,
          total_amount: 89.99,
          status: 'Completed',
          created_at: 'Feb 2, 2026',
          shipping_address: '123 Main St, New York, NY 10001',
          products: [
            { name: 'Paracetamol 500mg', quantity: 2, price: 5.99 },
            { name: 'Vitamin C 1000mg', quantity: 1, price: 15.99 },
          ],
        },
        {
          id: '#ORD-1235',
          customer: 'Jane Smith',
          email: 'jane.smith@example.com',
          items: 5,
          total_amount: 156.50,
          status: 'Processing',
          created_at: 'Feb 2, 2026',
          shipping_address: '456 Oak Ave, Boston, MA 02101',
          products: [
            { name: 'Digital Thermometer', quantity: 1, price: 25.00 },
            { name: 'Face Masks (50pk)', quantity: 2, price: 12.99 },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await ordersAPI.updateStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchOrders(); // Refresh the list
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-success/10 text-success';
      case 'Processing':
        return 'bg-info/10 text-info';
      case 'Shipped':
        return 'bg-primary/10 text-primary';
      case 'Pending':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Order Management</h1>
        <p className="text-muted-foreground">View and manage customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>All Orders</CardTitle>
            <div className="flex gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="text" placeholder="Search orders..." className="pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Items</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{order.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{order.customer}</div>
                        <div className="text-sm text-muted-foreground">{order.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {Array.isArray(order.items) ? order.items.length : order.items}
                    </td>
                    <td className="py-3 px-4 font-medium">{formatCurrency(order.total_amount)}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{order.created_at}</td>
                    <td className="py-3 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Update Status</DropdownMenuItem>
                          <DropdownMenuItem>Download Invoice</DropdownMenuItem>
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

      {/* Order Details Sheet */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
                <DialogDescription>{selectedOrder.id}</DialogDescription>
              </DialogHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="mb-3">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{selectedOrder.customer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{selectedOrder.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Order Date:</span>
                      <span className="font-medium">{selectedOrder.created_at}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3">Shipping Address</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder.shipping_address}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {(selectedOrder.products || selectedOrder.items || []).map((product: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-muted-foreground">Qty: {product.quantity}</p>
                        </div>
                        <p className="font-medium">{formatCurrency(product.price * product.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">{formatCurrency(selectedOrder.total_amount)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium">$5.99</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">$7.99</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold text-lg text-primary">
                      {formatCurrency(selectedOrder.total_amount + 5.99 + 7.99)}
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3">Order Status</h4>
                  <Select defaultValue={selectedOrder.status.toLowerCase()}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="w-full mt-3" onClick={() => handleUpdateStatus(selectedOrder.id, selectedOrder.status.toLowerCase())}>Update Status</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}