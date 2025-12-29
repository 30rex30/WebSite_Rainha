// Configurações iniciais de cookies
        let cookiePreferences = {
            necessary: true, // Sempre true (obrigatório)
            preferences: true,
            analytics: true,
            marketing: false
        };

        // Carregar preferências salvas
        function loadCookiePreferences() {
            const saved = localStorage.getItem('cookiePreferences');
            if (saved) {
                cookiePreferences = JSON.parse(saved);
                updateToggleSwitches();
            }
        }

        // Atualizar switches com as preferências
        function updateToggleSwitches() {
            document.getElementById('preferences-cookies').checked = cookiePreferences.preferences;
            document.getElementById('analytics-cookies').checked = cookiePreferences.analytics;
            document.getElementById('marketing-cookies').checked = cookiePreferences.marketing;
        }

        // Salvar preferências
        function saveCookiePreferences() {
            cookiePreferences.preferences = document.getElementById('preferences-cookies').checked;
            cookiePreferences.analytics = document.getElementById('analytics-cookies').checked;
            cookiePreferences.marketing = document.getElementById('marketing-cookies').checked;
            
            localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
            localStorage.setItem('cookiesAccepted', 'true');
            
            showNotification('Preferências de cookies salvas com sucesso!', 'success');
        }

        // Aceitar todos os cookies
        function acceptAllCookies() {
            cookiePreferences.preferences = true;
            cookiePreferences.analytics = true;
            cookiePreferences.marketing = true;
            
            localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
            localStorage.setItem('cookiesAccepted', 'true');
            
            updateToggleSwitches();
            showNotification('Todos os cookies foram aceitos!', 'success');
        }

        // Rejeitar todos os cookies (exceto necessários)
        function rejectAllCookies() {
            cookiePreferences.preferences = false;
            cookiePreferences.analytics = false;
            cookiePreferences.marketing = false;
            
            localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences));
            localStorage.setItem('cookiesAccepted', 'true');
            
            updateToggleSwitches();
            showNotification('Cookies não essenciais foram rejeitados.', 'info');
        }

        // Mostrar notificação
        function showNotification(message, type) {
            // Criar elemento de notificação
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: ${type === 'success' ? 'rgba(76, 157, 120, 0.9)' : 'rgba(157, 76, 144, 0.9)'};
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                z-index: 10000;
                max-width: 300px;
                backdrop-filter: blur(10px);
                border: 1px solid ${type === 'success' ? '#4c9d78' : '#9d4c90'};
                animation: slideIn 0.3s ease;
            `;
            
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // Remover após 3 segundos
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Animação de scroll
        document.addEventListener('DOMContentLoaded', function() {
            loadCookiePreferences();
            
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, observerOptions);

            // Observar elementos para animação
            document.querySelectorAll('.cookies-section-title, .cookies-subsection').forEach(element => {
                observer.observe(element);
            });

            // Smooth scroll para links do índice
            document.querySelectorAll('.toc-list a').forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        });

        // Adicionar estilos CSS para animações
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        // Marcar seção atual no scroll
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('.cookies-section-title');
            const navLinks = document.querySelectorAll('.toc-list a');
            
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - 150) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                    link.style.color = '#ff8eff';
                } else {
                    link.style.color = '#cccccc';
                }
            });
        });