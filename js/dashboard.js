class Dash extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });  // Crear shadow DOM
    }

    connectedCallback() {
        const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
        if (usuario) {
            this.render(usuario.cargo, usuario.nombre);
        } else {
            this.shadowRoot.innerHTML = `<h1>No hay usuario activo</h1>`;
        }
    }

    render(cargo, nombre) {
        if (cargo === 'Administrativo') {
            this.shadowRoot.innerHTML = `
                <style>.admin { color: blue; }</style>
                <header>
                    <h2>Acme Shool Institute</h2>
                    <p>Bienvenido ${cargo} ${nombre}</p>
                    <p>Settings</p>
                </header>
                <main>
                    <section>
                        <h2>Cursos Asociados</h2>
                        <button type="button">Registrar nuevo</button>
                    </section>
                    <section>
                        <h2>Profesores</h2>
                        <button type="button">Registrar nuevo</button>
                    </section>
                    <section>
                        <h2>Estudiantes</h2>
                        <button type="button">Registrar nuevo</button>
                    </section>
                    
                </main>
            `;
        } else if (cargo === 'Profesor') {
            this.shadowRoot.innerHTML = `
                <style>.admin { color: blue; }</style>
                <header>
                    <h2>Acme Shool Institute</h2>
                    <p>Bienvenido ${cargo} ${nombre}</p>
                    <p>Settings</p>
                </header>
                <main>
                    <section>
                        <h2>Cursos Asociados</h2>
                        
                    </section>
                    
                    <section>
                        <h2>Calificar Estudiantes</h2>
                        <button type="button">Califiacar</button>
                    </section>
                    
                </main>
            `;
        } else {
            this.shadowRoot.innerHTML = `<h2>Tipo de usuario no reconocido</h2>`;
        }
    }
}

customElements.define('dash-admin', Dash);