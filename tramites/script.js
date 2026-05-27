// Datos de simulación para validación
const usuariosDB = {
    "12345678": {
        nombres: "MARIA FERNANDA QUISPE MAMANI",
        facultad: "FACULTAD DE INGENIERÍA ELÉCTRICA, ELECTRÓNICA, INFORMÁTICA Y MECÁNICA",
        correo: "maria.quispe@unsaac.edu.pe"
    },
    "87654321": {
        nombres: "JUAN CARLOS PEREZ GONZALES",
        facultad: "FACULTAD DE CIENCIAS CONTABLES Y FINANCIERAS",
        correo: "juan.perez@unsaac.edu.pe"
    },
    "20241234": {
        nombres: "ANA LUCIA HUAMAN CCORIHUAMAN",
        facultad: "FACULTAD DE CIENCIAS DE LA SALUD",
        correo: "ana.huaman@unsaac.edu.pe"
    }
};

// Elementos del DOM
const searchBtn = document.getElementById('searchBtn');
const documentoInput = document.getElementById('documento');
const nombresInput = document.getElementById('nombres');
const facultadInput = document.getElementById('facultad');
const correoInput = document.getElementById('correo');
const validationMsg = document.getElementById('validationMsg');
const cancelBtn = document.getElementById('cancelBtn');
const nextBtn = document.getElementById('nextBtn');
const tipoUsuario = document.getElementById('tipoUsuario');

// Función de búsqueda/validación
function buscarDocumento() {
    const documento = documentoInput.value.trim();
    
    if (!documento) {
        alert('Por favor ingrese un código universitario o DNI');
        return;
    }
    
    // Mostrar loading
    const originalText = searchBtn.innerHTML;
    searchBtn.innerHTML = '⏳';
    searchBtn.disabled = true;
    
    // Simular búsqueda en API
    setTimeout(() => {
        const usuario = usuariosDB[documento];
        
        if (usuario) {
            // Autocompletar campos
            nombresInput.value = usuario.nombres;
            facultadInput.value = usuario.facultad;
            correoInput.value = usuario.correo;
            
            // Mostrar mensaje de validación
            validationMsg.classList.remove('hidden');
            
            // Efecto visual de éxito
            searchBtn.style.backgroundColor = '#2e7d32';
            searchBtn.innerHTML = '✓';
            
            setTimeout(() => {
                searchBtn.style.backgroundColor = '#0060a8';
                searchBtn.innerHTML = '🔍';
                searchBtn.disabled = false;
            }, 1500);
        } else {
            alert('Documento no encontrado. Por favor verifique su código o DNI.');
            searchBtn.style.backgroundColor = '#c62828';
            searchBtn.innerHTML = '✗';
            
            setTimeout(() => {
                searchBtn.style.backgroundColor = '#0060a8';
                searchBtn.innerHTML = '🔍';
                searchBtn.disabled = false;
            }, 1500);
        }
    }, 1000);
}

// Función para limpiar el formulario
function limpiarFormulario() {
    if (confirm('¿Está seguro que desea cancelar el registro? Se perderán los datos ingresados.')) {
        documentoInput.value = '';
        nombresInput.value = '';
        facultadInput.value = '';
        correoInput.value = '';
        document.getElementById('telefono').value = '';
        tipoUsuario.value = 'estudiante';
        validationMsg.classList.add('hidden');
    }
}

// Función para siguiente paso
function siguientePaso() {
    const documento = documentoInput.value.trim();
    const nombres = nombresInput.value.trim();
    const correo = correoInput.value.trim();
    
    if (!documento) {
        alert('Por favor ingrese y valide su código universitario o DNI');
        return;
    }
    
    if (!nombres || nombres === '---') {
        alert('Por favor valide su documento de identidad primero');
        return;
    }
    
    if (!correo) {
        alert('Por favor ingrese su correo institucional');
        return;
    }
    
    // Simular siguiente paso
    alert(`✅ Datos validados correctamente\n\nRedirigiendo al paso 2: Selección de Trámite\n\nUsuario: ${nombres}\nTipo: ${tipoUsuario.options[tipoUsuario.selectedIndex].text}`);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Botón de búsqueda
    if (searchBtn) {
        searchBtn.addEventListener('click', buscarDocumento);
    }
    
    // Enter en el campo de documento
    if (documentoInput) {
        documentoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                buscarDocumento();
            }
        });
    }
    
    // Botón cancelar
    if (cancelBtn) {
        cancelBtn.addEventListener('click', limpiarFormulario);
    }
    
    // Botón siguiente
    if (nextBtn) {
        nextBtn.addEventListener('click', siguientePaso);
    }
    
    // Navegación móvil
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            mobileLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Links del footer
    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert(`📄 ${link.textContent}\n\nInformación disponible próximamente.`);
        });
    });
    
    // Sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Botón de perfil
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            alert('🔐 Sistema de autenticación UNSAAC\n\nPor favor ingrese sus credenciales.');
        });
    }
    
    console.log('📋 Formulario TUPA - Inicializado correctamente');
});