// public/components/renderHome.js
export function renderHome() {
    return `
      <div id="name-modal" class="modal show">
        <div class="modal-content">
          <div class="modal-header">
            <h5>Entra in Naval Battle</h5>
          </div>
          <div class="modal-body">
            <label for="name-input">Inserisci il tuo nome:</label>
            <input type="text" id="name-input" required />
          </div>
          <div class="modal-footer">
            <button type="button" id="join-button">Entra</button>
          </div>
        </div>
      </div> 
  
      <div id="modal-backdrop" class="modal-backdrop show"></div>
  
      <div id="invite-container" style="display: none;"></div>
  
      <div id="game-container" class="game-container" style="display: none;">
        <h1>Naval Battle</h1>
        <div class="content">
          <div class="section">
            <h5>Partite</h5>
            <ul id="game-list"></ul>
          </div>
          <div class="section">
            <!--<img src="../data/logo" alt="logo" />-->
            <img src="/public/data/logo.png" alt="logo" />

          </div>
          <div class="section">
            <h5>Giocatori</h5>
            <ul id="player-list"></ul>
          </div>
        </div>
      </div>
    `;
  }
  