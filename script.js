document.addEventListener("DOMContentLoaded", function () {
    const apiKey = 'eec4294f20b44d138285682c6c8c5393'; // Chave de API fornecida
    const apiUrl = 'https://api.football-data.org/v4/matches';
    const options = {
        method: 'GET',
        headers: {
            'X-Auth-Token': apiKey
        }
    };

    let lastScores = {}; // Armazena os últimos placares conhecidos

    // Função para buscar dados da API e exibir na página
    function fetchLiveMatches() {
        fetch(apiUrl, options)
            .then(response => response.json())
            .then(data => {
                const matches = data.matches;
                const matchesList = document.getElementById('matches-list');
                matchesList.innerHTML = ''; // Limpa o conteúdo anterior

                matches.forEach(match => {
                    const matchElement = document.createElement('div');
                    matchElement.classList.add('match');

                    const homeTeam = match.homeTeam.name;
                    const awayTeam = match.awayTeam.name;
                    const homeScore = match.score.fullTime.home;
                    const awayScore = match.score.fullTime.away;
                    const stadium = match.venue || 'Não disponível'; // Mensagem padrão se o estádio não estiver disponível
                    const matchDate = new Date(match.utcDate); // Converte a data e hora para o objeto Date
                    const matchTime = matchDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }); // Formata a hora
                    const matchDateFormatted = matchDate.toLocaleDateString('pt-BR'); // Formata a data

                    // Verifica se a partida está ao vivo
                    const isLive = match.status === 'LIVE';

                    // Verifica e dispara alerta se houve gol
                    if (lastScores[match.id]) {
                        const lastHomeScore = lastScores[match.id].home;
                        const lastAwayScore = lastScores[match.id].away;

                        if (homeScore > lastHomeScore) {
                            alert(`Gol da equipe da casa! ${homeTeam} marcou um gol.`);
                        }
                        if (awayScore > lastAwayScore) {
                            alert(`Gol da equipe visitante! ${awayTeam} marcou um gol.`);
                        }
                    }

                    // Atualiza os últimos placares conhecidos
                    lastScores[match.id] = { home: homeScore, away: awayScore };

                    // Construção do conteúdo HTML
                    let matchHTML = `
                        <h2>${homeTeam} vs ${awayTeam}</h2>
                        <p><strong>Placar:</strong> ${homeScore} - ${awayScore}</p>
                        <p><strong>Data:</strong> ${matchDateFormatted}</p>
                        <p><strong>Horário:</strong> ${matchTime}</p>
                    `;

                    // Adiciona o indicador "Ao Vivo" se a partida estiver ao vivo
                    if (isLive) {
                        matchHTML += `<p class="live-indicator">Ao Vivo</p>`;
                    }

                    // Adiciona o estádio somente se estiver disponível
                    if (stadium) {
                        matchHTML += `<p><strong>Estádio:</strong> ${stadium}</p>`;
                    }

                    matchElement.innerHTML = matchHTML;
                    matchesList.appendChild(matchElement);
                });
            })
            .catch(error => {
                console.error('Erro ao buscar dados da API:', error);
            });
    }

    // Atualiza a lista de partidas a cada 30 segundos
    setInterval(fetchLiveMatches, 30000);

    // Busca partidas ao vivo quando a página carrega
    fetchLiveMatches();
});
