import { generateLoginComponent } from './components/formLogin.js';

const appElement = document.getElementById('loginBody');
const loginComponent = generateLoginComponent(appElement);

loginComponent.renderLogin();
