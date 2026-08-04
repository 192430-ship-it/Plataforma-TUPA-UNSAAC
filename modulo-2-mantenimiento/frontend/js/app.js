const API = "http://localhost:3000/api";

let procedimientoEditando = null;
let categoriaEditando = null;
let oficinaEditando = null;
let requisitoEditando = null;


// ======================================================
// MOSTRAR MÓDULO
// ======================================================

function mostrarModulo(modulo) {

    switch (modulo) {

        case "procedimientos":
            cargarProcedimientos();
            break;

        case "categorias":
            cargarCategorias();
            break;

        case "oficinas":
            cargarOficinas();
            break;

        case "requisitos":
            cargarRequisitos();
            break;

        default:
            console.log("Módulo no encontrado");
    }
}


// ======================================================
// PROCEDIMIENTOS
// ======================================================

async function cargarProcedimientos() {

    const contenido = document.getElementById("contenido");

    contenido.innerHTML = "<h2>Cargando procedimientos...</h2>";

    try {

        const respuesta = await fetch(`${API}/procedimientos`);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || datos.error);
        }

        let html = `
            <div class="titulo-modulo">

                <h2>Gestión de Procedimientos</h2>

                <button
                    class="btn btn-nuevo"
                    onclick="mostrarFormularioProcedimiento()">
                    + Nuevo procedimiento
                </button>

            </div>

            <input
                type="text"
                id="buscarProcedimiento"
                placeholder="Buscar por código o nombre..."
                onkeyup="filtrarProcedimientos()"
                class="buscador"
            >

            <table id="tablaProcedimientos">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Costo</th>
                        <th>Plazo</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>

                <tbody>
        `;

        datos.forEach(item => {

            html += `
                <tr>

                    <td>${item.id}</td>

                    <td>${item.codigo}</td>

                    <td>${item.nombre}</td>

                    <td>S/ ${Number(item.costo).toFixed(2)}</td>

                    <td>${item.plazo_atencion} días</td>

                    <td>
                        ${
                            item.estado
                                ? '<span class="activo">Activo</span>'
                                : '<span class="inactivo">Inactivo</span>'
                        }
                    </td>

                    <td>

                        <button
                            class="btn btn-editar"
                            onclick='editarProcedimiento(${JSON.stringify(item)})'>
                            Editar
                        </button>

                        ${
                            item.estado
                            ?
                            `<button
                                class="btn btn-eliminar"
                                onclick="desactivarProcedimiento(${item.id})">
                                Desactivar
                            </button>`
                            :
                            ""
                        }

                    </td>

                </tr>
            `;

        });

        html += `
                </tbody>
            </table>
        `;

        contenido.innerHTML = html;

    } catch (error) {

        console.error(error);

        contenido.innerHTML = `
            <h2>Error</h2>
            <p>No se pudieron cargar los procedimientos.</p>
        `;
    }
}


// ======================================================
// NUEVO PROCEDIMIENTO
// ======================================================

