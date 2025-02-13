const user = localStorage.getItem("user");
if (!user) {
    window.location.href = "index.html";
}

const biLinks = {
    "comercial.sebratel": [
        { src: "https://app.powerbi.com/view?r=eyJrIjoiN2RlMjhmNzgtYTkwMC00MTk4LWJmYWItYjZiYTQ0YTdjNjI5IiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9", 
          title: "COM - Relatórios Comercial", 
          description: "Relatório geral de desempenho do time comercial." }
    ],
    "gerencia.comercial": [
        { src: "https://app.powerbi.com/view?r=eyJrIjoiM2I2OTQ2YzgtNzg0NC00Njk0LTgwZjEtMTgwMWE1NWJkMDVmIiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9", 
          title: "COM - Coordenação Comercial", 
          description: "Relatório de coordenação e desempenho comercial." }
    ],
    "instalação.sebratel": [
        { src: "https://app.powerbi.com/view?r=eyJrIjoiM2I2OTQ2YzgtNzg0NC00Njk0LTgwZjEtMTgwMWE1NWJkMDVmIiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9", 
            title: "COM - Coordenação Comercial", 
            description: "Relatório de coordenação e desempenho comercial." }
    ],
    "manutenção.sebratel": [
        { src: "https://app.powerbi.com/view?r=eyJrIjoiM2I2OTQ2YzgtNzg0NC00Njk0LTgwZjEtMTgwMWE1NWJkMDVmIiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9", 
            title: "COM - Coordenação Comercial", 
            description: "Relatório de coordenação e desempenho comercial." }
    ],
    "infraestrutura.sebratel": [
        { src: "https://app.powerbi.com/view?r=eyJrIjoiM2I2OTQ2YzgtNzg0NC00Njk0LTgwZjEtMTgwMWE1NWJkMDVmIiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9", 
            title: "COM - Coordenação Comercial", 
            description: "Relatório de coordenação e desempenho comercial." }
    ],
    "suporte.sebratel": [
        { src: "https://app.powerbi.com/view?r=eyJrIjoiM2I2OTQ2YzgtNzg0NC00Njk0LTgwZjEtMTgwMWE1NWJkMDVmIiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9", 
            title: "COM - Coordenação Comercial", 
            description: "Relatório de coordenação e desempenho comercial." }
    ],
    "operacional.sebratel": [
        { src: "https://app.powerbi.com/view?r=eyJrIjoiM2I2OTQ2YzgtNzg0NC00Njk0LTgwZjEtMTgwMWE1NWJkMDVmIiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9", 
            title: "COM - Coordenação Comercial", 
            description: "Relatório de coordenação e desempenho comercial." }
    ],
    "financeiro.sebratel": [
        { src: "https://app.powerbi.com/view?r=eyJrIjoiM2I2OTQ2YzgtNzg0NC00Njk0LTgwZjEtMTgwMWE1NWJkMDVmIiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9", 
          title: "COM - Coordenação Comercial", 
          description: "Relatório de coordenação e desempenho comercial." }
        ],
    "planejamentoRedes.sebratel": [
        { src: "https://app.powerbi.com/view?r=eyJrIjoiM2I2OTQ2YzgtNzg0NC00Njk0LTgwZjEtMTgwMWE1NWJkMDVmIiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9", 
            title: "COM - Coordenação Comercial", 
            description: "Relatório de coordenação e desempenho comercial." }
    ],
    "logística.sebratel": [
        { src: "https://app.powerbi.com/view?r=eyJrIjoiM2I2OTQ2YzgtNzg0NC00Njk0LTgwZjEtMTgwMWE1NWJkMDVmIiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9", 
            title: "COM - Coordenação Comercial", 
            description: "Relatório de coordenação e desempenho comercial." }
    ],
    "compras.sebratel": [
        { src: "https://app.powerbi.com/view?r=eyJrIjoiM2I2OTQ2YzgtNzg0NC00Njk0LTgwZjEtMTgwMWE1NWJkMDVmIiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9", 
            title: "COM - Coordenação Comercial", 
            description: "Relatório de coordenação e desempenho comercial." }
        ],
    "controladoria.sebratel": [
        { src: "https://app.powerbi.com/view?r=eyJrIjoiM2I2OTQ2YzgtNzg0NC00Njk0LTgwZjEtMTgwMWE1NWJkMDVmIiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9", 
            title: "COM - Coordenação Comercial", 
            description: "Relatório de coordenação e desempenho comercial." }
    ],
    "qualidade.sebratel": [
        { src: "https://app.powerbi.com/view?r=eyJrIjoiM2I2OTQ2YzgtNzg0NC00Njk0LTgwZjEtMTgwMWE1NWJkMDVmIiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9", 
            title: "COM - Coordenação Comercial", 
            description: "Relatório de coordenação e desempenho comercial." }
    ],

    "dev.sebratel": "all"
};

document.getElementById("setorNome").textContent = setorNome[user] || "Dashboard";
const biContainer = document.getElementById("biContainer");

function logout() {
    // Remover o token de autenticação (se aplicável)
    localStorage.removeItem("userToken"); // Exemplo

    // Redirecionar para a página de login
    window.location.href = "index.html"; // Altere para sua página de login real
}


function createCard(dash) {
    return `
        <div class="card">
            <img class="card-logo" src="https://www.c5alliance.com/wp-content/uploads/2021/01/power-bi_logo.png" alt="Power BI Logo">
            <h3>${dash.title}</h3>
            <p>${dash.description}</p>
            <iframe class="dashboard-frame" src="${dash.src}" frameborder="0" allowFullScreen="true"></iframe>
        </div>
    `;
}

if (biLinks[user] === "all") {
    for (let setor in biLinks) {
        if (biLinks[setor] !== "all") {
            biLinks[setor].forEach(dash => {
                biContainer.innerHTML += createCard(dash);
            });
        }
    }
} else if (biLinks[user]) {
    biLinks[user].forEach(dash => {
        biContainer.innerHTML += createCard(dash);
    });
} else {
    biContainer.innerHTML = "<p>Sem acesso ao BI.</p>";
}
