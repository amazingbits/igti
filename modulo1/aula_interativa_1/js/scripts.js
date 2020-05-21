const inputPodcast = document.querySelector("#inputPodcast");
const inputRange = document.querySelector("#inputRange");
const content = document.querySelector("#content");

inputRange.addEventListener("input", function() {
    inputPodcast.value = inputRange.value;

    const foundItem = data.find((item) => {
        return inputRange.value == item.id;
    });

    if(!foundItem) {
        content.innerHTML = `
            <p>Nenhum podcast encontrado!</p>
        `;
    }else{
        content.innerHTML = `
            <img src='../aula_interativa_1/img/${foundItem.image}' width='50px' />
            <h3>${foundItem.title}</h3>
            <p>${foundItem.description}</p>
        `;
    }
});