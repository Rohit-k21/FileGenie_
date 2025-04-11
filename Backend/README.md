# FileGenie

**AI-powered PDF Assistant** — Upload any PDF, ask questions, and get intelligent answers using LangChain Agents and Azure OpenAI.

---

## Features

- Upload PDFs and extract clean text
- Embedding storage with **ChromaDB**
- Query content using **LangChain Agents**
- Custom tools for content lookup
- Context-aware conversation memory
- Auth system (login/signup) 
- Clean separation of frontend (Angular) and backend (Flask)

---

## Project Structure

```
FileGenie/
│
├── backend/
│   ├── app.py                    
│   ├── pdf_reader.py             
│   ├── chroma_vector_store.py    
|   ├── chroma_vector_query
|   ├── get_collect.py
│   ├── prompt_model.py           
│   ├── tools/                    
│   ├── config.py                 
│   ├── .env                      
│   └── requirements.txt
│
├── frontend/ (optional)
│   ├── src/
│   └── ...
└── README.md
```

---

## Setup Instructions

### 1. Clone the Repository


download and unzip zip file
cd FileGenie
```

### 2. Backend Setup (Python)


cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Variables (`.env`)

Create a `.env` file inside the `backend/` folder:

```env
AZURE_OPENAI_API_KEY=your-api-key
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_API_VERSION=2023-12-01-preview
AZURE_OPENAI_4o_MODEL=gpt-4o
```

Also update `config.py` with correct paths:

```python
PDF_FILEPATH = "your/path"
HISTORY_FILEPATH = "your/path"
CHROMA_PERSIST_DIRECTORY = "your/path"
```

### 4. Frontend Setup

cd frontend
npm install
ng serve
```

---

## How It Works

1. Upload a PDF → Extract and clean text
2. Chunk the content, embed using Azure OpenAI
3. Store in ChromaDB with metadata
4. When a user submits a query:
   - Convert query to embedding
   - Fetch relevant content chunks
   - Use LangChain Agent + Tools to answer
5. Response generated and saved to history

---


## Tech Stack

- **Backend**: Python, Flask, LangChain, Azure OpenAI, ChromaDB
- **Frontend**: Angular 
- **PDF parsing**: PyMuPDF (fitz)
- **Embeddings**: Azure OpenAI
- **Storage**: ChromaDB, JSON (history)

---

## Author

- Rohit Ravindra Kulkarni


---

## Future Improvements

- Enhanced vector search
- Table extraction from PDFs
- Per-user query history
- Streamlit-based chatbot UI
