// components/view/formView.js
export const formView = {
    render(parentElement, isLogin) {
      const html = `
        <style>
          body { font-family: sans-serif; text-align: center; margin-top: 50px; }
          form { display: inline-block; text-align: left; }
          input, button, select { display: block; margin: 10px 0; padding: 8px; width: 100%; }
          .switch { margin-top: 20px; font-size: 0.9em; color: #555; cursor: pointer; }
        </style>
  
        <h2 id="form-title">${isLogin ? "Login" : "Registrazione"}</h2>
        <form id="userForm">
          <input type="text" name="name" placeholder="Nome utente" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">${isLogin ? "Accedi" : "Registrati"}</button>
        </form>
        <div class="switch" id="toggleForm">
          ${isLogin ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
        </div>
      `;
  
      parentElement.innerHTML = html;
    }
  };
  