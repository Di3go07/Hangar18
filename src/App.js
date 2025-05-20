import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NewsPag from './pages/News';
import FormsArticle from './pages/FormsArticle';
import ArticlePag from './pages/PagArticle';
import Header from './components/Header';
import EditArticle from './pages/EditArticle';

function App() {
  return (
    <div className="app">
      <Router>        
          <Header />

          <div className='main'>
            <Routes> 
              <Route path="/noticia" element={<NewsPag />} />
              <Route path="/noticia/:slug" element={<ArticlePag/>} />
              <Route path="/redacao" element={<FormsArticle />} />
              <Route path="/editar/:ID" element={<EditArticle/>} />
            </Routes>
          </div>
        </Router>
    </div>
  );
}

export default App;