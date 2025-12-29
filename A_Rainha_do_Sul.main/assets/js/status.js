 // Configurações
        const CONFIG = {
            FIVEM_SERVER: 'Discord',
            WEBSITE_URL: window.location.origin,
            DISCORD_INVITE: 'https://discord.gg/TMRkatVVxy',
            UPDATE_INTERVAL: 30000 // 30 segundos
        };

        let statusHistory = [];

        // Função principal para verificar todos os status
        async function checkAllStatus() {
            const refreshBtn = document.getElementById('refresh-btn');
            refreshBtn.classList.add('loading');
            refreshBtn.disabled = true;

            try {
                await Promise.all([
                    checkFiveMStatus(),
                    checkWebsiteStatus(),
                    checkDiscordStatus()
                ]);

                // Atualizar histórico
                updateStatusHistory();
                
                // Atualizar timestamp
                document.getElementById('last-updated').textContent = 
                    `Última atualização: ${new Date().toLocaleTimeString('pt-BR')}`;

                showNotification('Status atualizado com sucesso!', 'success');
            } catch (error) {
                console.error('Erro ao verificar status:', error);
                showNotification('Erro ao atualizar status', 'error');
            } finally {
                refreshBtn.classList.remove('loading');
                setTimeout(() => {
                    refreshBtn.disabled = false;
                }, 5000); // Prevenir spam
            }
        }

        // Verificar status do FiveM
        async function checkFiveMStatus() {
            try {
                // Simulação - em produção, você usaria a API do FiveM
                const isOnline = Math.random() > 0.1; // 90% de chance de estar online
                const players = isOnline ? Math.floor(Math.random() * 50) + 1 : 0;
                
                const statusElement = document.getElementById('fivem-status');
                const infoElement = document.getElementById('fivem-info');
                const playersElement = document.getElementById('players-count');
                
                if (isOnline) {
                    statusElement.className = 'status-indicator status-online';
                    statusElement.innerHTML = '<div class="status-dot"></div><span>Online</span>';
                    infoElement.textContent = 'Servidor operacional';
                    playersElement.textContent = `${players}/64`;
                    
                    // Atualizar detalhes
                    document.getElementById('fivem-version').textContent = '1.0.0';
                    document.getElementById('fivem-uptime').textContent = '99.8%';
                    document.getElementById('fivem-ping').textContent = `${Math.floor(Math.random() * 50) + 20}ms`;
                } else {
                    statusElement.className = 'status-indicator status-offline';
                    statusElement.innerHTML = '<div class="status-dot"></div><span>Offline</span>';
                    infoElement.textContent = 'Servidor indisponível';
                    playersElement.textContent = '0/64';
                    
                    // Limpar detalhes
                    document.getElementById('fivem-version').textContent = '-';
                    document.getElementById('fivem-uptime').textContent = '-';
                    document.getElementById('fivem-ping').textContent = '-';
                }
            } catch (error) {
                console.error('Erro ao verificar FiveM:', error);
                setStatusOffline('fivem-status', 'fivem-info', 'Erro na verificação');
            }
        }

        // Verificar status do Website
        async function checkWebsiteStatus() {
            try {
                const response = await fetch('/', { method: 'HEAD' });
                const statusElement = document.getElementById('website-status');
                const infoElement = document.getElementById('website-info');
                
                if (response.ok) {
                    statusElement.className = 'status-indicator status-online';
                    statusElement.innerHTML = '<div class="status-dot"></div><span>Online</span>';
                    infoElement.textContent = 'Website operacional';
                    
                    // Atualizar detalhes
                    document.getElementById('website-response').textContent = `${Math.floor(Math.random() * 200) + 50}ms`;
                    document.getElementById('website-ssl').textContent = 'Válido';
                } else {
                    throw new Error('Website não respondeu corretamente');
                }
            } catch (error) {
                console.error('Erro ao verificar website:', error);
                setStatusOffline('website-status', 'website-info', 'Website indisponível');
                document.getElementById('website-response').textContent = '-';
                document.getElementById('website-ssl').textContent = '-';
            }
        }

        // Verificar status do Discord
        async function checkDiscordStatus() {
            try {
                // Simulação - em produção, você usaria a API do Discord
                const isOnline = Math.random() > 0.05; // 95% de chance de estar online
                const onlineMembers = isOnline ? Math.floor(Math.random() * 100) + 50 : 0;
                const totalMembers = isOnline ? Math.floor(Math.random() * 500) + 1000 : 0;
                
                const statusElement = document.getElementById('discord-status');
                const infoElement = document.getElementById('discord-info');
                
                if (isOnline) {
                    statusElement.className = 'status-indicator status-online';
                    statusElement.innerHTML = '<div class="status-dot"></div><span>Online</span>';
                    infoElement.textContent = 'Servidor Discord operacional';
                    
                    // Atualizar detalhes
                    document.getElementById('discord-online').textContent = onlineMembers;
                    document.getElementById('discord-total').textContent = totalMembers;
                } else {
                    statusElement.className = 'status-indicator status-offline';
                    statusElement.innerHTML = '<div class="status-dot"></div><span>Offline</span>';
                    infoElement.textContent = 'Servidor Discord indisponível';
                    
                    // Limpar detalhes
                    document.getElementById('discord-online').textContent = '-';
                    document.getElementById('discord-total').textContent = '-';
                }
            } catch (error) {
                console.error('Erro ao verificar Discord:', error);
                setStatusOffline('discord-status', 'discord-info', 'Erro na verificação');
            }
        }

        // Função auxiliar para definir status offline
        function setStatusOffline(statusId, infoId, message) {
            const statusElement = document.getElementById(statusId);
            const infoElement = document.getElementById(infoId);
            
            statusElement.className = 'status-indicator status-offline';
            statusElement.innerHTML = '<div class="status-dot"></div><span>Offline</span>';
            infoElement.textContent = message;
        }

        // Atualizar histórico de status
        function updateStatusHistory() {
            const history = [
                { time: 'Agora', service: 'FiveM', status: document.getElementById('fivem-status').textContent.includes('Online') ? 'Online' : 'Offline' },
                { time: 'Agora', service: 'Website', status: document.getElementById('website-status').textContent.includes('Online') ? 'Online' : 'Offline' },
                { time: 'Agora', service: 'Discord', status: document.getElementById('discord-status').textContent.includes('Online') ? 'Online' : 'Offline' }
            ];

            // Adicionar ao histórico (mantendo apenas últimos 6)
            statusHistory.unshift(...history);
            if (statusHistory.length > 6) {
                statusHistory = statusHistory.slice(0, 6);
            }

            // Atualizar UI
            const historyContainer = document.getElementById('status-history');
            historyContainer.innerHTML = '';

            statusHistory.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <div class="history-time">${item.time}</div>
                    <div class="history-service">${item.service}</div>
                    <div class="history-status ${item.status === 'Online' ? 'status-online' : 'status-offline'}">
                        ${item.status}
                    </div>
                `;
                historyContainer.appendChild(historyItem);
            });
        }

        // Copiar IP para clipboard
        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('IP copiado para a área de transferência!', 'success');
            }).catch(err => {
                showNotification('Erro ao copiar IP', 'error');
            });
        }

        // Mostrar notificação
        function showNotification(message, type = 'success') {
            // Remover notificações existentes
            const existingNotifications = document.querySelectorAll('.notification');
            existingNotifications.forEach(notification => notification.remove());

            const notification = document.createElement('div');
            notification.className = `notification ${type === 'error' ? 'error' : ''}`;
            notification.textContent = message;
            document.body.appendChild(notification);

            // Remover após 3 segundos
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }

        // Inicializar
        document.addEventListener('DOMContentLoaded', function() {
            // Verificar status imediatamente
            checkAllStatus();
            
            // Configurar atualização automática
            setInterval(checkAllStatus, CONFIG.UPDATE_INTERVAL);
            
            // Adicionar histórico inicial
            updateStatusHistory();
        });


        // Para integração REAL com FiveM API:
        /*
        async function checkRealFiveMStatus() {
            try {
                const response = await fetch(`http://${CONFIG.FIVEM_SERVER}/info.json`);
                const data = await response.json();
                
                // Processar dados reais do FiveM
                document.getElementById('players-count').textContent = `${data.players.length}/${data.vars.sv_maxClients}`;
                document.getElementById('fivem-version').textContent = data.server;
                // ... outros dados
            } catch (error) {
                setStatusOffline('fivem-status', 'fivem-info', 'Servidor offline');
            }
        }
        */