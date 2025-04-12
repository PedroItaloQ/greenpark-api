# Green Park - Desafio Técnico Backend NodeJS

Este é um projeto backend em **NestJS** com **TypeORM** e banco de dados SQL, que permite a importação de boletos 
condominiais via arquivos CSV e PDF, bem como a geração de relatórios em PDF.

---

## Tecnologias Utilizadas

- NodeJS + NestJS
- TypeScript
- PostgreSQL (mas pode ser adaptado)
- TypeORM
- pdf-lib / pdfkit / get-stream
- Multer para upload de arquivos

---

## Instalação

```bash
# 1. Instale as dependências
npm install

# 2. Configure o banco de dados no arquivo .env

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=senha
DB_DATABASE=database

# 3. Rode as migrations (se tiver)
npm run start:dev
```

---

## Endpoints Disponíveis

### `/boletos`

| Método | Rota                      | Descrição                                                              
|--------|---------------------------|--------------------------------------------------------------------------
| POST   | `/boletos`                | Cria um boleto manualmente                                              
| GET    | `/boletos`                | Lista todos os boletos (com filtros)                                    
| GET    | `/boletos?relatorio=1`    | Gera um PDF em base64 com os boletos filtrados                          
| GET    | `/boletos?nome=...&valor_inicial=...&valor_final=...&id_lote=...` | Filtra boletos com base nos parâmetros                                

### `/lotes`

| Método | Rota             | Descrição                                
|--------|------------------|-------------------------------------------
| POST   | `/lotes`         | Cria um novo lote                          
| GET    | `/lotes`         | Lista todos os lotes                      
| GET    | `/lotes/:id`     | Busca um lote pelo ID                     
| PATCH  | `/lotes/:id`     | Atualiza um lote                          
| DELETE | `/lotes/:id`     | Deleta um lote                            

### `/importacoes`

| Método | Rota                              | Descrição                                                                      
|--------|-----------------------------------|----------------------------------------------------------------------------------
| POST   | `/importacoes`                    | Cria uma importação manual                                                     
| POST   | `/importacoes/importar-csv`       | Faz upload de um `.csv` com os boletos                                          
| POST   | `/importacoes/importar-pdf`       | Recebe um PDF com várias páginas e divide em arquivos individuais por boleto     
| GET    | `/importacoes`                    | Lista todas as importações                                                   
| GET    | `/importacoes?relatorio=1`        | Gera um relatório de boletos importados em PDF (base64)                        
| GET    | `/importacoes/:id`                | Busca uma importação específica pelo ID                                      

---

## Como Testar

1. Antes de importar o CSV, é obrigatório cadastrar os lotes (com nome no formato 0017, 0018, etc).
rota: /lote
body: 
{
  "name": "0017"
}

2. Faça upload do arquivo CSV em `/importacoes/importar-csv` usando Postman ou Insomnia.
3. Faça upload do arquivo PDF com os boletos em `/importacoes/importar-pdf`.
4. Visualize os boletos via GET `/boletos` ou gere um relatório com `/boletos?relatorio=1`.
5. Gerar Relatório em PDF (Base64) (Bom, ao gerar, o pdf com base64, voce pode testá-lo no seguinte site: https://base64.guru/converter/decode/pdf,
    ou pode criar um arquivo (main.js) e colar o seguinte código: 

      # const fs = require('fs');

      # const base64String = 'cole o pdf';

      # const buffer = Buffer.from(base64String, 'base64');

      # fs.writeFileSync('relatorio_boletos.pdf', buffer);

    ) 

  6. Na pasta uploads, eu deixei um csv e um pdf para teste (Apenas tome cuidado com o id, para nao ocasionar error)

---

## Observações Importantes

- O sistema realiza o mapeamento de unidades (ex: 17, 18...) para lotes internos (ex: 0017, 0018...) automaticamente.
- O PDF enviado é dividido página a página e nomeado conforme o ID do boleto correspondente.
- O relatório gerado em PDF é retornado em base64 no formato JSON.

---


