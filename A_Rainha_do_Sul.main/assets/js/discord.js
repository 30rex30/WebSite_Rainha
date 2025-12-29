
        const DISCORD_CONFIG = {
          
            BOT_TOKEN: '', 
            CHANNEL_ID: '1435310802398871731', 
            
            
            WEBHOOK_URL: 'https://discord.com/api/webhooks/1438301616162996437/dBMgIGf8NeK5z5-3s9s-cY23p0xo8ug2XloeVmzMDBiEV9uIMA5zujoAFk_oHg2GtFDf',
            
          
            MESSAGE_LIMIT: 10, 
            UPDATE_INTERVAL: 30000 
        };

        let messagesCache = [];

       
        async function fetchDiscordMessages() {
            const refreshButton = document.querySelector('.refresh-button');
            const originalText = refreshButton.innerHTML;
            refreshButton.innerHTML = '<span>Carregando...</span>';

            try {
                updateStatus('connecting', 'Buscando mensagens...');

                
                let messages = await fetchWithBotToken();
                
                
                if (!messages || messages.length === 0) {
                    messages = await fetchWithWebhook();
                }

                if (messages && messages.length > 0) {
                    displayMessages(messages);
                    updateStatus('connected', `Conectado - ${messages.length} mensagens`);
                    
                   
                    checkForNewMessages(messages);
                } else {
                    showErrorMessage('Em Breve . . .');
                }

                refreshButton.innerHTML = originalText;

            } catch (error) {
                console.error('Erro ao buscar mensagens:', error);
                showErrorMessage('Erro ao conectar com o Discord');
                refreshButton.innerHTML = originalText;
            }
        }

        // Método 1: Buscar mensagens usando Bot Token
        async function fetchWithBotToken() {
            if (!DISCORD_CONFIG.BOT_TOKEN || !DISCORD_CONFIG.CHANNEL_ID) {
                console.warn('Bot Token ou Channel ID não configurados');
                return null;
            }

            try {
                const response = await fetch(
                    `https://discord.com/api/v10/channels/${DISCORD_CONFIG.CHANNEL_ID}/messages?limit=${DISCORD_CONFIG.MESSAGE_LIMIT}`,
                    {
                        headers: {
                            'Authorization': `Bot ${DISCORD_CONFIG.BOT_TOKEN}`
                        }
                    }
                );

                if (response.ok) {
                    const messages = await response.json();
                    return processBotMessages(messages);
                } else {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
            } catch (error) {
                console.error('Erro com Bot Token:', error);
                return null;
            }
        }

        // Método 2: Buscar mensagens usando Webhook (leitura)
        async function fetchWithWebhook() {
            if (!DISCORD_CONFIG.WEBHOOK_URL) {
                console.warn('Webhook URL não configurada');
                return null;
            }

            try {
                // Para webhooks, normalmente precisamos de um backend
                // Esta é uma simulação - na prática você precisaria de um servidor
                const response = await fetch('/api/discord-messages', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        webhook: DISCORD_CONFIG.WEBHOOK_URL,
                        limit: DISCORD_CONFIG.MESSAGE_LIMIT
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.messages;
                }
            } catch (error) {
                console.error('Erro com Webhook:', error);
            }

            return null;
        }

        // Processar mensagens do Bot
        function processBotMessages(discordMessages) {
            return discordMessages.reverse().map(msg => ({
                id: msg.id,
                author: msg.author.global_name || msg.author.username,
                avatar: msg.author.avatar ? 
                    `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png` : 
                    getInitials(msg.author.username),
                content: formatDiscordContent(msg.content, msg.embeds),
                timestamp: formatTimestamp(msg.timestamp),
                attachments: msg.attachments.map(att => att.filename)
            }));
        }

        // Formatar conteúdo do Discord
        function formatDiscordContent(content, embeds) {
            let formatted = content;

            // Processar embeds
            if (embeds && embeds.length > 0) {
                embeds.forEach(embed => {
                    if (embed.title) {
                        formatted += `\n\n**${embed.title}**`;
                    }
                    if (embed.description) {
                        formatted += `\n${embed.description}`;
                    }
                });
            }

            return formatted;
        }

        // Formatar timestamp
        function formatTimestamp(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('pt-BR') + ' - ' + date.toLocaleDateString('pt-BR');
        }

        // Obter iniciais para avatar
        function getInitials(username) {
            return username.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        }

        // Verificar por novas mensagens
        function checkForNewMessages(currentMessages) {
            if (messagesCache.length === 0) {
                messagesCache = currentMessages;
                return;
            }

            const newMessages = currentMessages.filter(msg => 
                !messagesCache.some(cached => cached.id === msg.id)
            );

            if (newMessages.length > 0) {
                // Adicionar novas mensagens no topo
                newMessages.reverse().forEach(msg => {
                    addNewMessage(msg);
                });
                messagesCache = currentMessages;
            }
        }

        // Adicionar nova mensagem em tempo real
        function addNewMessage(message) {
            const container = document.getElementById('messagesContainer');
            const messageElement = createMessageElement(message);
            
            container.insertBefore(messageElement, container.firstChild);
            
            // Manter limite de mensagens
            if (container.children.length > DISCORD_CONFIG.MESSAGE_LIMIT) {
                container.removeChild(container.lastChild);
            }

            // Efeito visual para nova mensagem
            messageElement.style.animation = 'fadeIn 0.5s ease-out';
        }

        // Exibir mensagens
        function displayMessages(messages) {
            const container = document.getElementById('messagesContainer');
            container.innerHTML = '';

            if (messages.length === 0) {
                container.innerHTML = '<div class="loading-message">Em Breve.</div>';
                return;
            }

            messages.forEach(message => {
                const messageElement = createMessageElement(message);
                container.appendChild(messageElement);
            });
        }

        // Criar elemento de mensagem
        function createMessageElement(message) {
            const messageElement = document.createElement('div');
            messageElement.className = 'message';
            messageElement.innerHTML = `
                <div class="message-header">
                    <div class="message-avatar" style="${message.avatar.includes('http') ? 
                        `background-image: url('${message.avatar}')` : 
                        ''}">${!message.avatar.includes('http') ? message.avatar : ''}</div>
                    <div>
                        <div class="message-author">${message.author}</div>
                        <div class="message-timestamp">${message.timestamp}</div>
                    </div>
                </div>
                <div class="message-content">${message.content}</div>
                ${message.attachments && message.attachments.length > 0 ? `
                    <div class="message-attachment">
                        ${message.attachments.map(att => 
                            `<div class="attachment">📎 ${att}</div>`
                        ).join('')}
                    </div>
                ` : ''}
            `;
            return messageElement;
        }

        // Atualizar status
        function updateStatus(status, message) {
            const statusDot = document.getElementById('statusDot');
            const statusText = document.getElementById('statusText');
            
            statusDot.className = 'status-dot';
            statusDot.classList.add(`status-${status}`);
            statusText.textContent = message;
        }

        // Mostrar mensagem de erro
        function showErrorMessage(message) {
            const container = document.getElementById('messagesContainer');
            container.innerHTML = `<div class="error-message">${message}</div>`;
            updateStatus('disconnected', 'Desconectado');
        }

        // Inicializar
        document.addEventListener('DOMContentLoaded', function() {
            // Buscar mensagens imediatamente
            fetchDiscordMessages();
            
            // Configurar atualização automática
            setInterval(fetchDiscordMessages, DISCORD_CONFIG.UPDATE_INTERVAL);
            
            // Mostrar configuração necessária se não estiver configurado
            if (!DISCORD_CONFIG.BOT_TOKEN && !DISCORD_CONFIG.WEBHOOK_URL) {
                showErrorMessage(`
                    ⚠️ Configuração necessária:<br>
                    - Adicione o BOT_TOKEN e CHANNEL_ID no código<br>
                    - Ou configure o WEBHOOK_URL
                `);
            }
        });