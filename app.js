const SUPABASE_URL = "https://ojatowkvipriwypqxeog.supabase.co";
const SUPABASE_KEY = "sb_publishable_2pntJ8Ey5oe2ehTY7YcZEw_44z9v3sR";

if (!window.supabase) {
  throw new Error("The Supabase client library failed to load.");
}

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
window.supabaseClient = supabaseClient;

(function initialiseAuthentication() {
  const body = document.body;
  const isAuthPage = body.dataset.authPage === "true";
  const isProtectedPage = body.dataset.protected === "true";

  function currentFile() {
    const file = window.location.pathname.split("/").filter(Boolean).pop();
    return file && file.endsWith(".html") ? file : "index.html";
  }

  function safeNextPage() {
    const requested = new URLSearchParams(window.location.search).get("next") || "index.html";
    return /^[a-z0-9-]+\.html$/i.test(requested) && requested !== "login.html"
      ? requested
      : "index.html";
  }

  function sendToLogin() {
    const next = encodeURIComponent(currentFile());
    window.location.replace(`login.html?next=${next}`);
  }

  function updateAccountUi(session) {
    const email = document.getElementById("userEmail");
    const logout = document.getElementById("logoutBtn");
    if (email) email.textContent = session?.user?.email || "";
    if (logout) logout.hidden = !session;
  }

  async function handleLogout() {
    const logout = document.getElementById("logoutBtn");
    if (logout) logout.disabled = true;
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      if (logout) logout.disabled = false;
      window.alert(error.message);
      return;
    }
    window.location.replace("login.html");
  }

  function setupAuthForm() {
    const form = document.getElementById("authForm");
    if (!form) return;

    const tabs = Array.from(document.querySelectorAll("[data-auth-mode]"));
    const nameField = document.getElementById("nameField");
    const confirmField = document.getElementById("confirmField");
    const nameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("authEmail");
    const passwordInput = document.getElementById("authPassword");
    const confirmInput = document.getElementById("confirmPassword");
    const submit = document.getElementById("authSubmit");
    const title = document.getElementById("authTitle");
    const intro = document.getElementById("authIntro");
    const message = document.getElementById("authMessage");
    let mode = new URLSearchParams(window.location.search).get("mode") === "register"
      ? "register"
      : "login";

    function showMessage(text, type = "") {
      message.textContent = text;
      message.className = `auth-message ${type}`.trim();
      message.hidden = !text;
    }

    function setMode(nextMode) {
      mode = nextMode;
      const registering = mode === "register";
      tabs.forEach((tab) => {
        const active = tab.dataset.authMode === mode;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
      });
      nameField.hidden = !registering;
      confirmField.hidden = !registering;
      nameInput.required = registering;
      confirmInput.required = registering;
      title.textContent = registering ? "Create your account" : "Welcome back";
      intro.textContent = registering
        ? "Register once, then use your account across FitForge."
        : "Sign in to continue to your workouts and tools.";
      submit.innerHTML = registering
        ? '<i class="fas fa-user-plus"></i> Register user'
        : '<i class="fas fa-right-to-bracket"></i> Log in';
      showMessage("");
    }

    tabs.forEach((tab) => tab.addEventListener("click", () => setMode(tab.dataset.authMode)));

    document.querySelectorAll("[data-password-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.passwordToggle);
        const reveal = input.type === "password";
        input.type = reveal ? "text" : "password";
        button.innerHTML = reveal
          ? '<i class="fas fa-eye-slash"></i>'
          : '<i class="fas fa-eye"></i>';
        button.setAttribute("aria-label", reveal ? "Hide password" : "Show password");
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      showMessage("");

      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const registering = mode === "register";

      if (password.length < 6) {
        showMessage("Your password must be at least 6 characters.", "error");
        return;
      }

      if (registering && password !== confirmInput.value) {
        showMessage("The passwords do not match.", "error");
        return;
      }

      submit.disabled = true;
      submit.innerHTML = '<i class="fas fa-circle-notch spinner"></i> Please wait';

      try {
        if (registering) {
          const fullName = nameInput.value.trim();
          if (!fullName) throw new Error("Please enter your name.");

          const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName.slice(0, 80) } },
          });
          if (error) throw error;

          if (data.session) {
            showMessage("Account created. Taking you into FitForge...", "success");
            window.setTimeout(() => window.location.replace(safeNextPage()), 450);
            return;
          }

          showMessage("Account created. Check your email to confirm it, then log in.", "success");
        } else {
          const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
          if (error) throw error;
          showMessage("Logged in. Taking you into FitForge...", "success");
          window.setTimeout(() => window.location.replace(safeNextPage()), 350);
          return;
        }
      } catch (error) {
        showMessage(error.message || "Authentication failed. Please try again.", "error");
      } finally {
        submit.disabled = false;
        submit.innerHTML = registering
          ? '<i class="fas fa-user-plus"></i> Register user'
          : '<i class="fas fa-right-to-bracket"></i> Log in';
      }
    });

    setMode(mode);
  }

  const logout = document.getElementById("logoutBtn");
  if (logout) logout.addEventListener("click", handleLogout);
  if (isAuthPage) setupAuthForm();

  supabaseClient.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error("Unable to read Supabase session:", error.message);
      return;
    }

    const session = data.session;
    updateAccountUi(session);
    if (isProtectedPage && !session) sendToLogin();
    if (isAuthPage && session) window.location.replace(safeNextPage());
  });

  supabaseClient.auth.onAuthStateChange((event, session) => {
    updateAccountUi(session);
    if (event === "SIGNED_OUT" && isProtectedPage) sendToLogin();
  });
})();
