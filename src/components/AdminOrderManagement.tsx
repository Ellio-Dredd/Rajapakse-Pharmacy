import { useState } from 'react';
import { Search, Eye, MoreHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { Separator } from './ui/separator';

export function AdminOrderManagement() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const orders = [
    {
      id: '#ORD-1234',
      customer: 'John Doe',
      email: 'john.doe@example.com',
      items: 3,
      total: 89.99,
      status: 'Completed',
      date: 'Feb 2, 2026',
      shippingAddress: '123 Main St, New York, NY 10001',
      products: [
        { name: 'Paracetamol 500mg', quantity: 2, price: 5.99 },
        { name: 'Digital Thermometer', quantity: 1, price: 34.99 },
      ],
    },
    {
      id: '#ORD-1235',
      customer: 'Jane Smith',
      email: 'jane.smith@example.com',
      items: 5,
      total: 156.50,
      status: 'Processing',
      date: 'Feb 2, 2026',
      shippingAddress: '456 Oak Ave, Boston, MA 02101',
      products: [
        { name: 'Multivitamins', quantity: 2, price: 24.99 },
        { name: 'Blood Pressure Monitor', quantity: 1, price: 49.99 },
      ],
    },
    {
      id: '#ORD-1236',
      customer: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      items: 2,
      total: 45.00,
      status: 'Shipped',
      date: 'Feb 1, 2026',
      shippingAddress: '789 Pine Rd, Chicago, IL 60601',
      products: [
        { name: 'Hand Sanitizer', quantity: 3, price: 8.99 },
      ],
    },
    {
      id: '#ORD-1237',
      customer: 'Alice Brown',
      email: 'alice.brown@example.com',
      items: 4,
      total: 210.75,
      status: 'Completed',
      date: 'Feb 1, 2026',
      shippingAddress: '321 Elm St, Los Angeles, CA 90001',
      products: [
        { name: 'Glucometer Kit', quantity: 1, price: 89.99 },
        { name: 'Test Strips', quantity: 2, price: 34.99 },
      ],
    },
    {
      id: '#ORD-1238',
      customer: 'Charlie Davis',
      email: 'charlie.davis@example.com',
      items: 1,
      total: 15.99,
      status: 'Pending',
      date: 'Feb 2, 2026',
      shippingAddress: '654 Maple Dr, Seattle, WA 98101',
      products: [
        { name: 'Face Masks (Box of 50)', quantity: 1, price: 15.99 },
      ],
    },
  ];

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
                    <td className="py-3 px-4">{order.items}</td>
                    <td className="py-3 px-4 font-medium">${order.total.toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
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
      <Sheet open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedOrder && (
            <>
              <SheetHeader>
                <SheetTitle>Order Details</SheetTitle>
                <SheetDescription>{selectedOrder.id}</SheetDescription>
              </SheetHeader>
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
                      <span className="font-medium">{selectedOrder.date}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3">Shipping Address</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress}</p>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3">Order Items</h4>
                  <div className="space-y-3">
                    {selectedOrder.products.map((product: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-muted-foreground">Qty: {product.quantity}</p>
                        </div>
                        <p className="font-medium">${(product.price * product.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">${selectedOrder.total.toFixed(2)}</span>
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
                      ${(selectedOrder.total + 5.99 + 7.99).toFixed(2)}
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
                  <Button className="w-full mt-3">Update Status</Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
