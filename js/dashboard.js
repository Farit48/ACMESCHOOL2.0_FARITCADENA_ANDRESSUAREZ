import { openDatabase } from './db.js';

class Dash extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
        const header = document.getElementById('header');
        header.innerHTML = `
            <style>
            .encabezado {
                display: flex;
                justify-content: space-evenly;
                align-items: center;
            }
            </style>
            <div class="encabezado">
                <h2>Acme School Institute</h2>
                <p>${usuario.nombre}</p>
                <p>Settings</p>
            </div>`;

        if (usuario) {
            this.render(usuario.cargo);
        } else {
            this.shadowRoot.innerHTML = `<h1>No hay usuario activo</h1>`;
        }
        const busquedaInput = this.shadowRoot.querySelector("#busquedaEstudiante");
        busquedaInput.addEventListener("input", async (e) => {
            const filtro = e.target.value;
            await this.buscarEstudiantes(filtro);  
        });
    }

    render(cargo) {
        if (cargo === 'Administrativo') {
            const template = document.getElementById('template-admin');
            const clone = template.content.cloneNode(true);
            this.shadowRoot.appendChild(clone);
            const selectCurso = this.shadowRoot.querySelector("#selectCurso");
            
            // Formulario para crear un nuevo curso
            this.shadowRoot.querySelector("#btnNuevoCurso").addEventListener("click", (e) => {
                e.preventDefault();
                this.crearFormularioCurso();
            });

            // Formulario para crear un nuevo estudiante
            this.shadowRoot.querySelector("#btnNuevoEstudiante").addEventListener("click", (e) => {
                e.preventDefault();
                this.crearFormularioEstudiante();
                
            });

        } else if (cargo === 'Profesor') {
            const template = document.getElementById('template-profe');
            const clone = template.content.cloneNode(true);
            this.shadowRoot.appendChild(clone);
        } else {
            this.shadowRoot.innerHTML = `<h2>Tipo de usuario no reconocido</h2>`;
        }
    }

    
    // Crear formulario para el curso
    crearFormularioCurso() {
        if (this.shadowRoot.querySelector('#formularioCurso')) return;

        const divFormulario = document.createElement('div');
        divFormulario.innerHTML = `
            <form id="formularioCurso">
                <label>Codigo del curso:</label>
                <input type="text" name="codigo" required><br>

                <label>Nombre del curso:</label>
                <input type="text" name="nombre" required><br>

                <label>Descripción:</label>
                <textarea name="descripcion" required></textarea><br>

                <label>Imagen (URL):</label>
                <input type="text" name="imagen" required><br>

                <button type="submit">Guardar Curso</button>
            </form>
        `;
        this.shadowRoot.appendChild(divFormulario);

        const formulario = this.shadowRoot.querySelector('#formularioCurso');
        formulario.addEventListener('submit', async (event) => {
            event.preventDefault();
            const data = {
                id: formulario.codigo.value,
                nombre: formulario.nombre.value,
                descripcion: formulario.descripcion.value,
                imagen: formulario.imagen.value,
                estudiantes: []
            };

            try {
                const db = await openDatabase();
                const cursos = db.transaction("cursos", "readwrite");
                const store = cursos.objectStore("cursos");
                store.add(data);

                alert("Curso registrado exitosamente.");
                formulario.reset();
            } catch (error) {
                console.error("Error guardando curso:", error);
            }
        });
    }

    // Crear formulario para estudiante
    crearFormularioEstudiante() {
        if (this.shadowRoot.querySelector('#formularioEstudiante')) return;

        const divFormulario = document.createElement('div');
        divFormulario.innerHTML = `
            <form id="formularioEstudiante">
                <label> Número de Identificación:</label>
                <input type="number" name="ids" required><br>

                <label>Nombre del Estudiante:</label>
                <input type="text" name="nombre" required><br>

                <label>Email:</label>
                <input type="email" name="email" required><br>

                <label>Imagen (URL):</label>
                <input type="text" name="imagen" required><br>

                <button type="submit">Guardar Estudiante</button>

              
                    
            </form>
        `;
        this.shadowRoot.appendChild(divFormulario);

        const formulario = this.shadowRoot.querySelector('#formularioEstudiante');
        formulario.addEventListener('submit', async (event) => {
            event.preventDefault();
            const data = {
                id: formulario.ids.value,
                nombre: formulario.nombre.value,
                email: formulario.email.value,
                imagen: formulario.imagen.value
            };

            try {
                const db = await openDatabase();
                const estudiantes = db.transaction("estudiantes", "readwrite");
                const store = estudiantes.objectStore("estudiantes");
                store.add(data);

                alert("Estudiante registrado exitosamente.");
                formulario.reset();
            } catch (error) {
                console.error("Error guardando Estudiante:", error);
            }
        });
    }

    // Buscar estudiantes y mostrar resultados
    async buscarEstudiantes(filtro) {
        const db = await openDatabase();
        const trans = db.transaction("estudiantes", "readonly");
        const store = trans.objectStore("estudiantes");
    
        const estudiantesEncontrados = [];
    
        store.openCursor().onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
                const estudiante = cursor.value;
                const coincide = estudiante.id.includes(filtro) ||
                                 estudiante.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
                                 estudiante.apellido.toLowerCase().includes(filtro.toLowerCase());
    
                if (coincide) {
                    estudiantesEncontrados.push(estudiante);
                }
                cursor.continue();
            } else {
                this.mostrarResultados(estudiantesEncontrados);  // Mostrar los resultados cuando se termina la búsqueda
            }
        };
    }

    // Mostrar resultados de la búsqueda de estudiantes
    mostrarResultados(estudiantes) {
        const lista = this.shadowRoot.querySelector('#resultadosBusqueda');
        lista.innerHTML = '';  // Limpiar la lista antes de mostrar nuevos resultados
    
        estudiantes.forEach(est => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${est.nombre} ${est.apellido} (${est.id})
                <button data-id="${est.id}">Agregar</button>
            `;
            li.querySelector('button').addEventListener('click', () => {
                this.agregarEstudianteACurso(est.id);  // Agregar el estudiante al curso
            });
            lista.appendChild(li);
        });
    }
    // Agregar estudiante a un curso
    async agregarEstudianteACurso(estudianteId) {
        const cursoId = this.cursoSeleccionado;  // Debes tener el ID del curso seleccionado
        const db = await openDatabase();
        const trans = db.transaction("cursos", "readwrite");
        const store = trans.objectStore("cursos");
        const req = store.get(cursoId);
    
        req.onsuccess = () => {
            const curso = req.result;
            if (!curso.estudiantes.includes(estudianteId)) {
                curso.estudiantes.push(estudianteId);
                store.put(curso);
                alert("Estudiante agregado al curso.");
            } else {
                alert("Este estudiante ya está en el curso.");
            }
        };
    }
}

customElements.define('dash-main', Dash);