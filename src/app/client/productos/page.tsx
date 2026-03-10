import { Suspense } from 'react';
import ProductsPageClient from './productsClientPage';

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: 'linear-gradient(160deg, #1e1e1c 0%, #252320 30%, #2a2724 60%, #1e1c1a 100%)',
        }}
      >
        <p className="text-white/50 text-sm tracking-widest uppercase">Cargando...</p>
      </div>
    }>
      <ProductsPageClient />
    </Suspense>
  );
}