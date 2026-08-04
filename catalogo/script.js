// Datos de los procedimientos
const procedures = [
    {
        id: 1,
        title: "Expedición de Duplicado de Carné Universitario",
        code: "T-0042",
        category: "academicos",
        categoryName: "ACADÉMICOS",
        cost: "S/ 35.00",
        time: "5 días hábiles",
        silence: "Positivo",
        silenceType: "positive"
    },
    {
        id: 2,
        title: "Otorgamiento de Grado Académico de Bachiller",
        code: "T-0158",
        category: "grados",
        categoryName: "GRADOS",
        cost: "S/ 450.00",
        time: "30 días hábiles",
        silence: "Negativo",
        silenceType: "negative"
    },
    {
        id: 3,
        title: "Reserva de Matrícula para Estudiantes de Pregrado",
        code: "T-0012",
        category: "matricula",
        categoryName: "MATRÍCULA",
        cost: "Gratuito",
        time: "48 horas",
        silence: "Automático",
        silenceType: "automatic",
        isFree: true
    },
    {
        id: 4,
        title: "Constancia de No Adeudo a la Biblioteca",
        code: "T-0022",
        category: "constancias",
        categoryName: "CONSTANCIAS",
        cost: "S/ 5.00",
        time: "Inmediato",
        silence: "Automático",
        silenceType: "automatic"
    },
    {
        id: 5,
        title: "Traslado Externo Nacional o Internacional",
        code: "T-0089",
        category: "academicos",
        categoryName: "ACADÉMICOS",
        cost: "S/ 280.00",
        time: "15 días hábiles",
        silence: "Positivo",
        silenceType: "positive"
    },
    {
        id: 6,
        title: "Certificado de Estudios",
        code: "T-0034",
        category: "constancias",
        categoryName: "CONSTANCIAS",
        cost: "S/ 15.00",
        time: "3 días hábiles",
        silence: "Positivo",
        silenceType: "positive"
    },
    {
        id: 7,
        title: "Solicitud de Becas y Créditos Educativos",
        code: "T-0076",
        category: "pagos",
        categoryName: "PAGOS",
        cost: "Gratuito",
        time: "15 días hábiles",
        silence: "Negativo",
        silenceType: "negative",
        isFree: true
    },
    {
        id: 8,
        title: "Convalidación de Asignaturas",
        code: "T-0051",
        category: "academicos",
        categoryName: "ACADÉMICOS",
        cost: "S/ 120.00",
        time: "10 días hábiles",
        silence: "Positivo",
        silenceType: "positive"
    },
    {
        id: 9,
        title: "Duplicado de Diploma de Grado",
        code: "T-0163",
        category: "grados",
        categoryName: "GRADOS",
        cost: "S/ 180.00",
        time: "20 días hábiles",
        silence: "Negativo",
        silenceType: "negative"
    },
    {
        id: 10,
        title: "Carnet Universitario Digital",
        code: "T-0099",
        category: "otros",
        categoryName: "OTROS",
        cost: "Gratuito",
        time: "24 horas",
        silence: "Automático",
        silenceType: "automatic",
        isFree: true
    },
    {
        id: 11,
        title: "Solicitud de Traslado Interno",
        code: "T-0067",
        category: "matricula",
        categoryName: "MATRÍCULA",
        cost: "S/ 95.00",
        time: "10 días hábiles",
        silence: "Positivo",
        silenceType: "positive"
    },
    {
        id: 12,
        title: "Constancia de Egresado",
        code: "T-0028",
        category: "constancias",
        categoryName: "CONSTANCIAS",
        cost: "S/ 25.00",
        time: "2 días hábiles",
        silence: "Automático",
        silenceType: "automatic"
    }
];

// Función para obtener la clase del valor de silencio
function getSilenceClass(silenceType) {
    switch(silenceType) {
        case 'positive': return 'positive';
        case 'negative': return 'negative';
        case 'automatic': return 'automatic';
        default: return '';
    }
}

// Función para obtener el ícono del detalle
function getDetailIcon(detailType) {
    switch(detailType) {
        case 'cost': return '💰';
        case 'time': return '⏰';
        case 'silence': return '🔕';
        default: return '📌';
    }
}

