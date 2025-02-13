const users = {
    "comercial.sebratel": "Com43449",
    "gerencia.comercial" : "Gcom434461",
    "instalação.sebratel": "Inst43450",
    "manutenção.sebratel": "Man43451",
    "infraestrutura.sebratel": "Inf43452",
    "suporte.sebratel": "Sup43453",
    "operacional.sebratel": "Ope43454",
    "financeiro.sebratel": "Fin43455",
    "planejamentoRedes.sebratel": "Plr43456",
    "dev.sebratel": "AwuIaSD443562",
    "logística.sebratel": "Log43457",
    "compras.sebratel": "Comp43458",
    "controladoria.sebratel": "Cont43459",
    "qualidade.sebratel": "Qua43460"
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
