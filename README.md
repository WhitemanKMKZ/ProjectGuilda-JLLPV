<div align="center">

# 💎 LUMORA

**Gestão de salão de beleza e venda de produtos em uma única plataforma.**

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-b8892b)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?logo=git&logoColor=white)

*ProjectGuilda-JLLPV · Projeto da disciplina de Engenharia de Software/ P.I*

</div>

---

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Objetivos](#-objetivos)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#%EF%B8%8F-tecnologias)
- [Estrutura do repositório](#-estrutura-do-repositório)
- [Como executar](#-como-executar)
- [Documentação e design](#-documentação-e-design)
- [Diagramas](#%EF%B8%8F-diagramas)
- [Equipe](#-equipe)

---

## 📖 Sobre o projeto

A **LUMORA** é um aplicativo para o gerenciamento de um salão de beleza. A plataforma reúne, em um só lugar, a organização dos atendimentos, o agendamento de horários e a comercialização de produtos.

A solução busca trazer **praticidade e eficiência** tanto para a profissional, que passa a controlar sua agenda e suas vendas, quanto para as clientes, que agendam serviços e escolhem produtos de forma simples.

O projeto foi desenvolvido na disciplina de **Engenharia de Software**, com o propósito de aplicar na prática os conceitos vistos em aula.

## 🎯 Objetivos

**Objetivo geral:** desenvolver uma solução tecnológica que contribua para a organização e a eficiência na gestão do salão, facilitando o controle da agenda e dos atendimentos e oferecendo um canal adequado para divulgar e vender perucas naturais.

**Objetivos específicos:**

- Aplicar conceitos de Engenharia de Software;
- Trabalhar em equipe;
- Utilizar ferramentas de desenvolvimento;
- Organizar e documentar o projeto;
- Desenvolver a solução seguindo boas práticas de programação.

## ✨ Funcionalidades

| Funcionalidade | Descrição | Protótipo |
|---|---|:---:|
| Cadastro de usuários | Criação de conta por clientes e pelo dono(a) do estabelecimento | ✅ |
| Login de usuários | Acesso à conta para agendar e comprar | ✅ |
| Agendamento de horários | Escolha de serviço, data e horário disponível | ✅ |
| Cadastro do dono/dona | Perfil com painel para acompanhar todos os agendamentos | ✅ |
| Carrinho de compras | Adição de perucas, ajuste de quantidades e finalização | ✅ |
| Catálogo de perucas | Listagem com filtros por tipo (lisas, cacheadas, crespas, coloridas) | ✅ |

> O protótipo atual é navegável e usa o `localStorage` do navegador para simular dados. A integração com back-end está prevista para as próximas etapas.

## 🛠️ Tecnologias

| Tecnologia | Uso no projeto |
|---|---|
| **HTML** | Estruturação das páginas |
| **CSS** | Estilização e layout |
| **JavaScript** | Lógica e interatividade |
| **Git** | Controle de versão |
| **GitHub** | Hospedagem e colaboração |

## 📂 Estrutura do repositório

```text
ProjectGuilda-JLLPV/
├── index.html          # Páginas e telas
├── style.css           # Estilos
├── app.js              # Lógica da aplicação
├── Links/              # Diagramas (classes, fluxograma, caso de uso e sequência)
└── README.md
```

## ▶️ Como executar

```bash
# 1. Clone o repositório
git clone https://github.com/WhitemanKMKZ/ProjectGuilda-JLLPV.git

# 2. Acesse a pasta do projeto
cd ProjectGuilda-JLLPV

# 3. Abra o protótipo no navegador
#    (dê um duplo clique em index.html)
```

Sem Git instalado? No GitHub, use o botão verde **Code → Download ZIP**, extraia a pasta e abra o `index.html`.

Não é necessário instalar dependências.

## 🔗 Documentação e design

| Recurso | Link |
|---|---|
| 🎨 Interface (canva) | [Protótipo da interface Lumora](https://canva.link/l64kext3h0x9wm0) |
| 🧩 Diagrama de classes | [Ver diagrama](Links/diagrama-classes.md) |
| 🔀 Fluxograma do site | [Ver fluxograma](Links/fluxograma.md) |
| 👥 Diagrama de caso de uso | [Ver diagrama](Links/diagrama-caso-de-uso.md) |
| 🔁 Sequência – criação de conta | [Ver diagrama](Links/diagrama-sequencia-conta.md) |
| 🔁 Sequência – fluxo geral | [Ver diagrama](Links/diagrama-sequencia-geral.md) |
| 📊 Planilha do projeto | [Google Planilhas](https://docs.google.com/spreadsheets/d/12rvJE7hvHuAYC0oeSAkxiAsvCnfeRgqhElNUBJeFJPk/edit?gid=0#gid=0) |

## 🗺️ Diagramas

Clique em cada título para abrir o diagrama aqui mesmo (o GitHub desenha sozinho).

<details>
<summary><b>Fluxograma do site</b></summary>

```mermaid
flowchart TD
  A([Abrir o site]) --> H["Início<br/>hero, serviços, destaques, promoção"]
  H --> M{"Menu inferior"}
  M -->|Início| H
  M -->|Agendar| AG
  M -->|Perucas| PE
  M -->|Carrinho| CA

  H -->|Escolher serviço| S1["Serviço selecionado"] --> AG
  H -->|Aproveitar Oferta| P1["Aplica 20% em Hidratação Profunda"] --> AG
  H -->|"+ em peruca em destaque"| ADD

  H -.->|Botão Entrar| AU
  subgraph AUTH["Entrar / Cadastrar"]
    AU{"Já tem conta?"}
    AU -->|Sim| LG["Login: e-mail e senha"]
    AU -->|Não| CD["Cadastro: nome, e-mail, senha"]
    CD --> DN{"Sou a dona do salão?"}
    DN -->|Sim| OW["Perfil de dona"]
    DN -->|Não| CL["Perfil de cliente"]
    LG --> V{"Dados corretos?"}
    V -->|Não| ER["Mostra erro"] --> LG
    V -->|Sim| OK
    OW --> OK
    CL --> OK
    OK(["Usuária logada"])
  end

  subgraph AGENDA["Agendar horário"]
    AG["Escolher serviço"] --> DT["Escolher data"]
    DT --> HR["Escolher horário livre"]
    HR --> CF["Confirmar agendamento"]
    CF --> L1{"Logada?"}
    L1 -->|Não| AU
    L1 -->|Sim| SV["Salva agendamento"]
    SV --> MY["Lista Meus agendamentos"]
    MY -->|Cancelar| RM["Remove agendamento"] --> MY
    SV --> OD{"É dona?"}
    OD -->|Sim| PN["Painel com todos os agendamentos"]
  end

  subgraph LOJA["Perucas e carrinho"]
    PE["Catálogo de perucas"] --> FI["Filtrar: Todas, Lisas, Cacheadas, Crespas, Coloridas"]
    FI --> ADD["Adicionar ao carrinho"]
    PE --> ADD
    ADD --> CA["Carrinho"]
    CA --> E{"Tem itens?"}
    E -->|Não| PE
    E -->|Sim| Q["Ajustar quantidades"]
    Q --> FN["Finalizar compra"]
    FN --> L2{"Logada?"}
    L2 -->|Não| AU
    L2 -->|Sim| FIM(["Pedido realizado, carrinho esvaziado"])
  end
```

</details>

<details>
<summary><b>Diagrama de classes</b></summary>

```mermaid
classDiagram
  class Usuario {
    +int id
    +String nome
    +String email
    +String senha
    +boolean ehDona
    +cadastrar()
    +entrar()
    +sair()
  }
  class Servico {
    +int id
    +String nome
    +double preco
  }
  class Agendamento {
    +int id
    +Date data
    +String horario
    +confirmar()
    +cancelar()
  }
  class Peruca {
    +int id
    +String nome
    +int comprimentoCm
    +double preco
    +String categoria
    +String etiqueta
  }
  class Carrinho {
    +adicionar(peruca)
    +alterarQuantidade(item, delta)
    +calcularTotal()
    +finalizar()
  }
  class ItemCarrinho {
    +int quantidade
  }
  class Promocao {
    +double descontoPercentual
    +Date validaAte
  }

  Usuario "1" --> "0..*" Agendamento : agenda
  Agendamento "0..*" --> "1" Servico : para
  Usuario "1" --> "1" Carrinho : possui
  Carrinho "1" *-- "0..*" ItemCarrinho : contém
  ItemCarrinho "0..*" --> "1" Peruca : refere-se a
  Promocao "0..*" --> "1" Servico : aplica desconto
```

</details>

<details>
<summary><b>Diagrama de caso de uso</b></summary>

Linhas tracejadas = funcionalidades previstas, ainda não feitas no protótipo.

![Diagrama de caso de uso da LUMORA](Links/caso-de-uso.png)

</details>

<details>
<summary><b>Diagrama de sequência – criação de conta</b></summary>

```mermaid
sequenceDiagram
  actor U as Usuária
  participant I as Interface (HTML)
  participant J as JavaScript (app.js)
  participant L as localStorage (navegador)
  U->>I: Clica em "Entrar"
  I->>U: Abre a janela de login
  U->>I: Escolhe a aba "Criar conta"
  U->>I: Preenche nome, e-mail e senha
  U->>I: Clica em enviar
  I->>J: Envia o formulário
  J->>L: Busca as contas já cadastradas
  L-->>J: Lista de contas
  alt E-mail já cadastrado
    J->>I: Mostra "E-mail já cadastrado"
    I->>U: Exibe o erro na janela
  else E-mail novo
    J->>L: Salva a nova conta e a conta logada
    J->>I: Fecha a janela e troca o botão para "Olá, nome · Sair"
    I->>U: Mostra "Bem-vinda"
  end
```

</details>

<details>
<summary><b>Diagrama de sequência – fluxo geral (agendar e comprar)</b></summary>

```mermaid
sequenceDiagram
  actor U as Usuária
  participant I as Interface (HTML)
  participant J as JavaScript (app.js)
  participant L as localStorage (navegador)
  U->>I: Abre o site
  I->>J: Carrega a página
  J->>L: Lê contas, carrinho e agendamentos
  L-->>J: Dados salvos
  J->>I: Mostra início, serviços e perucas
  rect rgb(235, 240, 250)
    Note over U,L: Agendar um horário
    U->>I: Escolhe serviço e data
    J->>L: Busca horários já ocupados no dia
    L-->>J: Agendamentos do dia
    J->>I: Mostra horários livres
    U->>I: Escolhe o horário e confirma
    alt Não está logada
      J->>I: Pede para entrar
    else Está logada
      J->>L: Salva o agendamento
      J->>I: Mostra "Horário agendado"
    end
  end
  rect rgb(250, 240, 235)
    Note over U,L: Comprar uma peruca
    U->>I: Clica em + na peruca
    J->>L: Salva o carrinho
    J->>I: Atualiza o carrinho
    U->>I: Clica em "Finalizar compra"
    alt Não está logada
      J->>I: Pede para entrar
    else Está logada
      J->>L: Esvazia o carrinho
      J->>I: Mostra "Pedido realizado"
    end
  end
```

</details>

---

## 👥 Equipe

| Integrante | Função |
|---|---|
| **Jose Gonçalves Pereira Neto** | Back-end |
| **Leonardo Henrique Alves** | Front-end |
| **Leonardo Jose Tebar** | _A definir_ |
| **Pedro Henrique De Souza** | _A definir_ |
| **Vitor Yuri Hirose Pena** | _A definir_ |

---

<div align="center">

Projeto acadêmico · Engenharia de Software

</div>
