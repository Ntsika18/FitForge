/* ==============================================
   SAVED WORKOUTS PAGE
   Reads plans from localStorage and renders
   them as expandable cards. Exposes
   window.renderSavedPage() so the workout chat
   can refresh the list after a save.
============================================== */
(function() {
 
  const savedList = document.getElementById('savedList');
 
  /* ---- Render the full saved plans list ---- */
  function renderSavedPage() {
    const plans = JSON.parse(localStorage.getItem('ffSavedPlans') || '[]');
 
    if (plans.length === 0) {
      // Show empty state with instructions
      savedList.innerHTML = `
        <div class="saved-empty">
          <i class="fas fa-bookmark"></i>
          <strong style="color:var(--text);">No saved workouts yet</strong>
          <p>Generate a workout plan on the <strong>Workout</strong> tab, then tap <em>"Save This Workout Plan"</em> to store it here.</p>
        </div>`;
      return;
    }
 
    // Build cards for each saved plan (newest first)
    savedList.innerHTML = plans.map((plan, index) => `
      <div class="saved-card" id="scard-${plan.id}">
        <div class="saved-card-header" onclick="toggleSavedCard(${plan.id})">
          <div>
            <div class="saved-card-title"><i class="fas fa-dumbbell" style="color:var(--accent);margin-right:0.4rem;"></i>${plan.title}</div>
            <div class="saved-card-date">${plan.date}</div>
          </div>
          <i class="fas fa-chevron-down" id="chevron-${plan.id}" style="color:var(--text2); transition:transform 0.2s; flex-shrink:0;"></i>
        </div>
        <div class="saved-card-body" id="sbody-${plan.id}">
          <div class="saved-plan-text">${plan.html}</div>
          <button class="delete-saved-btn" onclick="deleteSavedPlan(${plan.id})">
            <i class="fas fa-trash-alt"></i> Delete
          </button>
        </div>
      </div>`
    ).join('');
  }
 
  /* ---- Toggle a saved card open/closed ---- */
  window.toggleSavedCard = function(id) {
    const body    = document.getElementById('sbody-'   + id);
    const chevron = document.getElementById('chevron-' + id);
    const open = body.classList.toggle('open');
    chevron.style.transform = open ? 'rotate(180deg)' : 'rotate(0deg)';
  };
 
  /* ---- Delete a saved plan by id ---- */
  window.deleteSavedPlan = function(id) {
    const plans = JSON.parse(localStorage.getItem('ffSavedPlans') || '[]');
    const updated = plans.filter(p => p.id !== id);
    localStorage.setItem('ffSavedPlans', JSON.stringify(updated));
    renderSavedPage();
  };
 
  /* ---- Expose so workout chat can trigger a refresh ---- */
  window.renderSavedPage = renderSavedPage;
 
  /* ---- Render on initial load ---- */
  window.addEventListener('load', renderSavedPage);
 
  /* ---- Also re-render whenever the Saved tab is tapped ---- */
  document.getElementById('nav-saved').addEventListener('click', renderSavedPage);
 
})();
