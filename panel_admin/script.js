// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Botones de acción de la tabla
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const title = this.getAttribute('title') || 'Acción';
            alert(`📋 ${title}\n\nProcesando acción sobre el expediente.`);
        });
    });
    
    // Filas de la tabla
    const tableRows = document.querySelectorAll('.expedients-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('click', function() {
            const expId = this.querySelector('.exp-id')?.textContent || 'EXP-00000';
            alert(`📄 Expediente ${expId}\n\nVer detalles completos del trámite.`);
        });
    });
    
    // Botones de paginación
    const pageBtns = document.querySelectorAll('.page-btn');
    pageBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                pageBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                alert(`📄 Página ${this.textContent}\n\nCargando más expedientes...`);
            }
        });
    });
    
    // Botón de filtro
    const filterBtn = document.querySelector('.filter-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', function() {
            alert('🔽 Filtros\n\nFiltrar por:\n• Prioridad\n• Estado\n• Facultad\n• Fecha');
        });
    }
    
    // Botón de búsqueda
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            alert('🔍 Búsqueda avanzada\n\nBuscar por:\n• N° Expediente\n• DNI del interesado\n• Nombre');
        });
    }
    
    // Botón de menú móvil
    const mobileMenu = document.querySelector('.mobile-menu');
    const sidebar = document.querySelector('.sidebar');
    if (mobileMenu && sidebar) {
        mobileMenu.addEventListener('click', function() {
            if (sidebar.style.display === 'flex' || sidebar.style.display === 'block') {
                sidebar.style.display = 'none';
            } else {
                sidebar.style.display = 'block';
                sidebar.style.position = 'fixed';
                sidebar.style.top = '0';
                sidebar.style.left = '0';
                sidebar.style.width = '280px';
                sidebar.style.height = '100%';
                sidebar.style.zIndex = '100';
                sidebar.style.backgroundColor = '#edeef2';
            }
        });
    }
    
    // Botón de cerrar sesión
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            alert('🚪 Cerrar Sesión\n\n¿Está seguro que desea salir?\n\nSe cerrará su sesión actual.');
        });
    }
    
    // Botones de reportes
    const pdfBtn = document.querySelector('.btn-pdf');
    const excelBtn = document.querySelector('.btn-excel');
    
    if (pdfBtn) {
        pdfBtn.addEventListener('click', function() {
            alert('📄 Generando Reporte PDF\n\nSe descargará el reporte de gestión en formato PDF.');
        });
    }
    
    if (excelBtn) {
        excelBtn.addEventListener('click', function() {
            alert('📊 Exportando a Excel\n\nSe descargará el archivo con los datos de la tabla.');
        });
    }
    
    // Botones de acceso rápido
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.querySelector('span:last-child')?.textContent || 'opción';
            alert(`⚡ Acceso Rápido: ${text}\n\nRedirigiendo a la sección de ${text.toLowerCase()}.`);
        });
    });
    
    // Navegación entre páginas
    const pages = document.querySelectorAll('.page');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a[data-page]');
    const mobileLinks = document.querySelectorAll('.mobile-nav a[data-page]');

    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.toggle('active', page.id === pageId);
        });
    }

    function setActiveLink(pageId) {
        sidebarLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });
        mobileLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageId);
        });
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.dataset.page;
            if (!pageId) return;
            setActiveLink(pageId);
            showPage(pageId);
        });
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.dataset.page;
            if (!pageId) return;
            setActiveLink(pageId);
            showPage(pageId);
        });
    });
    
    // Links del footer
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert(`📄 ${this.textContent}\n\nInformación disponible próximamente.`);
        });
    });
    
    console.log('📊 Dashboard de Gestión - Inicializado correctamente');
});