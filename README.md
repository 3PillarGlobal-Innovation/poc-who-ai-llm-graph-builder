
# Knowledge Graph Builder App
This application is designed to convert PDF documents into a knowledge graph stored in Neo4j. It utilizes the power of OpenAI's GPT/Diffbot LLM(Large language model) to extract nodes, relationships and properties from the text content of the PDF and then organizes them into a structured knowledge graph using Langchain framework. 
Files can be uploaded from local machine or S3 bucket and then LLM model can be chosen to create the knowledge graph.

### Getting started

:warning: You will need to have a Neo4j Database V5.15 or later with [APOC installed](https://neo4j.com/docs/apoc/current/installation/) to use this Knowledge Graph Builder.
You can use any [Neo4j Aura database](https://neo4j.com/aura/) (including the free database)
If you are using Neo4j Desktop, you will not be able to use the docker-compose but will have to follow the [separate deployment of backend and frontend section](#running-backend-and-frontend-separately-dev-environment). :warning:

### Deploy locally

#### Running Neo4j locally
1. Create a separate folder named neo4j and create a file docker-compose.yml and paste the below content
```env 
version: "3.8"
services:
  neo4j:
    container_name: neo4j
    image: neo4j:5.16
    volumes:
      - ./neo4j/data:/data
      - ./neo4j/plugins:/plugins
      - ./neo4j/import:/import
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      - NEO4J_AUTH=neo4j/super-secret
      - NEO4J_PLUGINS=["apoc"]
      - NEO4J_apoc_export_file_enabled=true
      - NEO4J_apoc_import_file_enabled=true
      - NEO4J_dbms_security_procedures_unrestricted=apoc.*,algo.*
      - NEO4J_dbms_security_procedures_allowlist=apoc.*
      - NEO4J_server_memory_heap_initial__size=512m
      - NEO4J_server_memory_heap_max__size=2G
      - NEO4J_apoc_uuid_enabled=true
      - NEO4J_server_default__listen__address=0.0.0.0
      - NEO4J_initial_dbms_default__database=neo4j
    restart: unless-stopped
    networks:
      - net
# use docker volume to persist data outside of a container.
networks:
  net:

volumes:
  neo4j:
```
2. Run "docker compose up -d"

#### Cloning repo and running neo4j llm graph builder

1. Clone https://github.com/3PillarGlobal-Innovation/poc-who-ai-llm-graph-builder.git
2. Checkout branch "feature-azure-openai"
3. Rename example.env to .env
4. Add values for the below env variables
```env
AZURE_OPENAI_API_KEY=""
AZURE_OPENAI_MODEL=""
AZURE_OPENAI_ENDPOINT=""
AZURE_OPENAI_DEPLOYMENT_NAME=""
OPENAI_API_VERSION=""
```
5. Replace values for the below env variables 
```env
NEO4J_URI = "neo4j://<your-local-ip-address>:7687"
NEO4J_USERNAME = "neo4j"
NEO4J_PASSWORD = "super-secret"
BACKEND_API_URL="http://<your-local-ip-address>:8000"
```
6. Run "docker compose up -d"

#### Proceed with next steps for specific use-cases only

#### Running through docker-compose
By default only OpenAI and Diffbot are enabled since Gemini requires extra GCP configurations.

In your root folder, create a .env file with your OPENAI and DIFFBOT keys (if you want to use both):
```env
OPENAI_API_KEY="your-openai-key"
DIFFBOT_API_KEY="your-diffbot-key"
```

if you only want OpenAI:
```env
LLM_MODELS="OpenAI GPT 3.5,OpenAI GPT 4o"
OPENAI_API_KEY="your-openai-key"
```

if you only want Diffbot:
```env
LLM_MODELS="Diffbot"
DIFFBOT_API_KEY="your-diffbot-key"
```

You can then run Docker Compose to build and start all components:
```bash
docker-compose up --build
```

##### Additional configs

By default, the input sources will be: Local files, Youtube, Wikipedia and AWS S3. As this default config is applied:
```env
REACT_APP_SOURCES="local,youtube,wiki,s3"
```

If however you want the Google GCS integration, add `gcs` and your Google client ID:
```env
REACT_APP_SOURCES="local,youtube,wiki,s3,gcs"
GOOGLE_CLIENT_ID="xxxx"
```

You can of course combine all (local, youtube, wikipedia, s3 and gcs) or remove any you don't want/need.


#### Running Backend and Frontend separately (dev environment)
Alternatively, you can run the backend and frontend separately:

- For the frontend:
1. Create the frontend/.env file by copy/pasting the frontend/example.env.
2. Change values as needed
3.
    ```bash
    cd frontend
    yarn
    yarn run dev
    ```

- For the backend:
1. Create the backend/.env file by copy/pasting the backend/example.env.
2. Change values as needed
3.
    ```bash
    cd backend
    python -m venv envName
    source envName/bin/activate 
    pip install -r requirements.txt
    uvicorn score:app --reload
    ```
### ENV
| Env Variable Name       | Mandatory/Optional | Default Value | Description                                                                                      |
|-------------------------|--------------------|---------------|--------------------------------------------------------------------------------------------------|
| OPENAI_API_KEY          | Mandatory          |               | API key for OpenAI                                                                               |
| DIFFBOT_API_KEY         | Mandatory          |               | API key for Diffbot                                                                              |
| EMBEDDING_MODEL         | Optional           | all-MiniLM-L6-v2 | Model for generating the text embedding (all-MiniLM-L6-v2 , openai , vertexai)                |
| IS_EMBEDDING            | Optional           | true          | Flag to enable text embedding                                                                    |
| KNN_MIN_SCORE           | Optional           | 0.94          | Minimum score for KNN algorithm                                                                  |
| GEMINI_ENABLED          | Optional           | False         | Flag to enable Gemini                                                                             |
| GCP_LOG_METRICS_ENABLED | Optional           | False         | Flag to enable Google Cloud logs                                                                 |
| NUMBER_OF_CHUNKS_TO_COMBINE | Optional        | 6             | Number of chunks to combine when processing embeddings                                           |
| UPDATE_GRAPH_CHUNKS_PROCESSED | Optional      | 20            | Number of chunks processed before updating progress                                        |
| NEO4J_URI               | Optional           | neo4j://database:7687 | URI for Neo4j database                                                                  |
| NEO4J_USERNAME          | Optional           | neo4j         | Username for Neo4j database                                                                       |
| NEO4J_PASSWORD          | Optional           | password      | Password for Neo4j database                                                                       |
| LANGCHAIN_API_KEY       | Optional           |               | API key for Langchain                                                                             |
| LANGCHAIN_PROJECT       | Optional           |               | Project for Langchain                                                                             |
| LANGCHAIN_TRACING_V2    | Optional           | true          | Flag to enable Langchain tracing                                                                  |
| LANGCHAIN_ENDPOINT      | Optional           | https://api.smith.langchain.com | Endpoint for Langchain API                                                            |
| BACKEND_API_URL         | Optional           | http://localhost:8000 | URL for backend API                                                                       |
| BLOOM_URL               | Optional           | https://workspace-preview.neo4j.io/workspace/explore?connectURL={CONNECT_URL}&search=Show+me+a+graph&featureGenAISuggestions=true&featureGenAISuggestionsInternal=true | URL for Bloom visualization |
| REACT_APP_SOURCES       | Optional           | local,youtube,wiki,s3 | List of input sources that will be available                                               |
| LLM_MODELS              | Optional           | Diffbot,OpenAI GPT 3.5,OpenAI GPT 4o | Models available for selection on the frontend, used for entities extraction and Q&A Chatbot                          |
| ENV                     | Optional           | DEV           | Environment variable for the app                                                                 |
| TIME_PER_CHUNK          | Optional           | 4             | Time per chunk for processing                                                                    |
| CHUNK_SIZE              | Optional           | 5242880       | Size of each chunk for processing                                                                |
| GOOGLE_CLIENT_ID        | Optional           |               | Client ID for Google authentication                                                              |


###
To deploy the app and packages on Google Cloud Platform, run the following command on google cloud run:
```bash
# Frontend deploy 
gcloud run deploy 
source location current directory > Frontend
region : 32 [us-central 1]
Allow unauthenticated request : Yes
```
```bash
# Backend deploy 
gcloud run deploy --set-env-vars "OPENAI_API_KEY = " --set-env-vars "DIFFBOT_API_KEY = " --set-env-vars "NEO4J_URI = " --set-env-vars "NEO4J_PASSWORD = " --set-env-vars "NEO4J_USERNAME = "
source location current directory > Backend
region : 32 [us-central 1]
Allow unauthenticated request : Yes
```
### Features
- **PDF Upload**: Users can upload PDF documents using the Drop Zone.
- **S3 Bucket Integration**: Users can also specify PDF documents stored in an S3 bucket for processing.
- **Knowledge Graph Generation**: The application employs OpenAI/Diffbot's LLM to extract relevant information from the PDFs and construct a knowledge graph.
- **Neo4j Integration**: The extracted nodes and relationships are stored in a Neo4j database for easy visualization and querying.
- **Grid View of source node files with** : Name,Type,Size,Nodes,Relations,Duration,Status,Source,Model
  
## Functions/Modules

#### extract_graph_from_file(uri, userName, password, file_path, model):
   Extracts nodes , relationships and properties from a PDF file leveraging LLM models.
   
    Args:
   	 uri: URI of the graph to extract
   	 userName: Username to use for graph creation ( if None will use username from config file )
   	 password: Password to use for graph creation ( if None will use password from config file )
   	 file: File object containing the PDF file path to be used
   	 model: Type of model to use ('Gemini Pro' or 'Diffbot')
   
     Returns: 
   	 Json response to API with fileName, nodeCount, relationshipCount, processingTime, 
     status and model as attributes.
     
<img width="692" alt="neoooo" src="https://github.com/neo4j-labs/llm-graph-builder/assets/118245454/01e731df-b565-4f4f-b577-c47e39dd1748">

#### create_source_node_graph(uri, userName, password, file):

   Creates a source node in Neo4jGraph and sets properties.
   
    Args:
   	 uri: URI of Graph Service to connect to
   	 userName: Username to connect to Graph Service with ( default : None )
   	 password: Password to connect to Graph Service with ( default : None )
   	 file: File object with information about file to be added
   
    Returns: 
   	 Success or Failure message of node creation

<img width="958" alt="neo_workspace" src="https://github.com/neo4j-labs/llm-graph-builder/assets/118245454/f2eb11cd-718c-453e-bec9-11410ec6e45d">


#### get_source_list_from_graph():
   
     Returns a list of file sources in the database by querying the graph and 
     sorting the list by the last updated date. 

<img width="822" alt="get_source" src="https://github.com/neo4j-labs/llm-graph-builder/assets/118245454/1d8c7a86-6f10-4916-a4c1-8fdd9f312bcc">

#### Chunk nodes and embeddings creation in Neo4j

<img width="926" alt="chunking" src="https://github.com/neo4j-labs/llm-graph-builder/assets/118245454/4d61479c-e5e9-415e-954e-3edf6a773e72">


## Application Walkthrough
https://github.com/neo4j-labs/llm-graph-builder/assets/121786590/b725a503-6ade-46d2-9e70-61d57443c311

## Links
 The Public [ Google cloud Run URL](https://devfrontend-dcavk67s4a-uc.a.run.app).
 [Workspace URL](https://workspace-preview.neo4j.io/workspace)

