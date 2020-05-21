let allPeople = [];
let selectedPeople = [];
let mascPeople = 0;
let femPeople = 0;
let numberUser = 0;
let ageSum = 0;
let ageAverage = 0;
let numberFormat = null;

window.addEventListener("load", () => {
    const loading = document.querySelector(".loading");
    const container = document.querySelector(".container");
    const form = document.querySelector("#form");
    const search = document.querySelector("#search");
    const btn = document.querySelector("#btn");
    const resUser = document.querySelector("#resUser");
    const resStatistics = document.querySelector("#resStatistics");

    numberFormat = Intl.NumberFormat("pt-BR");

    setTimeout(() => {
        container.classList.add("show");
        loading.classList.add("hide");
    },1000);

    fetchPeople();
});

//fetch com a API
async function fetchPeople() {
    const res = await fetch("https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo");
    const json = await res.json();
    
    allPeople = json.results.map(people => {
        const {gender, name, dob, picture} = people;
        return {
            gender,
            firstName: name.first,
            lastName: name.last,
            registered: dob.age,
            picture: picture.thumbnail
        }
    });
}

//função disparada quando eu der submit no form
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const word = search.value.toLowerCase();
    search.value = "";
    
    selectedPeople = allPeople.filter(people => people.firstName.toLowerCase().includes(word) || people.lastName.toLowerCase().includes(word)).sort((a,b) => {
        return a.firstName.localeCompare(b.firstName);
    });

    if(selectedPeople.length == 0) {
        resUser.innerHTML = `<p>Nenhum usuário encontrado!!</p>`;
        resStatistics.innerHTML = `<p>Nada a ser exibido!!</p>`;
        return;
    }

    render();
    
});

function render() {
    updateUser();
    updateStatistics();
}

function updateUser() {

    numberUser = selectedPeople.reduce((acc,_) => {
        return acc += 1;
    },0);

    peopleHTML = `
        <h1>${numberUser} Usuário(s) encontrado(s)!</h1>
        <div class="line"></div>
    `;

    selectedPeople.forEach(people => {
        peopleHTML += `
            <div class="user-box">
                <img src="${people.picture}" alt="${people.firstName} ${people.lastName}">
                <p>${people.firstName} ${people.lastName}, ${people.registered} anos</p>
            </div>
        `;
    });

    resUser.innerHTML = peopleHTML;
}

function updateStatistics() {

    mascPeople = selectedPeople.filter(people => {
        return people.gender === "male";
    }).reduce((acc, _) => {
        return acc += 1;
    },0);

    femPeople = selectedPeople.filter(people => {
        return people.gender === "female";
    }).reduce((acc, _) => {
        return acc += 1;
    },0);

    ageSum = selectedPeople.reduce((acc, curr) => {
        return acc + curr.registered;
    },0);

    ageAverage = numberFormat.format(ageSum / numberUser);

    statisticsHTML = `
        <h1>Estatísticas</h1>
        <div class="line"></div>
        <div class="statistics">
            <p>Sexo masculino: <strong>${mascPeople}</strong></p>
            <p>Sexo feminino: <strong>${femPeople}</strong></p>
            <p>Soma de idades: <strong>${ageSum}</strong></p>
            <p>Média de idades: <strong>${ageAverage}</strong></p>
        </div>
    `;

    resStatistics.innerHTML = statisticsHTML;
}

search.addEventListener("keyup", () => {
    if(search.value.length > 0) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
});