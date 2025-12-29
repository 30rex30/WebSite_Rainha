document.addEventListener('DOMContentLoaded', function() {
            const faqItems = document.querySelectorAll('.faq-item');
            const categoryBtns = document.querySelectorAll('.category-btn');
            const searchInput = document.getElementById('searchInput');
            const noResults = document.getElementById('noResults');

          
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                question.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                 
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    
                  
                    if (!isActive) {
                        item.classList.add('active');
                    }
                });
            });

          
            categoryBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const category = btn.getAttribute('data-category');
                    
                   
                    categoryBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    
                   
                    filterFAQs(category, searchInput.value);
                });
            });

     
            searchInput.addEventListener('input', () => {
                const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
                filterFAQs(activeCategory, searchInput.value);
            });

            function filterFAQs(category, searchTerm) {
                let visibleCount = 0;
                
                faqItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    const questionText = item.querySelector('.question-text').textContent.toLowerCase();
                    const answerText = item.querySelector('.faq-answer').textContent.toLowerCase();
                    const searchLower = searchTerm.toLowerCase();
                    
                    const categoryMatch = category === 'all' || itemCategory === category;
                    const searchMatch = !searchTerm || 
                        questionText.includes(searchLower) || 
                        answerText.includes(searchLower);
                    
                    if (categoryMatch && searchMatch) {
                        item.style.display = 'block';
                        visibleCount++;
                    } else {
                        item.style.display = 'none';
                    }
                });
                
          
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            }

           
            if (faqItems.length > 0) {
                faqItems[0].classList.add('active');
            }
        });

        function openDiscord() {
            window.open('https://discord.gg/rainhadosul', '_blank');
        }

        function openTicket() {
        
            alert('Redirecionando para o sistema de tickets...');
    
        }

        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

    
        document.querySelectorAll('.faq-item').forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(item);
        });