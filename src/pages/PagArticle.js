import { BrowserRouter as Router, Link, Route, Routes, useParams,} from "react-router-dom";
import React, { useState, useEffect, useMemo} from 'react';
import { db } from '../firebaseConnection';
import { doc, getDocs, getDoc, collection,  query, where} from 'firebase/firestore';

function ArticlePag(){
    const {slug} = useParams();
    const [article, setArticle] = useState(null);
    const [nods, setNods] = useState([]);
    const [author, setAuthor] = useState([]);
    const [error, setError] = useState(null);
    const [user, setUser] = useState('');
    const [keywords, setKeywords] = useState([]);
    const [loading, setLoading] = useState(true);

    async function getArticle(Ref, slug){
        //capture all the instances in the db
        const snapshot = await getDocs(Ref);
        const lista = snapshot.docs.map(doc => {
            const data = doc.data();
            const article = {
                id: data.id,  
                title: data.title,
                subtitle: data.subtitle,
                authorID: data.author,
                slug: data.slug,
                type: data.type,
                thumb: data.thumb,
                date: data.date
            };
            
            // Add 'edited' field only if it exists in the document
            if ('edited' in data) {
                article.edited = data.edited;
            }
            
            return article;
        });
        // Find the article with matching slug
        const foundArticle = lista.find(article => article.slug === slug);
        
        if (foundArticle) {
            setArticle(foundArticle);
        } else {
            console.log('No article found for this slug');
        } 
    }

    async function getAuthor(Ref, id){
        //recieve the author ID and searchs for his informations in the 'users' table
        const snapshot = await getDocs(Ref);
        const list = snapshot.docs.map(doc => ({
            id: doc.data().ID,
            name: doc.data().name
        }));

        const  filteredList = list.filter(author => author.id === Number(id));

        setAuthor(filteredList[0]);
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

        //filter only the nods of the news
        const  filteredList = lista.filter(nod => nod.publicacaoID === Number(id));
        const listaOrdenada = filteredList.sort((a, b) => a.position - b.position);
        setNods(listaOrdenada);
    }

    function capitalizeName(name) {
        if (!name) return '';
        return name.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        ).join(' ');
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
                    <h3 className="mb-1"> {nod.value} </h3>
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

    async function getKeywords(Ref, articleId) {
        try{
            //serach every instance of the news in the keywords-news table
            const q = query(Ref, where("NewsID", "==", Number(article.id)));
            const querySnapshot = await getDocs(q); 

            //search the value for each keywordID reached in the last search
            if (!querySnapshot.empty) {
                const KeysID = [];
                const keysValues = [];
                querySnapshot.docs.map(keyword => KeysID.push(keyword.data().KeywordID))
                console.log(KeysID)

                for (var i=0; i < KeysID.length; i++){
                    const q = query(collection(db, "keywords"), where("ID", "==", Number(KeysID[i])));
                    const querySnapshot = await getDocs(q); 
                    if (!querySnapshot.empty) {
                        querySnapshot.docs.map(keyword => keysValues.push(keyword.data().value))
                    }
                }

                setKeywords(keysValues) //add the list of keywords registred for the news in the database
            }else{
                console.log('nenhuma keyword encontrada!')
            }
        } catch {
            console.error("Erro ao buscar as Keywords: ", error)
        } 
    }

    useEffect(() => {
        const data = localStorage.getItem("user");

        if (data){
            setUser(JSON.parse(data))
        }
        }, 
    []);

    useEffect(() => {
        //when the site load, search for the news in the slug
        const articleRef = collection(db, "publications");
        console.log(slug)
        getArticle(articleRef, slug)
    }, [slug]);

    useEffect(() => {
        if (article?.id) {
            const nodsRef = collection(db, "nods");
            getNods(nodsRef, article.id);
            const authorRef = collection(db, 'users');
            getAuthor(authorRef, article.authorID);

            const loadKeywords = async () => {
                const keywordsRef = collection(db, "keywords-news");
                await getKeywords(keywordsRef, article.id)
            };
            loadKeywords()

            setLoading(false);
        }
    }, [article]); 

    useEffect(() => {
        console.log("Nods atualizados:", nods);
    }, [nods]);

    //Hold the page until the article is found out
    if (loading) return <div className="loading"> <p> Carregando... </p></div>;
    if (error) return <div className="error">{error}</div>;
    if (!article) return <div className="not-found">Artigo não encontrado</div>;

    return(
        <div className="row bg-Body ms-lg-5 me-lg-5 p-4">
            <div className="col-lg-9"> 
                <h2> {article.type.toUpperCase()} </h2>
                <h2 className="mt-4 mb-1"> {article.title} </h2>
                <h4 className="subtitle mb-1"> {article.subtitle} </h4>

                <div className="d-flex gap-2">
                    <p className="infos pb-2"> <i class="bi bi-calendar-minus"></i>  {article.date} </p>
                    <p className="infos pb-2"> <i class="bi bi-person-fill"></i> {capitalizeName(author.name)} </p>
                    {'edited' in article && (
                        <p className="infos pb-2 fst-italic"> Edited </p>
                    )}
                </div>

                <div className="mb-2 d-flex gap-2 align-items-center">
                    <button className="share"> <i class="bi bi-share"></i> <span> Compartilhar </span>  </button>
                    {user.role === 'Editor' && (
                        <a className="edit" href={'/editar/' + article.id}> <i class="bi bi-pencil"></i> Editar </a>
                    )}
                </div>

                <img className='img-fluid main-thumb mb-2' src={article.thumb}/>

                <div className='article'> 
                    {/* Render a input for each nod saved based on their own tag */}
                    {nods && nods.length > 0 ? (
                        nods.map(nod => renderNods(nod))
                    ) : (
                        <p>Nenhum nod encontrado</p>
                    )}
                </div>

                <div className='d-flex flex-row mt-2'> 
                    {keywords && keywords.length > 0 ? (
                        keywords.map(key => <p className='article-keyword'> {key.toUpperCase()}</p>)
                    ) : (
                        <p></p>
                    )}
                </div>
            </div>
        </div>
    )

}

export default ArticlePag