async function mostrarFormularioProcedimiento() {

    procedimientoEditando = null;

    const contenido = document.getElementById("contenido");

    let categorias = [];
    let oficinas = [];

    try {

        const respuestaCategorias =
            await fetch(`${API}/categorias`);

        categorias = await respuestaCategorias.json();

        const respuestaOficinas =
            await fetch(`${API}/oficinas`);

        oficinas = await respuestaOficinas.json();

    } catch (error) {

        console.error(error);
    }

    contenido.innerHTML = `

        <h2>Nuevo Procedimiento</h2>

        <form id="formProcedimiento">

            <label>Código:</label>

            <input
                type="text"
                id="codigo"
                maxlength="20"
                required
            >

            <label>Nombre:</label>

            <input
                type="text"
                id="nombre"
                maxlength="200"
                required
            >

            <label>Descripción:</label>

            <textarea id="descripcion"></textarea>

            <label>Costo:</label>

            <input
                type="number"
                id="costo"
                step="0.01"
                min="0"
                value="0"
                required
            >

            <label>Plazo de atención (días):</label>

            <input
                type="number"
                id="plazo_atencion"
                min="1"
                value="1"
                required
            >

            <label>Categoría:</label>

            <select id="categoria_id" required>

                <option value="">
                    Seleccione una categoría
                </option>

                ${categorias
                    .filter(c => c.estado)
                    .map(c => `
                        <option value="${c.id}">
                            ${c.nombre}
                        </option>
                    `)
                    .join("")
                }

            </select>

            <label>Oficina responsable:</label>

            <select id="oficina_id" required>

                <option value="">
                    Seleccione una oficina
                </option>

                ${oficinas
                    .filter(o => o.estado)
                    .map(o => `
                        <option value="${o.id}">
                            ${o.nombre}
                        </option>
                    `)
                    .join("")
                }

            </select>

            <div class="acciones-formulario">

                <button
                    type="submit"
                    class="btn btn-nuevo">
                    Guardar
                </button>

                <button
                    type="button"
                    class="btn btn-cancelar"
                    onclick="cargarProcedimientos()">
                    Cancelar
                </button>

            </div>

        </form>
    `;

    document
        .getElementById("formProcedimiento")
        .addEventListener("submit", guardarProcedimiento);
}


// ======================================================
// GUARDAR / ACTUALIZAR PROCEDIMIENTO
// ======================================================

