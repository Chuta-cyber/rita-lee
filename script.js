async function buscarPerfil() {
  const username = document.getElementById('username').value.trim();
  const resultadoDiv = document.getElementById('resultado');

  if (!username) {
    resultadoDiv.innerHTML = '<p>Por favor, digite um nome de usuário.</p>';
    return;
  }

  resultadoDiv.innerHTML = '<p>Carregando...</p>';

  try {
    // Busca dados do usuário e seus 5 repositórios mais recentes
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`)
    ]);

    if (!userRes.ok) throw new Error('Usuário não encontrado.');

    const user = await userRes.json();
    const repos = await reposRes.json();

    // Monta a lista de repositórios
    const reposHTML = repos.map(repo => `
      <div class="repo-item">
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        <p style="font-size: 12px; margin: 5px 0 0;">⭐ ${repo.stargazers_count} | ${repo.language || 'Sem linguagem'}</p>
      </div>
    `).join('');

    // Exibe na tela
    resultadoDiv.innerHTML = `
      <div class="card">
        <img src="${user.avatar_url}" alt="Avatar">
        <h2>${user.name || user.login}</h2>
        <p>${user.bio || 'Sem biografia.'}</p>
        <p><strong>Seguidores:</strong> ${user.followers} | <strong>Repositórios:</strong> ${user.public_repos}</p>
        <div class="repo-list">
          <h3>Últimos Repositórios:</h3>
          ${reposHTML || '<p>Nenhum repositório público.</p>'}
        </div>
      </div>
    `;
  } catch (erro) {
    resultadoDiv.innerHTML = `<p style="color: #f85149;">Erro: ${erro.message}</p>`;
  }
}