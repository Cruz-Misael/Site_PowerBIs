const users = {
    "Comercial.sebratel": "Com43449",
    "Instalação.sebratel": "Inst43450",
    "Manutenção.sebratel": "Man43451",
    "Infraestrutura.sebratel": "Inf43452",
    "Suporte.sebratel": "Sup43453",
    "Operacional.sebratel": "Ope43454",
    "Financeiro.sebratel": "Fin43455",
    "PlanejamentoRedes.sebratel": "Plr43456",
    "Dev.sebratel": "AwuIaSD443562",
    "Logística.sebratel": "Log43457",
    "Compras.sebratel": "Comp43458",
    "Controladoria.sebratel": "Cont43459",
    "Qualidade.sebratel": "Qua43460"
};

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let errorMessage = document.getElementById("errorMessage");

    if (users[email] && users[email] === password) {
        localStorage.setItem("user", email);
        window.location.href = "dashboard.html";
    } else {
        errorMessage.textContent = "Usuário ou senha incorretos.";
    }
});
