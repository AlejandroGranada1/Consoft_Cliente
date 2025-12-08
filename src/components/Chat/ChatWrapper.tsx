'use client';

import { useUser } from '@/providers/userContext';
import { useMyCart } from '@/hooks/apiHooks';
import FloatingChat from './FloatingChat';

export default function ChatWrapper() {
  const { user, loading } = useUser();

  // 👇 Hook SIEMPRE debe ejecutarse
  const { data, isLoading } = useMyCart();

  // 👇 Después sí puedes retornar basándote en estados
  if (loading || !user || isLoading) return null;

  const quotationId = data?.quotations?.[0]?._id;

  return quotationId ? <FloatingChat quotationId={quotationId} /> : null;
}
