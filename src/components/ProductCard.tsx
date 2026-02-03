import { Star, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  requiresPrescription?: boolean;
  onAddToCart?: () => void;
}

export function ProductCard({
  image,
  name,
  price,
  rating,
  reviews,
  requiresPrescription = false,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardContent className="p-0">
        <div className="relative overflow-hidden bg-muted/30">
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {requiresPrescription && (
            <Badge className="absolute top-2 right-2 bg-warning text-warning-foreground">
              Rx Required
            </Badge>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-sm mb-2 line-clamp-2 min-h-[2.5rem]">{name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-primary">${price.toFixed(2)}</span>
            <Button
              size="sm"
              onClick={onAddToCart}
              className="gap-1.5"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
