// ============================================================
// Datos de simulación para validación de usuario (Paso 1)
// ============================================================
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

// ============================================================
// Datos de los tipos de trámite (Paso 2)
// ============================================================
const tiposTramite = [
    {
        id: "inscripcion",
        nombre: "Inscripción / Registro inicial",
        subtitulo: 'Equivalente a "Inscripción del menor de edad", "Inscripción ordinaria DNI"',
        requisitos: [
            "Formulario/ficha con carácter de declaración jurada",
            "Documento de identidad del solicitante",
            "Documento sustentatorio (partida, certificado de estudios, etc.)",
            "Acreditación de domicilio",
            "Fotografía reciente",
            "Comprobante de pago de derechos"
        ],
        unidad: "Área de Admisión / Registro y Matrícula (análoga a \"Sub Gerencia de Procesamiento de Identificación\").",
        baseLegal: "Ley orgánica de la institución + Reglamento interno de inscripción/matrícula."
    },
    {
        id: "credencial",
        nombre: "Emisión de credencial o documento oficial",
        subtitulo: 'Equivalente a "Emisión del DNI/DNIe", "Duplicado"',
        requisitos: [
            "Documento de identidad vigente",
            "Sustento del trámite (pérdida, deterioro, primera emisión)",
            "Fotografía",
            "Pago de derechos"
        ],
        unidad: "Área de Registro / Carnetización (análoga a \"Gerencia de Registros de Identificación\").",
        baseLegal: "Decreto Supremo o Reglamento específico de emisión de documentos."
    },
    {
        id: "rectificacion",
        nombre: "Rectificación / Actualización de datos",
        subtitulo: "Corrección o actualización de información registrada",
        requisitos: [
            "Solicitud simple o declaración jurada",
            "Documento de identidad",
            "Documento que sustenta el cambio (partida, resolución, certificado)",
            "Pago de derechos"
        ],
        unidad: "Área de Registros Académicos / Registros Civiles (análoga a \"Gerencia de Registros Civiles\").",
        baseLegal: "Reglamento de procedimientos administrativos (rectificaciones)."
    },
    {
        id: "certificaciones",
        nombre: "Certificaciones y constancias",
        subtitulo: "Emisión de constancias y certificados diversos",
        requisitos: [
            "Solicitud simple",
            "Documento de identidad",
            "Pago de derechos (sin mayores exigencias documentales)"
        ],
        unidad: "Mesa de Partes / Secretaría General (análoga a \"Sub Gerencia de Certificación\").",
        baseLegal: "Ley de Procedimiento Administrativo General (o su equivalente institucional) + TUPA propio."
    },
    {
        id: "recursos",
        nombre: "Recursos administrativos (reconsideración/apelación)",
        subtitulo: "Impugnación de un acto administrativo previo",
        requisitos: [
            "Escrito fundamentado",
            "Nueva prueba (reconsideración) o cuestión de puro derecho (apelación)",
            "Plazos de presentación (usualmente 15 días hábiles)"
        ],
        unidad: "Misma autoridad que emitió el acto (reconsideración) / autoridad superior jerárquica (apelación).",
        baseLegal: "Ley del Procedimiento Administrativo General."
    },
    {
        id: "transparencia",
        nombre: "Acceso a la información pública / transparencia",
        subtitulo: "Solicitud de información pública institucional",
        requisitos: [
            "Solicitud simple indicando la información requerida",
            "No requiere justificar el motivo"
        ],
        unidad: "Área de Transparencia / Secretaría General.",
        baseLegal: "Ley de Transparencia y Acceso a la Información Pública."
    },
    {
        id: "interoperabilidad",
        nombre: "Servicios de interoperabilidad / convenios institucionales",
        subtitulo: 'Equivalente a "Web services", "Consultas en línea"',
        requisitos: [
            "Convenio previo suscrito con la institución",
            "Pago según lo estipulado en el convenio (sin documentación de usuario final)"
        ],
        unidad: "Área de Tecnología / Sistemas (análoga a \"Gerencia de Tecnología\").",
        baseLegal: "Convenio marco interinstitucional + normativa de protección de datos."
    }
];

// ============================================================
// Estado del formulario
// ============================================================
const estado = {
    pasoActual: 1,
    tramiteSeleccionado: null,
    archivo: null
};

