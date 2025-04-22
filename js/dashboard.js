class Dash extends HTMLElement {
    constructor(){
        super();
        const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
        this.innerHTML = `<h1>Hola, ${usuario.cargo} ${usuario.nombre}</h1>`
        if (usuario) {
            this.setAttribute('cargo', usuario.cargo);
        }
    }
    static observedAttributes = ["cargo"];
    attributeChangedCallback(nombre, oldVal, newVal) {
        if (nombre === 'cargo') {
            this.render(newVal);
        }
    }
    render(cargo) {
        if (cargo === 'Administrativo') {
            this.shadowRoot.innerHTML = `
                <style>.admin { color: blue; }</style>
                <h2 class="admin">Bienvenido Administrativo</h2>
            `;
        } else if (cargo === 'Profesor') {
            this.shadowRoot.innerHTML = `
                <style>.profe { color: green; }</style>
                <h2 class="profe">Bienvenido Profesor</h2>
            `;
        } else {
            this.shadowRoot.innerHTML = `<h2>Tipo de usuario no reconocido</h2>`;
        }
    }
    connectedCallback(){
        console.log('tamo')
        const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));
        const cargo = usuario?.cargo;
        if (cargo === "Profesor") {
            console.log("Mostrar dashboard de profesor");
        } else if (cargo === "Administrativo") {
            console.log("Mostrar dashboard administrativo");
        }
    }
}

customElements.define('dash-admin', Dash)