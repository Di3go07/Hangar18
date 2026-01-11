# 🎸 HANGAR 18 

## ♫ Apresentação 

Nomeado com inspiração em uma música de mesmo nome do "Megadeth", **Hanagr 18** é um projeto pessoal de um portal de notícias voltadas para o cenário do rock. 

O site tem como objetivo principal construir uma plataforma que seja um ponto de referência para a comunidade do  rock na internet e amplie a divulgação de conteúdos relacionados, voltados principamente às músicas underground e nacional. 

Embora tenha na sua essência uma temática nichada, a sua estrutura possue os mesmo requisitos comuns de  um site de notícias, como *publicar uma matéria*, *editar suas informações* e *salvar o conteúdo em um servidor*, o que permite adaptar o projeto para diferentes contextos.

<a href="#" target="_blank"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"></a>
<a href="#" target="_blank"><img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5"></a>
<a href="#" target="_blank"><img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3"></a>
<a href="#" target="_blank"><img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite"></a>

## 🛠️ Funcionalidades

### 📝 Sistema Completo de Publicação (CRUD)

A aplicação oferece uma interface gráfica intuitiva para o ciclo completo de gerenciamento de artigos:

✍️ Criação de novos artigos 
   
🔧 Edição de conteúdo já publicado

👁️ Visualização em tempo real

🗑️ Exclusão controlada de publicações

Todos os artigos são armazenados e gerenciados diretamente no servidor do projeto.

### 👥 Sistema Hierárquico de Usuários

Para garantir segurança e organização, implementamos um sistema de permissões por cargos

| Cargo | Permissões | Descrição |
|-------|------------|-----------|
| **Autor** |  Criar artigos | Responsável pela produção de conteúdo |
| **Editor** |  Editar artigos | Revisa e aprimora publicações existentes |
| **Administrador** |  Editar +  Excluir +  Gerenciar usuários | Controle total do sistema |

⚠️ Importante: Leitores do site têm acesso público apenas à leitura. Todas as páginas de administração são protegidas e requerem autenticação.

### 🔍 Sistema Inteligente de Busca

Cada artigo inclui um sistema de palavras-chave (keywords) cadastradas pelo autor para os usuários finais  buscarem na página artigos relacionados à uma temática específica.

Exemplo de uso: Um artigo sobre "Megadeth" pode ter keywords como: thrash metal, Dave Mustaine, heavy metal, anos 80 - facilitando que fãs encontrem conteúdo relevante.

## 💾 Banco de Dados

Segue abaixo o diagrama do banco de dados usado na aplicação.


```mermaid
classDiagram
direction TB
  class User{
    - int ID
    - string name
    - string email
    - string password
    - Enum role
  }

  class Publication{
    - int ID
    - string title
    - string subtitle
    - string slug
    - string thumb
    - Enum type
    - User autor
    - Datetime date
    - Datetime edited
  }

  class Nods{
    - int ID
    - string value
    - int position
    - Enum tag
    - Publication publicationID
    - string alt
    - string caption
  }
  
  class Keywords{
    - int ID
    - string value
  }

  class keywords-news{
    - int keywordID
    - int newsID
  }

  User "1" -- "*" Publication : cria
  Publication "1" -- "*" Nods : contém
  keywords-news -- Keywords : referencia
  keywords-news -- Publication : referencia
```

`User` - tabela com os usuários cadastrados

`Publications` - tabela com as informações gerais de uma publicação 

`Nods` - cada tupla da tabela representa o elemento do conteúdo de uma publicação, como parágrafo e imagem

`Keywords` - tabela com os valores chaves para a busca 

`keywords-news` - assosiação entre keywords e referentes à uma publicação 

## 🌐 Endpoints 
Como dito, algumas rotas do projeto são protegidas e precisam, muitas vezes, serem digitadas para serem acessadas. Essas rotas são:

`/login` - página de login dos usuários

`/register` - formulário para administradores criarem novos usuários 

`/redacao` - página com formulário para o autor escrever um artigo

`/editar/:ID` - página com formulário para editar um artigo específico


## 🔴 Pré-requisitos
Para rodar o projeto Hanagr 18 localmente, você precisará ter os seguintes itens instalados em sua máquina:

1. Node.js

    Versão: 14.x ou superior (recomendado: 18.x LTS)

    Como verificar: `node --version`

    Download: [nodejs.org](https://nodejs.org/pt-br)

2. npm (Node Package Manager)

    Geralmente instalado junto com o Node.js

    Como verificar: `npm --version`

    Versão mínima: 6.x

4. SQLite3

    Sistema: Já incluso no Node.js via pacote

## 🟢 Inicialização

Como iniciar a aplicação

1. No terminal, acesse o dirétorio raiz do projeto 
   ```
   cd ./Hangar18
   ```

2. Baixe as dependências necessárias
   ```
   npm install
   ```

   
3. Inicialize a aplicação
   ```
   npm run
   ```

Com os servidores online, cadastre seu usuário e escreva seus próprios artigos para popular o site.

## 👨‍💻 Desenvolvedor
Responsável pela criação do projeto

Diego - Programação e documentação <br>
Email: diego.dpab@gmail.com <br>
Conheça mais acessando o GitHub do desenvolvedor [aqui](https://github.com/Di3go07)!
