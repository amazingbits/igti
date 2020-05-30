const express = require('express');
const fs = require('fs');
const app = express();
const port = 9999;

app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Teste');
// });

app.post('/account', (req, res) => {
  const { name, balance } = req.body;

  try {
    fs.readFile('accounts.json', 'utf8', (err, data) => {
      let json = JSON.parse(data);
      json.accounts.push({ id: json.nextId++, name, balance });

      try {
        fs.writeFile('accounts.json', JSON.stringify(json), (err) => {
          if (err) return res.status(400).send('Write file error');
        });
      } catch (err) {
        return res.status(400).send('Write file error');
      }

      res.status(200).send('Cadastro ralizado!');
    });
  } catch (err) {
    return res.status(400).send('Reading file error!');
  }
});

app.get('/account', (req, res) => {
  try {
    fs.readFile('accounts.json', 'utf8', (err, data) => {
      const json = JSON.parse(data);
      res.status(200).send(json.accounts);
    });
  } catch (err) {
    return res.status(400).send('Reading file error!');
  }
});

app.get('/account/:id', (req, res) => {
  try {
    const id = Number(req.params.id);
    fs.readFile('accounts.json', 'utf8', (err, data) => {
      const json = JSON.parse(data);
      const foundAccount = json.accounts.find((account) => {
        return account.id === id;
      });
      if (!foundAccount) {
        return res.status(404).send('account not found!');
      }
      res.status(200).send(foundAccount);
    });
  } catch (err) {
    return res.status(400).send('Reading file error!');
  }
});

app.put('/account', (req, res) => {
  const currentAccount = req.body;

  fs.readFile('accounts.json', 'utf8', (err, data) => {
    if (err) res.status(400).send('Read file error!');

    const json = JSON.parse(data);

    let index = json.accounts.findIndex(
      (acc) => acc.id === Number(currentAccount.id)
    );

    if (index >= 0) {
      json.accounts[index] = currentAccount;
      fs.writeFile('accounts.json', JSON.stringify(json), (err) => {
        if (err) return res.status(400).send('Write file error!');
      });
      return res.status(200).send(json);
    } else {
      return res.status(404).send('Account not found!');
    }
  });
});

app.delete('/account/:id', (req, res) => {
  const id = Number(req.params.id);

  fs.readFile('accounts.json', 'utf8', (err, data) => {
    if (err) return res.status(400).send('Read file error!');
    const json = JSON.parse(data);

    const filteredData = json.accounts.filter((acc) => {
      return acc.id !== id;
    });

    if (filteredData.length === json.accounts.length)
      return res.status(400).send('Account not found!');

    json.accounts = filteredData;

    fs.writeFile('accounts.json', JSON.stringify(json), (err) => {
      if (err) return res.status(400).send('Write file error!');
    });

    res.status(200).send(json.accounts);
  });
});

app.listen(port, () => {
  try {
    fs.readFile('accounts.json', 'utf8', (err, data) => {
      if (err) {
        let initialFile = { nextId: 1, accounts: [] };

        fs.writeFile('accounts.json', JSON.stringify(initialFile), (err) => {
          if (err) {
            return console.log('Creating file error!');
          }
        });
      }
    });
  } catch (err) {
    return console.log('Reading file error!');
  }
  console.log(`Server is running at port ${port}`);
});
