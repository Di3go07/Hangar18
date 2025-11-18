import { BrowserRouter as Router, Link, Route, Routes, useParams, Await,} from "react-router-dom";
import React, { useState, useEffect, useMemo} from 'react';
import { db } from '../firebaseConnection';
import { doc, getDocs, updateDoc, setDoc, addDoc, deleteDoc, collection, query, where} from 'firebase/firestore';
import { useNavigate } from "react-router-dom";

function EditArticle(){
    //STATES
    const {ID} = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({});
    const [article, setArticle] = useState({});
    const [nextPosition, setNextPosition] = useState(1);
    const [nods, setNods] = useState([]);
    const [tag, setTag] = useState('p')
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [keywordsInput, setKeywordsInput] = useState('');
    const [keywords, setKeywords] = useState([]);

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
                        <button  className='excluir' onClick={() => deleteElemento(nod.id)}> <i class="bi bi-trash align-middle"></i> Excluir </button>
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
                        <button  className='excluir' onClick={() => deleteElemento(nod.id)}> <i class="bi bi-trash align-middle"></i> Excluir </button>
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
                        <button  className='excluir' onClick={() => deleteElemento(nod.id)}> <i class="bi bi-trash align-middle"></i> Excluir </button>
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

    function getCurrentDate(){
        const currentDate = new Date();
        const options = {year:'numeric', month: 'long', day: 'numeric'};   
        const formattedDate = currentDate.toLocaleDateString('pt-BR', options);
        return formattedDate
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
        setLoading(true);
        //PUBLICATION
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
                    slug: article.slug,
                    edited: getCurrentDate(),
                    editor: user.ID,
                }

                await updateDoc(docRef, updatedData);
            } 
        } catch (error) {
            console.error("Erro ao editar artigo:", error);
            alert("Erro ao salvar alterações.");
        }

        //KEYWORDS
        try{
            const keywrodRef = collection(db, 'keywords-news');
            const q = query(keywrodRef, where("NewsID", "==", Number(article.id)));
            const querySnapshot = await getDocs(q); 

            if (!querySnapshot.empty) {
                //delete all the old keywords relations
                querySnapshot.docs.map(doc => deleteDoc(doc.ref));

                //save the new ones
                const keysList = keywordsInput
                .split(',')
                .map(key => key.trim())
                .filter(key => key !== ''); //save all the last alterations before send the informations to the database
            
                setKeywords(keysList);
                keywords.map(key => handleKey(key))
            } else {
                //save the keywords for the first time in the database
                console.log(keywordsInput)
                const keysList = keywordsInput
                .split(',')
                .map(key => key.trim())
                .filter(key => key !== ''); //save all the last alterations before send the informations to the database
            
                setKeywords(keysList);
                keywords.map(key => handleKey(key))
                console.log('The article now has keywords!')
            }
        }catch (error) {
            console.log('Erro ao editar keywords: ', error)
        }

        //NODS
        try{
            if (article){
                const nodsRef = collection(db, 'nods');
                const q = query(nodsRef, where("publicacaoID", "==", Number(article.id)));
                const querySnapshot = await getDocs(q);
                console.log(nods)
                if (!querySnapshot.empty) {
                    //delete the atual nods in the db
                    querySnapshot.docs.map(nod => deleteDoc(doc(db, 'nods', nod.id)));
                    
                    // Save all nods in parallel with error handling
                    const nodPromises = nods.map(async (nod) => {
                        try {
                            await addDoc(collection(db, 'nods'), 
                                {
                                    id: nod.id,
                                    publicacaoID: Number(ID),
                                    tag: nod.tag,
                                    value: nod.value || '',
                                    position: nod.position,
                                    Alt: nod.ALT || '',
                                    caption: nod.caption || ''
                                }
                            ).catch ((error) => {
                                console.error(`Failed to save nod ${nod.id}:`, error);
                                throw error; 
                            })   
                        }catch (error) {
                            console.error('Error in SaveText:', error); 
                            throw error;
                        }   
                    });
            
                    await Promise.all(nodPromises);
                    console.log('All nods saved successfully');
                }else{
                    console.log('nenhum nod encontrado!')
                }
            }
        }catch (error){
            console.error("Erro ao editar nods:", error);
            alert("Erro ao salvar alterações.");
        }finally{
            alert("Publicação atualizada com sucesso!");
            navigate(`/${article.type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}/${article.slug}`); 
            setLoading(false);
        }
    }

    async function getNods(Ref, articleId){
        const listaNods = [];
        try{
            //Search every nod with the article's id
            const q = query(Ref, where("publicacaoID", "==", Number(articleId)));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                querySnapshot.docs.map(nod => listaNods.push(nod.data()))
            }else{
                console.log('nenhum nod encontrado!')
            }
        }catch (error) {
            console.error("Erro ao buscar nods:", error);
        }finally{
            const listaOrdenada = listaNods.sort((a, b) => a.position - b.position);
            setNods(listaOrdenada);
            console.log(nods);
        }
    }

    async function handleKey(key){
        let id;
        const q = query(collection(db, "keywords"), where("value", "==", key.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) { 
            //create the keyword
            id = Date.now()
            const keywrodRef = await addDoc(collection(db, "keywords"), 
                {
                    ID: id,
                    value: key.toLowerCase()
                }
            );
            console.log('Nova keyword registrada no banco com ID:', keywrodRef.id);
        } else {
            //Search the key's id 
            const keyword = querySnapshot.docs[0].data()
            id = keyword.ID
        }

        //verify if the relation alredy exists 
        const relationsRef = collection(db, "keywords-news");
        const relationQuery = query(
            relationsRef,
            where("KeywordID", "==", id),
            where("NewsID", "==", article.id) 
        );
        const relationSnapshot = await getDocs(relationQuery);
        if (relationSnapshot.empty) {
            //relate the keyword and the news
            const relationRef = await addDoc(collection(db, "keywords-news"), 
                {
                    KeywordID: id,
                    NewsID: article.id
                }
            );
            console.log('Nova relação no banco com ID:', relationRef.id);
        } else {
            console.log('Relation already exisits')
        }
    }

    async function getKeywords(Ref, articleId) {
        try{
            //serach every instance of the news in the keywords-news table
            const q = query(Ref, where("NewsID", "==", Number(articleId)));
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
                setKeywordsInput(keysValues.toString())
            }else{
                console.log('nenhuma keyword encontrada!')
            }
        } catch {
            console.error("Erro ao buscar as Keywords: ", error)
        } 
    }

    function splitKeyword(e){
        if (e.key === ',' || e.key === 'Enter') {
            const keysList = keywordsInput.split(',').filter(key => key !== '').map(key => key.trim());
            setKeywords(keysList)
        }
    }

    async function deleteArticle() {
        const userConfirmed = window.confirm(
            "Tem certeza que deseja deletar esta publicação PERMANENTEMENTE?"
        );

        if (!userConfirmed) {
            console.log("Deleção cancelada pelo usuário");
            return false;
        }

        try {
            // Main publication
            const publicationsRef = collection(db, "publications");
            const q = query(publicationsRef, where("id", "==", parseInt(ID)));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                // Main document reference
                const docRef = querySnapshot.docs[0].ref;
                
                // Before delete the publication, delete the nods
                const nodsRef = collection(db, "nods");
                const nodsQuery = query(nodsRef, where("publicacaoID", "==", Number(ID)));
                const nodsSnapshot = await getDocs(nodsQuery);
                
                // Delete nods
                const deleteNodsPromises = nodsSnapshot.docs.map(nodDoc => 
                    deleteDoc(nodDoc.ref)
                );
                await Promise.all(deleteNodsPromises);
                
                // Delete the publication
                await deleteDoc(docRef);
                
                console.log("Publicação e nods relacionados deletados com sucesso!");
                return true;
            } else {
                console.log("Nenhuma publicação encontrada com esse ID!");
                return false;
            }
        } catch (error) {
            console.error("Erro ao deletar artigo:", error);
            throw error;
        } finally{
            navigate('/home')
        }
    }

    //USE EFFECTS

    useEffect(()=>{
        const user = localStorage.getItem("user");

        if (user){
            setUser(JSON.parse(user));
        }
    }, []) 

    useEffect(() => {
        //load the publication's infos in the db
        const loadArticle = async () => {
            const articleRef = collection(db, "publications");
            await getArticle(articleRef, ID); 
        };
        loadArticle();
    }, [ID]);

    useEffect(() => {
        //activeted when a new article is loaded to serach its' nods
        if (article){
            const loadNods = async () => {
                const nodRef = collection(db, "nods");
                await getNods(nodRef, article.id); 
            };
            loadNods();

            const loadKeywords = async () => {
                const keywordsRef = collection(db, "keywords-news");
                await getKeywords(keywordsRef, article.id)
            };
            loadKeywords()
        }
    }, [article]);

    useEffect(() => {
        setNextPosition(nods.length + 2)
    }, [nods]);

    //WEB PAGE
    //conditionals pages
    if (loading) return <div className="loading"><p> Carregando... </p></div>;

    //base
    return(
         <div className='form-group bg-Body ms-lg-5 me-lg-5 p-4'>
                <h2> EDIÇÃO </h2>
                <h4 className="subtitle mt-2 mb-4"> Edite a publicação </h4>

                <div className='d-flex flex-column mb-2'>
                    <label htmlFor="titulo"> Título </label>
                    <input type='text' name='titulo'  maxlength="70" value={article.title} onChange={(e) => setArticle({...article, title: e.target.value, slug: titleToSlug(e.target.value) })} required />
                </div>
                <div className='d-flex flex-column mb-2'> 
                    <label htmlFor="subtitulo"> Subtítulo </label>
                    <input type='text' name='subtitulo' maxlength="90" value={article.subtitle} onChange={(e) => setArticle({...article, subtitle: e.target.value})} required />
                </div>

                <div className='d-flex flex-row gap-lg-5'>

                    <div className='d-flex flex-column flex-fill'>
                        <label> Tipo: </label>
                        <select  className='form-select' name="tipo" value={article.type} onChange={(e) => setArticle({...article, type: e.target.value})}>
                            <option> Notícia </option>
                            <option> Matéria </option>
                            <option> Resenha </option>
                        </select>
                    </div>

                    <div className='d-flex flex-column flex-fill'>
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
                
                <h3 className='mb-2 mt-4' > Conteúdo </h3>
                <div className='campoEscrita'> 
                    {/* Render a input for each nod saved based on their own tag */}
                    {nods && nods.length > 0 ? (
                        nods.map(nod => renderNods(nod))
                    ) : (
                        <p>Nenhum nod encontrado</p>
                    )}
                </div>
                <div className='TagSelect'>
                    <select className='tag-select' name="tag" value={tag} onChange={(e) => setTag(e.target.value)}>
                        <option> p </option>
                        <option> h3 </option>
                        <option> img </option>
                    </select>
                    <button className='addButton' onClick={addNod}> Adicionar </button>
                </div>

                <div className='d-flex flex-column'>
                    <h3 className='mb-2 mt-4'> Keywords </h3>
                    <input placeholder='Separe por vírgula' type='text' name='subtitulo' maxlength="90" value={keywordsInput} onKeyDown={splitKeyword} onChange={(e) => setKeywordsInput(e.target.value)} />

                    <div className='d-flex flex-row m-1'> 
                        {keywords && keywords.length > 0 ? (
                            keywords.map(key => <p className='p-keyword'> {key.toUpperCase()} - </p>)
                        ) : (
                            <p></p>
                        )}
                    </div>
                </div> 

                <button className='saveButton' onClick={editArticle}> EDITAR {article.type.toUpperCase()} </button>
                <button className='excluir ms-2' onClick={deleteArticle}>  EXCLUIR </button>
            </div>
    )
}

export default EditArticle