export const generateLoginComponent = (parentElement) => {
    let token;
    let isLogged;
    let privateClass;

    const login = (username, password) => {
        /* return new Promise((resolve, reject) => {
             fetch("https://ws.cipiaceinfo.it/credential/login", {
                 method: "POST",
                 headers: {
                     "content-type": "application/json",
                     "key": token
                 },
                 body: JSON.stringify({
                     username: username,
                     password: password
                 })
             })
             .then(r => r.json())
             .then(data => resolve(data.result))
             .catch(err => reject(err.result));
         });*/
        return true;
    };

    return {
        build: () => {//inputToken, inputPrivateClass) => {
            isLogged = true;
            /* token = inputToken;
             isLogged = sessionStorage.getItem("logged") || false;
             privateClass = inputPrivateClass;

             if (isLogged) {
                 document.getElementById("loginContainer").classList.remove("visible");
                 document.getElementById("loginContainer").classList.add("hidden");
                 document.querySelectorAll("." + privateClass).forEach(e => {
                     e.classList.remove("hidden");
                     e.classList.add("visible");
                 });
             }*/
        },

        renderFormLogin: () => {
            let html = `
           <div>
                <input type="text" id="usernameInput" placeholder="Username">
            </div>
            <div>
                <input type="password" id="passwordInput" placeholder="Password">
            </div>
            <p>Non hai un account? <a href='#' id="registerLink">Registrati</a></p>
            <button id="loginButton">Accedi</button>
      `;

            parentElement.innerHTML = html;

            const registerLink = parentElement.querySelector("#registerLink");
            if (registerLink) {
                registerLink.onclick = () => {
                    const switchButton = document.querySelector("#closeModalClient");
                    if (switchButton) {
                        switchButton.click(); // Simula il click sul pulsante principale
                    }
                };
            }

            // (La logica per l'invio del form di login andrebbe qui)
            const loginButton = parentElement.querySelector("#loginButton");
            if (loginButton) {
                loginButton.onclick = () => {
                    const username = parentElement.querySelector("#usernameInput")?.value;
                    const password = parentElement.querySelector("#passwordInput")?.value;

                    if (username && password) {
                        login(username, password)
                            .then(r => {
                                if (r) {
                                    isLogged = true;
                                    sessionStorage.setItem("Logged", true);
                                    // ... (gestisci la navigazione o l'aggiornamento dell'UI dopo il login)
                                    alert("Login effettuato con successo!");
                                } else {
                                    alert("Credenziali errate");
                                }
                            })
                            .catch(err => {
                                console.error("Errore durante il login:", err);
                                alert("Errore durante il login");
                            });
                    } else {
                        alert("Inserisci username e password.");
                    }
                };
            }
        },
        isLogged: () => {
            return isLogged;
        },
        renderFormRegister: () => {
            let html = `
                <div class="input-container">
                    <label for="email">Email</label>
                    <input type="email" id="email" placeholder="Email">
                </div>
                <div class="input-container">
                    <label for="password">Password</label>
                    <input type="password" id="password" placeholder="Password">
                </div>
                <div class="input-container">
                    <label>Registrati come:</label>
                    <div class="role-selection">
                        <input type="radio" id="approver" name="role" value="approver">
                        <label class="role-btn black" for="approver">approver</label>
                        <input type="radio" id="editor" name="role" value="editor">
                        <label class="role-btn gray" for="editor">editor</label>
                    </div>
                    <p>Hai già un account? <a href='#' id="loginLink">Accedi</a></p>
                </div>
                <button id="registerButton">Registrati</button>
                <div id="result"></div>`;
            parentElement.innerHTML = html;

            const loginLink = parentElement.querySelector("#loginLink");
            if (loginLink) {
                loginLink.onclick = () => {
                    const switchButton = document.querySelector("#closeModalClient");
                    if (switchButton) {
                        switchButton.click(); // Simula il click sul pulsante principale
                    }
                };
            }

            const registerButton = parentElement.querySelector("#registerButton");
            if (registerButton) {
                registerButton.onclick = () => {
                    const email = parentElement.querySelector("#email")?.value;
                    const password = parentElement.querySelector("#password")?.value;
                    const role = parentElement.querySelector('input[name="role"]:checked')?.value;

                    if (email && password && role) {
                        // Qui andrebbe la tua logica di registrazione
                        console.log("Registrazione:", email, password, role);
                        alert("Registrazione simulata!");
                    } else {
                        alert("Compila tutti i campi per la registrazione.");
                    }
                };
            }
        }
    };
};