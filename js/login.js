class Login extends HTMLElement {
    constructor(){

        super();

        const html = `
            <h2>Inicio de Secion</h2>
            <form action="">
                <p>Usuario</p><input type="text">
                <p>Contraseña</p><input type="password">
            </form>
            <p>¿No tienes Usuario?</p><button id="btnRegistrar">Registrate Aqui</button>`;

        const css = ``

        this.innerHTML = html + css
    }

    static observedAttributes = ["on-registro", "out-registro"];

    attributeChangedCallback(nombre, valorAntiguio, valorNuevo){
        switch (nombre){
            case "on-registro":
                this.registroComponent = valorNuevo;
                break;
            

        }
    }

    connectedCallback(){
        const btnRegistrar = document.getElementById('btnRegistrar')
        btnRegistrar.addEventListener('click', ()=>{
            const main = document.querySelector('main')
            main.innerHTML =`
            <${this.registroComponent} out-registro="login-component"></${this.registroComponent}> 
            `
        })
        console.log('conectado')
    }
}
customElements.define('login-component', Login);