// ============================================================
// Elementos del DOM - Paso 1
// ============================================================
const searchBtn = document.getElementById('searchBtn');
const documentoInput = document.getElementById('documento');
const nombresInput = document.getElementById('nombres');
const facultadInput = document.getElementById('facultad');
const correoInput = document.getElementById('correo');
const telefonoInput = document.getElementById('telefono');
const validationMsg = document.getElementById('validationMsg');
const cancelBtn = document.getElementById('cancelBtn');
const tipoUsuario = document.getElementById('tipoUsuario');
const consentNotif = document.getElementById('consentNotif');
const consentError = document.getElementById('consentError');
const nextBtn1 = document.getElementById('nextBtn1');

// Paso 2
const tramiteList = document.getElementById('tramiteList');
const tramiteError = document.getElementById('tramiteError');
const nextBtn2 = document.getElementById('nextBtn2');

// Paso 3
const archivoInput = document.getElementById('archivoInput');
const fileDropZone = document.getElementById('fileDropZone');
const fileUploadText = document.getElementById('fileUploadText');
const archivoError = document.getElementById('archivoError');
const aclaracionInput = document.getElementById('aclaracion');
const nextBtn3 = document.getElementById('nextBtn3');

// Paso 4
const resumenBox = document.getElementById('resumenBox');
const notifCorreoInst = document.getElementById('notifCorreoInst');
const notifTelefono = document.getElementById('notifTelefono');
const notifCorreoNuevo = document.getElementById('notifCorreoNuevo');
const notifError = document.getElementById('notifError');
const captchaCanvas = document.getElementById('captchaCanvas');
const captchaInput = document.getElementById('captchaInput');
const captchaRefresh = document.getElementById('captchaRefresh');
const captchaError = document.getElementById('captchaError');
let captchaCodigoActual = '';
const limpiarBtn = document.getElementById('limpiarBtn');
const guardarBtn = document.getElementById('guardarBtn');

// Modal
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitulo = document.getElementById('modalTitulo');
const modalSubtitulo = document.getElementById('modalSubtitulo');
const modalRequisitos = document.getElementById('modalRequisitos');
const modalUnidad = document.getElementById('modalUnidad');
const modalBaseLegal = document.getElementById('modalBaseLegal');

