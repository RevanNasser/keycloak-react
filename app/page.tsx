'use client';

import { useState, useEffect } from 'react';
import LandingPage from '@/components/LandingPage';
import DocumentationPage from '@/components/DocumentationPage';

export default function Home() {
  const [showDocs, setShowDocs] = useState(false);

  const handleLoginSuccess = () => {
    setShowDocs(true);
  };

  const handleLogout = () => {
    setShowDocs(false);
  };

  // Check initial auth state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const { getKeycloak } = require('@/lib/keycloak');
      const kc = getKeycloak();
      if (kc?.authenticated) {
        setShowDocs(true);
      }
    }
  }, []);

  if (showDocs) {
    return <DocumentationPage onLogout={handleLogout} />;
  }

  return <LandingPage onLoginSuccess={handleLoginSuccess} />;
}
