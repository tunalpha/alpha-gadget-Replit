import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { AuthProvider } from '@/hooks/use-auth';
import { CartProvider } from '@/hooks/use-cart';
import { useEffect } from 'react';

// Layouts
import { AppLayout } from '@/components/layout/AppLayout';
import { AdminLayout } from '@/components/admin/AdminLayout';

// Pages
import Home from '@/pages/Home';
import Catalog from '@/pages/Catalog';
import ProductDetail from '@/pages/ProductDetail';
import Offers from '@/pages/Offers';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderSuccess from '@/pages/OrderSuccess';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Shipping from '@/pages/Shipping';
import Returns from '@/pages/Returns';
import Privacy from '@/pages/Privacy';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Account from '@/pages/Account';
import NotFound from '@/pages/not-found';

// Admin Pages
import AdminDashboard from '@/pages/admin/Dashboard';
import AdminOrders from '@/pages/admin/Orders';
import AdminProducts from '@/pages/admin/Products';
import AdminCustomers from '@/pages/admin/Customers';
import AdminOffers from '@/pages/admin/Offers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function ScrollToTop() {
  const [pathname] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AdminRouter() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin/ordini" component={AdminOrders} />
        <Route path="/admin/prodotti" component={AdminProducts} />
        <Route path="/admin/clienti" component={AdminCustomers} />
        <Route path="/admin/offerte" component={AdminOffers} />
        <Route component={AdminDashboard} />
      </Switch>
    </AdminLayout>
  );
}

function StoreRouter() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/prodotti" component={Catalog} />
        <Route path="/prodotto/:id" component={ProductDetail} />
        <Route path="/offerte" component={Offers} />
        <Route path="/carrello" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order-success/:id" component={OrderSuccess} />
        <Route path="/chi-siamo" component={About} />
        <Route path="/contatti" component={Contact} />
        <Route path="/spedizioni" component={Shipping} />
        <Route path="/resi-rimborsi" component={Returns} />
        <Route path="/privacy-policy" component={Privacy} />
        <Route path="/login" component={Login} />
        <Route path="/registrati" component={Register} />
        <Route path="/password-dimenticata" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />
        <Route path="/account" component={Account} />
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith('/admin');
  return isAdmin ? <AdminRouter /> : <StoreRouter />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <WouterRouter base="">
              <ScrollToTop />
              <Router />
            </WouterRouter>
            <Toaster position="bottom-right" richColors />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
