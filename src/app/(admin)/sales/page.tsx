'use client';

import { useEffect, useState, useMemo } from 'react';
import { useStore, useSales } from '@/presentation/hooks/useStore';
import { ProductCatalog } from '@/presentation/components/features/sales/ProductCatalog';
import { CartSidebar } from '@/presentation/components/features/sales/CartSidebar';
import { CheckoutModal } from '@/presentation/components/features/sales/CheckoutModal';
import { toast } from 'sonner';

import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';

import { Product } from '@/domain/entities/Store';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  maxStock: number;
}

export default function SalesPage() {
  const { products, fetchProducts } = useStore();
  const { createSale, isLoading } = useSales();

  // Estado del POS
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false); // Estado para móvil

  // Lógica del Carrito
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.currentStock) {
          toast.warning(`No hay más stock de ${product.name}`);
          return prev;
        }
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: product.salePrice,
        quantity: 1,
        maxStock: product.currentStock
      }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        if (newQty > item.maxStock) {
          toast.warning('Stock máximo alcanzado');
          return item;
        }
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleBarcodeScan = (code: string) => {
    const product = products.find(p => p.barcode === code);
    if (product) {
      if (!product.isActive) {
        toast.error('Este producto está desactivado');
        return;
      }
      if (product.currentStock <= 0) {
        toast.error('Producto sin stock');
        return;
      }
      addToCart(product);
      toast.success(`${product.name} añadido`);
    } else {
      toast.error('Producto no encontrado');
    }
  };

  const handleConfirmSale = async (paymentMethod: 'CASH' | 'TRANSFER' | 'CARD', receivedAmount: number) => {
    const saleData = {
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity
      })),
      totalAmount: cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0),
      paymentMethod,
      receivedAmount // Guardamos esto para el reporte futuro
    };

    const success = await createSale(saleData);
    if (success) {
      setCartItems([]);
      setIsCheckoutOpen(false);
      fetchProducts(); // Recargar stock
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Lógica de Escaneo Global (Mejora UX)
  useEffect(() => {
    let buffer = '';
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();

      // Los scanners son muy rápidos, si el tiempo entre teclas es > 50ms, es un humano escribiendo
      if (currentTime - lastKeyTime > 50) {
        buffer = '';
      }

      if (e.key === 'Enter') {
        if (buffer.length > 3) { // Código de barras mínimo
          handleBarcodeScan(buffer);
          buffer = '';
        }
      } else if (e.key !== 'Shift') {
        buffer += e.key;
      }

      lastKeyTime = currentTime;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products]); // Re-suscribir cuando los productos carguen

  // Filtrado de productos para el catálogo
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    const s = search.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(s) ||
      (p.barcode && p.barcode.includes(s))
    );
  }, [products, search]);

  const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="relative h-[calc(100vh-140px)] lg:h-[calc(100vh-180px)] overflow-hidden animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row gap-8 h-full">
        {/* Columna Principal: Catálogo */}
        <div className={`flex-1 min-w-0 h-full flex flex-col transition-all duration-300 ${showMobileCart ? 'hidden lg:flex' : 'flex'}`}>
          <ProductCatalog
            products={filteredProducts}
            onAddToCart={addToCart}
            search={search}
            onSearchChange={setSearch}
          />
        </div>

        {/* Columna Lateral: Carrito */}
        <div className={`
          fixed inset-0 z-40 lg:relative lg:inset-auto lg:z-0
          w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 h-full
          transition-transform duration-300 ease-in-out
          ${showMobileCart ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
          bg-slate-50 lg:bg-transparent
        `}>
          {/* Header móvil para cerrar carrito */}
          <div className="lg:hidden p-6 bg-white border-b border-slate-100 flex items-center gap-4">
            <button
              onClick={() => setShowMobileCart(false)}
              className="p-2 rounded-xl bg-slate-100 text-slate-600"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="font-black text-slate-900 uppercase tracking-widest text-sm">Revisar Pedido</h2>
          </div>

          <div className="h-[calc(100%-76px)] lg:h-full p-4 lg:p-0">
            <CartSidebar
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onClearCart={() => setCartItems([])}
              onCheckout={() => setIsCheckoutOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button (Móvil) */}
      {!showMobileCart && cartItems.length > 0 && (
        <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] z-30">
          <Button
            onClick={() => setShowMobileCart(true)}
            className="w-full h-16 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center justify-between px-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center relative">
                <ShoppingCart size={18} />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900">
                  {cartItems.length}
                </span>
              </div>
              <span className="font-bold">Ver Carrito</span>
            </div>
            <span className="text-xl font-black">${total.toFixed(2)}</span>
          </Button>
        </div>
      )}

      {/* Modal de Finalización */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)}
        onConfirm={handleConfirmSale}
        isLoading={isLoading}
      />
    </div>
  );
}
