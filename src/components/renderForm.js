// renderForm.js
export const renderForm = (parentElement, initialIsLogin = true) => {
    const html = `
      <style>
        body { font-family: sans-serif; text-align: center; margin-top: 50px; }
        form { display: inline-block; text-align: left; }
        input, button, select { display: block; margin: 10px 0; padding: 8px; width: 100%; }
        .switch { margin-top: 20px; font-size: 0.9em; color: #555; cursor: pointer; }
      </style>
  
      <h2 id="form-title">${initialIsLogin ? "Login" : "Registrazione"}</h2>
      <form id="userForm">
        <input type="text" name="name" placeholder="Nome utente" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">${initialIsLogin ? "Accedi" : "Registrati"}</button>
      </form>
      <div class="switch" id="toggleForm">
        ${initialIsLogin ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
      </div>
    `;
  
    parentElement.innerHTML = html;
  
    return {
      form: parentElement.querySelector("#userForm"),
      toggle: parentElement.querySelector("#toggleForm"),
      title: parentElement.querySelector("#form-title"),
      button: parentElement.querySelector("#userForm button"),
    };
  };
  