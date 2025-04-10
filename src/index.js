import { generateLoginComponent } from "./components/formLogin.js";

const loginContainer = document.querySelector("#login");
const loginBody = document.querySelector("#loginBody");
const registerBody = document.querySelector("#registerBody");
const modalLabel = document.querySelector("#ModalLabel");
const switchButton = document.querySelector("#closeModalClient");

const registerComponent = generateLoginComponent(registerBody);
const loginComponent = generateLoginComponent(loginBody);

loginComponent.renderFormLogin();

switchButton.onclick = () => {
    if (loginBody.classList.contains("visible")) {
        loginBody.classList.remove("visible");
        loginBody.classList.add("d-none");
        registerBody.classList.remove("d-none");
        registerBody.classList.add("visible");
        modalLabel.textContent = "Registrati";
        switchButton.textContent = "Accedi";
        registerComponent.renderFormRegister();
    } else {
        registerBody.classList.remove("visible");
        registerBody.classList.add("d-none");
        loginBody.classList.remove("d-none");
        loginBody.classList.add("visible");
        modalLabel.textContent = "Login";
        switchButton.textContent = "Registrati";
        loginComponent.renderFormLogin();
    }
};