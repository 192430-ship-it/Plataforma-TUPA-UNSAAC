document.addEventListener('DOMContentLoaded', async function() {
    if (!localStorage.getItem('adminLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    const adminUser = JSON.parse(localStorage.getItem('adminUser') || 'null');
    const userNameNode = document.querySelector('.user-name');
    if (adminUser && userNameNode) {
        userNameNode.textContent = `${adminUser.nombres || adminUser.username} ${adminUser.apellidos || ''}`.trim();
    }

    const totalTramitesValue = document.getElementById('totalTramitesValue');
    const avgTiempoValue = document.getElementById('avgTiempoValue');
    const approvalRateValue = document.getElementById('approvalRateValue');
    const pendingTableBody = document.getElementById('pendingTableBody');
    const pendingSummary = document.getElementById('pendingSummary');
    const facultyChart = document.getElementById('facultyChart');
    const quickInfo = document.getElementById('quickInfo');
    const pdfButtons = document.querySelectorAll('.btn-pdf');
    const excelButtons = document.querySelectorAll('.btn-excel');
    const quickBtns = document.querySelectorAll('.quick-btn');

    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('¿Está seguro que desea cerrar sesión?')) {
                localStorage.removeItem('adminLoggedIn');
                localStorage.removeItem('adminUser');
                window.location.href = 'login.html';
            }
        });
    }

    function formatEstado(estado) {
        switch (estado) {
            case 'registrado': return 'Registrado';
            case 'en_revision': return 'En revisión';
            case 'observado': return 'Observado';
            case 'aprobado': return 'Aprobado';
            case 'rechazado': return 'Rechazado';
            default: return estado;
        }
    }

    function getStatusClass(estado) {
        if (estado === 'registrado' || estado === 'en_revision') return 'pendiente';
        if (estado === 'observado') return 'observado';
        if (estado === 'aprobado') return 'validacion';
        if (estado === 'rechazado') return 'rechazado';
        return 'baja';
    }

    function getPriority(estado) {
        if (estado === 'registrado' || estado === 'observado') return 'Alta';
        if (estado === 'en_revision') return 'Media';
        return 'Baja';
    }

    function renderPendingRows(items) {
        if (!pendingTableBody) return;
        if (!items || items.length === 0) {
            pendingTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:24px; color:#564242;">No hay trámites pendientes en este momento.</td></tr>';
            if (pendingSummary) pendingSummary.textContent = 'No hay trámites pendientes.';
            return;
        }

        if (pendingSummary) pendingSummary.textContent = `Mostrando ${items.length} trámites pendientes en la bandeja.`;
        pendingTableBody.innerHTML = items.map(item => {
            const priority = getPriority(item.estado).toLowerCase();
            const statusClass = getStatusClass(item.estado);
            return `
                <tr>
                    <td><span class="priority ${priority}">${getPriority(item.estado)}</span></td>
                    <td class="exp-id">${item.numero_expediente}</td>
                    <td>${item.interesado}</td>
                    <td>${item.facultad || 'Sin Facultad'}</td>
                    <td><span class="status ${statusClass}">${formatEstado(item.estado)}</span></td>
                    <td class="actions">
                        <button class="action-btn" title="Ver detalle">👁</button>
                        <button class="action-btn" title="Derivar">➤</button>
                    </td>
                </tr>
            `;
        }).join('');

        pendingTableBody.querySelectorAll('tr').forEach(row => {
            row.addEventListener('click', function() {
                const expId = this.querySelector('.exp-id')?.textContent || 'EXP-00000';
                alert(`Expediente ${expId} seleccionado. Revise los detalles en el sistema administrativo.`);
            });
        });
    }

    function renderFacultyChart(items) {
        if (!facultyChart) return;
        if (!items || items.length === 0) {
            facultyChart.innerHTML = '<p style="color:#564242;">No hay datos de facultades disponibles.</p>';
            return;
        }

        const maxValue = Math.max(...items.map(item => item.total));
        facultyChart.innerHTML = items.map((item, index) => {
            const width = maxValue > 0 ? Math.round((item.total / maxValue) * 100) : 0;
            const fillClass = index === 0 ? 'primary' : index === 1 ? 'secondary' : index === 2 ? 'tertiary' : 'other';
            return `
                <div class="chart-item">
                    <div class="chart-label">
                        <span>${item.facultad}</span>
                        <span class="chart-percent">${item.total}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${fillClass}" style="width: ${width}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function showQuickInfo(message) {
        if (!quickInfo) return;
        quickInfo.textContent = message;
        quickInfo.style.display = 'block';
    }

    function downloadFile(filename, content, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    async function exportReport(format, dashboard) {
        if (!dashboard) {
            const response = await fetch('/api/admin/dashboard');
            dashboard = response.ok ? await response.json() : null;
        }

        if (!dashboard) {
            alert('No hay datos para exportar.');
            return;
        }

        if (format === 'excel') {
            const rows = [
                ['Métrica', 'Valor'],
                ['Total de trámites', dashboard.totalTramites],
                ['Tiempo promedio (días)', dashboard.avgTiempoDias],
                ['Tasa de aprobación (%)', `${dashboard.approvalRate}%`],
                ['Documentos totales', dashboard.documentosTotales]
            ];
            rows.push([]);
            rows.push(['Facultad', 'Total']);
            dashboard.facultades.forEach(item => rows.push([item.facultad, item.total]));
            const csv = rows.map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(',')).join('\n');
            downloadFile('resumen_tramites.csv', csv, 'text/csv;charset=utf-8;');
            return;
        }

        const reportHtml = `
            <html>
            <head>
                <meta charset="utf-8">
                <title>Resumen de Trámites</title>
                <style>body{font-family:Arial,Helvetica,sans-serif;padding:24px;color:#191c1f;}h1{color:#4b000e;}table{width:100%;border-collapse:collapse;margin-top:20px;}th,td{border:1px solid #ddd;padding:10px;}th{background:#f4f4f4;text-align:left;}</style>
            </head>
            <body>
                <h1>Resumen de Trámites</h1>
                <p>Total de trámites: <strong>${dashboard.totalTramites}</strong></p>
                <p>Tiempo promedio: <strong>${dashboard.avgTiempoDias} días</strong></p>
                <p>Tasa de aprobación: <strong>${dashboard.approvalRate}%</strong></p>
                <p>Documentos totales: <strong>${dashboard.documentosTotales}</strong></p>
                <h2>Trámites por Facultad</h2>
                <table><thead><tr><th>Facultad</th><th>Total</th></tr></thead><tbody>${dashboard.facultades.map(item => `<tr><td>${item.facultad}</td><td>${item.total}</td></tr>`).join('')}</tbody></table>
                <h2>Trámites Pendientes</h2>
                <table><thead><tr><th>Expediente</th><th>Interesado</th><th>Facultad</th><th>Estado</th></tr></thead><tbody>${dashboard.pending.map(item => `<tr><td>${item.numero_expediente}</td><td>${item.interesado}</td><td>${item.facultad}</td><td>${formatEstado(item.estado)}</td></tr>`).join('')}</tbody></table>
            </body>
            </html>`;

        const win = window.open('', '_blank');
        if (win) {
            win.document.write(reportHtml);
            win.document.close();
            win.focus();
            win.print();
        } else {
            alert('No se pudo abrir la ventana de impresión. Verifique si el navegador bloqueó los pop-ups.');
        }
    }

    function bindQuickActions(dashboard) {
        quickBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.dataset.action;
                if (action === 'dni') {
                    showQuickInfo(`Documentos registrados: ${dashboard.documentosTotales}. Esta información está conectada con la tabla documentos.`);
                } else if (action === 'directorio') {
                    const rules = dashboard.baseLegal || [];
                    if (!rules.length) {
                        showQuickInfo('No hay información de silencio administrativo disponible.');
                        return;
                    }
                    showQuickInfo(`Silencio Administrativo: ${rules.map(item => `${item.codigo}: ${item.silencio_administrativo}`).join(' | ')}`);
                } else if (action === 'base-legal') {
                    const rules = dashboard.baseLegal || [];
                    if (!rules.length) {
                        showQuickInfo('No hay base legal disponible en este momento.');
                        return;
                    }
                    showQuickInfo(`Base Legal disponible para ${rules.length} trámites. Ejemplo: ${rules.slice(0, 3).map(item => `${item.codigo}`).join(', ')}`);
                }
            });
        });
    }

    async function initializePanel() {
        try {
            const response = await fetch('/api/admin/dashboard');
            if (!response.ok) throw new Error('No se pudo cargar la información del panel.');
            const dashboard = await response.json();

            const pendingCount = Array.isArray(dashboard.pending) ? dashboard.pending.length : 0;
            if (totalTramitesValue) totalTramitesValue.textContent = dashboard.totalTramites;
            if (avgTiempoValue) avgTiempoValue.textContent = `${dashboard.avgTiempoDias}d`;
            if (approvalRateValue) approvalRateValue.textContent = `${dashboard.approvalRate}%`;
            if (pendingSummary) pendingSummary.textContent = `Mostrando ${pendingCount} de ${dashboard.totalTramites} trámites totales`;
            if (quickInfo) {
                quickInfo.textContent = 'Utilice los accesos rápidos para consultar base legal, documentos o silencio administrativo.';
                quickInfo.style.display = 'block';
            }

            renderPendingRows(dashboard.pending);
            renderFacultyChart(dashboard.facultades);
            bindQuickActions(dashboard);

            pdfButtons.forEach(btn => btn.addEventListener('click', () => exportReport('pdf', dashboard)));
            excelButtons.forEach(btn => btn.addEventListener('click', () => exportReport('excel', dashboard)));
        } catch (error) {
            console.error(error);
            if (pendingTableBody) pendingTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:24px; color:#ba1a1a;">No se pudo cargar la bandeja de trámites.</td></tr>';
            if (facultyChart) facultyChart.innerHTML = '<p style="color:#ba1a1a;">No se pudieron cargar los datos por facultad.</p>';
            if (quickInfo) quickInfo.textContent = 'Error cargando información del panel administrativo.';
        }
    }

    await initializePanel();

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

    const footerLinks = document.querySelectorAll('.footer-links a');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert(`📄 ${this.textContent}\n\nInformación disponible próximamente.`);
        });
    });

    console.log('Dashboard administrativo inicializado');
});
