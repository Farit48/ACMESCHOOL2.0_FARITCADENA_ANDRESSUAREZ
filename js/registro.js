import { openDatabase } from './db.js'; 
class Registro extends HTMLElement {
    constructor(){

        super();

          
        const html = `
            <h2>Registro</h2>
            <section>
                <form action="#">
                    <p>Numero de identificacion</p>
                    <input id="numID" type="number" name="numID" >
                    <p>Nombre</p>
                    <input id="Nombre" type="text">
                    <p>Cargo</p>
                    <span>Administrativo</span><input id="cargo" type="radio" name="cargo"  value="Administrativo">
                    <span>Profesor</span><input id="cargo" type="radio" name="cargo"  value="Profesor">
                    <p>Email</p>
                    <input id="email" type="email" name="email" >
                    <p>Contraseña</p>
                    <input  id="password" type="password"><br>
                    <style>
                    button{
                        margin-top:30px;
                    }
                    </style>
                    <button  id="btnRegistrar" type="button" >REGISTRAR</button>
                    <button id="btnCancelar" type="submit" >CANCELAR</button>
                </form>
            <section>`;

        const css = ``

        this.innerHTML = html + css
       
    }
    static observedAttributes = ["out-registro"];

    attributeChangedCallback(nombre, valorAntiguio, valorNuevo){
        switch (nombre){
            case "out-registro":
                this.loginComponent = valorNuevo;
                break;
             
        }
    }

    connectedCallback(){
        const btnRegistrar= document.getElementById('btnRegistrar')
        btnRegistrar.addEventListener('click', async (e) => {
            e.preventDefault();
    
            const nuevoUsuario = {
                id: parseInt(this.querySelector('#numID').value),
                nombre: this.querySelector('#Nombre').value,
                cargo: this.querySelector('input[name="cargo"]:checked').value,
                email: this.querySelector('#email').value,
                contraseña: this.querySelector('#password').value,
            };
    
            try {
                const db = await openDatabase();
    
                
                if (!db.objectStoreNames.contains("usuarios")) {
                    db.close();
                    const upgradeRequest = indexedDB.open("MiBaseDeDatos", db.version + 1);
                    upgradeRequest.onupgradeneeded = function (event) {
                        const db = event.target.result;
                        db.createObjectStore("usuarios", { keyPath: "id" });
                    };
                    upgradeRequest.onsuccess = async function () {
                        (await openDatabase()).transaction(["usuarios"], "readwrite")
                            .objectStore("usuarios").add(nuevoUsuario);
                        alert("Usuario registrado después de crear la store.");
                    };
                    return;
                }
    
                const tx = db.transaction(["usuarios"], "readwrite");
                const store = tx.objectStore("usuarios");
                const addReq = store.add(nuevoUsuario);
    
                addReq.onsuccess = () => alert("Usuario registrado exitosamente.");
                addReq.onerror = (e) => {
                    alert("Error: ya existe un usuario con ese ID.");
                    console.error(e);
                };
    
            } catch (err) {
                console.error("Error al registrar usuario:", err);
            }
        });
        const btnCancelar = document.getElementById('btnCancelar')
        btnCancelar.addEventListener('click', ()=>{
            const main = document.querySelector('main')
            main.innerHTML =`
            <${this.loginComponent} on-registro="registro-component"></${this.loginComponent}> 
            `
            console.log('conectado en registro')
        })
        
    }
}
customElements.define('registro-component', Registro)