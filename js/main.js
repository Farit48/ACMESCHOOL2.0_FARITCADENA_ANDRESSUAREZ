class miIincio extends HTMLElement{
    constructor(){
        super();
        const shadow = this.attachShadow({mode:'open'})
        this.shadowRoot
    }
    connectedCallback(){
        this.shadowRoot.innerHTML = `
        
        
        `
    }
}
customElements.define('mi-inicio', miIincio)