async function guardarProcedimiento(event) {

    event.preventDefault();

    const datos = {

        codigo: document.getElementById("codigo").value.trim(),

        nombre: document.getElementById("nombre").value.trim(),

        descripcion:
            document.getElementById("descripcion").value.trim(),

        costo:
            Number(document.getElementById("costo").value),

        plazo_atencion:
            Number(document.getElementById("plazo_atencion").value),

        categoria_id:
            Number(document.getElementById("categoria_id").value),

        oficina_id:
            Number(document.getElementById("oficina_id").value)
    };

    try {

        let url = `${API}/procedimientos`;
        let metodo = "POST";

        if (procedimientoEditando !== null) {

            url =
                `${API}/procedimientos/${procedimientoEditando}`;

            metodo = "PUT";
        }

        const respuesta = await fetch(url, {

            method: metodo,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(datos)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {

            alert(
                resultado.mensaje ||
                resultado.error ||
                "Error al guardar el procedimiento."
            );

            return;
        }

        alert(
            procedimientoEditando !== null
                ? "Procedimiento actualizado correctamente."
                : "Procedimiento registrado correctamente."
        );

        procedimientoEditando = null;

        cargarProcedimientos();

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");
    }
}


// ======================================================
// EDITAR PROCEDIMIENTO
// ======================================================

async function editarProcedimiento(item) {

    procedimientoEditando = item.id;

    const contenido = document.getElementById("contenido");

    let categorias = [];
    let oficinas = [];

    try {

        const respuestaCategorias =
            await fetch(`${API}/categorias`);

        categorias = await respuestaCategorias.json();

        const respuestaOficinas =
            await fetch(`${API}/oficinas`);

        oficinas = await respuestaOficinas.json();

    } catch (error) {

        console.error(error);
    }

    contenido.innerHTML = `

        <h2>Editar Procedimiento</h2>

        <form id="formProcedimiento">

            <label>Código:</label>

            <input
                type="text"
                id="codigo"
                value="${item.codigo || ""}"
                maxlength="20"
                required
            >

            <label>Nombre:</label>

            <input
                type="text"
                id="nombre"
                value="${item.nombre || ""}"
                maxlength="200"
                required
            >

            <label>Descripción:</label>

            <textarea id="descripcion">${item.descripcion || ""}</textarea>

            <label>Costo:</label>

            <input
                type="number"
                id="costo"
                value="${item.costo || 0}"
                step="0.01"
                min="0"
                required
            >

            <label>Plazo de atención:</label>

            <input
                type="number"
                id="plazo_atencion"
                value="${item.plazo_atencion || 1}"
                min="1"
                required
            >

            <label>Categoría:</label>

            <select id="categoria_id" required>

                ${categorias
                    .filter(c => c.estado)
                    .map(c => `
                        <option
                            value="${c.id}"
                            ${c.id == item.categoria_id ? "selected" : ""}>
                            ${c.nombre}
                        </option>
                    `)
                    .join("")
                }

            </select>

            <label>Oficina responsable:</label>

            <select id="oficina_id" required>

                ${oficinas
                    .filter(o => o.estado)
                    .map(o => `
                        <option
                            value="${o.id}"
                            ${o.id == item.oficina_id ? "selected" : ""}>
                            ${o.nombre}
                        </option>
                    `)
                    .join("")
                }

            </select>

            <div class="acciones-formulario">

                <button
                    type="submit"
                    class="btn btn-nuevo">
                    Actualizar
                </button>

                <button
                    type="button"
                    class="btn btn-cancelar"
                    onclick="cargarProcedimientos()">
                    Cancelar
                </button>

            </div>

        </form>
    `;

    document
        .getElementById("formProcedimiento")
        .addEventListener("submit", guardarProcedimiento);
}


// ======================================================
// DESACTIVAR PROCEDIMIENTO
// ======================================================

async function desactivarProcedimiento(id) {

    if (!confirm(
        "¿Está seguro de desactivar este procedimiento?"
    )) {
        return;
    }

    try {

        const respuesta =
            await fetch(
                `${API}/procedimientos/${id}`,
                {
                    method: "DELETE"
                }
            );

        const resultado =
            await respuesta.json();

        if (!respuesta.ok) {

            alert(
                resultado.mensaje ||
                resultado.error ||
                "No se pudo desactivar."
            );

            return;
        }

        alert(
            "Procedimiento desactivado correctamente."
        );

        cargarProcedimientos();

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");
    }
}


// ======================================================
// BUSCAR PROCEDIMIENTOS
// ======================================================

function filtrarProcedimientos() {

    const input =
        document.getElementById("buscarProcedimiento");

    const texto =
        input.value.toLowerCase();

    const filas =
        document.querySelectorAll(
            "#tablaProcedimientos tbody tr"
        );

    filas.forEach(fila => {

        fila.style.display =
            fila.textContent
                .toLowerCase()
                .includes(texto)
                ? ""
                : "none";
    });
}


// ======================================================
// CATEGORÍAS
// ======================================================

async function cargarCategorias() {

    const contenido =
        document.getElementById("contenido");

    contenido.innerHTML =
        "<h2>Cargando categorías...</h2>";

    try {

        const respuesta =
            await fetch(`${API}/categorias`);

        const datos =
            await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || datos.error);
        }

        let html = `

            <div class="titulo-modulo">

                <h2>Gestión de Categorías</h2>

                <button
                    class="btn btn-nuevo"
                    onclick="mostrarFormularioCategoria()">
                    + Nueva categoría
                </button>

            </div>

            <input
                type="text"
                id="buscarCategoria"
                placeholder="Buscar categoría..."
                onkeyup="filtrarTabla('buscarCategoria','tablaCategorias')"
                class="buscador"
            >

            <table id="tablaCategorias">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>

                </thead>

                <tbody>
        `;

        datos.forEach(item => {

            html += `

                <tr>

                    <td>${item.id}</td>

                    <td>${item.nombre}</td>

                    <td>${item.descripcion || ""}</td>

                    <td>
                        ${
                            item.estado
                                ? '<span class="activo">Activo</span>'
                                : '<span class="inactivo">Inactivo</span>'
                        }
                    </td>

                    <td>

                        <button
                            class="btn btn-editar"
                            onclick='editarCategoria(${JSON.stringify(item)})'>
                            Editar
                        </button>

                        ${
                            item.estado
                            ?
                            `<button
                                class="btn btn-eliminar"
                                onclick="desactivarCategoria(${item.id})">
                                Desactivar
                            </button>`
                            :
                            ""
                        }

                    </td>

                </tr>
            `;

        });

        html += `
                </tbody>
            </table>
        `;

        contenido.innerHTML = html;

    } catch (error) {

        console.error(error);

        contenido.innerHTML =
            "<p>Error al cargar categorías.</p>";
    }
}