// Función para renderizar los procedimientos
function renderProcedures(filterCategory = 'all', searchTerm = '') {
    const grid = document.getElementById('proceduresGrid');
    const resultsContainer = document.getElementById('resultsContainer');
    if (!grid) return;
    
    // Filtrar procedimientos
    let filtered = procedures;
    
    if (filterCategory !== 'all') {
        filtered = filtered.filter(p => p.category === filterCategory);
    }
    
    if (searchTerm && searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase().trim();
        filtered = filtered.filter(p => 
            p.title.toLowerCase().includes(term) || 
            p.code.toLowerCase().includes(term)
        );
    }
    
    // Limpiar grid
    grid.innerHTML = '';
    
    // Mostrar contador de resultados
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="results-count">
                📋 Se encontraron ${filtered.length} trámite${filtered.length !== 1 ? 's' : ''}
            </div>
        `;
    }
    
    // Si no hay resultados, mostrar tarjeta de ayuda
    if (filtered.length === 0) {
        const helpCard = document.createElement('div');
        helpCard.className = 'help-card';
        helpCard.innerHTML = `
            <div class="help-icon">🔍</div>
            <h4>¿No encuentras el trámite?</h4>
            <p>Utiliza nuestro buscador avanzado o solicita asistencia.</p>
            <button class="help-btn" id="contactSupport">📞 Contactar Soporte</button>
        `;
        grid.appendChild(helpCard);
        
        const supportBtn = document.getElementById('contactSupport');
        if (supportBtn) {
            supportBtn.addEventListener('click', () => {
                alert('Centro de ayuda UNSAAC\n\n📞 Teléfono: (084) 123456\n📧 Email: soporte@unsaac.edu.pe\n📍 Ubicación: Campus Perayoc - Oficina de Modernización\n🕒 Horario: Lunes a Viernes 8am - 4pm');
            });
        }
        return;
    }
    
    // Renderizar cada procedimiento como card
    filtered.forEach((proc, index) => {
        const card = document.createElement('div');
        card.className = 'procedure-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        card.innerHTML = `
            <div class="card-category">${proc.categoryName}</div>
            <div class="procedure-code">Cód. ${proc.code}</div>
            <h4 class="procedure-title">${proc.title}</h4>
            <div class="procedure-details">
                <div class="detail-item">
                    <span class="detail-icon">💰</span>
                    <span class="detail-text">
                        Costo: <strong ${proc.isFree ? 'class="free"' : ''}>${proc.cost}</strong>
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">⏰</span>
                    <span class="detail-text">
                        Tiempo: <strong>${proc.time}</strong>
                    </span>
                </div>
                <div class="detail-item">
                    <span class="detail-icon">🔕</span>
                    <span class="detail-text">
                        Silencio: <strong class="${getSilenceClass(proc.silenceType)}">${proc.silence}</strong>
                    </span>
                </div>
            </div>
            <button class="start-btn" data-id="${proc.id}" data-title="${proc.title}">
                Iniciar Trámite
                <span>→</span>
            </button>
        `;
        grid.appendChild(card);
    });
    
    // Agregar eventos a los botones de inicio
    document.querySelectorAll('.start-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const title = btn.getAttribute('data-title');
            alert(`✅ Iniciando trámite: "${title}"\n\nSerás redirigido al formulario de solicitud.\n\n📌 Requisitos:\n• Documento de identidad\n• Pago de tasa (si aplica)\n• Formulario de solicitud`);
        });
    });
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Renderizar todos los procedimientos
    renderProcedures();
    
    // Búsqueda en tiempo real
    const searchInput = document.getElementById('searchInput');
    let currentCategory = 'all';
    let debounceTimer;
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                renderProcedures(currentCategory, e.target.value);
            }, 300);
        });
    }
    
    // Filtros de categoría
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Actualizar clase activa
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Obtener categoría
            const category = btn.getAttribute('data-category');
            currentCategory = category;
            
            // Filtrar
            renderProcedures(category, searchInput ? searchInput.value : '');
        });
    });
    
    // Navegación móvil
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            mobileLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const linkText = link.querySelector('span:last-child')?.textContent || '';
            alert(`🚀 Navegando a: ${linkText}\n\nEsta sección está en desarrollo.\nPróximamente disponible.`);
        });
    });
    
    // Links del footer
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.textContent;
            alert(`📄 ${page}\n\nInformación disponible próximamente.\n\nPara más información:\n📞 Central UNSAAC: (084) 123456`);
        });
    });
    
    // Botón de perfil
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            window.location.href = '../panel_admin/login.html';
        });
    }
    
    console.log('📋 Catálogo UNSAAC TUPA - Inicializado correctamente');
    console.log(`📊 Total de trámites disponibles: ${procedures.length}`);
});