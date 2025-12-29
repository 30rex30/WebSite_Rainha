
        document.addEventListener('DOMContentLoaded', function() {
           
            const header = document.querySelector('.header');
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

          
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      
                        entry.target.classList.add('animated');
                        
                       
                        if (entry.target.classList.contains('feature-card')) {
                            const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                            entry.target.style.animationDelay = `${(index + 1) * 0.1}s`;
                        }
                    }
                });
            }, observerOptions);

            
            const elementsToAnimate = document.querySelectorAll('.text-group, .feature-card, .lead, .cta-section');
            
            elementsToAnimate.forEach(element => {
               
                element.style.opacity = '0';
                
               
                observer.observe(element);
            });

            
            const featureCards = document.querySelectorAll('.feature-card');
            featureCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });

           
            const ctaButtons = document.querySelectorAll('.cta-button');
            ctaButtons.forEach(button => {
                button.addEventListener('click', function() {
                    if (this.classList.contains('primary')) {
                        // BOTAO DISOCRD
                        window.open('https://discord.gg/TMRkatVVxy', '_blank');
                    } else if (this.classList.contains('secondary')) {
                        // Por o ip do server 
                        window.location.href = '/index.html';
                    }
                });
            });
        });