// ======================================================
// NUEVA / EDITAR CATEGORÍA
// ======================================================

function mostrarFormularioCategoria(item = null) {

    categoriaEditando =
        item ? item.id : null;

    const contenido =
        document.getElementById("contenido");

    contenido.innerHTML = `

        <h2>
            ${
                item
                    ? "Editar Categoría"
                    : "Nueva Categoría"
            }
        </h2>

        <form id="formCategoria">

            <label>Nombre:</label>

            <input
                type="text"
                id="nombreCategoria"
                value="${item?.nombre || ""}"
                required
            >

            <label>Descripción:</label>

            <textarea
                id="descripcionCategoria"
            >${item?.descripcion || ""}</textarea>

            ${
                item
                ?
                `
                <label>Estado:</label>

                <select id="estadoCategoria">

                    <option
                        value="1"
                        ${item.estado ? "selected" : ""}>
                        Activo
                    </option>

                    <option
                        value="0"
                        ${!item.estado ? "selected" : ""}>
                        Inactivo
                    </option>

                </select>
                `
                :
                ""
            }

            <div class="acciones-formulario">

                <button
                    type="submit"
                    class="btn btn-nuevo">

                    ${
                        item
                            ? "Actualizar"
                            : "Guardar"
                    }

                </button>

                <button
                    type="button"
                    class="btn btn-cancelar"
                    onclick="cargarCategorias()">
                    Cancelar
                </button>

            </div>

        </form>
    `;

    document
        .getElementById("formCategoria")
        .addEventListener(
            "submit",
            guardarCategoria
        );
}


async function guardarCategoria(event) {

    event.preventDefault();

    const datos = {

        nombre:
            document
                .getElementById("nombreCategoria")
                .value
                .trim(),

        descripcion:
            document
                .getElementById("descripcionCategoria")
                .value
                .trim()
    };

    if (categoriaEditando !== null) {

        datos.estado =
            Number(
                document
                    .getElementById("estadoCategoria")
                    .value
            );
    }

    try {

        const url =
            categoriaEditando !== null
                ? `${API}/categorias/${categoriaEditando}`
                : `${API}/categorias`;

        const metodo =
            categoriaEditando !== null
                ? "PUT"
                : "POST";

        const respuesta =
            await fetch(url, {

                method: metodo,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(datos)
            });

        const resultado =
            await respuesta.json();

        if (!respuesta.ok) {

            alert(
                resultado.mensaje ||
                resultado.error ||
                "Error al guardar categoría."
            );

            return;
        }

        alert(
            categoriaEditando !== null
                ? "Categoría actualizada correctamente."
                : "Categoría registrada correctamente."
        );

        categoriaEditando = null;

        cargarCategorias();

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");
    }
}


function editarCategoria(item) {

    mostrarFormularioCategoria(item);
}


async function desactivarCategoria(id) {

    if (!confirm(
        "¿Está seguro de desactivar esta categoría?"
    )) {
        return;
    }

    try {

        const respuesta =
            await fetch(
                `${API}/categorias/${id}`,
                {
                    method: "DELETE"
                }
            );

        const resultado =
            await respuesta.json();

        if (!respuesta.ok) {

            alert(
                resultado.mensaje ||
                resultado.error ||
                "No se pudo desactivar."
            );

            return;
        }

        alert(
            "Categoría desactivada correctamente."
        );

        cargarCategorias();

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");
    }
}


