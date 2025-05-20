import React, { useState, useEffect, useMemo} from 'react';
import { db } from '../firebaseConnection';
import { doc, setDoc, addDoc, collection} from 'firebase/firestore';
import '../style/FormsArticle.css'

function FormsArticle(){
    //STATES
    const [newsID, setNewsID] = useState(Date.now())
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [slug, setSlug] = useState('');
    const [thumb, setThumb] = useState('');
    const [date, setDate ] = useState('');
    const [tag, setTag] = useState('p');
    const [type, setType] = useState('Notícia');
    const [nextPosition, setNextPosition] = useState(1);
    const [nods, setNods] = useState([]);

    //FUNCTIONS
    function validateForms(){
        if (newsID && title && subtitle && thumb && nods.length != 0 ){
            console.log('Formulário validado!')

            return true
        } else {
            alert('Preencha todos os campos')
            return false
        }
    }


    async function SaveText() {
        //function to save the new text
        if (!validateForms()) {
            //validate the forms fields
            console.log("Validation failed. Please fill all required fields.");
            return;
        }

        //adiciona a data da notícia
        const currentDate = new Date();
        const options = {year:'numeric', month: 'long', day: 'numeric'};   
        const formattedDate = currentDate.toLocaleDateString('pt-BR', options);
        setDate(formattedDate); 

        // Save the main publication
        const publicationRef = await addDoc(collection(db, "publications"), 
            {
                id: newsID,
                title: title,
                subtitle: subtitle,
                slug: slug,
                type: type,
                thumb: thumb,
                date: formattedDate
            }
        );
        console.log('Matéria registrada no banco com ID:', publicationRef.id);

        // Save all nods in parallel with error handling
        const nodPromises = nods.map(async (nod) => {
            try {
                await addDoc(collection(db, 'nods'), 
                    {
                        id: nod.id,
                        publicacaoID: newsID,
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

        //reseta todos os campos    
        setTitle('');
        setSubtitle('');
        setNextPosition(1);
        setNewsID(Date.now());
        setNods([]);
        setSlug('');
        setThumb('');
    }

    function addNod(){
        //add a new HTML nod at the nods list
        const newElement = {
            id: Date.now(),
            publicacaoID: newsID,
            tag:tag,
            value: '',
            position: nextPosition,
            ALT: '',
            caption: '' 
        };

        setNods([...nods, newElement]);
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

    //WEB PAGE
    return(
         <div className='Form'>
                <h1> Redação </h1>
                <h4> Escreva o texto a ser publicado </h4>

                <h3> Nova {type}</h3>
                <div className='form-field'>
                    <label htmlFor="titulo"> Título </label>
                    <input type='text' name='titulo'  maxlength="70" value={title} onChange={(e) => {setTitle(e.target.value); setSlug(titleToSlug(e.target.value))}} required />
                </div>
                <div className='form-field'> 
                    <label htmlFor="subtitulo"> Subtítulo </label>
                    <input type='text' name='subtitulo' maxlength="90" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required />
                </div>
                <div className='form-section'>
                    <div className='form-field'>
                        <label> Tipo: </label>
                        <select name="tipo" value={type} onChange={(e) => setType(e.target.value)}>
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
                            value={thumb}
                            placeholder="/images/nome_imagem.png"
                            onChange={(e) => setThumb(e.target.value)}
                        />

                        {thumb && (
                            <div style={{marginTop: '10px'}}>
                                <img 
                                    src={`${thumb}`} 
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

                <button className='saveButton' onClick={SaveText}> SALVAR {type.toUpperCase()} </button>
            </div>
    )
}

export default FormsArticle