class Login extends HTMLElement {
    constructor(){

        super();

        const html = `
            <h2>Inicio de Secion</h2>
            <form action="">
                <p>Usuario</p><input type="text">
                <p>Contraseña</p><input type="password">
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
        btnLogin.addEventListener('click', (e) => {
            e.preventDefault();
    
            const emailInput = this.querySelector('input[type="text"]').value;
            const passwordInput = this.querySelector('input[type="password"]').value;
    
            const request = indexedDB.open("USERS", 1);
    
            request.onsuccess = function (event) {
                const db = event.target.result;
                const transaction = db.transaction(["USERS"], "readonly");
                const store = transaction.objectStore("USERS");
    
                let found = false;
    
                const cursorRequest = store.openCursor();
    
                cursorRequest.onsuccess = function (e) {
                    const cursor = e.target.result;
                    if (cursor) {
                        const usuario = cursor.value;
                        if (usuario.email === emailInput) {
                            found = true;
                            if (usuario.contraseña === passwordInput) {
                                alert(`✅ Bienvenido, ${usuario.nombre}`);
                                localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
                                // window.location.href = "dashboard.html"; // si quieres redirigir
                            } else {
                                alert("❌ Contraseña incorrecta");
                            }
                            return;
                        }
                        cursor.continue();
                    } else {
                        if (!found) {
                            alert("⚠️ Usuario no registrado");
                        }
                    }
                };
            };
    
            request.onerror = () => {
                console.log("❌ Error al abrir la base de datos.");
            };
        });

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