// ======================================================
// OFICINAS
// ======================================================

async function cargarOficinas() {

    const contenido =
        document.getElementById("contenido");

    contenido.innerHTML =
        "<h2>Cargando oficinas...</h2>";

    try {

        const respuesta =
            await fetch(`${API}/oficinas`);

        const datos =
            await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || datos.error);
        }

        let html = `

            <div class="titulo-modulo">

                <h2>Gestión de Oficinas</h2>

                <button
                    class="btn btn-nuevo"
                    onclick="mostrarFormularioOficina()">
                    + Nueva oficina
                </button>

            </div>

            <input
                type="text"
                id="buscarOficina"
                placeholder="Buscar oficina..."
                onkeyup="filtrarTabla('buscarOficina','tablaOficinas')"
                class="buscador"
            >

            <table id="tablaOficinas">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>

                </thead>

                <tbody>
        `;

        datos.forEach(item => {

            html += `

                <tr>

                    <td>${item.id}</td>

                    <td>${item.nombre}</td>

                    <td>${item.descripcion || ""}</td>

                    <td>
                        ${
                            item.estado
                                ? '<span class="activo">Activo</span>'
                                : '<span class="inactivo">Inactivo</span>'
                        }
                    </td>

                    <td>

                        <button
                            class="btn btn-editar"
                            onclick='editarOficina(${JSON.stringify(item)})'>
                            Editar
                        </button>

                        ${
                            item.estado
                            ?
                            `<button
                                class="btn btn-eliminar"
                                onclick="desactivarOficina(${item.id})">
                                Desactivar
                            </button>`
                            :
                            ""
                        }

                    </td>

                </tr>
            `;

        });

        html += `
                </tbody>
            </table>
        `;

        contenido.innerHTML = html;

    } catch (error) {

        console.error(error);

        contenido.innerHTML =
            "<p>Error al cargar oficinas.</p>";
    }
}


// ======================================================
// NUEVA / EDITAR OFICINA
// ======================================================

function mostrarFormularioOficina(item = null) {

    oficinaEditando =
        item ? item.id : null;

    const contenido =
        document.getElementById("contenido");

    contenido.innerHTML = `

        <h2>
            ${
                item
                    ? "Editar Oficina"
                    : "Nueva Oficina"
            }
        </h2>

        <form id="formOficina">

            <label>Nombre:</label>

            <input
                type="text"
                id="nombreOficina"
                value="${item?.nombre || ""}"
                required
            >

            <label>Descripción:</label>

            <textarea
                id="descripcionOficina"
            >${item?.descripcion || ""}</textarea>

            ${
                item
                ?
                `
                <label>Estado:</label>

                <select id="estadoOficina">

                    <option
                        value="1"
                        ${item.estado ? "selected" : ""}>
                        Activo
                    </option>

                    <option
                        value="0"
                        ${!item.estado ? "selected" : ""}>
                        Inactivo
                    </option>

                </select>
                `
                :
                ""
            }

            <div class="acciones-formulario">

                <button
                    type="submit"
                    class="btn btn-nuevo">

                    ${
                        item
                            ? "Actualizar"
                            : "Guardar"
                    }

                </button>

                <button
                    type="button"
                    class="btn btn-cancelar"
                    onclick="cargarOficinas()">
                    Cancelar
                </button>

            </div>

        </form>
    `;

    document
        .getElementById("formOficina")
        .addEventListener(
            "submit",
            guardarOficina
        );
}


