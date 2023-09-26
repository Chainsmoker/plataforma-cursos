const ver_respuesta = document.querySelectorAll("#ver_respuesta");
const pregunta_flecha = document.querySelectorAll("#pregunta_flecha");
const contenedor_reguntas = document.querySelector(".preguntas");

for (let index = 0; index < ver_respuesta.length; index++) {
    ver_respuesta[index].addEventListener("click", () => {
        pregunta_flecha.forEach((flecha) => {
            flecha.classList.remove("girar__flecha");
        });

        const tieneClase = ver_respuesta[index].classList.contains("ver__respuesta");

        if (contenedor_reguntas.querySelector(".ver__respuesta")) {
            contenedor_reguntas.querySelector(".ver__respuesta").classList.remove("ver__respuesta");
        }      
        if (!tieneClase) {
            ver_respuesta[index].classList.add("ver__respuesta");
            pregunta_flecha[index].classList.add("girar__flecha");
        }
    });
}
