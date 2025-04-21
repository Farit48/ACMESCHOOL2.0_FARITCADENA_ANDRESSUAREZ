class Registro extends HTMLElement {
    constructor(){

        super();

        const html = `
            <h1>Registro</h1>
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
                    <button id="btnRegistrar" type="submit" >REGISTRAR</button>
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