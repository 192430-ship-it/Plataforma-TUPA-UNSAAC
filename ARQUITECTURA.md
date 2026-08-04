# Arquitectura y Despliegue — Plataforma TUPA UNSAAC

**Módulo 3 — Despliegue y arquitectura**
Responsable: C. Rivera

## 1. Visión general

La plataforma es un **sitio 100% estático** (HTML + CSS + JavaScript vanilla), sin backend ni base de datos activa. Cada módulo funcional vive en su propia carpeta, autocontenida (HTML + CSS + JS propios), y `index.html` en la raíz actúa como hub que enlaza a todos los módulos.

```
Plataforma-TUPA-UNSAAC/
├── index.html                 # Hub de navegación
├── panel_principal/            # Landing / inicio (Sota - parcial)
├── catalogo/                   # Catálogo de trámites (búsqueda/filtros)
├── tramites/                   # Solicitud de trámites (B. Sota)
├── Seguimiento/                # Seguimiento de expedientes
├── panel_admin/                # Panel administrativo / CRUD (A. Ttito)
├── panel_control/              # Panel de control de despliegue (C. Rivera)
├── .github/workflows/          # Pipelines de CI/CD
└── ARQUITECTURA.md             # Este documento
```

## 2. Stack

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (vanilla, sin frameworks) |
| Hosting / Cloud | GitHub Pages |
| CI/CD | GitHub Actions |
| Control de versiones | Git + GitHub, una rama por integrante (`feature/<módulo>`) hacia `main` vía Pull Request |

No hay backend ni base de datos real todavía: los módulos que necesitan datos (catálogo de trámites, validación de DNI, expedientes) usan datos simulados (arrays hardcodeados en JS) a la espera de una API/BD futura.

## 3. Pipeline de despliegue (CI/CD)

```
Push a main
    │
    ▼
GitHub Actions (.github/workflows/deploy.yml)
    │
    ├─ checkout del código
    ├─ configuración de Pages
    ├─ empaquetado del sitio (artifact)
    ▼
Deploy automático a GitHub Pages
    │
    ▼
https://192430-ship-it.github.io/Plataforma-TUPA-UNSAAC/
```

Cada vez que se hace merge a `main`, el workflow se dispara solo y publica la versión más reciente del sitio — sin pasos manuales. También se puede disparar a mano desde la pestaña **Actions** del repo (`workflow_dispatch`).

**Requisito de configuración (una sola vez, manual):** en el repo, ir a `Settings → Pages → Build and deployment → Source` y seleccionar **"GitHub Actions"** (en vez de "Deploy from a branch"). Sin este cambio el workflow no tiene permiso para publicar.

## 4. Notificaciones de despliegue

GitHub notifica automáticamente por correo/UI a los colaboradores cuando un workflow de Actions falla. Además, el estado de cada corrida (éxito/fallo, duración, commit) queda visible en la pestaña **Actions** del repo, y se refleja en el **Panel de Control** (`panel_control/`) del sitio, que muestra un historial simulado de despliegues como referencia visual para el equipo.

## 5. Panel de Control

Página nueva (`panel_control/panel_control.html`) pensada para el equipo de desarrollo, no para el usuario final del TUPA. Muestra:
- Estado actual del sitio (en línea / última publicación)
- Historial de despliegues (commit, autor, estado, duración)
- Centro de notificaciones del sistema (eventos de build/deploy)
- Resumen de arquitectura (mismo diagrama de este documento, en versión visual)

## 6. Decisiones y próximos pasos

- Se eligió GitHub Pages + Actions por ser gratuito, no requerir servidor propio, y ya estar en uso por el equipo — evita introducir un proveedor cloud adicional (Vercel/Netlify/Render) sin necesidad real, dado que el sitio no tiene backend.
- Cuando el proyecto incorpore un backend real (mencionado en el README: MySQL), esta arquitectura debe extenderse con un servicio de API separado; GitHub Pages seguiría sirviendo solo el frontend estático.
