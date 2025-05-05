import { generateLoginComponent } from './model/formLogin.js';

let loginComponent;

const appElement = document.getElementById('loginBody');
loginComponent = generateLoginComponent(appElement);
//loginComponent.build();
loginComponent.renderFormLogin();


