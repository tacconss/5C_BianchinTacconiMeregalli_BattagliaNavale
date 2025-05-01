export function generateGiocatoreComponent(nome, stato) {
    return {
      renderHTML: function () {
        return `
          <li>
            ${nome} - ${stato}
            ${stato === "libero" ? `<button class="invite-button" data-nome="${nome}">Invita</button>` : ""}
          </li>
        `;
      }
    };
  }
  