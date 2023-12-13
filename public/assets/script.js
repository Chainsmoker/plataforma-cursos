// ABRIR/CERRAR MENU

const btn_menu = document.querySelector("#btn_menu")

let estado = true

btn_menu.addEventListener("click", ()=>{
    if (estado) {
        btn_menu.querySelector("img").src = "/assets/icons/x.svg"
        estado = false
    } else {
        btn_menu.querySelector("img").src = "/assets/icons/menu.svg"
        estado = true
    }
    document.querySelector(".nav__links").classList.toggle("open__links")
})