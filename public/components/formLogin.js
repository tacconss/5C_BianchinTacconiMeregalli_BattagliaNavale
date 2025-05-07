import { handleLoginOrRegister } from "./registerLogin.js";

export const generateLoginComponent = (parentElement) => {
  let isLogin = true;

  const html = `
    <style>
      body { font-family: sans-serif; text-align: center; margin-top: 50px; }
      form { display: inline-block; text-align: left; }
      input, button, select { display: block; margin: 10px 0; padding: 8px; width: 100%; }
      .switch { margin-top: 20px; font-size: 0.9em; color: #555; cursor: pointer; }
    </style>

    <h2 id="form-title">Login</h2>
    <form id="userForm">
      <input type="text" name="name" placeholder="Nome utente" required />
      <input type="password" name="password" placeholder="Password" required />
      <button type="submit">Accedi</button>
    </form>
    <div class="switch" id="toggleForm">Non hai un account? Registrati</div>
  `;

  const renderLogin = () => {
    parentElement.innerHTML = html;

    const toggle = document.getElementById("toggleForm");
    const formTitle = document.getElementById("form-title");
    const formButton = document.querySelector("#userForm button");
    const userForm = document.getElementById("userForm");

    toggle.onclick = () => {
      isLogin = !isLogin;
      formTitle.innerText = isLogin ? "Login" : "Registrazione";
      formButton.innerText = isLogin ? "Accedi" : "Registrati";
      toggle.innerText = isLogin
        ? "Non hai un account? Registrati"
        : "Hai già un account? Accedi";
    };

    userForm.onsubmit = async (e) => {
      e.preventDefault();
      const name = userForm.name.value;
      const password = userForm.password.value;

      await handleLoginOrRegister({ name, password, isLogin, form: userForm, toggle });
    };
  };

  return {
    renderLogin,
    renderRegister: renderLogin
  };
};