async function guardarOficina(event) {

    event.preventDefault();

    const datos = {

        nombre:
            document
                .getElementById("nombreOficina")
                .value
                .trim(),

        descripcion:
            document
                .getElementById("descripcionOficina")
                .value
                .trim()
    };

    if (oficinaEditando !== null) {

        datos.estado =
            Number(
                document
                    .getElementById("estadoOficina")
                    .value
            );
    }

    try {

        const url =
            oficinaEditando !== null
                ? `${API}/oficinas/${oficinaEditando}`
                : `${API}/oficinas`;

        const metodo =
            oficinaEditando !== null
                ? "PUT"
                : "POST";

        const respuesta =
            await fetch(url, {

                method: metodo,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(datos)
            });

        const resultado =
            await respuesta.json();

        if (!respuesta.ok) {

            alert(
                resultado.mensaje ||
                resultado.error ||
                "Error al guardar oficina."
            );

            return;
        }

        alert(
            oficinaEditando !== null
                ? "Oficina actualizada correctamente."
                : "Oficina registrada correctamente."
        );

        oficinaEditando = null;

        cargarOficinas();

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");
    }
}


function editarOficina(item) {

    mostrarFormularioOficina(item);
}


async function desactivarOficina(id) {

    if (!confirm(
        "¿Está seguro de desactivar esta oficina?"
    )) {
        return;
    }

    try {

        const respuesta =
            await fetch(
                `${API}/oficinas/${id}`,
                {
                    method: "DELETE"
                }
            );

        const resultado =
            await respuesta.json();

        if (!respuesta.ok) {

            alert(
                resultado.mensaje ||
                resultado.error ||
                "No se pudo desactivar."
            );

            return;
        }

        alert(
            "Oficina desactivada correctamente."
        );

        cargarOficinas();

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");
    }
}


// ======================================================
// REQUISITOS
// ======================================================

async function cargarRequisitos() {

    const contenido =
        document.getElementById("contenido");

    contenido.innerHTML =
        "<h2>Cargando requisitos...</h2>";

    try {

        const respuesta =
            await fetch(`${API}/requisitos`);

        const datos =
            await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || datos.error);
        }

        let html = `

            <div class="titulo-modulo">

                <h2>Gestión de Requisitos</h2>

                <button
                    class="btn btn-nuevo"
                    onclick="mostrarFormularioRequisito()">
                    + Nuevo requisito
                </button>

            </div>

            <input
                type="text"
                id="buscarRequisito"
                placeholder="Buscar requisito..."
                onkeyup="filtrarTabla('buscarRequisito','tablaRequisitos')"
                class="buscador"
            >

            <table id="tablaRequisitos">

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Obligatorio</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>

                </thead>

                <tbody>
        `;

        datos.forEach(item => {

            html += `

                <tr>

                    <td>${item.id}</td>

                    <td>${item.nombre}</td>

                    <td>${item.descripcion || ""}</td>

                    <td>
                        ${item.obligatorio ? "Sí" : "No"}
                    </td>

                    <td>
                        ${
                            item.estado
                                ? '<span class="activo">Activo</span>'
                                : '<span class="inactivo">Inactivo</span>'
                        }
                    </td>

                    <td>

                        <button
                            class="btn btn-editar"
                            onclick='editarRequisito(${JSON.stringify(item)})'>
                            Editar
                        </button>

                        ${
                            item.estado
                            ?
                            `<button
                                class="btn btn-eliminar"
                                onclick="desactivarRequisito(${item.id})">
                                Desactivar
                            </button>`
                            :
                            ""
                        }

                    </td>

                </tr>
            `;

        });

        html += `
                </tbody>
            </table>
        `;

        contenido.innerHTML = html;

    } catch (error) {

        console.error(error);

        contenido.innerHTML =
            "<p>Error al cargar requisitos.</p>";
    }
}


// ======================================================
// NUEVO / EDITAR REQUISITO
// ======================================================

