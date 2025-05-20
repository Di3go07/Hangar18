import React, { useState, useEffect, useMemo} from 'react';
import { db } from '../firebaseConnection';
import { doc, getDocs, getDoc, collection} from 'firebase/firestore';
import '../style/main.css'
import '../style/News.css'

function NewsPag(){
  //STATES
  const [noticias, setNews] = useState([]);
  const [pagina, setPag] = useState((1));

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

  return(
    <div>
        <h1> ▪ NOTÍCIAS </h1>

        <div className='news-page'>
          {noticias.slice((paginaAtual - 1) * 3, paginaAtual * 3).map((news, index) => (
              <div key={`news-${index}`} className='news-card'>
                <div>  
                  <img src={news.thumb}/>
                </div>
                <div className='text-area'> 
                  <div className='title'> 
                    <h2> <a href= {news.type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') + '/' + news.slug}> {news.title} </a> </h2>
                    <h4 className='subtitle'> {news.subtitle} </h4>
                  </div>
                  <div className='infos'>
                    <p> <i class="bi bi-calendar-minus"></i> {news.date} </p>
                    <p><i class="bi bi-box-arrow-up-right"></i> Compartilhar </p>
                  </div>
                </div>
              </div>
          ))}
        </div>

        <p className='page-changer'>
          <button onClick={ultimaPag} style={{opacity: pagina == 1 ? 0.5 : 1, cursor:  pagina == 1 ? 'not-allowed' : 'pointer'}}> - </button>
          {paginaAtual}
          <button onClick={proximaPag} style={{opacity: pagina >= (noticias.length/3) ? 0.5 : 1, cursor: pagina >= (noticias.length/3) ? 'not-allowed' : 'pointer'}}> + </button>
        </p>

    </div>
  )

}

export default NewsPag