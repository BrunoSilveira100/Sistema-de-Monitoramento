<<<<<<< HEAD
# Sistema de Monitoramento - Padrões de Desenvolvimento de Software

## Descrição do Projeto

Este projeto implementa um sistema de monitoramento que demonstra o uso de dois padrões de desenvolvimento de software fundamentais: **Singleton** e **Factory Method**. O sistema simula a criação de recursos em diferentes provedores de nuvem (AWS e Azure) com um gerenciador de logs centralizado.

**✅ Implementação em Java (sintaxe Java para web)**

## Padrões Implementados

### 1. Padrão Singleton
- **Aplicação**: Gerenciador de Logs
- **Objetivo**: Garantir que apenas uma instância do gerenciador de logs exista durante toda a execução do sistema
- **Benefícios**: 
  - Consistência nos logs
  - Economia de recursos
  - Linha de tempo única de eventos

### 2. Padrão Factory Method
- **Aplicação**: Criação de recursos de nuvem
- **Objetivo**: Permitir a criação de instâncias específicas para cada provedor de nuvem sem modificar o código cliente
- **Benefícios**:
  - Facilidade para adicionar novos provedores
  - Código desacoplado
  - Reutilização de componentes

## Funcionalidades

### Interface Web
- **Seleção de Provedor**: Interface para escolher entre AWS e Azure
- **Criação de Recursos**: Botão para criar instâncias e armazenamento no provedor selecionado
- **Gerenciamento de Logs**: Interface para registrar eventos e visualizar logs do sistema
- **Visualização de Recursos**: Exibição dos recursos criados com detalhes específicos

### Recursos Suportados

#### AWS
- **Instância EC2**: Máquina virtual com configurações t2.micro
- **Armazenamento S3**: Bucket com criptografia AES-256

#### Azure
- **Virtual Machine**: Máquina virtual com configurações Standard_B1s
- **Blob Storage**: Armazenamento de objetos com replicação LRS

## Estrutura do Projeto

```
/
├── index.html              # Página principal com interface do usuário
├── css/
│   └── style.css          # Estilos e layout responsivo
├── js/
│   └── sistema-monitoramento.js  # Lógica dos padrões de software
└── README.md              # Documentação do projeto
```

## Como Usar

### 1. Abrir o Sistema
- Abra o arquivo `index.html` em um navegador web moderno

### 2. Selecionar Provedor
- Escolha entre AWS ou Azure no dropdown de provedores

### 3. Criar Recursos
- Clique em "Criar Recursos" para gerar instâncias e armazenamento
- Os recursos criados aparecerão na seção "Recursos Criados"

### 4. Gerenciar Logs
- Digite mensagens personalizadas e clique em "Registrar Evento"
- Visualize todos os eventos do sistema na área de logs
- Use "Limpar Logs" para remover todos os registros

## Exemplos de Uso

### Registrar Evento Personalizado
1. Digite "Sistema iniciado com sucesso" no campo de mensagem
2. Clique em "Registrar Evento"
3. O evento aparecerá nos logs com timestamp e identificação

### Criar Recursos AWS
1. Selecione "Amazon Web Services (AWS)" no dropdown
2. Clique em "Criar Recursos"
3. Verifique os detalhes da EC2 e S3 criados

### Criar Recursos Azure
1. Selecione "Microsoft Azure" no dropdown
2. Clique em "Criar Recursos"
3. Verifique os detalhes da VM e Blob Storage criados

## Demonstração dos Padrões

### Singleton em Ação
- Todos os eventos de log são registrados na mesma instância
- Mesmo após criar múltiplos recursos, há apenas um gerenciador de logs

### Factory Method em Ação
- O sistema cria diferentes tipos de recursos baseado no provedor selecionado
- A interface do usuário não precisa saber os detalhes de implementação de cada provedor

## Tecnologias Utilizadas

- **HTML5**: Estrutura da interface
- **CSS3**: Estilização e layout responsivo
- **Java (sintaxe para web)**: Implementação dos padrões de software
- **Bootstrap 5**: Framework CSS para interface moderna

## Próximos Passos Sugeridos

1. **Adicionar mais provedores**: Implementar Google Cloud Platform, DigitalOcean
2. **Expandidr tipos de recursos**: Adicionar bancos de dados, redes, balanceadores
3. **Implementar persistência**: Adicionar armazenamento local dos logs
4. **Adicionar autenticação**: Sistema de login para diferentes usuários
5. **Dashboard com estatísticas**: Visualizar métricas dos recursos criados
6. **Exportação de logs**: Permitir download dos logs em formato CSV ou JSON

## Notas de Desenvolvimento

- O código foi projetado para ser de fácil leitura e compreensão
- Comentários explicam os conceitos dos padrões de software
- A interface é responsiva e funciona em dispositivos móveis
- Todos os logs incluem timestamp para rastreabilidade completa

