import './App.css'
import SitesGrid from './components/SitesGrid'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopifinder</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Discover Shopify-powered websites</p>
        </div>
      </header>
      <main>
        <SitesGrid />
      </main>
      <footer className="bg-white dark:bg-gray-800 shadow-inner mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-300">
          <p>© {new Date().getFullYear()} Shopifinder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
