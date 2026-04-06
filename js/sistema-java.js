class GerenciadorLogs {
    static instancia = null;

    constructor() {
        this.logs = [];
        this.arquivoSaida = 'sistema_monitoramento.log';
        this.registrar('SISTEMA', 'Gerenciador de Logs inicializado', 'success');
    }

    static getInstance() {
        if (!GerenciadorLogs.instancia) {
            GerenciadorLogs.instancia = new GerenciadorLogs();
        }
        return GerenciadorLogs.instancia;
    }

    registrar(tipo, mensagem, nivel = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] ${tipo}: ${mensagem}`;

        this.logs.unshift({ timestamp, tipo, mensagem, nivel, entry: logEntry });
        this.atualizarInterface(timestamp, tipo, mensagem, nivel);
        console.log(logEntry);
    }

    atualizarInterface(timestamp, tipo, mensagem, nivel) {
        const container = document.getElementById('logContainer');
        if (!container) return;

        if (container.innerHTML.includes('Nenhum log registrado')) {
            container.innerHTML = '';
        }

        const logElement = document.createElement('div');
        logElement.className = `log-entry ${nivel}`;
        logElement.innerHTML = `
            <span class="log-timestamp">${new Date(timestamp).toLocaleTimeString()}</span>
            <strong>${tipo}:</strong>
            <span class="log-message">${mensagem}</span>
        `;

        container.insertBefore(logElement, container.firstChild);

        if (container.children.length > 50) {
            container.removeChild(container.lastChild);
        }
    }

    obterLogs() {
        return this.logs.slice();
    }

    limparLogs() {
        this.logs = [];
        const container = document.getElementById('logContainer');
        if (container) {
            container.innerHTML = '<div class="text-muted">Logs limpos. Nenhum evento registrado...</div>';
        }
        this.registrar('SISTEMA', 'Logs do sistema foram limpos', 'warning');
    }
}

class HashMap {
    constructor() {
        this.map = {};
    }
    put(key, value) {
        this.map[key] = value;
    }
    get(key) {
        return this.map[key];
    }
    toObject() {
        return { ...this.map };
    }
}

// Fábricas
class FabricaAWS {
    criarInstancia() {
        return new InstanciaEC2();
    }
    criarArmazenamento() {
        return new ArmazenamentoS3();
    }
}

class FabricaAzure {
    criarInstancia() {
        return new InstanciaVirtual();
    }
    criarArmazenamento() {
        return new ArmazenamentoBlob();
    }
}

// Classes base
class InstanciaComputacional {
    constructor() {
        this.tipo = 'Computacional';
        this.status = 'criando';
        this.id = this.gerarId();
        this.provedor = '';
    }
    iniciar() {
        this.status = 'executando';
        console.log(`${this.constructor.name} iniciada: ${this.id}`);
    }
    parar() {
        this.status = 'parada';
        console.log(`${this.constructor.name} parada: ${this.id}`);
    }
    getDetalhes() {
        throw new Error('getDetalhes() precisa ser implementado pela subclasse');
    }
    gerarId() {
        return Math.random().toString(36).substring(2, 11);
    }
}

class Armazenamento {
    constructor() {
        this.tipo = 'Armazenamento';
        this.status = 'disponivel';
        this.id = this.gerarId();
        this.provedor = '';
    }
    criar() {
        this.status = 'criado';
        console.log(`${this.constructor.name} criado: ${this.id}`);
    }
    deletar() {
        this.status = 'deletado';
        console.log(`${this.constructor.name} deletado: ${this.id}`);
    }
    getDetalhes() {
        throw new Error('getDetalhes() precisa ser implementado pela subclasse');
    }
    gerarId() {
        return Math.random().toString(36).substring(2, 11);
    }
}

// Produtos concretos AWS
class InstanciaEC2 extends InstanciaComputacional {
    constructor() {
        super();
        this.provedor = 'AWS';
        this.tipoInstancia = 't2.micro';
        this.sistemaOperacional = 'Amazon Linux 2';
    }
    getDetalhes() {
        const detalhes = new HashMap();
        detalhes.put('nome', 'EC2 Instance');
        detalhes.put('provedor', this.provedor);
        detalhes.put('tipo', this.tipoInstancia);
        detalhes.put('sistemaOperacional', this.sistemaOperacional);
        detalhes.put('id', this.id);
        detalhes.put('status', this.status);
        return detalhes;
    }
}

class ArmazenamentoS3 extends Armazenamento {
    constructor() {
        super();
        this.provedor = 'AWS';
        this.classeArmazenamento = 'Standard';
        this.criptografia = 'AES-256';
    }
    getDetalhes() {
        const detalhes = new HashMap();
        detalhes.put('nome', 'S3 Bucket');
        detalhes.put('provedor', this.provedor);
        detalhes.put('classeArmazenamento', this.classeArmazenamento);
        detalhes.put('criptografia', this.criptografia);
        detalhes.put('id', this.id);
        detalhes.put('status', this.status);
        return detalhes;
    }
}

// Produtos concretos Azure
class InstanciaVirtual extends InstanciaComputacional {
    constructor() {
        super();
        this.provedor = 'Azure';
        this.tamanho = 'Standard_B1s';
        this.imagem = 'Ubuntu Server 20.04 LTS';
    }
    getDetalhes() {
        const detalhes = new HashMap();
        detalhes.put('nome', 'Virtual Machine');
        detalhes.put('provedor', this.provedor);
        detalhes.put('tamanho', this.tamanho);
        detalhes.put('imagem', this.imagem);
        detalhes.put('id', this.id);
        detalhes.put('status', this.status);
        return detalhes;
    }
}

class ArmazenamentoBlob extends Armazenamento {
    constructor() {
        super();
        this.provedor = 'Azure';
        this.tipoConta = 'StorageV2';
        this.replicacao = 'LRS';
    }
    getDetalhes() {
        const detalhes = new HashMap();
        detalhes.put('nome', 'Blob Storage');
        detalhes.put('provedor', this.provedor);
        detalhes.put('tipoConta', this.tipoConta);
        detalhes.put('replicacao', this.replicacao);
        detalhes.put('id', this.id);
        detalhes.put('status', this.status);
        return detalhes;
    }
}

class ClienteSistema {
    constructor() {
        this.gerenciadorLogs = GerenciadorLogs.getInstance();
        this.recursos = [];
        this.fabrica = null;
    }

    configurarProvedor(tipoProvedor) {
        switch (String(tipoProvedor).toLowerCase()) {
            case 'aws':
                this.fabrica = new FabricaAWS();
                this.gerenciadorLogs.registrar('CONFIG', 'Provedor configurado: AWS', 'success');
                break;
            case 'azure':
                this.fabrica = new FabricaAzure();
                this.gerenciadorLogs.registrar('CONFIG', 'Provedor configurado: Azure', 'success');
                break;
            default:
                this.gerenciadorLogs.registrar('ERRO', `Provedor desconhecido: ${tipoProvedor}`, 'error');
                throw new Error('Provedor de nuvem não suportado');
        }
    }

    criarRecursos() {
        if (!this.fabrica) {
            this.gerenciadorLogs.registrar('ERRO', 'Nenhum provedor configurado', 'error');
            return null;
        }

        try {
            const instancia = this.fabrica.criarInstancia();
            const armazenamento = this.fabrica.criarArmazenamento();

            instancia.iniciar();
            armazenamento.criar();

            this.recursos.push(instancia, armazenamento);
            this.gerenciadorLogs.registrar('RECURSO', 'Recursos criados com sucesso', 'success');

            return {
                instancia: instancia.getDetalhes(),
                armazenamento: armazenamento.getDetalhes(),
            };
        } catch (error) {
            this.gerenciadorLogs.registrar('ERRO', `Erro ao criar recursos: ${error.message || error}`, 'error');
            throw error;
        }
    }

    obterRecursos() {
        const detalhesRecursos = [];
        for (const recurso of this.recursos) {
            if (recurso instanceof InstanciaComputacional || recurso instanceof Armazenamento) {
                detalhesRecursos.push(recurso.getDetalhes());
            }
        }
        return detalhesRecursos;
    }
}

// Instância global do sistema
const sistema = new ClienteSistema();

// Funções da interface
function criarRecursos() {
    const provedorSelect = document.getElementById('providerSelect');
    if (!provedorSelect) {
        alert('Elemento de seleção de provedor não encontrado');
        return;
    }
    
    const provedorSelecionado = provedorSelect.value;

    try {
        sistema.configurarProvedor(provedorSelecionado);
        const recursos = sistema.criarRecursos();

        if (recursos) {
            atualizarInterfaceRecursos(recursos);
        }
    } catch (error) {
        alert('Erro ao criar recursos: ' + (error.message || error));
    }
}

function atualizarInterfaceRecursos(recursos) {
    const container = document.getElementById('recursosContainer');
    if (!container) return;
    
    container.innerHTML = '';

    // Instância
    if (recursos.instancia) {
        const instanciaElement = document.createElement('div');
        const provedor = recursos.instancia.get('provedor')?.toLowerCase() || '';
        instanciaElement.className = `recurso-item ${provedor}`;
        instanciaElement.innerHTML = `
            <div class="recurso-titulo">${recursos.instancia.get('nome')}</div>
            <div class="recurso-detalhes">
                <strong>ID:</strong> ${recursos.instancia.get('id')}<br>
                <strong>Provedor:</strong> ${recursos.instancia.get('provedor')}<br>
                <strong>Status:</strong> ${recursos.instancia.get('status')}<br>
                <strong>Tipo:</strong> ${recursos.instancia.get('tipo') || recursos.instancia.get('tamanho')}
            </div>
        `;
        container.appendChild(instanciaElement);
    }

    // Armazenamento
    if (recursos.armazenamento) {
        const armazenamentoElement = document.createElement('div');
        const provedor = recursos.armazenamento.get('provedor')?.toLowerCase() || '';
        armazenamentoElement.className = `recurso-item ${provedor}`;
        armazenamentoElement.innerHTML = `
            <div class="recurso-titulo">${recursos.armazenamento.get('nome')}</div>
            <div class="recurso-detalhes">
                <strong>ID:</strong> ${recursos.armazenamento.get('id')}<br>
                <strong>Provedor:</strong> ${recursos.armazenamento.get('provedor')}<br>
                <strong>Status:</strong> ${recursos.armazenamento.get('status')}<br>
                <strong>Classe:</strong> ${recursos.armazenamento.get('classeArmazenamento') || recursos.armazenamento.get('tipoConta')}
            </div>
        `;
        container.appendChild(armazenamentoElement);
    }
}

function registrarEvento() {
    const input = document.getElementById('eventMessage');
    if (!input) return;
    
    const mensagem = input.value.trim();
    const gerenciador = GerenciadorLogs.getInstance();

    if (mensagem) {
        gerenciador.registrar('USUÁRIO', mensagem, 'info');
        input.value = '';
    } else {
        gerenciador.registrar('SISTEMA', 'Tentativa de registrar evento vazio', 'warning');
    }
}

function limparLogs() {
    GerenciadorLogs.getInstance().limparLogs();
}

// Inicialização
window.addEventListener('load', function() {
    const gerenciador = GerenciadorLogs.getInstance();
    gerenciador.registrar('SISTEMA', 'Sistema de monitoramento carregado', 'success');
    
    const input = document.getElementById('eventMessage');
    if (input) {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                registrarEvento();
            }
        });
    }
});