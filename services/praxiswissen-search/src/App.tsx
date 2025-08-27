import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatInterface } from './components/ChatInterface';
import { AdminDashboard } from './components/AdminDashboard';
import { Layout } from './components/Layout';
import { useAuthStore } from './stores/authStore';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<ChatInterface />} />
            {isAuthenticated && (
              <Route path="/admin/*" element={<AdminDashboard />} />
            )}
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}