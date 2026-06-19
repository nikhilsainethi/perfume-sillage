// ============================================================
// SILLAGE — App root
// ============================================================

import { Providers } from './providers';
import { PerfumeDiscoveryPage } from '@/pages/PerfumeDiscoveryPage';

export default function App() {
  return (
    <Providers>
      <PerfumeDiscoveryPage />
    </Providers>
  );
}
