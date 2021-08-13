const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');
const fs = require('fs')

// GET Route for retrieving all the notes
notes.get('/', (req, res) =>
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

// POST Route for submitting note
notes.post('/', (req, res) => {
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = { 
      title,
      text,
      note_id: uuidv4(),
    };

    readAndAppend(newNote, './db/db.json');

    const response = {
      status: 'success',
      body: newNote,
    };

    res.json(response);
  } else {
    res.json('Error in saving note');
  }
});

// Delete Route for deleting note
notes.delete('/:note_id', (req, res) => {
    const deleteId = req.params.note_id;
    
    fs.readFile('./db/db.json', (err, data) => {

      if (err) throw err;

      noteData = JSON.parse(data);

      for (let i = 0; i < noteData.length; i++) {
        if(noteData[i].note_id == (deleteId)) {
          noteData.splice([i], 1);
        }
      } 

      minusDeletedData = JSON.stringify(noteData)

      fs.writeFile('./db/db.json', minusDeletedData, (err, data) => {
        if (err) throw err;
      });
    });
    res.json("Deleted Successfully")
});

module.exports = notes;
