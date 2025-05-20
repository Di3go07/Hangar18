import { BrowserRouter as Router, Link, Route, Routes, useParams,} from "react-router-dom";
import React, { useState, useEffect, useMemo} from 'react';
import { db } from '../firebaseConnection';
import { doc, getDocs, getDoc, collection} from 'firebase/firestore';
import '../style/PagArticle.css'

function ArticlePag(){
    const {slug} = useParams();
    const [article, setArticle] = useState(null);
    const [nods, setNods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function getArticle(Ref, slug){
        //capture all the instances in the db
        const snapshot = await getDocs(Ref);
        const lista = snapshot.docs.map(doc => ({
            id: doc.data().id,
            title: doc.data().title,
            subtitle: doc.data().subtitle,
            slug: doc.data().slug,
            type: doc.data().type,
            thumb: doc.data().thumb,
            date: doc.data().date
        }));

        //filter only the article with the respective slug
        const  filteredList =  lista.filter(article => article.slug === slug);
        
        //set the article 
        if (filteredList.length > 0) {
            setArticle(filteredList[0]);
            setLoading(false);
        } else {
            console.log('Any article found for this slug')
        }
    }

    async function getNods(Ref, id) {
        //recive the ID of the article and return its respective nods
        //capture all the instances of nods in the db
        const snapshot = await getDocs(Ref);
        const lista = snapshot.docs.map(doc => ({
            id: doc.data().id,
            ALT: doc.data().ALT,
            tag: doc.data().tag,
            position: doc.data().position,
            publicacaoID: doc.data().publicacaoID,
            caption: doc.data().caption,
            value: doc.data().value
        }));

        console.log(id)
        console.log(lista)
        //filter only the nods of the news
        const  filteredList = lista.filter(nod => nod.publicacaoID == id);
        const listaOrdenada = filteredList.sort((a, b) => a.position - b.position);

        setNods(listaOrdenada);
    }

    function renderNods(nod){
        //function that render a template for each tag saved on the nods
        const tag = nod.tag;
        switch (tag) {
            case 'p':
                return (
                    <p> {nod.value} </p>
                )
            case 'h3':
                return(
                    <h3> {nod.value} </h3>
                )
            case 'img':
                return(
                    <div>
                        <img src={nod.value} alt={nod.ALT} width='400px' />
                        <p><small> | {nod.caption} </small></p>
                    </div>
                )
        }
    }
    useEffect(() => {
        //when the site load, search for the news in the slug
        const articleRef = collection(db, "publications");
        getArticle(articleRef, slug)
    }, [slug]);

    useEffect(() => {
        if (article?.id) {
            const nodsRef = collection(db, "nods");
            getNods(nodsRef, article.id);
        }
    }, [article]); 

    useEffect(() => {
        console.log("Nods atualizados:", nods);
    }, [nods]);

    //Hold the page until the article is found out
    if (loading) return <div className="loading">Carregando...</div>;
    if (error) return <div className="error">{error}</div>;
    if (!article) return <div className="not-found">Artigo não encontrado</div>;

    return(
        <div className="ArticlePag">
            <h1> {article.type.toUpperCase()} </h1>
            <h2> {article.title} </h2>
            <h4 className="subtitle"> {article.subtitle} </h4>
            <p> <i class="bi bi-calendar-minus"></i>  {article.date} </p>
            <button> <i class="bi bi-share"></i> Compartilhar  </button>
            <a href={'/editar/' + article.id}> <i class="bi bi-pencil"></i> Editar </a>
            <img src={article.thumb}/>

            <div className='article'> 
                {/* Render a template for each nod saved based on their own tag */}
                {nods.map(nod => 
                    renderNods(nod)
                )}
            </div>
        </div>
    )

}

export default ArticlePag