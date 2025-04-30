/*export const generateLoginComponent = (parentElement) => {
    let isLogged = false;

    const login = (username, password) => {
        //Dati fittizzi per login
        return Promise.resolve(username === 'admin' && password === 'password');
    };

    return {
        build: () => {
            isLogged = sessionStorage.getItem("logged") === "true";
        },

        /*renderFormLogin: () => {
            const html = `
                <div>
                    <input type="text" id="usernameInput" placeholder="Username">
                </div>
                <div>
                    <input type="password" id="passwordInput" placeholder="Password">
                </div>
                <div>
                    <button id="loginButton">Login</button>
                </div>
                <p>Non hai un account? <a id="registerA" href="#">Registrati</a></p>
            `;

            parentElement.innerHTML = html;
            document.querySelector("#ModalLabel").innerText = "Login";

            document.querySelector("#registerA").onclick = (e) => {
                e.preventDefault();
                document.getElementById("loginBody").classList.add("d-none");
                document.getElementById("registerBody").classList.remove("d-none");
                loginComponent.renderFormRegister();
            };

            

            document.getElementById("loginButton").onclick = () => {
                const username = document.getElementById("usernameInput").value;
                const password = document.getElementById("passwordInput").value;

                if (username && password) {
                    login(username, password)
                        .then(success => {
                            if (success) {
                                isLogged = true;
                                sessionStorage.setItem("logged", "true");
                                //alert("Login effettuato con successo!");
                                window.location.href = "prova.html";
                                document.getElementById("modal").style.display = "none";
                            } else {
                                alert("Credenziali errate");
                            }
                        })
                        .catch(err => console.log(err));
                }
            };
        },
        renderFormLogin: () => {
            const html = `
                <div>
                    <input type="text" id="usernameInput" placeholder="Username">
                </div>
                <div>
                    <input type="password" id="passwordInput" placeholder="Password">
                </div>
                <div>
                    <button id="loginButton">Login</button>
                </div>
                <p>Non hai un account? <a id="registerA" href="#">Registrati</a></p> 
                `;

            parentElement.innerHTML = html;
            document.querySelector("#ModalLabel").innerText = "Login";

         
            document.querySelector("#registerA").onclick = (e) => {
               
                window.location.href = "register.html"; 
            
            };
           

            document.getElementById("loginButton").onclick = () => {
                const username = document.getElementById("usernameInput").value;
                const password = document.getElementById("passwordInput").value;

                if (username && password) {
                    login(username, password)
                        .then(success => {
                            if (success) {
                                isLogged = true;
                                sessionStorage.setItem("logged", "true");
                                
                                window.location.href = "home.html";
                              
                                const modalElement = document.getElementById("modal"); 
                                if (modalElement) {
                                    modalElement.style.display = "none";
                                    
                                }
                            } else {
                                alert("Credenziali errate");
                            }
                        })
                        .catch(err => console.log(err));
                }
            };
        },

        renderFormRegister: () => {
            const html = `
                <div class="input-container">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="Email">
                </div>
                <div class="input-container">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="Password">
                </div>
                <div class="input-container">
                    <label>Register as:</label>
                    <div class="role-selection">
                        <input type="radio" id="approver" name="role" value="approver">
                        <label for="approver">Approver</label>
                        <input type="radio" id="editor" name="role" value="editor">
                        <label for="editor">Editor</label>
                    </div>
                    <p>Hai già un account? <a id="AccediA" href="#">Accedi</a></p>
                </div>
            `;

            document.getElementById("registerBody").innerHTML = html;
            document.querySelector("#ModalLabel").innerText = "Registrati";

            document.querySelector("#AccediA").onclick = (e) => {
                e.preventDefault();
                document.getElementById("registerBody").classList.add("d-none");
                document.getElementById("loginBody").classList.remove("d-none");
                loginComponent.renderFormLogin();
            };
        },

        isLogged: () => isLogged,
    };
    
};
*/
import { renderForm } from "./renderForm.js";

export const generateLoginComponent = (parentElement) => {
  let isLogin = true;

  const { form, toggle, title, button } = renderForm(parentElement, isLogin);


  toggle.onclick = () => {
    isLogin = !isLogin;
    title.textContent = isLogin ? "Login" : "Registrazione";
    button.textContent = isLogin ? "Accedi" : "Registrati";
    toggle.textContent = isLogin
      ? "Non hai un account? Registrati"
      : "Hai già un account? Accedi";
  };

  form.onsubmit = async (e) => {
    e.preventDefault();
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
            toggle.onclick();
            form.reset();
          } else {
            // Login riuscito → redirect
            window.location.href = location.origin.replace("3000", "3001") + "/pages/home.html";

          }
        } else {
          alert(data.error || "Errore");
        }
      } catch (error) {
        alert("Errore di rete o server");
      }
    };
  };

