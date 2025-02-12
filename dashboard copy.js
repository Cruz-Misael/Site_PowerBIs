const user = localStorage.getItem("user");

if (!user) {
    window.location.href = "index.html";
}

const biLinks = {
    "Comercial.sebratel": [
        '<iframe title="COM - Coordenação Comercial" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiM2I2OTQ2YzgtNzg0NC00Njk0LTgwZjEtMTgwMWE1NWJkMDVmIiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9" frameborder="0" allowFullScreen="true"></iframe>',
        '<iframe title="COM - Relatórios Comercial" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiN2RlMjhmNzgtYTkwMC00MTk4LWJmYWItYjZiYTQ0YTdjNjI5IiwidCI6IjAyMmVlMDEzLTcyMGMtNGJlYi1hMTY2LWFhZjBhZTI2ODE2NiJ9" frameborder="0" allowFullScreen="true"></iframe>'
    ],
    "Dev.sebratel": "all"
};

const biContainer = document.getElementById("biContainer");

if (biLinks[user] === "all") {
    for (let setor in biLinks) {
        if (biLinks[setor] !== "all") {
            biContainer.innerHTML += biLinks[setor].join("");
        }
    }
} else if (biLinks[user]) {
    biContainer.innerHTML = biLinks[user].join("");
} else {
    biContainer.innerHTML = "<p>Sem acesso ao BI.</p>";
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}
