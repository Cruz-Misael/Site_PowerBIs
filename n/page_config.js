const API_BASE_URL = 'https://us-central1-sebratel-tecnologia.cloudfunctions.net/api'//process.env.REACT_APP_API_URL;

// Verifica se o usuário está logado e redireciona se não estiver
const userEmail = localStorage.getItem("userEmail");
const accessLevel = localStorage.getItem("accessLevel");
const userTeam = localStorage.getItem("team"); // Pega o setor do usuário

if (!userEmail || !accessLevel || !userTeam) {
    window.location.href = "index.html"; // Redireciona se faltar dados
}

// Função para buscar usuários e atualizar a tabela
function fetchUsers() {
    axios.get(`${API_BASE_URL}/users`)
        .then(response => {
            const users = response.data;
            const tableBody = document.getElementById('users-table-body');
            tableBody.innerHTML = '';

            users.forEach(user => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.accessLevel}</td>
                    <td>${user.team || 'Não definido'}</td>
                    <td>
                        <button class="delete-button" onclick="handleDelete('${user.id}')">X</button>
                    </td>
                    <td>
                        <button class="edit-button" onclick="openEditModal('${user.id}', '${user.name}', '${user.email}', '${user.accessLevel}', '${user.team || ''}')">Editar</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar usuários:', error);
            alert('Não foi possível carregar os usuários.');
        });
}

// Função para abrir o modal de edição
function openEditModal(id, name, email, accessLevel, team) {
    document.getElementById('editName').value = name;
    document.getElementById('editEmail').value = email;
    const radio = document.querySelector(`input[name="editAccessLevel"][value="${accessLevel}"]`);
    if (radio) radio.checked = true; // Só define se o elemento existir
    document.getElementById('editTeam').value = team || '';
    document.getElementById('editModal').dataset.userId = id;
    document.getElementById('editModal').style.display = 'flex';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Função para salvar um novo usuário
function handleSave() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const accessLevel = document.querySelector('input[name="accessLevel"]:checked')?.value;
    const team = document.getElementById('team').value;

    if (!name || !email || !accessLevel || !team) {
        alert('Preencha todos os campos antes de salvar.');
        return;
    }

    axios.post(`${API_BASE_URL}/users`, { name, email, accessLevel, team })
    .then(() => {
        fetchUsers(); // Atualiza a tabela
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        const checkedRadio = document.querySelector('input[name="accessLevel"]:checked');
        if (checkedRadio) checkedRadio.checked = false;
        document.getElementById('team').value = '';
    })
    .catch(error => {
        console.error('Erro ao salvar usuário:', error);
    });
}

// Função para atualizar um usuário
function handleUpdate() {
    const id = document.getElementById('editModal').dataset.userId;
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const accessLevel = document.querySelector('input[name="editAccessLevel"]:checked')?.value;
    const team = document.getElementById('editTeam').value;

    if (!name || !email || !accessLevel || !team) {
        alert('Preencha todos os campos antes de atualizar.');
        return;
    }

    axios.put(`${API_BASE_URL}/users/${id}`, { name, email, accessLevel, team })
        .then(() => {
            fetchUsers(); // Atualiza a tabela
            closeModal(); // Fecha o modal
        })
        .catch(error => {
            console.error('Erro ao atualizar usuário:', error);
            if (error.response) {
                // Erro retornado pelo servidor (ex.: 404, 500)
                alert(`Erro: ${error.response.data.message || 'Falha ao atualizar usuário.'}`);
            } else {
                // Erro de rede ou configuração
                alert('Erro de conexão com o servidor.');
            }
        });
}

// Função para excluir um usuário
function handleDelete(userId) {
    axios.delete(`${API_BASE_URL}/users/${userId}`)
        .then(() => {
            fetchUsers(); // Atualiza a tabela após exclusão
        })
        .catch(error => {
            console.error('Erro ao excluir usuário:', error);
        });
}

// Carrega os usuários ao abrir a página
window.onload = function() {
    fetchUsers();
};