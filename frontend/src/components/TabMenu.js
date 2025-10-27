import { Link, useLocation } from 'react-router-dom';

const tabs = [
  { label: 'Dashboard', to: '/dashboard', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3 10a7 7 0 1114 0A7 7 0 013 10zm7-3a3 3 0 100 6 3 3 0 000-6z" /></svg>
  ) },
  { label: 'Clientes', to: '/clients', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13 7a3 3 0 11-6 0 3 3 0 016 0z" /><path fillRule="evenodd" d="M5.5 9a4.5 4.5 0 019 0v.25a5.5 5.5 0 013.5 5.157V15a2 2 0 01-2 2h-12a2 2 0 01-2-2v-.593A5.5 5.5 0 015.5 9.25V9z" clipRule="evenodd" /></svg>
  ) },
  { label: 'Facturas', to: '/invoices', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 012-2h6l4 4v10a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /><path d="M8 10h4M8 13h4M8 7h2" /></svg>
  ) },
  { label: 'Perfil', to: '/profile', icon: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1a4 4 0 108 0V6a4 4 0 00-4-4zm-7 14a7 7 0 0114 0v1H3v-1z" clipRule="evenodd" /></svg>
  ) },
];

export default function TabMenu() {
  const location = useLocation();
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-pink-200 flex justify-around z-50 shadow-lg">
      {tabs.map(tab => (
        <Link
          key={tab.to}
          to={tab.to}
          className={`flex flex-col items-center py-2 px-3 text-xs font-bold transition-all duration-150 ${location.pathname === tab.to ? 'text-pink-600 border-t-2 border-pink-400 bg-pink-50' : 'text-gray-500'}`}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </Link>
      ))}
    </nav>
  );
}
