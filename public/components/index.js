import { generateLoginComponent } from './model/formLogin.js';
import { socket } from '../middleware/socket.js';
import { inviteController } from '../components/controller/inviteController.js';

const appElement = document.getElementById('loginBody');
const loginComponent = generateLoginComponent(appElement);
loginComponent.renderFormLogin();

// Avvia controller inviti SOLO se loggato
const savedUsername = sessionStorage.getItem("username");
if (savedUsername) {
  socket.emit("join", savedUsername);

  const gameContainer = document.getElementById("game-container");
  inviteController.init(socket, gameContainer);
}
