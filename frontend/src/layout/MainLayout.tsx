import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar';
import { Outlet } from 'react-router';

interface MainLayoutProps {
  showSidebar: boolean;
}
const MainLayout = ({ showSidebar=false }: MainLayoutProps) => {
  return (
    <div className='min-h-screen'>
      <div className='flex'>
        {showSidebar && <Sidebar />}
        <div className='flex-1 flex flex-col'>
          <Navbar />

          {/* Content */}
          <main className='flex-1 overflow-y-auto'>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default MainLayout