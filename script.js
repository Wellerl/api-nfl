// ====== dados locais / fallback ======
var teams = [
  // fallback (caso a API não possa ser acessada)
  {
    id: 1,
    name: "Las Vegas Raiders",
    city: "Las Vegas",
    logo: "./img/raiders.png", // ajuste se tiver outra path
    coach: "Antonio Pierce (interim)",
    stadium: "Allegiant Stadium"
  },
  {
    id: 2,
    name: "Jacksonville Jaguars",
    city: "Jacksonville",
    logo: "./img/jaguars.png",
    coach: "Doug Pederson",
    stadium: "EverBank Stadium"
  },
  {
    id: 3,
    name: "New England Patriots",
    city: "Foxborough",
    logo: "./img/patriots.png",
    coach: "Bill Belichick",
    stadium: "Gillette Stadium"
  },
  {
    id: 4,
    name: "New York Giants",
    city: "New York",
    logo: "./img/giants.png",
    coach: "Brian Daboll",
    stadium: "MetLife Stadium"
  },
  {
    id: 5,
    name: "Baltimore Ravens",
    city: "Baltimore",
    logo: "./img/ravens.png",
    coach: "John Harbaugh",
    stadium: "M&T Bank Stadium"
  }
];

// =============================
// 🧍 Dados dos Jogadores (corrigidos)
// =============================
const players = [
  { name: "Patrick Mahomes", team: "Chiefs", img:"./img/patrick_mahomes.jpg" },
  { name: "Josh Allen", team: "Bills", img: "./img/josh_allen.jpg" },
  { name: "Lamar Jackson", team: "Ravens", img: "./img/lamar_jackson.jpg" },
  { name: "Aaron Rodgers", team: "Packers", img: "./img/Aaron_rodgers.jpg" },
  { name: "Jalen Hurts", team: "Eagles", img: "./img/jalen_hurts.jpg" },
  { name: "Joe Burrow", team: "Bengals", img: "./img/joe_burrow.jpg" }, // se preferir Browns ajuste
  { name: "Justin Herbert", team: "Chargers", img: "./img/Justin_herbert.jpg" },
  { name: "Tua Tagovailoa", team: "Dolphins", img: "./img/Tua_tagovailoa.jpg" },
  { name: "Matthew Stafford", team: "Rams", img: "./img/osvaldo.jpg" },
  { name: "Jared Goff", team: "Lions", img: "./img/jared_goff.jpg" },
];

// =============================
// 🌐 Selecionar elementos
// =============================
const homeScreen = document.getElementById("homeScreen");
const teamsSection = document.getElementById("teamsSection");
const playersSection = document.getElementById("playersSection");
const teamsGrid = document.getElementById("teamsGrid");
const playersGrid = document.getElementById("playersGrid");

// botões home
document.getElementById("teamsCard").addEventListener("click", () => {
  showSection("teams");
});
document.getElementById("playersCard").addEventListener("click", () => {
  showSection("players");
});

// função de navegação
function showSection(name) {
  homeScreen.classList.add("hidden");
  teamsSection.classList.add("hidden");
  playersSection.classList.add("hidden");

  if (name === "teams") {
    teamsSection.classList.remove("hidden");
    renderTeams();
  } else if (name === "players") {
    playersSection.classList.remove("hidden");
    renderPlayers();
  } else {
    homeScreen.classList.remove("hidden");
  }
}

function goBack() {
  // volta pra home
  homeScreen.classList.remove("hidden");
  teamsSection.classList.add("hidden");
  playersSection.classList.add("hidden");
}

// =============================
// 🏟️ Renderizar Times (fetch + fallback)
// =============================
function renderTeams() {
  teamsGrid.innerHTML = "<p>Carregando times...</p>";

  // tenta buscar da API; se falhar, usa o fallback local
  fetch("https://v1.american-football.api-sports.io/teams?league=1&season=2021", {
    method: "GET",
    headers: {
      "x-rapidapi-host": "v1.american-football.api-sports.io",
      "x-rapidapi-key": "c947aed4ca616be2e0a575e9dea751b7"
    }
  })
  .then(resp => {
    if (!resp.ok) throw new Error("Resposta da API não OK");
    return resp.json();
  })
  .then(data => {
    // dependendo da API, o caminho pode ser data.response
    const timesApi = (data && data.response) ? data.response : [];
    if (timesApi.length === 0) throw new Error("API retornou vazio, usando fallback");

    // mapear para o formato que usamos (logo, city, coach, stadium)
    const mapped = timesApi.map(t => ({
      id: t.team?.id ?? t.id ?? Math.random(),
      name: t.team?.name ?? t.name ?? "Nome não informado",
      city: t.team?.city ?? t.city ?? "Cidade não informada",
      logo: t.team?.logo ?? t.logo ?? "./img/default_team.png",
      coach: t.coach ?? t.team?.coach ?? "Não informado",
      stadium: t.stadium ?? t.team?.stadium ?? "Não informado"
    }));

    buildTeamsGrid(mapped);
  })
  .catch(err => {
    console.warn("Erro ao usar API, carregando fallback local:", err);
    // se der qualquer erro, usa o array local 'teams'
    buildTeamsGrid(teams);
  });
}

function buildTeamsGrid(list) {
  teamsGrid.innerHTML = "";
  list.forEach(t => {
    const div = document.createElement("div");
    div.classList.add("item");
    // deixe a borda por time se existir classe
    const teamNameClass = `team-border-${(t.name || "").split(" ")[0]}`;
    // inner
    div.innerHTML = `
      <img src="${t.logo || './img/default_team.png'}" alt="${t.name}">
      <h3>${t.name}</h3>
      <p>${t.city || ''}</p>
    `;
    // evento para abrir modal e mostrar detalhes
    div.addEventListener("click", () => openTeamModal(t));
    teamsGrid.appendChild(div);
  });
}

// =============================
// 🪄 Modal de Informações
// =============================
function openTeamModal(team) {
  document.getElementById("modalLogo").src = team.logo || "./img/default_team.png";
  document.getElementById("modalName").textContent = team.name || "Nome não informado";
  document.getElementById("modalCity").textContent = `Cidade: ${team.city || 'Não informado'}`;
  document.getElementById("modalCoach").textContent = `Técnico: ${team.coach || 'Não informado'}`;
  document.getElementById("modalStadium").textContent = `Estádio: ${team.stadium || 'Não informado'}`;

  const modal = document.getElementById("teamModal");
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
}

// fechar modal
function closeTeamModal() {
  const modal = document.getElementById("teamModal");
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
}

// fecha modal ao clicar fora
window.addEventListener("click", function(event) {
  const modal = document.getElementById("teamModal");
  if (event.target === modal) {
    closeTeamModal();
  }
});

// =============================
// 🎯 Renderizar Jogadores (simples, apenas mostra cards)
// =============================
function renderPlayers() {
  playersGrid.innerHTML = "";
  players.forEach(p => {
    const div = document.createElement("div");
    div.classList.add("item");
    div.innerHTML = `
      <img src="${p.img || './img/player_default.png'}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.team}</p>
    `;
    playersGrid.appendChild(div);
  });
}

// chama inicial para mostrar Home (não abre nada automaticamente)
(function init() {
  // se quiser abrir direto a lista de times ao carregar, descomente:
  // showSection('teams');
})();
