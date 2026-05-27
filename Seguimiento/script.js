// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Botón de Subsanar
    const subsanarBtn = document.getElementById('subsanarBtn');
    if (subsanarBtn) {
        subsanarBtn.addEventListener('click', function() {
            alert('📋 Subsanación de Observación\n\nExpediente #2024-00452\n\nPor favor, prepare los siguientes documentos:\n• Fotografía actualizada (fondo blanco, sin lentes)\n• Formulario de subsanación\n\nSerá redirigido al formulario de carga de documentos.');
        });
    }
    
    // Botón de Subir Fotografía
    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            alert('📸 Subir Fotografía\n\nFormatos aceptados: JPG, PNG\nTamaño máximo: 2MB\nFondo blanco, sin lentes, ropa formal.\n\nSeleccione el archivo desde su dispositivo.');
        });
    }
    
    // Botones de descarga de documentos
    const downloadBtns = document.querySelectorAll('.doc-download');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            alert('⬇️ Descargando documento\n\nEl archivo se descargará en breve.');
        });
    });
    
    // Botón Ver Todos los Anexos
    const viewAllBtn = document.querySelector('.btn-outline');
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', function() {
            alert('📁 Todos los Anexos\n\nDocumentos disponibles:\n• Solicitud TUPA.pdf\n• Cargo de Recepción.pdf\n• DNI del solicitante\n• Constancia de pago\n• Fotografía actualizada (pendiente)\n• Resolución Final (pendiente)');
        });
    }
    
    // Navegación del sidebar
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const linkText = this.querySelector('span:last-child')?.textContent || '';
            if (linkText !== 'Mis Trámites') {
                alert(`🚀 Navegando a: ${linkText}\n\nEsta sección está en desarrollo.`);
            }
        });
    });
    
    // Navegación del header
    const headerLinks = document.querySelectorAll('header nav a');
    headerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            headerLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const linkText = this.textContent;
            if (linkText !== 'Mis Trámites') {
                alert(`🚀 Navegando a: ${linkText}\n\nEsta sección está en desarrollo.`);
            }
        });
    });
    
    // Navegación móvil
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            mobileLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const linkText = this.querySelector('span:last-child')?.textContent || '';
            alert(`🚀 Navegando a: ${linkText}\n\nEsta sección está en desarrollo.`);
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
    
    // Botón de perfil
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function() {
            alert('🔐 Sistema de autenticación UNSAAC\n\nUsuario: María Fernández\n\nCerrar sesión | Mi perfil | Configuración');
        });
    }
    
    console.log('📊 Dashboard de Seguimiento - Inicializado correctamente');
});