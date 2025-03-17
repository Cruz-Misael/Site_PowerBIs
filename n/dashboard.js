const API_BASE_URL = 'https://us-central1-sebratel-tecnologia.cloudfunctions.net/api'//process.env.REACT_APP_API_URL;

// Verifica se o usuário está logado e redireciona se não estiver
const userEmail = localStorage.getItem("userEmail");
const accessLevel = localStorage.getItem("accessLevel");
const userTeam = localStorage.getItem("team"); // Pega o setor do usuário

if (!userEmail || !accessLevel || !userTeam) {
    window.location.href = "index.html"; // Redireciona se faltar dados
}

const biLinks = {
    "Comercial": [
        { src: "https://app.powerbi.com/reportEmbed?reportId=1fdfebc2-8b1c-4545-9a8b-0924e37ece76&autoAuth=true&ctid=022ee013-720c-4beb-a166-aaf0ae268166", 
          title: "COM - Relatórios Comercial", 
          description: "Relatório geral de desempenho do time comercial." }
    ],
    "Instalação": [
        { src: "", 
          title: "INST - Relatórios de Instalação", 
          description: "Relatórios de desempenho de instalação." }
    ],
    "Manutenção": [
        { src: "", 
          title: "MAN - Relatórios de Manutenção", 
          description: "Relatórios de desempenho de manutenção." }
    ],
    "Infraestrutura": [
        { src: "", 
          title: "INFRA - Relatórios de Infra", 
          description: "Relatórios de infraestrutura." }
    ],
    "Suporte": [
        { src: "", 
          title: "SUP - Relatórios de Suporte", 
          description: "Relatórios de suporte técnico." }
    ],
    "Operacional": [
        { src: "", 
          title: "OP - Relatórios Operacionais", 
          description: "Relatórios operacionais." }
    ],
    "Financeiro": [
        { src: "", 
          title: "FIN - Relatórios Financeiros", 
          description: "Relatórios financeiros." }
    ],
    "Planejamento de Redes": [
        { src: "", 
          title: "PLAN - Análise de Conexões e Infra", 
          description: "Relatórios detalhados de conexões e infraestrutura." }
    ],
    "Logística": [
        { src: "", 
          title: "LOG - Relatórios Gerenciais", 
          description: "Relatório de gerência e desempenho logística." }
    ],
    "Compras": [
        { src: "", 
          title: "COMP - Relatórios de Compras", 
          description: "Relatórios de compras." }
    ],
    "Controladoria": [
        { src: "", 
          title: "CONT - Relatórios de Controladoria", 
          description: "Relatórios de controladoria." }
    ],
    "Qualidade": [
        { src: "", 
          title: "QUAL - Horários de Entrada e Saída", 
          description: "Relatório detalhado dos batimentos de ponto." }
    ],
    "Gerência": [
        { src: "https://app.powerbi.com/reportEmbed?reportId=dedaf004-ee12-4688-b25d-0adf72fa70be&autoAuth=true&ctid=022ee013-720c-4beb-a166-aaf0ae268166", 
            title: "COM - Coordenação Comercial", 
            description: "Relatório geral de desempenho do time comercial." }
    ],
    "DHO": [
        { src: "https://app.powerbi.com/reportEmbed?reportId=47fea940-59b4-4b4b-bd95-80eeb186b937&autoAuth=true&ctid=022ee013-720c-4beb-a166-aaf0ae268166", 
          title: "DHO - Desligamentos", 
          description: "Relatório detalhado de desligamentos." },
        { src: "https://app.powerbi.com/reportEmbed?reportId=f08c74fe-8ecb-47a8-8c3e-1b9593c1789f&autoAuth=true&ctid=022ee013-720c-4beb-a166-aaf0ae268166", 
        title: "DHO - Entrevistas de Desligamentos", 
        description: "Relatório detalhado das entrevistas de desligamentos." },
        { src: "https://app.powerbi.com/reportEmbed?reportId=a078cf9a-9183-4aa4-beb6-3c1cbd2cba2e&autoAuth=true&ctid=022ee013-720c-4beb-a166-aaf0ae268166", 
            title: "DHO - Painel de Vagas", 
            description: "Relatório detalhado do Painel de Vagas." },
        { src: "https://app.powerbi.com/reportEmbed?reportId=af3fe983-3802-4fdf-91fa-039e55060333&autoAuth=true&ctid=022ee013-720c-4beb-a166-aaf0ae268166", 
            title: "DHO - Quadro Funcional", 
            description: "Relatório detalhado do quadro funcional." }
    ],
    "Desenvolvimento": "all"
};


// Define e-mail e setor no rodapé
document.getElementById("userEmailFooter").textContent = userEmail || "N/A";


// Define o nome do setor no título
document.getElementById("setorNome").textContent = userTeam || "Dashboard";
const biContainer = document.getElementById("biContainer");

function logout() {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("accessLevel");
    localStorage.removeItem("team");
    window.location.href = "index.html";
}

function irParaConfig() {
    // Verifica se o usuário é ADMIN antes de redirecionar
    if (accessLevel === "Admin") {
        window.location.href = "page_config.html";
    } else {
        // Opcional: exibir uma mensagem de erro
        alert("Acesso negado! Apenas administradores podem acessar a página de configurações.");
        console.log("Tentativa de acesso à página de configurações por usuário não autorizado:", userEmail);
    }
}


function createCard(dash) {
    return `
        <div class="card" onclick="abrirEmTelaCheia('${dash.src}')">
            <img class="card-logo" src="https://www.c5alliance.com/wp-content/uploads/2021/01/power-bi_logo.png" alt="Power BI Logo">
            <h3>${dash.title}</h3>
            <p>${dash.description}</p>
            <iframe class="dashboard-frame" src="${dash.src}" frameborder="0" allowFullScreen="true"></iframe>
        </div>
    `;
}


function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (err) {
        return false;
    }
}

function abrirEmTelaCheia(url) {
    if (!isValidUrl(url)) {
        alert("URL inválida.");
        return;
    }

    const novaJanela = window.open(url, "_blank", "fullscreen=yes");

    if (novaJanela) {
        novaJanela.focus();
    } else {
        alert("Seu navegador bloqueou o pop-up. Permita pop-ups para abrir em tela cheia.");
    }
}

// Renderiza dashboards com base no team do usuário
if (biLinks[userTeam] === "all") {
    for (let setor in biLinks) {
        if (biLinks[setor] !== "all") { // Ignora chaves com "all"
            biLinks[setor].forEach(dash => {
                biContainer.innerHTML += createCard(dash);
            });
        }
    }
} else if (biLinks[userTeam]) {
    biLinks[userTeam].forEach(dash => {
        biContainer.innerHTML += createCard(dash);
    });
} else {
    biContainer.innerHTML = "<p>Sem acesso ao BI.</p>";
}
console.log("userTeam:", userTeam);
console.log("biLinks[userTeam]:", biLinks[userTeam]);