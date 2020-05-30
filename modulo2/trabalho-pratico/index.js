const express = require('express');
const fs = require('fs');
const app = express();
const port = 9999;
const states = require('./Estados.json');
const cities = require('./Cidades.json');

app.use(express.json());

app.get('/', (req, res) => {
  states.forEach((state) => {
    let idState = state.ID;
    let city = cities.filter((city) => city.Estado === idState);

    fs.writeFile(
      `./states/${state.Sigla}.json`,
      JSON.stringify(city),
      (err) => {
        if (err) return res.status(400).send('Write file error!');
      }
    );
  });
});

app.get('/state/:uf', (req, res) => {
  const uf = req.params.uf.toUpperCase();
  fs.readFile(`./states/${uf}.json`, 'utf8', (err, data) => {
    if (err) return res.status(400).send('Read file error!');
    let json = JSON.parse(data);
    let countCities = json.reduce((acc, curr) => {
      return (acc = acc + 1);
    }, 0);
    return res.send(`O total de cidades em ${uf} é: ${countCities}`);
  });
});

app.get('/morecities', (req, res) => {
  let allCities = [];
  states.forEach((state) => {
    let countCity = cities
      .filter((city) => city.Estado === state.ID)
      .reduce((acc, curr) => {
        return (acc = acc + 1);
      }, 0);
    let currentCity = { uf: state.Sigla, count: countCity };
    allCities.push(currentCity);
  });

  allCities.sort((a, b) => {
    return b.count - a.count;
  });

  let fiveCities = [];
  for (let i = 0; i < 5; i++) {
    fiveCities.push(allCities[i]);
  }

  res.send(fiveCities);
});

app.get('/lesscities', (req, res) => {
  let allCities = [];
  states.forEach((state) => {
    let countCity = cities
      .filter((city) => city.Estado === state.ID)
      .reduce((acc, curr) => {
        return (acc = acc + 1);
      }, 0);
    let currentCity = { uf: state.Sigla, count: countCity };
    allCities.push(currentCity);
  });

  allCities.sort((a, b) => {
    return a.count - b.count;
  });

  let fiveCities = [];
  for (let i = 0; i < 5; i++) {
    fiveCities.push(allCities[i]);
  }

  res.send(fiveCities.sort((a, b) => b.count - a.count));
});

app.get('/biggername', (req, res) => {
  let biggerLengthCity = [];
  states.forEach((state) => {
    let allCities = cities.filter((city) => city.Estado === state.ID);
    allCities.sort((a, b) => {
      return b.Nome.length - a.Nome.length;
    });

    let filterCity = allCities.filter(
      (city) => allCities[0].Nome.length === city.Nome.length
    );

    biggerLengthCity.push({ uf: state.Sigla, ...filterCity });
  });
  res.send(biggerLengthCity);
});

app.get('/smallestname', (req, res) => {
  let smallestLengthCity = [];
  states.forEach((state) => {
    let allCities = cities.filter((city) => city.Estado === state.ID);
    allCities.sort((a, b) => {
      return a.Nome.length - b.Nome.length;
    });

    let filterCity = allCities.filter(
      (city) => allCities[0].Nome.length === city.Nome.length
    );

    smallestLengthCity.push({ uf: state.Sigla, ...filterCity });
  });
  res.send(smallestLengthCity);
});

app.get('/bigname', (req, res) => {
  let c = [];
  let names = [];
  cities.forEach((city) => {
    c.push({ name: city.Nome, estado: city.Estado });
  });
  c.sort((a, b) => {
    return b.name.length - a.name.length;
  });
  names = c.filter((city) => c[0].name.length === city.name.length);
  names.sort((a, b) => a.name.localeCompare(b.name));
  names = {
    name: names[0].name,
    uf: states.find((state) => state.ID === names[0].estado),
  };
  res.send(names);
});

app.get('/lesname', (req, res) => {
  let c = [];
  let names = [];
  cities.forEach((city) => {
    c.push({ name: city.Nome, estado: city.Estado });
  });
  c.sort((a, b) => {
    return a.name.length - b.name.length;
  });
  names = c.filter((city) => c[0].name.length === city.name.length);
  names.sort((a, b) => a.name.localeCompare(b.name));
  names = {
    name: names[0].name,
    uf: states.find((state) => state.ID === names[0].estado),
  };
  res.send(names);
});

app.listen(port, () => {
  console.log(`Server is listening port ${port}`);
});
