import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from '@/components/Sidebar/index.js';
import Header from '@/components/Header/index.js';

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-dark-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-auto p-6 relative">
          <div className="absolute inset-0 bg-magic-grid opacity-10 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-magic-900/20 to-transparent pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-magic-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </div>
  );
}
