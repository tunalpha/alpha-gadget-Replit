import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useListProducts, useListCategories } from '@workspace/api-client-react';
import { ProductCard } from '@/components/shared/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Catalog() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get('category') || '';
  const initialSearch = searchParams.get('search') || '';

  const [category, setCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [sort, setSort] = useState('newest');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Sync state with URL changes (back/forward)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCategory(params.get('category') || '');
    const q = params.get('search') || '';
    setSearchQuery(q);
    setSearchInput(q);
  }, [location]);

  const { data: categoriesData } = useListCategories();
  const { data: productsData, isLoading } = useListProducts({
    category: category || undefined,
    search: searchQuery || undefined,
    limit: 50,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    updateUrl(category, searchInput);
  };

  const handleCategorySelect = (c: string) => {
    const newCategory = category === c ? '' : c;
    setCategory(newCategory);
    updateUrl(newCategory, searchQuery);
    setIsMobileFiltersOpen(false);
  };

  const updateUrl = (c: string, s: string) => {
    const params = new URLSearchParams();
    if (c) params.set('category', c);
    if (s) params.set('search', s);
    const newUrl = `/prodotti${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.pushState({}, '', newUrl); // Don't trigger full reload
  };

  // Sorting logic on the client side since API doesn't seem to support sort param directly
  const products = productsData?.products ? [...productsData.products] : [];
  if (sort === 'price-asc') {
    products.sort((a, b) => {
      const priceA = a.on_sale && a.sale_price ? a.sale_price : a.price;
      const priceB = b.on_sale && b.sale_price ? b.sale_price : b.price;
      return priceA - priceB;
    });
  } else if (sort === 'price-desc') {
    products.sort((a, b) => {
      const priceA = a.on_sale && a.sale_price ? a.sale_price : a.price;
      const priceB = b.on_sale && b.sale_price ? b.sale_price : b.price;
      return priceB - priceA;
    });
  } else if (sort === 'name-asc') {
    products.sort((a, b) => a.name.localeCompare(b.name));
  }

  const clearFilters = () => {
    setCategory('');
    setSearchQuery('');
    setSearchInput('');
    updateUrl('', '');
  };

  const hasActiveFilters = category || searchQuery;

  const FiltersContent = () => (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-display font-semibold mb-3">Categorie</h3>
        <div className="flex flex-col gap-1">
          <button 
            className={`text-left px-3 py-2 text-sm rounded-md transition-colors ${!category ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-muted-foreground'}`}
            onClick={() => handleCategorySelect('')}
          >
            Tutti i prodotti
          </button>
          {categoriesData?.map(c => (
            <button 
              key={c.name}
              className={`text-left px-3 py-2 text-sm rounded-md transition-colors flex justify-between items-center ${category === c.name ? 'bg-primary text-primary-foreground font-medium' : 'hover:bg-muted text-muted-foreground'}`}
              onClick={() => handleCategorySelect(c.name)}
            >
              <span>{c.name}</span>
              <span className={`text-xs ${category === c.name ? 'text-primary-foreground/80' : 'text-muted-foreground/50'}`}>
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <a href="/" className="text-sm font-semibold flex items-center gap-1" style={{ color: '#7c3aed' }}>
          ← Torna alla Home
        </a>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Tutti i Prodotti</h1>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {category && <span className="inline-flex items-center text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">{category}</span>}
              {searchQuery && <span className="inline-flex items-center text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">"{searchQuery}"</span>}
              <button onClick={clearFilters} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                <X className="w-3 h-3" /> Rimuovi filtri
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden flex-1">
                <Filter className="w-4 h-4 mr-2" /> Filtri
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader className="mb-6">
                <SheetTitle>Filtra Prodotti</SheetTitle>
              </SheetHeader>
              <FiltersContent />
            </SheetContent>
          </Sheet>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full md:w-[200px] rounded-full border-gray-200">
              <SelectValue placeholder="Ordina per" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Più recenti</SelectItem>
              <SelectItem value="price-asc">Prezzo: crescente</SelectItem>
              <SelectItem value="price-desc">Prezzo: decrescente</SelectItem>
              <SelectItem value="name-asc">Nome: A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sticky top-32">
            <form onSubmit={handleSearch} className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cerca..."
                className="pl-9 rounded-full border-gray-200"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>
            <FiltersContent />
          </div>
        </aside>

        {/* Product Grid */}
        <main className="md:col-span-3 lg:col-span-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-4">
                <span className="font-bold text-gray-900">{products.length}</span> prodotti trovati
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">Nessun prodotto trovato</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6 text-sm">
                Prova a rimuovere qualche filtro.
              </p>
              <button onClick={clearFilters} className="btn-gradient px-6 py-2.5 rounded-full text-sm font-bold">
                Pulisci filtri
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
