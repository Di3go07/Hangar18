import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import NewsPag from './pages/News';
import FormsArticle from './pages/FormsArticle';
import ArticlePag from './pages/PagArticle';
import Header from './components/Header';
import EditArticle from './pages/EditArticle';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import UserPage from './pages/UserPage';
import Editor from './protected/Editor';
import Autor from './protected/Autor';
import Admin from './protected/Admin';

function App() {

  const location = useLocation();
  const hideHeaderPaths = ['/register', '/login'];

  return (
    <div className="app">
          {!hideHeaderPaths.includes(location.pathname) && <Header />}

          <div className='main'>
            <Routes> 
              <Route path="/noticia" element={<NewsPag />} />
              <Route path="/noticia/:slug" element={<ArticlePag/>} />
              <Route path="/redacao" element={<Autor> <FormsArticle /> </Autor>} />
              <Route path="/editar/:ID" element={<Editor> <EditArticle/> </Editor>} />
              <Route path="/register" element={<Admin> <RegisterPage/> </Admin>} />
              <Route path="/login" element={ <LoginPage/>} /> 
              <Route path="/perfil/:nome" element={<UserPage />} />
            </Routes>
          </div>
    </div>
  );
}

export default App;

