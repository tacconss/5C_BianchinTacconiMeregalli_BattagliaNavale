import { generateLoginComponent } from './components/formLogin.js';

const appElement = document.getElementById('loginBody');
const loginComponent = generateLoginComponent(appElement);

// Mostra il form di login (che può anche switchare a registrazione)
loginComponent.renderLogin();