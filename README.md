### Stack de Referência
- **Backend**: .NET 8 Web API + EF Core + PostgreSQL  
- **Frontend**: React (Vite) + React Router + React Query  
- **Sem containers**: a conexão é configurada diretamente em `appsettings.json`.  

> É permitido substituir React por Angular/Vue e/ou trocar o ORM, desde que o escopo seja mantido e as decisões sejam explicadas no README. O boilerplate fornecido está em React com JavaScript.  

### Execução Local

#### Banco PostgreSQL
1. Crie um banco local (ex.: `parking_test`) e ajuste a `ConnectionString` em `appsettings.json`, se necessário.  
2. Rode o seed pelo terminal (bash/WSL):  
   ```bash
   psql -h localhost -U postgres -d parking_test -f scripts/seed.sql
   ```  
   Caso utilize Windows sem WSL, execute o script pelo gerenciador de banco de dados de sua preferência (ex.: DBeaver).  

#### Backend
```bash
cd src/backend
dotnet restore
dotnet run
```
A API será iniciada (por padrão) em `http://localhost:5000`. Swagger ativado em `/swagger`.  

#### Frontend
```bash
cd src/frontend
npm install
npm run dev
```
A aplicação ficará disponível em `http://localhost:5173`.  
Configure `VITE_API_URL` caso seja necessário apontar para outra porta.  

### 4.3 Estrutura de Pastas
```
/src/backend        -> API .NET 8
/src/frontend       -> React (Vite)
/scripts/seed.sql   -> Criação e seed do banco
/scripts/exemplo.csv-> CSV de exemplo
```

# Registro Técnico

**Resumo:** Frontend inteiro foi recomponentizado página a página com view-models, backend ganhou validações e histórico de faturas e, por fim, todo o stack passou a rodar via Docker.

## Configurações iniciais
- Para Linting e Formatação, instalei o BiomeJs na raiz do projeto. Não foi setado um arquivo de configuração, portanto o linting e formatação foram feitas com as configurações padrões do Biomejs.
- O `docker-compose.yaml` foi configurado em um primeiro momento apenas para conter o banco postgres. Foi escolhida a versão 17 do postgres por ser uma imagem que eu já tinha instalada no meu ambiente.


## Primeira Tarefa: Tela de Clientes
- A `primeira decisão` foi fazer uma refatoração antes de aplicar as modificações. Isso porque todo o código das páginas estavam todas em um único lugar (arquivo da pagina), tanto a regra de negócio quanto a estilização e estrutura da página. 
  - A refatoração consiste em um processo de componentização. Cada parte da tela se tornou um componente interno da pagina, e a regra de negócio principal foi movida para um arquivo de view-model. Embora tenha se usado o conceito de view-model, não foi de fato aplicada uma arquitetura MVVM, pois não foi configurada no frontend uma camada de modelo. Para essa componentização foi instalada no frontend o `styled-components` para melhorar a consistência visual do projeto. Essa decisão foi tomada 
- Após o processo de componentização, para aplicar a implementação de edição de clientes, a `segunda decisão` foi adicionado um componente de modal com um formulário para melhorar a experiência do usuário.
- A garantia de valores únicos para combinação de Nome + Telefone foram adicionadas tanto no backend quanto no frontend. Essa `terceira decisão` foi feita para evitar erros de validação e evitar duplicados.
  - Assim, o backend garante que o nome e telefone não sejam duplicados, e o frontend garante que o nome e telefone sejam únicos. Validação dupla = mais segurança. Para o uso do formulário no frontend foi instalada a `react-hook-form` para melhorar a consistência visual do projeto e uma melhor usabilidade do formulário.
- Backend agora busca clientes sem diferenciar maiúsculas/minúsculas.
  - Essa `quarta decisão` foi feita para melhorar a experiência do usuário, pois dificultava a busca de clientes quando não digitasse o nome exatamente como ele era
- Backend agora força `Mensalidade = null` para perfis não-mensalistas.
  - Isso para gerar mais consistência na interface do usuário, pois o usuário não precisa preencher a mensalidade para perfis não-mensalistas, e nem precisa ter algo salvo no banco de dados nesse caso.

## Segunda Tarefa: Tela de Veículos
- Tela de veículos segue o mesmo padrão modular: página/índice, componentes de CRUD e `useVeiculosViewModel.js` centralizando chamadas e validações.
- Formulário de edição passa a permitir alterar modelo e ano do veículo, com validação GUI/UX consistente com React Hook Form.
- Styled-components substituem o CSS anterior, garantindo consistência visual com a tela de clientes.

## Terceira Tarefa: Tela de Importação CSV
- Fluxo de upload CSV recebeu a mesma arquitetura (componentes + view-model). Relatório e formulário foram separados em componentes autocontidos, facilitando evolução independente.
- Foi implementado um dashboard dashboard com métricas do processamento ao invés de exibição de um JSON. Com isso o usuário tem uma experiência melhor e mais agradável para a leitura das informações sem ter muito esforço para analisar.
- Adicionados SVGs específicos para cada status (adicionado, duplicado, inválido, erro, processado) para comunicar o resultado ao usuário e melhorar a interface.

## Quarta Tarefa: Tela de Faturamentos
- Backend agora calcula faturas considerando apenas os dias efetivos de vínculo veículo/cliente via nova tabela `VeiculoClienteHistorico`; DTOs e seed SQL foram alinhados à nova regra.
  - Essa decisão foi tomada por ser mais seguro e ter uma melhor auditoria do faturamento. A segunda opção seria, ao invés de implementar uma tabela de histórico, implementar essa informação no próprio veículo. Porém isso daria uma maior complexidade no backend e não seria mais seguro.
- `FaturamentoService` e `FaturasController` passaram a expor o novo modelo de dados e as telas exibem o histórico consolidado.
- Página de faturamentos recebeu redesign completo (componentização + view-model) e a tela de veículos ganhou suporte para alterar o dono do veículo, mantendo o histórico necessário.
- Foi implementado na tela de veículos no formulário de edição um select para alterar o dono do veículo, entrando em conformidade com o que atarefa 2 já pedia.

## Configuração final: Suporte Docker Full-Stack
- Criados `Dockerfile` (backend), `Dockerfile.frontend` e `.dockerignore`, além das alterações necessárias no `docker-compose.yaml` que sobe API, frontend e Postgres prontos para desenvolvimento. Isso para um ambiente de desenvolvimento mais simples e rápido, além de estar pré-configurado para uma possível produção.
- Bug crítico corrigido: `Fatura` agora mantém referência de navegação para `Cliente`, permitindo ao DTO expor o nome sem depender de builds antigos.
- `FaturasController` passou a usar `DateTime.TryParseExact`, evitando erros de split ao rodar dentro dos containers, e o `AppDbContext` foi ajustado para os novos relacionamentos.


