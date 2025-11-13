import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { FilterProvider } from '@/contexts/FilterContext';
import { Header } from '@/components/Header';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { APIDirectoryPage } from '@/pages/APIDirectoryPage';
import { TodayToolsPage } from '@/pages/TodayToolsPage';
import { MostUsedPage } from '@/pages/MostUsedPage';
import { SavedToolsPage } from '@/pages/SavedToolsPage';
import { GPTsPage } from '@/pages/GPTsPage';
import { MonitorPage } from '@/pages/MonitorPage';
import { ToolDetailPage } from '@/pages/ToolDetailPage';

function App() {
  return (
    <ThemeProvider>
      <FilterProvider>
        <Router>
          <div className="min-h-screen bg-primary flex flex-col">
            <Header />
            <Navigation />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/apis" element={<APIDirectoryPage />} />
                <Route path="/today" element={<TodayToolsPage />} />
                <Route path="/most-used" element={<MostUsedPage />} />
                <Route path="/saved" element={<SavedToolsPage />} />
                <Route path="/gpts" element={<GPTsPage />} />
                <Route path="/monitor" element={<MonitorPage />} />
                <Route path="/tool/:id" element={<ToolDetailPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </FilterProvider>
    </ThemeProvider>
  );
}

export default App;
