import { generateLoginComponent } from './components/formLogin.js';

let loginComponent;

document.addEventListener('DOMContentLoaded', () => {
    const appElement = document.getElementById('loginBody');
    loginComponent = generateLoginComponent(appElement);
    loginComponent.build();
    loginComponent.renderFormLogin();

    document.getElementById('openModal').onclick = () => {
        document.getElementById('modal').style.display = 'block';
    };

    document.getElementById('closeModalClient').onclick = () => {
        document.getElementById('modal').style.display = 'none';
    };
});
