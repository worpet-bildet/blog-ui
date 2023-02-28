import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from './pages/index'

function App() {
  return (
    <BrowserRouter basename="/apps/blog">
    <Routes>
      {/* <Route path="/" element={<Layout />}> */}
        <Route index element={<Index />} />
      {/* </Route> */}
    </Routes>
  </BrowserRouter>
  );
}

export default App
