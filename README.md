# 🖼️ Projeto Fullstack –  Gerenciador de Atividades com Django REST Framework + ReactJS + TypeScript
![GitHub top language](https://img.shields.io/github/languages/top/Kurosakiniel/CheckListAtividadeFullStack) 
![GitHub last commit (branch)](https://img.shields.io/github/last-commit/Kurosakiniel/CheckListAtividadeFullStack/TelaEditarDeletar)

Aplicação fullstack para gerenciamento de **atividades/tarefas**, desenvolvida com:

* **Backend:** Django + Django REST Framework
* **Frontend:** React + TypeScript (Vite)
* **Autenticação:** JWT

O sistema permite que usuários autenticados **criem, visualizem, editem e removam atividades**.


## 📸 Preview



## 📁 Estrutura do Projeto

```bash id="1z0a3x"
/backend      # API Django REST
/frontend     # Aplicação React + TypeScript
```


## 🚀 Como Executar

### 🔧 Backend

```bash id="3dlh1v"
cd backend

python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

pip install -r requirements.txt

python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Servidor:
👉 http://localhost:8000


### 💻 Frontend

```bash id="y9w7s2"
cd frontend

npm install
```

Crie o arquivo `.env.local`:

```id="z8h2ka"
VITE_API_URL=http://localhost:8000
```

Inicie:

```bash id="8k2bpl"
npm run dev
```

Acesse:
👉 http://localhost:5173


## 🧠 Funcionalidades

### 🔐 Autenticação

* Login e logout com JWT
* Proteção de rotas no frontend

### 📋 Gerenciamento de Atividades

* Criação de atividades com título e descrição
* Listagem de atividades
* Visualização de detalhes
* Edição de atividades
* Exclusão de atividades
* Acesso restrito a usuários autenticados


## ⚙️ Tecnologias Utilizadas

### Backend

* Django
* Django REST Framework

### Frontend

* React
* TypeScript
* Vite
* React Hook Form
* Yup
* Tailwind CSS


## 🎯 Objetivo do Projeto

Este projeto foi desenvolvido para praticar:

* Integração entre frontend e backend
* Consumo de APIs REST
* Autenticação com JWT
* Manipulação de formulários com validação
* Organização de código em aplicações fullstack


Se você curtiu o projeto, considere deixar uma ⭐ no repositório!


