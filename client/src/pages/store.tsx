import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppLayout } from "@/components/layout/app-layout";
import { productsService } from "@/lib/mockServices";
import type { BricksProduct } from "@shared/schema";
import {
  ShoppingCart,
  Tag,
  Package,
  ChevronRight,
  Star,
  Check,
} from "lucide-react";

export default function StorePage() {
  const [selectedProduct, setSelectedProduct] = useState<BricksProduct | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedSize, setSelectedSize] = useState<string>("");

  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products", categoryFilter],
    queryFn: () => productsService.getAll({
      category: categoryFilter !== "all" ? categoryFilter : undefined,
    }),
  });

  const categories = ["Suplementos", "Moda Fitness", "Acessorios", "Equipamentos"];

  return (
    <AppLayout>
      <div className="p-4 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8 fade-in">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Loja Bricks</h1>
          <p className="text-muted-foreground">
            Produtos selecionados com descontos exclusivos para a comunidade.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]" data-testid="select-product-category">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="bg-card border-border/50 overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <Card
                key={product.id}
                className="bg-card border-border/50 hover-elevate cursor-pointer slide-up overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                  setSelectedProduct(product);
                  setSelectedSize("");
                }}
                data-testid={`card-product-${product.id}`}
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  {product.tags && product.tags.length > 0 && (
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                      {product.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} className="text-xs bg-primary text-primary-foreground">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                  <h3 className="font-semibold text-sm line-clamp-2 mb-2">{product.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between gap-4">
                  <div>
                    {product.hasBricksDiscount && product.bricksPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary">
                          R$ {product.bricksPrice}
                        </span>
                        <span className="text-xs text-muted-foreground line-through">
                          R$ {product.normalPrice}
                        </span>
                      </div>
                    ) : (
                      <span className="text-lg font-bold">R$ {product.normalPrice}</span>
                    )}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros para ver mais produtos.
            </p>
          </div>
        )}

        <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedProduct && (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                    <img
                      src={selectedProduct.imageUrl}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                    {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {selectedProduct.tags.map((tag) => (
                          <Badge key={tag} className="text-xs bg-primary text-primary-foreground">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{selectedProduct.brand}</p>
                      <h2 className="text-xl font-bold">{selectedProduct.name}</h2>
                    </div>

                    <Badge variant="outline">{selectedProduct.category}</Badge>

                    <p className="text-sm text-muted-foreground">{selectedProduct.description}</p>

                    {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Tamanho</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedProduct.sizes.map((size) => (
                            <Button
                              key={size}
                              variant={selectedSize === size ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedSize(size)}
                              data-testid={`button-size-${size}`}
                            >
                              {size}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-4 border-t border-border">
                      {selectedProduct.hasBricksDiscount && selectedProduct.bricksPrice ? (
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl font-bold text-primary">
                            R$ {selectedProduct.bricksPrice}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            R$ {selectedProduct.normalPrice}
                          </span>
                          <Badge className="bg-primary text-primary-foreground">
                            Desconto Bricks
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold block mb-4">
                          R$ {selectedProduct.normalPrice}
                        </span>
                      )}

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        {selectedProduct.inStock ? (
                          <>
                            <Check className="w-4 h-4 text-green-500" />
                            <span>Em estoque</span>
                          </>
                        ) : (
                          <span className="text-destructive">Fora de estoque</span>
                        )}
                      </div>

                      <Button 
                        className="w-full" 
                        disabled={!selectedProduct.inStock || (selectedProduct.sizes && !selectedSize)}
                        data-testid="button-add-cart"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Adicionar ao Carrinho
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
