import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Index from './pages/index'
import Layout from './components/Layout'
import Draft from './pages/Draft'
import Theme from './pages/Theme'
import Published from './pages/Published'

function App() {
  return (
    <BrowserRouter basename="/apps/blog">
      <Layout>
        <Routes>
          <Route path="/" index element={<Index />} />
          <Route path="/published/*" element={<Published/>} />
          <Route path="/draft/*" element={<Draft />  } />
          <Route path="/theme/:theme" element={<Theme />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App
