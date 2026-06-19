/* ==============================================
   ANIMATED BARCODE BARS (decorative)
   Builds random-height bars on the scanner
   page. Each bar has a staggered animation
   delay to create a breathing effect.
============================================== */
(function() {
  const viz = document.getElementById('barViz');
  if (!viz) return;
  const widths  = [3,5,2,7,3,4,6,2,5,3,4,7,2,3,5,6,3,2,4,5];
  const heights = [60,40,70,50,65,35,55,45,70,60,40,50,65,55,45,70,60,50,35,65];
  widths.forEach((w, i) => {
    const bar = document.createElement('span');
    bar.style.width  = w + 'px';
    bar.style.height = heights[i] + 'px';
    bar.style.animationDelay = (i * 0.07) + 's'; // stagger each bar
    viz.appendChild(bar);
  });
})();

/*=============================================
   NUTRITION SCANNER
   Mock product database keyed by barcode.
   Renders macro badges and a visual macro
   bar chart when a product is found.
============================================== */
(function() {

  /* ---- Mock product database ---- */
  const productDB = {
    '4901234': { name: 'Protein Bar (Choco)',    calories: 210, protein: 20, carbs: 22, fat: 7,  barcode: '4901234' },
    '123456':  { name: 'Grilled Chicken Wrap',   calories: 350, protein: 32, carbs: 28, fat: 12, barcode: '123456'  },
    '999888':  { name: 'Greek Yogurt Plain',      calories: 100, protein: 17, carbs: 6,  fat: 0,  barcode: '999888'  },
    '111222':  { name: 'Oatmeal Cup',             calories: 280, protein: 8,  carbs: 52, fat: 5,  barcode: '111222'  },
  };

  const barcodeInput  = document.getElementById('barcodeInput');
  const scanBtn       = document.getElementById('scanBtn');
  const resultDiv     = document.getElementById('productResult');

  /* ---- Render a found product ---- */
  function renderProduct(p) {
    // Calculate % of total macros for bar chart widths
    const totalMacro = p.protein + p.carbs + p.fat || 1;
    const pPct = Math.round(p.protein / totalMacro * 100);
    const cPct = Math.round(p.carbs   / totalMacro * 100);
    const fPct = Math.round(p.fat     / totalMacro * 100);

    resultDiv.innerHTML = `
      <div class="card product-card" style="margin:0 1.25rem;">
        <div class="section-title"><i class="fas fa-cube"></i> ${p.name}</div>

        <!-- Four macro badges in a grid -->
        <div class="nutrition-grid">
          <div class="nutrition-cell">
            <span class="val">${p.calories}</span>
            <small>Calories</small>
          </div>
          <div class="nutrition-cell">
            <span class="val">${p.protein}g</span>
            <small>Protein</small>
          </div>
          <div class="nutrition-cell">
            <span class="val">${p.carbs}g</span>
            <small>Carbs</small>
          </div>
          <div class="nutrition-cell">
            <span class="val">${p.fat}g</span>
            <small>Fat</small>
          </div>
        </div>

        <!-- Visual macro bar chart -->
        <div class="macro-bar-wrap" style="margin-top:1rem;">
          <div class="macro-label-row"><span>Protein</span><span>${pPct}%</span></div>
          <div class="macro-bar"><div class="macro-fill fill-protein" style="width:0%" data-target="${pPct}"></div></div>

          <div class="macro-label-row"><span>Carbs</span><span>${cPct}%</span></div>
          <div class="macro-bar"><div class="macro-fill fill-carbs" style="width:0%" data-target="${cPct}"></div></div>

          <div class="macro-label-row"><span>Fat</span><span>${fPct}%</span></div>
          <div class="macro-bar"><div class="macro-fill fill-fat" style="width:0%" data-target="${fPct}"></div></div>
        </div>

        <div style="font-size:0.7rem;color:var(--text2);margin-top:0.9rem;">
          <i class="fas fa-barcode"></i> ${p.barcode}
        </div>
      </div>`;

    // Animate bars after a short delay so the transition is visible
    setTimeout(() => {
      resultDiv.querySelectorAll('.macro-fill').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
      });
    }, 50);
  }

  /* ---- Render an error message ---- */
  function renderError() {
    resultDiv.innerHTML = `
      <div class="error-msg">
        <i class="fas fa-exclamation-circle"></i>
        Product not found. Try one of the demo chips above.
      </div>`;
  }

  /* ---- Main scan handler ---- */
  function handleScan() {
    const code = barcodeInput.value.trim();
    if (!code) return;

    // Show spinner while "scanning"
    resultDiv.innerHTML = `<div class="scanning-msg" style="padding:0 1.25rem;">
      <i class="fas fa-spinner spinner"></i> Scanning barcode…</div>`;

    setTimeout(() => {
      const product = productDB[code];
      product ? renderProduct(product) : renderError();
    }, 650);
  }

  scanBtn.addEventListener('click', handleScan);
  barcodeInput.addEventListener('keypress', e => { if (e.key === 'Enter') { e.preventDefault(); handleScan(); } });

  /* ---- Demo chips auto-fill the input ---- */
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      barcodeInput.value = chip.dataset.code;
      handleScan();
    });
  });

})();
