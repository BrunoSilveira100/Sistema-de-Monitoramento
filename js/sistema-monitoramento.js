/**
 * Sistema de Monitoramento - Implementação dos Padrões Singleton e Factory Method
 * 
 * Este código demonstra:
 * 1. Padrão Singleton para o Gerenciador de Logs (uma única instância)
 * 2. Padrão Factory Method para criar recursos de diferentes provedores de nuvem
 */

// Padrão Singleton - Gerenciador de Logs
class GerenciadorLogs {
    constructor() {
        if (GerenciadorLogs.instancia) {
            return GerenciadorLogs.instancia;
        }
        
        this.logs = [];
        this.arquivoSaida = 'sistema_monitoramento.log';
        GerenciadorLogs.instancia = this;
        
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
        const logEntry = {
            timestamp,
            tipo,
            mensagem,
            nivel,
            id: Date.now()
        };
        
        this.logs.push(logEntry);
        this.atualizarInterface(logEntry);
        
        // Simular escrita em arquivo
        console.log(`[${timestamp}] ${tipo}: ${mensagem}`);
        
        return logEntry;
    }

    atualizarInterface(logEntry) {
        const container = document.getElementById('logContainer');
        
        if (container.innerHTML.includes('Nenhum log registrado')) {
            container.innerHTML = '';
        }
        
        const logElement = document.createElement('div');
        logElement.className = `log-entry ${logEntry.nivel}`;
        logElement.innerHTML = `
            <span class="log-timestamp">${new Date(logEntry.timestamp).toLocaleTimeString()}</span>
            <strong>${logEntry.tipo}:</strong>
            <span class="log-message">${logEntry.mensagem}</span>
        `;
        
        container.insertBefore(logElement, container.firstChild);
        
        // Limitar a quantidade de logs mostrados
        if (container.children.length > 50) {
            container.removeChild(container.lastChild);
        }
    }

    obterLogs() {
        return this.logs;
    }

    limparLogs() {
        this.logs = [];
        document.getElementById('logContainer').innerHTML = '<div class="text-muted">Logs limpos. Nenhum evento registrado...</div>';
        this.registrar('SISTEMA', 'Logs do sistema foram limpos', 'warning');
    }
}

// Padrão Factory Method - Interface para fábricas de recursos
class FabricaRecursos {
    criarInstancia() {
        throw new Error('Método criarInstancia() deve ser implementado pela subclasse');
    }

    criarArmazenamento() {
        throw new Error('Método criarArmazenamento() deve ser implementado pela subclasse');
    }
}

// Fábrica concreta para AWS
class FabricaAWS extends FabricaRecursos {
    criarInstancia() {
        return new InstanciaEC2();
    }

    criarArmazenamento() {
        return new ArmazenamentoS3();
    }
}

// Fábrica concreta para Azure
class FabricaAzure extends FabricaRecursos {
    criarInstancia() {
        return new InstanciaVirtual();
    }

    criarArmazenamento() {
        return new ArmazenamentoBlob();
    }
}

// Produtos abstratos
class InstanciaComputacional {
    constructor() {
        this.tipo = 'Computacional';
        this.status = 'criando';
        this.id = Math.random().toString(36).substr(2, 9);
    }

    iniciar() {
        this.status = 'executando';
        console.log(`${this.constructor.name} iniciada: ${this.id}`);
    }

    parar() {
        this.status = 'parada';
        console.log(`${this.constructor.name} parada: ${this.id}`);
    }
}

class Armazenamento {
    constructor() {
        this.tipo = 'Armazenamento';
        this.status = 'disponivel';
        this.id = Math.random().toString(36).substr(2, 9);
    }

    criar() {
        this.status = 'criado';
        console.log(`${this.constructor.name} criado: ${this.id}`);
    }

    deletar() {
        this.status = 'deletado';
        console.log(`${this.constructor.name} deletado: ${this.id}`);
    }
}

// Produtos concretos para AWS
class InstanciaEC2 extends InstanciaComputacional {
    constructor() {
        super();
        this.provedor = 'AWS';
        this.tipoInstancia = 't2.micro';
        this.sistemaOperacional = 'Amazon Linux 2';
    }

    getDetalhes() {
        return {
            nome: 'EC2 Instance',
            provedor: this.provedor,
            tipo: this.tipoInstancia,
            sistemaOperacional: this.sistemaOperacional,
            id: this.id,
            status: this.status
        };
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
        return {
            nome: 'S3 Bucket',
            provedor: this.provedor,
            classeArmazenamento: this.classeArmazenamento,
            criptografia: this.criptografia,
            id: this.id,
            status: this.status
        };
    }
}

