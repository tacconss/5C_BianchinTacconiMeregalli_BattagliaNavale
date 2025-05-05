
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

  const renderFormLogin = () => {
    parentElement.innerHTML = html;

    document.getElementById("toggleForm").addEventListener("click", () => {
      isLogin = !isLogin;
      document.getElementById("form-title").textContent = isLogin ? "Login" : "Registrazione";
      document.querySelector("#userForm button").textContent = isLogin ? "Accedi" : "Registrati";
      document.getElementById("toggleForm").textContent = isLogin
        ? "Non hai un account? Registrati"
        : "Hai già un account? Accedi";
    });

    document.getElementById("userForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const form = e.target;
      const name = form.name.value;
      const password = form.password.value;

      try {
        const endpoint = isLogin ? "/login" : "/register";
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, password }),
        });

        const data = await res.json();
        if (data.result) {
          alert(data.result);
          if (!isLogin) {
            document.getElementById("toggleForm").click();
            form.reset();
          } else {
            // Login riuscito → redirect
            window.location.href = location.origin.replace("5050", "5051") + "/pages/home.html";

          }
        } else {
          alert(data.error || "Errore");
        }
      } catch (error) {
        alert("Errore di rete o server");
      }
    });
  };

  return {
    build: () => {},
    renderFormLogin
  };
};