// ============================================================
// Navegación entre pasos
// ============================================================
function irAPaso(numero) {
    document.querySelectorAll('.step-panel').forEach(panel => panel.classList.remove('active'));
    document.getElementById(`panel-${numero}`).classList.add('active');

    document.querySelectorAll('.stepper .step').forEach(step => {
        const n = parseInt(step.dataset.step, 10);
        step.classList.toggle('active', n === numero);
        step.classList.toggle('completed', n < numero);
    });

    estado.pasoActual = numero;

    if (numero === 4) {
        construirResumen();
    }

    document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelectorAll('[data-back]').forEach(btn => {
    btn.addEventListener('click', () => irAPaso(parseInt(btn.dataset.back, 10)));
});

// Permite saltar directamente a cualquier paso haciendo clic en el círculo/etiqueta del stepper
document.querySelectorAll('.stepper .step').forEach(step => {
    step.addEventListener('click', () => {
        const destino = parseInt(step.dataset.step, 10);
        irAPaso(destino);
    });
});

// ============================================================
// PASO 1: Búsqueda / validación de usuario
// ============================================================
function buscarDocumento() {
    const documento = documentoInput.value.trim();

    if (!documento) {
        alert('Por favor ingrese un código universitario o DNI');
        return;
    }

    const originalText = searchBtn.innerHTML;
    searchBtn.innerHTML = '⏳';
    searchBtn.disabled = true;

    setTimeout(() => {
        const usuario = usuariosDB[documento];

        if (usuario) {
            nombresInput.value = usuario.nombres;
            facultadInput.value = usuario.facultad;
            correoInput.value = usuario.correo;

            validationMsg.classList.remove('hidden');

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

function limpiarFormulario() {
    documentoInput.value = '';
    nombresInput.value = '';
    facultadInput.value = '';
    correoInput.value = '';
    telefonoInput.value = '';
    tipoUsuario.value = 'estudiante';
    validationMsg.classList.add('hidden');
    consentNotif.checked = false;
    consentError.classList.add('hidden');

    estado.tramiteSeleccionado = null;
    document.querySelectorAll('.tramite-card').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('input[name="tramiteRadio"]').forEach(r => r.checked = false);
    tramiteError.classList.add('hidden');

    archivoInput.value = '';
    estado.archivo = null;
    fileDropZone.classList.remove('has-file');
    fileUploadText.textContent = 'Haga clic o arrastre un archivo aquí';
    archivoError.classList.add('hidden');
    aclaracionInput.value = '';

    document.querySelectorAll('input[name="notifTipo"]').forEach(cb => {
        cb.checked = cb.value === 'institucional';
    });
    notifCorreoNuevo.value = '';
    notifCorreoNuevo.classList.add('hidden');
    notifError.classList.add('hidden');
    captchaError.classList.add('hidden');
    generarCaptcha();

    irAPaso(1);
}

function cancelarRegistro() {
    if (confirm('¿Está seguro que desea cancelar el registro? Se perderán los datos ingresados.')) {
        limpiarFormulario();
    }
}

function validarPaso1() {
    const documento = documentoInput.value.trim();
    const nombres = nombresInput.value.trim();
    const correo = correoInput.value.trim();
    let valido = true;

    if (!documento || !nombres || nombres === '---') {
        alert('Por favor ingrese y valide su código universitario o DNI');
        valido = false;
    } else if (!correo) {
        alert('Por favor ingrese su correo institucional');
        valido = false;
    }

    if (!consentNotif.checked) {
        consentError.classList.remove('hidden');
        valido = false;
    } else {
        consentError.classList.add('hidden');
    }

    return valido;
}

// ============================================================
// PASO 2: Renderizado y selección de trámite
// ============================================================
function renderTramites() {
    tramiteList.innerHTML = '';

    tiposTramite.forEach((tramite, index) => {
        const card = document.createElement('div');
        card.className = 'tramite-card';
        card.dataset.id = tramite.id;

        card.innerHTML = `
            <input type="radio" name="tramiteRadio" id="radio-${tramite.id}" value="${tramite.id}">
            <label class="tramite-card-info" for="radio-${tramite.id}">
                <h4>${index + 1}. ${tramite.nombre}</h4>
                <p>${tramite.subtitulo}</p>
            </label>
            <button type="button" class="btn-requisito" data-id="${tramite.id}">📄 Requisitos</button>
        `;

        tramiteList.appendChild(card);
    });

    // Selección de tarjeta
    document.querySelectorAll('.tramite-card').forEach(card => {
        const radio = card.querySelector('input[type="radio"]');

        const seleccionar = () => {
            document.querySelectorAll('.tramite-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            radio.checked = true;
            estado.tramiteSeleccionado = card.dataset.id;
            tramiteError.classList.add('hidden');
        };

        card.querySelector('.tramite-card-info').addEventListener('click', seleccionar);
        radio.addEventListener('change', seleccionar);
    });

    // Botones de requisitos (abren modal, no seleccionan la tarjeta)
    document.querySelectorAll('.btn-requisito').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            abrirModalRequisitos(btn.dataset.id);
        });
    });
}

function abrirModalRequisitos(id) {
    const tramite = tiposTramite.find(t => t.id === id);
    if (!tramite) return;

    modalTitulo.textContent = tramite.nombre;
    modalSubtitulo.textContent = tramite.subtitulo;
    modalRequisitos.innerHTML = tramite.requisitos.map(r => `<li>${r}</li>`).join('');
    modalUnidad.textContent = tramite.unidad;
    modalBaseLegal.textContent = tramite.baseLegal;

    modalOverlay.classList.remove('hidden');
}

function cerrarModal() {
    modalOverlay.classList.add('hidden');
}

function validarPaso2() {
    if (!estado.tramiteSeleccionado) {
        tramiteError.classList.remove('hidden');
        return false;
    }
    tramiteError.classList.add('hidden');
    return true;
}

// ============================================================
// PASO 3: Carga de archivos
// ============================================================
function manejarArchivo(file) {
    if (!file) return;

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) {
        alert('El archivo supera el tamaño máximo permitido (10MB).');
        archivoInput.value = '';
        return;
    }

    estado.archivo = file;
    fileDropZone.classList.add('has-file');
    fileUploadText.textContent = `✓ ${file.name}`;
    archivoError.classList.add('hidden');
}

function validarPaso3() {
    if (!estado.archivo) {
        archivoError.classList.remove('hidden');
        return false;
    }
    archivoError.classList.add('hidden');
    return true;
}

// ============================================================
// CAPTCHA propio (canvas, 100% gratuito, sin claves ni servicios externos)
// ============================================================
function generarCaptcha() {
    if (!captchaCanvas) return;

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin caracteres ambiguos (0/O, 1/I, etc.)
    let codigo = '';
    for (let i = 0; i < 5; i++) {
        codigo += chars[Math.floor(Math.random() * chars.length)];
    }
    captchaCodigoActual = codigo;

    const ctx = captchaCanvas.getContext('2d');
    const w = captchaCanvas.width;
    const h = captchaCanvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#f8f9fd';
    ctx.fillRect(0, 0, w, h);

    // líneas de ruido
    for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = `rgba(0, 96, 168, ${Math.random() * 0.3 + 0.1})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(Math.random() * w, Math.random() * h);
        ctx.lineTo(Math.random() * w, Math.random() * h);
        ctx.stroke();
    }

    // caracteres distorsionados
    const espacio = w / (codigo.length + 1);
    for (let i = 0; i < codigo.length; i++) {
        ctx.save();
        const x = espacio * (i + 1);
        const y = h / 2 + (Math.random() * 10 - 5);
        ctx.translate(x, y);
        ctx.rotate(Math.random() * 0.5 - 0.25);
        ctx.font = `bold ${Math.floor(Math.random() * 6) + 24}px Arial`;
        const r = Math.floor(Math.random() * 60);
        const g = Math.floor(Math.random() * 50) + 40;
        const b = Math.floor(Math.random() * 90) + 60;
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(codigo[i], 0, 0);
        ctx.restore();
    }

    // puntos de ruido
    for (let i = 0; i < 45; i++) {
        ctx.fillStyle = `rgba(86, 66, 66, ${Math.random() * 0.4})`;
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }

    captchaInput.value = '';
}

function validarCaptcha() {
    const valor = captchaInput.value.trim().toUpperCase();

    if (!valor || valor !== captchaCodigoActual) {
        captchaError.classList.remove('hidden');
        generarCaptcha(); // se regenera el código tras un intento fallido, como en captchas reales
        return false;
    }

    captchaError.classList.add('hidden');
    return true;
}

// ============================================================
// PASO 4: Resumen y confirmación
// ============================================================
function construirResumen() {
    const tramite = tiposTramite.find(t => t.id === estado.tramiteSeleccionado);

    notifCorreoInst.textContent = correoInput.value.trim() || '---';
    notifTelefono.textContent = telefonoInput.value.trim() || '---';

    resumenBox.innerHTML = `
        <div class="resumen-item"><span>Tipo de usuario</span><span>${tipoUsuario.options[tipoUsuario.selectedIndex].text}</span></div>
        <div class="resumen-item"><span>Documento</span><span>${documentoInput.value || '---'}</span></div>
        <div class="resumen-item"><span>Nombres y apellidos</span><span>${nombresInput.value || '---'}</span></div>
        <div class="resumen-item"><span>Facultad / dependencia</span><span>${facultadInput.value || '---'}</span></div>
        <div class="resumen-item"><span>Correo institucional</span><span>${correoInput.value || '---'}</span></div>
        <div class="resumen-item"><span>Teléfono de contacto</span><span>${telefonoInput.value || '---'}</span></div>
        <div class="resumen-item"><span>Trámite seleccionado</span><span>${tramite ? tramite.nombre : '---'}</span></div>
        <div class="resumen-item"><span>Archivo adjunto</span><span>${estado.archivo ? estado.archivo.name : '---'}</span></div>
        <div class="resumen-item"><span>Aclaración</span><span>${aclaracionInput.value.trim() || 'Sin observaciones'}</span></div>
    `;
}

function obtenerNotifSeleccionadas() {
    return Array.from(document.querySelectorAll('input[name="notifTipo"]:checked')).map(cb => cb.value);
}

function validarPaso4() {
    let valido = true;
    const seleccionadas = obtenerNotifSeleccionadas();

    if (seleccionadas.length === 0) {
        notifError.textContent = 'Debe seleccionar al menos un medio de notificación.';
        notifError.classList.remove('hidden');
        valido = false;
    } else {
        notifError.classList.add('hidden');

        if (seleccionadas.includes('nuevo')) {
            const correoNuevo = notifCorreoNuevo.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!correoNuevo || !emailRegex.test(correoNuevo)) {
                notifError.textContent = 'Ingrese un correo electrónico nuevo válido.';
                notifError.classList.remove('hidden');
                valido = false;
            }
        }
        if (valido && seleccionadas.includes('telefono') && !telefonoInput.value.trim()) {
            notifError.textContent = 'No se registró un número de teléfono en el Paso 1.';
            notifError.classList.remove('hidden');
            valido = false;
        }
        if (valido && seleccionadas.includes('institucional') && !correoInput.value.trim()) {
            notifError.textContent = 'No se registró un correo institucional en el Paso 1.';
            notifError.classList.remove('hidden');
            valido = false;
        }
    }

    if (!validarCaptcha()) {
        valido = false;
    }

    return valido;
}

function guardarTramite() {
    if (!validarPaso4()) return;

    const seleccionadas = obtenerNotifSeleccionadas();
    const destinos = seleccionadas.map(tipo => {
        if (tipo === 'nuevo') return { tipo: 'correo_nuevo', valor: notifCorreoNuevo.value.trim() };
        if (tipo === 'telefono') return { tipo: 'telefono', valor: telefonoInput.value.trim() };
        return { tipo: 'correo_institucional', valor: correoInput.value.trim() };
    });
    const destinoNotificacion = destinos.map(d => d.valor).join(', ');

    const payload = {
        tipoUsuario: tipoUsuario.value,
        documento: documentoInput.value.trim(),
        nombres: nombresInput.value.trim(),
        facultad: facultadInput.value.trim(),
        correo: correoInput.value.trim(),
        telefono: telefonoInput.value.trim(),
        autorizaNotificaciones: consentNotif.checked,
        tramite: estado.tramiteSeleccionado,
        archivoNombre: estado.archivo ? estado.archivo.name : null,
        aclaracion: aclaracionInput.value.trim(),
        notificacion: { medios: destinos }
    };

    // TODO: Cuando se comparta routes/tramites.js, reemplazar por:
    // fetch('/api/tramites', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    console.log('📤 Trámite a registrar:', payload);

    guardarBtn.disabled = true;
    guardarBtn.innerHTML = 'Guardando... ⏳';

    setTimeout(() => {
        alert(`✅ Trámite registrado correctamente.\n\nSe enviará una notificación a: ${destinoNotificacion}`);
        guardarBtn.disabled = false;
        guardarBtn.innerHTML = 'Guardar Trámite <span>✓</span>';
        limpiarFormulario();
    }, 1200);
}

// ============================================================
// Event Listeners
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    renderTramites();

    if (searchBtn) searchBtn.addEventListener('click', buscarDocumento);

    if (documentoInput) {
        documentoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') buscarDocumento();
        });
    }

    if (cancelBtn) cancelBtn.addEventListener('click', cancelarRegistro);

    nextBtn1.addEventListener('click', () => { if (validarPaso1()) irAPaso(2); });
    nextBtn2.addEventListener('click', () => { if (validarPaso2()) irAPaso(3); });
    nextBtn3.addEventListener('click', () => { if (validarPaso3()) irAPaso(4); });

    // Carga de archivo
    archivoInput.addEventListener('change', () => manejarArchivo(archivoInput.files[0]));

    ['dragover', 'dragenter'].forEach(evt => {
        fileDropZone.addEventListener(evt, (e) => {
            e.preventDefault();
            fileDropZone.classList.add('dragover');
        });
    });
    ['dragleave', 'drop'].forEach(evt => {
        fileDropZone.addEventListener(evt, (e) => {
            e.preventDefault();
            fileDropZone.classList.remove('dragover');
        });
    });
    fileDropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        if (file) {
            archivoInput.files = e.dataTransfer.files;
            manejarArchivo(file);
        }
    });

    // Notificaciones paso 4 (selección múltiple)
    document.querySelectorAll('input[name="notifTipo"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const nuevoSeleccionado = document.querySelector('input[name="notifTipo"][value="nuevo"]').checked;
            notifCorreoNuevo.classList.toggle('hidden', !nuevoSeleccionado);
            notifError.classList.add('hidden');
        });
    });

    // Captcha propio
    generarCaptcha();
    captchaRefresh.addEventListener('click', generarCaptcha);
    captchaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') validarCaptcha();
    });

    limpiarBtn.addEventListener('click', () => {
        if (confirm('¿Desea limpiar todo el formulario? Se perderán todos los datos ingresados.')) {
            limpiarFormulario();
        }
    });

    guardarBtn.addEventListener('click', guardarTramite);

    // Modal
    modalClose.addEventListener('click', cerrarModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) cerrarModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') cerrarModal();
    });

    // Navegación móvil (los enlaces con destino real navegan; los "#" solo cambian el estado activo)
    const mobileLinks = document.querySelectorAll('.mobile-nav a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                mobileLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
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

    // Sidebar navigation (los enlaces con destino real navegan normalmente)
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                sidebarLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Botón de perfil
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            window.location.href = '../panel_admin/login.html';
        });
    }

    console.log('📋 Formulario TUPA (wizard 4 pasos) - Inicializado correctamente');
});