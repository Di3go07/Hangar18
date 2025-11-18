import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/custom.css'

export default function Header() {
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
      const data = localStorage.getItem("user");

      if (data){
        setUser(JSON.parse(data))
      }
    }, 
  [navigate]);

  return (
    <header className="header">

      <div className='banner pt-4 pb-4'>
        <h1 className='text-center'> HANGAR 18</h1>
      </div>

      <nav className="navbar navbar-expand">
        <div className="navbar-collapse p-2" id="navbarNavAltMarkup">
          <div className="navbar-nav w-100 justify-content-around align-items-center"> 
            
            {/* Home */}
            <h4 className="m-0">
              <a className="nav-link" href="/home">
                <i className="bi bi-house-door pe-1"></i> {/* Adicione fs-3 */}
                <span className="d-none d-lg-inline">HOME</span>
              </a>
            </h4>

            {/* Notícias */}
            <h4 className="m-0">
              <a className="nav-link" href="/noticia">
                <i className="bi bi-newspaper pe-1"></i>
                <span className="d-none d-lg-inline">NOTÍCIAS</span>
              </a>
            </h4>

            {/* Matérias */}
            <h4 className="m-0">
              <a className="nav-link" href="/">
                <i className="bi bi-journal-text pe-1"></i>
                <span className="d-none d-lg-inline">MATÉRIAS</span>
              </a>
            </h4>

            {/* Resenhas */}
            <h4 className="m-0">
              <a className="nav-link" href="/">
                <i className="bi bi-justify-left pe-1"></i>
                <span className="d-none d-lg-inline">RESENHAS</span>
              </a>
            </h4>

            {/* Lançamentos */}
            <h4 className="m-0">
              <a className="nav-link" href="/">
                <i className="bi bi-disc pe-1"></i>
                <span className="d-none d-lg-inline">LANÇAMENTOS</span>
              </a>
            </h4>

            {user.role === 'Administrador' && (
              <h4 className="m-0">
                <a className="nav-link" href="/register" style={{ color: '#ff5722' }}>
                  <i className="bi bi-person-plus fs-3 pe-1"></i>
                  <span className="d-none d-lg-inline">REGISTRAR</span>
                </a>
              </h4>
            )}
            {user.role === 'Autor' && (
              <h4 className="m-0">
                <a className="nav-link" href="/redacao" style={{ color: '#ff5722' }}>
                  <i className="bi bi-pencil-square fs-3 pe-1"></i>
                  <span className="d-none d-lg-inline">REDAÇÃO</span>
                </a>
              </h4>
            )}

            {user && (
              <h4 className="m-0">
                <a className="nav-link" href={"/perfil/" + user.name} style={{ color: '#ff5722' }}>
                  <i className="bi bi-person fs-3 pe-1"> </i> {/* Ícone maior */}
                </a>
              </h4>
            )}
          </div>
        </div>
      </nav>

    </header>
  );
}