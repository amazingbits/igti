const express = require('express');
const app = express();
const fs = require('fs');
const port = 9999;
const global_data = 'grades.json';

app.use(express.json());

app.post('/grade/create', (req, res) => {
  let content = req.body;
  let obj = {};
  fs.readFile(global_data, 'utf8', (err, data) => {
    if (err) return res.status(400).send('Read file error!');
    let json = JSON.parse(data);
    obj = {
      id: json.nextId++,
      student: content.student,
      subject: content.subject,
      type: content.type,
      value: content.value,
      timestamp: new Date(),
    };
    json.grades.push(obj);
    fs.writeFile(global_data, JSON.stringify(json), (err) => {
      if (err) return res.status(400).send('Write file error');
    });
    res.send(obj);
  });
});

app.put('/grade/edit/:id', (req, res) => {
  let id = Number(req.params.id);
  let content = req.body;

  fs.readFile(global_data, 'utf8', (err, data) => {
    if (err) return res.status(400).send('Read file error!');
    let json = JSON.parse(data);
    let findIndex = json.grades.findIndex((grade) => {
      return grade.id === id;
    });
    if (findIndex < 0) {
      return res.status(404).send('Grade not found!');
    } else {
      let obj = {
        id: id,
        student: content.student,
        subject: content.subject,
        type: content.type,
        value: content.value,
        timestamp: new Date(),
      };
      json.grades[findIndex] = obj;

      fs.writeFile(global_data, JSON.stringify(json), (err) => {
        if (err) return res.status(400).send('Write file error!');
      });
      return res.status(200).send(obj);
    }
  });
});

app.delete('/grade/delete/:id', (req, res) => {
  let id = Number(req.params.id);
  fs.readFile(global_data, 'utf8', (err, data) => {
    if (err) return res.status(400).send('Read file error!');
    let json = JSON.parse(data);
    let filteredGrades = json.grades.filter((grade) => grade.id !== id);

    if (filteredGrades.length === json.grades.length) {
      return res.status(400).send('Grade not found!');
    }

    json.grades = filteredGrades;

    fs.writeFile(global_data, JSON.stringify(json), (err) => {
      if (err) return res.status(400).send('Write file error!');
    });
    return res.end();
  });
});

app.get('/grade/:id', (req, res) => {
  let id = Number(req.params.id);
  let foundGrade = {};
  fs.readFile(global_data, 'utf8', (err, data) => {
    if (err) return res.status(400).send('Read file error!');
    let json = JSON.parse(data);
    foundGrade = json.grades.find((grade) => {
      return grade.id === id;
    });
    if (!foundGrade) return res.status(404).send('Grade not found!');
    return res.status(200).send(foundGrade);
  });
});

app.get('/sumvalue', (req, res) => {
  let { student, subject } = req.body;
  let filteredStudent = {};
  let soma = 0;
  fs.readFile(global_data, 'utf8', (err, data) => {
    if (err) return res.status(400).send('Read file error!');
    let json = JSON.parse(data);
    filteredStudent = json.grades.filter((grade) => {
      return grade.student === student && grade.subject === subject;
    });

    if (filteredStudent.length == 0)
      return res.status(404).send('Student not found!');

    filteredStudent.forEach((grade) => {
      soma += grade.value;
    });
    return res
      .status(200)
      .send(
        `A soma das notas de ${student} na disciplina ${subject} é de ${soma}`
      );
  });
});

app.get('/average', (req, res) => {
  let { subject, type } = req.body;
  fs.readFile(global_data, 'utf8', (err, data) => {
    if (err) return res.status(400).send('Read file error!');
    let json = JSON.parse(data);
    let count = 0;
    let sum = 0;
    let avg = 0;
    let filteredGrades = json.grades.filter((grade) => {
      return grade.subject === subject && grade.type === type;
    });
    if (filteredGrades.length == 0)
      return res.status(404).send('Grade or type not found!');

    filteredGrades.forEach((grade) => {
      count++;
      sum += grade.value;
    });
    avg = sum / count;
    return res
      .status(200)
      .send(`A média do Subject ${subject} e do Type ${type} é de ${avg}`);
  });
});

app.get('/bests', (req, res) => {
  let { subject, type } = req.body;
  fs.readFile(global_data, 'utf8', (err, data) => {
    if (err) return res.status(400).send('Read file error!');
    let json = JSON.parse(data);
    let filteredGrade = json.filter(
      (grade) => grade.subject === subject && grade.type === type
    );

    if (filteredGrade.length == 0)
      return res.status(404).send('Grade not found!');

    filteredGrade.sort((a, b) => {
      return b.value - a.value;
    });

    return res.status(200).send(filteredGrade.slice(0, 3));
  });
});

app.listen(port, () => {
  fs.readFile(global_data, 'utf8', (err, data) => {
    if (err) {
      let content = { nextId: 1, grades: [] };
      fs.writeFile(global_data, JSON.stringify(content), (err) => {
        if (err) return console.log('Write file error!');
      });
    }
  });
  console.log(`Server is listening to port ${port}`);
});
