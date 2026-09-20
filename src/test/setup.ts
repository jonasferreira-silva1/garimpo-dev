import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Limpa o DOM simulado após cada teste
afterEach(() => {
  cleanup();
});
