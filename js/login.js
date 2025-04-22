import { openDatabase } from './db.js';
class Login extends HTMLElement {
    constructor(){

        super();

        const html = `
            <h2>Inicio de Secion</h2>
            <form action="">
                <p>Usuario</p><input id="email" type="text">
                <p>Contraseña</p><input id="password" type="password">
            </form>
            <button id="btnLogin" type="button">Log In</button>
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
        const btnLogin = document.getElementById('btnLogin');
        btnRegistrar.addEventListener('click', ()=>{
            const main = document.querySelector('main')
            main.innerHTML =`
            <${this.registroComponent} out-registro="login-component"></${this.registroComponent}> 
            `
        })
        btnLogin.addEventListener('click', async () => {
            const email = this.querySelector('#email').value;
            const password = this.querySelector('#password').value;

            try {
                const db = await openDatabase();
                const tx = db.transaction(["usuarios"], "readonly");
                const store = tx.objectStore("usuarios");

                const getRequest = store.index("email").get(email);
                getRequest.onsuccess = () => {
                    const usuario = getRequest.result;
                    if (usuario && usuario.contraseña === password) {
                        this.showDashboard(usuario);
                    } else {
                        alert("Usuario o contraseña incorrectos.");
                    }
                };
                getRequest.onerror = () => {
                    alert("No se encontró el usuario.");
                };
            } catch (err) {
                console.error("Error al acceder a la base de datos:", err);
            }
        });
    }

    showDashboard(usuario) {
        console.log(`hola ${usuario}`)
        const main = document.getElementById('mainDashboard');
        if (usuario.cargo === "Administrativo") {
            console.log('hola esste es el dash')
            window.location.href = '/dashboard.html'
            main.innerHTML = `<h1>hola ADMIN</h1>`
        } else if (usuario.cargo === "Profesor") {
            window.location.href = '/dashboard.html'
            main.innerHTML =`<h1>hola PROFE</h1>`
        } else {
            alert("Tipo de usuario desconocido.");
        }
    }

  
    
}
       

customElements.define('login-component', Login);
