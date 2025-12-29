
        document.addEventListener('DOMContentLoaded', function() {
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

        
            document.querySelectorAll('.terms-section-title, .terms-subsection').forEach(element => {
                observer.observe(element);
            });

         
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

        function acceptTerms() {
           
            alert('Obrigado por aceitar nossos Termos de Serviço! Agora você pode aproveitar totalmente o servidor Rainha do Sul.');
            
           
            const button = document.querySelector('.accept-button');
            button.style.background = 'rgba(76, 157, 120, 0.3)';
            button.style.borderColor = '#4c9d78';
            button.textContent = 'Termos Aceitos ✓';
            button.disabled = true;
        }

   
        window.addEventListener('scroll', function() {
            const sections = document.querySelectorAll('.terms-section-title');
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