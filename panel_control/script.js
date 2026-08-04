// ===== Datos de referencia (simulados) =====
// Se completarán con datos reales de GitHub Actions cuando el workflow
// de CI/CD (.github/workflows/deploy.yml) quede activo en el repositorio.

const deployHistory = [
    { hash: '92fe16a', desc: 'Mejorar diseño página principal', author: 'A. Ttito', status: 'ok', duration: '38s', date: '27/05/2026 19:58' },
    { hash: '0db08fc', desc: 'Corregir links con nombres reales de archivos', author: 'A. Ttito', status: 'ok', duration: '33s', date: '27/05/2026 19:50' },
    { hash: '6f8fc9b', desc: 'Agregar página principal con links', author: 'A. Ttito', status: 'ok', duration: '41s', date: '27/05/2026 19:45' },
    { hash: '39d07d8', desc: 'Módulo Seguimiento', author: 'A. Ttito', status: 'ok', duration: '35s', date: '27/05/2026 19:18' },
    { hash: '9249d67', desc: 'Módulo Trámites', author: 'A. Ttito', status: 'ok', duration: '39s', date: '27/05/2026 19:17' },
    { hash: 'b24c50d', desc: 'Módulo Panel Admin', author: 'A. Ttito', status: 'ok', duration: '44s', date: '27/05/2026 19:16' },
];

const notifications = [
    {
        title: 'Despliegue exitoso',
        detail: `El sitio se actualizó correctamente con el commit ${deployHistory[0].hash}.`
    },
    {
        title: 'Nuevo commit en main',
        detail: `Push de ${deployHistory[0].author}: "${deployHistory[0].desc}".`
    },
    {
        title: 'Configuración pendiente',
        detail: 'Activa "GitHub Actions" como fuente en Settings → Pages para habilitar el despliegue automático.'
    },
];

document.addEventListener('DOMContentLoaded', () => {

    // ===== KPI: último despliegue =====
    const ultimoDeployEl = document.getElementById('ultimoDeploy');
    if (ultimoDeployEl && deployHistory.length > 0) {
        ultimoDeployEl.textContent = deployHistory[0].hash;
    }

    // ===== Tabla de despliegues =====
    const deploysBody = document.getElementById('deploysBody');
    if (deploysBody) {
        deployHistory.forEach(d => {
            const tr = document.createElement('tr');
            const statusLabel = d.status === 'ok' ? '✓ Exitoso' : '✗ Falló';
            const statusClass = d.status === 'ok' ? 'ok' : 'fail';
            tr.innerHTML = `
                <td><span class="commit-hash">${d.hash}</span></td>
                <td>${d.desc}</td>
                <td>${d.author}</td>
                <td><span class="deploy-status ${statusClass}">${statusLabel}</span></td>
                <td>${d.duration}</td>
                <td>${d.date}</td>
            `;
            deploysBody.appendChild(tr);
        });
    }

    // ===== Centro de notificaciones (página) =====
    const notificationsList = document.getElementById('notificationsList');
    if (notificationsList) {
        notifications.forEach(n => {
            const li = document.createElement('li');
            li.className = 'notification-item';
            li.innerHTML = `<strong>${n.title}</strong><span>${n.detail}</span>`;
            notificationsList.appendChild(li);
        });
    }

    // ===== Dropdown de campana (header) =====
    const bellList = document.getElementById('bellList');
    if (bellList) {
        notifications.forEach(n => {
            const item = document.createElement('div');
            item.className = 'bell-item';
            item.innerHTML = `<strong>${n.title}</strong><span>${n.detail}</span>`;
            bellList.appendChild(item);
        });
    }

    const bellBtn = document.getElementById('bellBtn');
    const bellDropdown = document.getElementById('bellDropdown');
    const bellBadge = document.getElementById('bellBadge');

    if (bellBtn && bellDropdown) {
        bellBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            bellDropdown.classList.toggle('open');
            if (bellDropdown.classList.contains('open') && bellBadge) {
                bellBadge.style.display = 'none';
            }
        });

        document.addEventListener('click', (e) => {
            if (!bellDropdown.contains(e.target) && e.target !== bellBtn) {
                bellDropdown.classList.remove('open');
            }
        });
    }

    // ===== Navegación entre secciones (sidebar + mobile) =====
    const pages = document.querySelectorAll('.page');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a[data-page]');
    const mobileLinks = document.querySelectorAll('.mobile-nav a[data-page]');

    function showPage(pageId) {
        pages.forEach(page => {
            page.classList.toggle('active', page.id === pageId);
        });
    }

    function setActiveLink(pageId) {
        sidebarLinks.forEach(link => link.classList.toggle('active', link.dataset.page === pageId));
        mobileLinks.forEach(link => link.classList.toggle('active', link.dataset.page === pageId));
    }

    [...sidebarLinks, ...mobileLinks].forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            if (!pageId) return;
            setActiveLink(pageId);
            showPage(pageId);
            document.querySelector('.sidebar')?.classList.remove('open');
        });
    });

    // ===== Menú móvil (abrir/cerrar sidebar) =====
    const mobileMenu = document.querySelector('.mobile-menu');
    const sidebar = document.querySelector('.sidebar');
    if (mobileMenu && sidebar) {
        mobileMenu.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }

    console.log('📊 Panel de Control de Despliegue - Inicializado correctamente');
});
