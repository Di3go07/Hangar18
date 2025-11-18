import React, { useState, useEffect, useMemo} from 'react';
import { db } from '../firebaseConnection';
import { doc, getDocs, getDoc, collection} from 'firebase/firestore';

function NewsPag(){
  //STATES
  const [noticias, setNews] = useState([]);
  const [pagina, setPag] = useState((1));
  const [loading, setLoading] = useState(true);

  const paginaAtual = useMemo(()=> pagina)

  //RESGATAR NOTÍCIAS DO BANCO
  async function getNews(Ref) {
      const snapshot = await getDocs(Ref);

      const lista = snapshot.docs.map(doc => {

        //Formatar data para comparação
        const data = doc.data().date;
        const [dia, , mes, , ano] = data.split(' ');
        const meses = {
          'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
          'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
          'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
        };
        const dateObj = new Date(ano, meses[mes.toLowerCase()], dia);
        
        return {
          id: doc.data().id,
          title: doc.data().title,
          subtitle: doc.data().subtitle,
          slug: doc.data().slug,
          type: doc.data().type,
          thumb: doc.data().thumb,
          date: doc.data().date, 
          dateObj: dateObj 
        };
      });
      
      const listaOrdenada = lista.sort((a, b) => b.dateObj - a.dateObj); //order by the realease date
      const listaFiltrada = listaOrdenada.filter(article => article.type == 'Notícia'); //search only for articles that are news
      const listaFinal = listaFiltrada.map(({ dateObj, ...rest }) => rest); 
      setNews(listaFinal);
      setLoading(false)
      console.log("Notícias carregadas com sucesso!");
  }

  //CARREGAR NOTÍCIAS NA PÁGINA
  useEffect(() => {
    const newsRef = collection(db, "publications");
      
    getNews(newsRef)
  }, []);

  const proximaPag = () => {
    if (pagina >= (noticias.length/3)){
      return
    }else{
      setPag(prevPag => prevPag + 1)
    }
  }

  const ultimaPag = () => {
    if (pagina == 1){
      return
    }else{
      setPag(prevPag => prevPag - 1)
    }
  }

  //WEB
  if (loading) return <div className="loading"> <p> Carregando... </p></div>;


  return(
    <div className='bg-Body ms-lg-5 me-lg-5 p-4'> 
        <h2> NOTÍCIAS </h2>

        <div className='pt-4'>
          {noticias.slice((paginaAtual - 1) * 3, paginaAtual * 3).map((news, index) => (
            <div key={`news-${index}`} className="container p-0 m-0 mb-2"> 
              <div className='row g-3'>
                <div className='col-md-4'> 
                  <img className="img-news" src={news.thumb}/>
                </div>
                <div className='col-md-7 d-flex flex-column justify-content-around'> 
                  <div className='block'>
                    <h3 className="title mb-1 position-relative d-inline-block">
                      <a 
                        href={news.type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '/' + news.slug}
                        className="text-decoration-none position-relative hover-effect"
                      >
                        <span className="position-relative z-index-2">{news.title}</span>
                      </a>
                    </h3>
                    <h4 className='subtitle'> {news.subtitle} </h4>
                  </div>
                  <div className='block mt-1'>
                    <p className='infos'> <i className="bi bi-calendar-minus"></i> {news.date} </p>
                    <p className='infos'><i className="bi bi-box-arrow-up-right"></i> Compartilhar </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='page-changer d-flex flex-row align-items-center mt-2'>
          <button 
            onClick={ultimaPag} 
            style={{
              opacity: pagina === 1 ? 0.5 : 1, 
              cursor: pagina === 1 ? 'not-allowed' : 'pointer'
            }}
            className="btn btn-outline-secondary me-1"
          > 
            - 
          </button>
            <p className='page-number'>{paginaAtual}</p>
          <button 
            onClick={proximaPag} 
            style={{
              opacity: pagina >= (noticias.length/3) ? 0.5 : 1, 
              cursor: pagina >= (noticias.length/3) ? 'not-allowed' : 'pointer'
            }}
            className="btn btn-outline-secondary ms-1"
          > 
            + 
          </button>
        </div>
    </div>
  )

}

export default NewsPag