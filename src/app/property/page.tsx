import { Suspense } from 'react';
import PropertyClient from './PropertyClient';

export default function PropertyPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading property...</div>}>
      <PropertyClient />
    </Suspense>
  );
}