function mostrarFormularioRequisito(item = null) {

    requisitoEditando =
        item ? item.id : null;

    const contenido =
        document.getElementById("contenido");

    contenido.innerHTML = `

        <h2>
            ${
                item
                    ? "Editar Requisito"
                    : "Nuevo Requisito"
            }
        </h2>

        <form id="formRequisito">

            <label>Nombre:</label>

            <input
                type="text"
                id="nombreRequisito"
                value="${item?.nombre || ""}"
                required
            >

            <label>Descripción:</label>

            <textarea
                id="descripcionRequisito"
            >${item?.descripcion || ""}</textarea>

            <label>

                <input
                    type="checkbox"
                    id="obligatorioRequisito"
                    ${item?.obligatorio ? "checked" : ""}
                >

                Obligatorio

            </label>

            ${
                item
                ?
                `
                <br>

                <label>Estado:</label>

                <select id="estadoRequisito">

                    <option
                        value="1"
                        ${item.estado ? "selected" : ""}>
                        Activo
                    </option>

                    <option
                        value="0"
                        ${!item.estado ? "selected" : ""}>
                        Inactivo
                    </option>

                </select>
                `
                :
                ""
            }

            <div class="acciones-formulario">

                <button
                    type="submit"
                    class="btn btn-nuevo">

                    ${
                        item
                            ? "Actualizar"
                            : "Guardar"
                    }

                </button>

                <button
                    type="button"
                    class="btn btn-cancelar"
                    onclick="cargarRequisitos()">
                    Cancelar
                </button>

            </div>

        </form>
    `;

    document
        .getElementById("formRequisito")
        .addEventListener(
            "submit",
            guardarRequisito
        );
}


async function guardarRequisito(event) {

    event.preventDefault();

    const datos = {

        nombre:
            document
                .getElementById("nombreRequisito")
                .value
                .trim(),

        descripcion:
            document
                .getElementById("descripcionRequisito")
                .value
                .trim(),

        obligatorio:
            document
                .getElementById("obligatorioRequisito")
                .checked
                ? 1
                : 0
    };

    if (requisitoEditando !== null) {

        datos.estado =
            Number(
                document
                    .getElementById("estadoRequisito")
                    .value
            );
    }

    try {

        const url =
            requisitoEditando !== null
                ? `${API}/requisitos/${requisitoEditando}`
                : `${API}/requisitos`;

        const metodo =
            requisitoEditando !== null
                ? "PUT"
                : "POST";

        const respuesta =
            await fetch(url, {

                method: metodo,

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(datos)
            });

        const resultado =
            await respuesta.json();

        if (!respuesta.ok) {

            alert(
                resultado.mensaje ||
                resultado.error ||
                "Error al guardar requisito."
            );

            return;
        }

        alert(
            requisitoEditando !== null
                ? "Requisito actualizado correctamente."
                : "Requisito registrado correctamente."
        );

        requisitoEditando = null;

        cargarRequisitos();

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");
    }
}


function editarRequisito(item) {

    mostrarFormularioRequisito(item);
}


async function desactivarRequisito(id) {

    if (!confirm(
        "¿Está seguro de desactivar este requisito?"
    )) {
        return;
    }

    try {

        const respuesta =
            await fetch(
                `${API}/requisitos/${id}`,
                {
                    method: "DELETE"
                }
            );

        const resultado =
            await respuesta.json();

        if (!respuesta.ok) {

            alert(
                resultado.mensaje ||
                resultado.error ||
                "No se pudo desactivar."
            );

            return;
        }

        alert(
            "Requisito desactivado correctamente."
        );

        cargarRequisitos();

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor.");
    }
}


// ======================================================
// FILTRO GENERAL DE TABLAS
// ======================================================

function filtrarTabla(inputId, tablaId) {

    const input =
        document.getElementById(inputId);

    const texto =
        input.value.toLowerCase();

    const filas =
        document.querySelectorAll(
            `#${tablaId} tbody tr`
        );

    filas.forEach(fila => {

        fila.style.display =
            fila.textContent
                .toLowerCase()
                .includes(texto)
                ? ""
                : "none";
    });
}