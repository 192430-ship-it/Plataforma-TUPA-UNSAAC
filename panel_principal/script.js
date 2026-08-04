// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos de búsqueda
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const searchBar = document.querySelector('.search-bar');
    
    // Función de búsqueda
    const performSearch = () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            alert(`Buscando: "${searchTerm}"`);
            console.log(`Búsqueda realizada: ${searchTerm}`);
        } else {
            alert('Por favor ingresa un término de búsqueda');
        }
    };
    
    // Evento de búsqueda
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Efecto de focus en la barra de búsqueda
        searchInput.addEventListener('focus', () => {
            searchBar.classList.add('ring');
        });
        
        searchInput.addEventListener('blur', () => {
            searchBar.classList.remove('ring');
        });
    }
    
    // Carrusel de avisos
    const carousel = document.getElementById('carousel');
    const dots = document.querySelectorAll('.dot');
    let currentIndex = 0;
    let autoScrollInterval;
    
    if (carousel && dots.length > 0) {
        // Función para actualizar el dot activo
        const updateActiveDot = () => {
            const scrollPosition = carousel.scrollLeft;
            const cardWidth = carousel.children[0]?.offsetWidth || 0;
            const gap = 24;
            const newIndex = Math.round(scrollPosition / (cardWidth + gap));
            
            dots.forEach((dot, index) => {
                if (index === newIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
            currentIndex = newIndex;
        };
        
        // Scroll manual con dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const cardWidth = carousel.children[0]?.offsetWidth || 0;
                const gap = 24;
                carousel.scrollTo({
                    left: index * (cardWidth + gap),
                    behavior: 'smooth'
                });
            });
        });
        
        // Actualizar dot al hacer scroll
        carousel.addEventListener('scroll', updateActiveDot);
        
        // Arrastrar con mouse
        let isDown = false;
        let startX;
        let scrollLeft;
        
        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            carousel.style.cursor = 'grabbing';
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });
        
        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            carousel.style.cursor = 'grab';
        });
        
        carousel.addEventListener('mouseup', () => {
            isDown = false;
            carousel.style.cursor = 'grab';
        });
        
        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
        
        // Soporte para touch
        carousel.addEventListener('touchstart', (e) => {
            isDown = true;
            startX = e.touches[0].pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
        });
        
        carousel.addEventListener('touchend', () => {
            isDown = false;
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.touches[0].pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });
        
        // Auto-scroll cada 5 segundos
        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                const cardWidth = carousel.children[0]?.offsetWidth || 0;
                const gap = 24;
                let newIndex = currentIndex + 1;
                if (newIndex >= dots.length) {
                    newIndex = 0;
                }
                carousel.scrollTo({
                    left: newIndex * (cardWidth + gap),
                    behavior: 'smooth'
                });
            }, 5000);
        };
        
        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };
        
        carousel.addEventListener('mouseenter', stopAutoScroll);
        carousel.addEventListener('mouseleave', startAutoScroll);
        carousel.addEventListener('touchstart', stopAutoScroll);
        carousel.addEventListener('touchend', startAutoScroll);
        
        startAutoScroll();
    }
    
    // Botón FAB (ayuda)
    const fabBtn = document.getElementById('fabBtn');
    if (fabBtn) {
        fabBtn.addEventListener('click', () => {
            alert('Centro de ayuda - Próximamente disponible\n\nPara emergencias:\n• Soporte Técnico: (084) 123456\n• Email: soporte@unsaac.edu.pe');
        });
    }
    
    // Botones de acción principales
    const btnPrimary = document.querySelector('.btn-primary');
    const btnSecondary = document.querySelector('.btn-secondary');
    
    if (btnPrimary) {
        btnPrimary.addEventListener('click', () => {
            alert('Iniciar nuevo trámite\n\nRedirigiendo al formulario de solicitud...');
        });
    }
    
    if (btnSecondary) {
        btnSecondary.addEventListener('click', () => {
            alert('Consultar expediente\n\nPor favor ingrese su número de expediente o DNI.');
        });
    }
    
    // Enlaces de las tarjetas
    const cardLinks = document.querySelectorAll('.card-link');
    cardLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const cardTitle = link.closest('.card')?.querySelector('h4')?.textContent;
            alert(`Iniciando proceso para: ${cardTitle}\n\nPróximamente disponible.`);
        });
    });
    
    // Botón de perfil
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            window.location.href = '../panel_admin/login.html';
        });
    }
    
    // Navegación móvil
    const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            mobileNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const linkText = link.querySelector('span')?.textContent || '';
            alert(`Navegando a: ${linkText}\n\nSección en construcción.`);
        });
    });
    
    // Links del footer
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert(`Información: ${link.textContent}\n\nPróximamente disponible.`);
        });
    });
    
    // Animación de entrada para elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Aplicar animación inicial
    const animatedElements = document.querySelectorAll('.stat-card, .card, .notice-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        observer.observe(el);
    });
    
    console.log('Portal UNSAAC TUPA - Inicializado correctamente');
});