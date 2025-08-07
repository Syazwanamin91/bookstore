import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import AddBook from './pages/AddBook';
import EditBook from './pages/EditBook';

function App() {
  return (<div className="min-h-screen w-screen">
    <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/edit-book/:id" element={<EditBook />} />
        </Routes>
    </Router>
  </div>);
}

export default App;