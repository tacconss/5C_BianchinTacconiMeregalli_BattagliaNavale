// components/controller/formController.js
import { formModel } from "../model/formModel.js";
import { formView } from "../view/formView.js";

export const formController = {
  init(parentElement) {
    const render = () => {
      formView.render(parentElement, formModel.isLogin);

      document.getElementById("toggleForm").onclick = () => {
        formModel.toggleLoginState();
        render(); // ri-renderizza il form aggiornato
      };

      document.getElementById("userForm").onsubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const password = form.password.value;

        const endpoint = formModel.isLogin ? "/login" : "/register";

        try {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, password }),
          });

          const data = await res.json();
          if (data.result) {
            alert(data.result);
            if (!formModel.isLogin) {
              document.getElementById("toggleForm").click();
              form.reset();
            } else {
              window.location.href = location.origin.replace("5050", "5051") + "/pages/home.html";
            }
          } else {
            alert(data.error || "Errore");
          }
        } catch (error) {
          alert("Errore di rete o server");
        }
      };
    };

    render(); // prima renderizzazione
  }
};
