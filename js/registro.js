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
        const request = indexedDB.open("USERS", 1);
        request.onupgradeneeded = function(event) {
            let db = event.target.result;
            if (!db.objectStoreNames.contains("USERS")) {
                db.createObjectStore("USERS", { data: "id" });
            }
        };
        request.onsuccess = function(event){
            let db = event.target.result;
            btnRegistrar.addEventListener('click', (e)=>{
                e.preventDefault(); 
                const data = {
                    id:document.getElementById('numID').value,
                    nombre:document.getElementById('Nombre').value,
                    cargo:document.querySelector('input[name="cargo"]:checked').value,
                    email:document.getElementById('email').value,
                    contraseña:document.getElementById('password').value,
                }
                const transaction = db.transaction(["USERS"], "readwrite")
                const store = transaction.objectStore("USERS");
                const checkRequest = store.get(data.id);
                checkRequest.onsuccess = () => {
                    if (checkRequest.result) {
                        alert("Ya existe un usuario con ese ID");
                    } else {
                        store.add(data);
                    }
};
                checkRequest.onerror = () => {
                    console.log("Error al agregar el usuario. Puede que el ID ya exista.");
                };
                const getRequest = store.get(data.id);
                getRequest.onsuccess = () => {
                console.log("Usuario encontrado:", getRequest.result);
                };
            })
            
        }
        request.onerror = function () {
            console.log("Error al abrir la base de datos");
        };
        
       
       
       
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