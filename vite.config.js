import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        businessFunding: resolve(__dirname, 'business-funding.html'),
        mcaLoans: resolve(__dirname, 'mca-loans.html'),
        fundingOptions: resolve(__dirname, 'funding-options.html'),
        howItWorks: resolve(__dirname, 'how-it-works.html'),
        faq: resolve(__dirname, 'faq.html'),
        contact: resolve(__dirname, 'contact.html'),
        privacyPolicy: resolve(__dirname, 'privacy-policy.html'),
        terms: resolve(__dirname, 'terms.html'),
      },
    },
    cssMinify: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 4173,
  },
});