// Produtos concretos para Azure
class InstanciaVirtual extends InstanciaComputacional {
    constructor() {
        super();
        this.provedor = 'Azure';
        this.tamanho = 'Standard_B1s';
        this.imagem = 'Ubuntu Server 20.04 LTS';
    }

    getDetalhes() {
        return {
            nome: 'Virtual Machine',
            provedor: this.provedor,
            tamanho: this.tamanho,
            imagem: this.imagem,
            id: this.id,
            status: this.status
        };
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
        return {
            nome: 'Blob Storage',
            provedor: this.provedor,
            tipoConta: this.tipoConta,
            replicacao: this.replicacao,
            id: this.id,
            status: this.status
        };
    }
}

// Cliente - Sistema que usa as fábricas
class ClienteSistema {
    constructor() {
        this.gerenciadorLogs = GerenciadorLogs.getInstance();
        this.fabrica = null;
        this.recursos = [];
    }

    configurarProvedor(tipoProvedor) {
        switch (tipoProvedor.toLowerCase()) {
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
                armazenamento: armazenamento.getDetalhes()
            };
        } catch (error) {
            this.gerenciadorLogs.registrar('ERRO', `Erro ao criar recursos: ${error.message}`, 'error');
            throw error;
        }
    }

    obterRecursos() {
        return this.recursos.map(recurso => recurso.getDetalhes ? recurso.getDetalhes() : recurso);
    }
}

// Instância global do sistema
let sistema = new ClienteSistema();

// Funções para interface do usuário
function criarRecursos() {
    const provedorSelecionado = document.getElementById('providerSelect').value;
    
    try {
        sistema.configurarProvedor(provedorSelecionado);
        const recursos = sistema.criarRecursos();
        
        if (recursos) {
            atualizarInterfaceRecursos(recursos);
        }
    } catch (error) {
        alert('Erro ao criar recursos: ' + error.message);
    }
}

function atualizarInterfaceRecursos(recursos) {
    const container = document.getElementById('recursosContainer');
    container.innerHTML = '';
    
    // Adicionar instância
    if (recursos.instancia) {
        const instanciaElement = document.createElement('div');
        instanciaElement.className = `recurso-item ${recursos.instancia.provedor.toLowerCase()}`;
        instanciaElement.innerHTML = `
            <div class="recurso-titulo">${recursos.instancia.nome}</div>
            <div class="recurso-detalhes">
                <strong>ID:</strong> ${recursos.instancia.id}<br>
                <strong>Provedor:</strong> ${recursos.instancia.provedor}<br>
                <strong>Status:</strong> ${recursos.instancia.status}<br>
                <strong>Tipo:</strong> ${recursos.instancia.tipoInstancia || recursos.instancia.tamanho}
            </div>
        `;
        container.appendChild(instanciaElement);
    }
    
    // Adicionar armazenamento
    if (recursos.armazenamento) {
        const armazenamentoElement = document.createElement('div');
        armazenamentoElement.className = `recurso-item ${recursos.armazenamento.provedor.toLowerCase()}`;
        armazenamentoElement.innerHTML = `
            <div class="recurso-titulo">${recursos.armazenamento.nome}</div>
            <div class="recurso-detalhes">
                <strong>ID:</strong> ${recursos.armazenamento.id}<br>
                <strong>Provedor:</strong> ${recursos.armazenamento.provedor}<br>
                <strong>Status:</strong> ${recursos.armazenamento.status}<br>
                <strong>Classe:</strong> ${recursos.armazenamento.classeArmazenamento || recursos.armazenamento.tipoConta}
            </div>
        `;
        container.appendChild(armazenamentoElement);
    }
}

function registrarEvento() {
    const mensagem = document.getElementById('eventMessage').value;
    const gerenciador = GerenciadorLogs.getInstance();
    
    if (mensagem.trim()) {
        gerenciador.registrar('USUÁRIO', mensagem, 'info');
        document.getElementById('eventMessage').value = '';
    } else {
        gerenciador.registrar('SISTEMA', 'Tentativa de registrar evento vazio', 'warning');
    }
}

function limparLogs() {
    const gerenciador = GerenciadorLogs.getInstance();
    gerenciador.limparLogs();
}

// Inicialização
window.addEventListener('load', function() {
    // Registrar evento de inicialização
    const gerenciador = GerenciadorLogs.getInstance();
    gerenciador.registrar('SISTEMA', 'Interface carregada e pronta para uso', 'success');
    
    // Adicionar evento de tecla Enter no campo de mensagem
    document.getElementById('eventMessage').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            registrarEvento();
        }
    });
});