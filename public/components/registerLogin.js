export const handleLoginOrRegister = async ({ name, password, isLogin, form, toggle }) => {
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
          toggle.click(); 
          form.reset();
        } else {
          window.location.href = "/pages/home.html";
        }
      } else {
        alert(data.error || "Errore");
      }
    } catch (error) {
      alert("Errore di rete o server");
    }
  };
  