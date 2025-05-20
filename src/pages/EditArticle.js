import { BrowserRouter as Router, Link, Route, Routes, useParams,} from "react-router-dom";
import React, { useState, useEffect, useMemo} from 'react';
import { db } from '../firebaseConnection';
import { doc, getDocs, updateDoc, setDoc, addDoc, collection, query, where} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";
import '../style/FormsArticle.css'

function FormsArticle(){
    //STATES
    const {ID} = useParams();
    const navigate = useNavigate();

    const [article, setArticle] = useState({});
    const [nextPosition, setNextPosition] = useState(1);
    const [nods, setNods] = useState([]);
    const [tag, setTag] = useState('p')
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //FUNCTIONS
    function validateForms(){
        if ( article.title && article.subtitle && article.thumb && nods.length != 0 ){
            console.log('Formulário validado!')

            return true
        } else {
            alert('Preencha todos os campos')
            return false
        }
    }

    function addNod(){
        //add a new HTML nod at the nods list
        const newElement = {
            id: Date.now(),
            publicacaoID: ID,
            tag: tag,
            value: '',
            position: nextPosition,
            ALT: '',
            caption: '' 
        };

        setNods([...nods, newElement]);
        console.log(newElement)
        setNextPosition( nextPosition + 1);
    }

    const handleChangeElemento = (id, updates) => {
        //function to alter the value of the nod
        setNods(prevNods => 
            prevNods.map(nod => 
                nod.id === id ? { ...nod, ...updates } : nod
            )
        );
    };

    const deleteElemento = (id) => {
        //function to remove the nod
        if (window.confirm('Tem certeza que deseja excluir este elemento?')) {
            setNods(prevNods => 
                prevNods.filter(nod =>
                    nod.id !== id
                )
            );
        }
    };

    function renderNods(nod){
        //function that render a template for each tag saved on the nods
        const tag = nod.tag;
        switch (tag) {
            case 'p':
                return (
                    <div key={nod.id} style={{margin: '10px 0'}}>
                        <p>Parágrafo:</p>
                        <textarea 
                            value={nod.value}
                            onChange={(e) => handleChangeElemento(nod.id,{ value: e.target.value })}
                            style={{width: '100%', minHeight: '100px'}}
                        />
                        <button  className='excluir' onClick={() => deleteElemento(nod.id)}> Excluir </button>
                    </div>
                );
            case 'h3':
                return (
                    <div key={nod.id} style={{margin: '10px 0'}}>
                        <p>Título (h3):</p>
                        <input
                            type="text"
                            value={nod.value}
                            onChange={(e) => handleChangeElemento(nod.id, { value: e.target.value })}
                            style={{width: '100%'}}
                        />
                        <button  className='excluir' onClick={() => deleteElemento(nod.id)}> Excluir </button>
                    </div>
                );
            case 'img':
                return (
                    <div key={nod.id} style={{margin: '10px 0'}}>
                        <div>
                            <p> Imagem: </p>
                            <p> • URL</p>
                            <input
                                type="text"
                                value={nod.value}
                                onChange={(e) => handleChangeElemento(nod.id, { value: e.target.value })}
                                style={{width: '100%'}}
                                placeholder="nome_imagem.png"
                            />
                        </div>

                        <div>
                            <p> • Legenda </p>
                            <input 
                                type='text'
                                value={nod.caption}
                                onChange={(e) => handleChangeElemento(nod.id, { caption: e.target.value })}
                                placeholder='crie uma legenda criativa e útil'
                                style={{width: '100%'}}
                            />
                        </div>
                        
                        <div>
                            <p> • ALT </p>
                            <input 
                                type='text'
                                value={nod.ALT}
                                onChange={(e) => handleChangeElemento(nod.id, { ALT: e.target.value })}
                                placeholder='breve descrição da imagem'
                                style={{width: '100%'}}
                            />
                        </div>

                        {nod.value && (
                            <div style={{marginTop: '10px'}}>
                                <img 
                                    src={`${nod.value}`} 
                                    alt="Pré-visualização" 
                                    style={{maxWidth: '200px', maxHeight: '200px'}}
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = '/src/images/placeholder.png';
                                    }}
                                />
                                <p style={{fontSize: '12px', color: '#666'}}>Pré-visualização</p>
                            </div>
                        )}
                        <button  className='excluir' onClick={() => deleteElemento(nod.id)}> Excluir </button>
                    </div>
                )
        }
    }

    function titleToSlug(text) {
        //function to write the title as a slug
        return text
            .toString() // Garante que seja string
            .normalize('NFD') // Separa acentos dos caracteres (á → a + ´)
            .replace(/[\u0300-\u036f]/g, '') // Remove acentos
            .toLowerCase() // Tudo em minúsculo
            .trim() // Remove espaços extras no início/fim
            .replace(/\s+/g, '-') // Substitui espaços por hífens
            .replace(/[^\w\-]+/g, '') // Remove caracteres não alfanuméricos (exceto hífens)
            .replace(/\-\-+/g, '-'); // Remove múltiplos hífens consecutivos
    }

    async function getArticle(Ref, id){
        try{
            //Search the publication with the id
            const q = query(Ref, where("id", "==", parseInt(id)));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                // Pega o primeiro documento encontrado (se houver)
                const doc = querySnapshot.docs[0];
                setArticle(doc.data());
                setLoading(false);
            } else {
                console.log("Nenhum documento encontrado com esse ID!");
            }
        } catch (error) {
                console.error("Erro ao buscar artigo:", error);
        }
    }

    async function editArticle() {
        if (!validateForms()) {
            //validate the forms fields
            console.log("Validation failed. Please fill all required fields.");
            return;
        }
        
        try{
            const articleRef = collection(db, 'publications');
            const q = query(articleRef, where("id", "==", parseInt(ID)));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const docRef = querySnapshot.docs[0].ref;

                const updatedData = {
                    title: article.title,
                    subtitle: article.subtitle,
                    thumb: article.thumb,
                    type: article.type,
                    slug: article.slug
                }

                await updateDoc(docRef, updatedData);
                alert("Publicação atualizada com sucesso!");

                navigate(`/${article.type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}/${article.slug}`); 
            } 
        } catch (error) {
            console.error("Erro ao editar artigo:", error);
            alert("Erro ao salvar alterações.");
        }
    }

    //USE EFFECTS
    useEffect(() => {
        //load the publication's infos in the db
        const loadArticle = async () => {
            const articleRef = collection(db, "publications");
            await getArticle(articleRef, ID); 
        };
        loadArticle();
    }, [ID]);

    //WEB PAGE
    //conditionals pages
    if (loading) return <div className="loading">Carregando...</div>;

    //base
    return(
         <div className='Form'>
                <h1> EDIÇÃO </h1>
                <h4> Edite a publicação </h4>

                <div className='form-field'>
                    <label htmlFor="titulo"> Título </label>
                    <input type='text' name='titulo'  maxlength="70" value={article.title} onChange={(e) => setArticle({...article, title: e.target.value, slug: titleToSlug(e.target.value) })} required />
                </div>
                <div className='form-field'> 
                    <label htmlFor="subtitulo"> Subtítulo </label>
                    <input type='text' name='subtitulo' maxlength="90" value={article.subtitle} onChange={(e) => setArticle({...article, subtitle: e.target.value})} required />
                </div>
                <div className='form-section'>
                    <div className='form-field'>
                        <label> Tipo: </label>
                        <select name="tipo" value={article.type} onChange={(e) => setArticle({...article, type: e.target.value})}>
                            <option> Notícia </option>
                            <option> Matéria </option>
                            <option> Resenha </option>
                        </select>
                    </div>

                    <div className='form-field img-field'>
                        <label htmlFor="capa"> Capa </label>
                        <input
                            type="text"
                            name="capa"
                            value={article.thumb}
                            placeholder="/images/nome_imagem.png"
                            onChange={(e) => setArticle({...article, thumb: e.target.value})}
                        />

                        {article.thumb && (
                            <div style={{marginTop: '10px'}}>
                                <img 
                                    src={`${article.thumb}`} 
                                    alt="Pré-visualização"
                                    style={{maxWidth: '200px', maxHeight: '200px'}}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/placeholder.png';
                                    }}
                                />
                                <p style={{fontSize: '12px', color: '#666'}}>Pré-visualização</p>
                            </div>
                        )}
                    </div>
                </div>
                
                <h3> Conteúdo </h3>
                <div className='campoEscrita'> 
                    {/* Render a input for each nod saved based on their own tag */}
                    {nods.map(nod => 
                        renderNods(nod)
                    )}
                </div>
                <div className='TagSelect'>
                    <select name="tag" value={tag} onChange={(e) => setTag(e.target.value)}>
                        <option> p </option>
                        <option> h3 </option>
                        <option> img </option>
                    </select>
                    <button onClick={addNod}> Adicionar </button>
                </div>

                <button className='saveButton' onClick={editArticle}> EDITAR {article.type.toUpperCase()} </button>
            </div>
    )
}

export default FormsArticle