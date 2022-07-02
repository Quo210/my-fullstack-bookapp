const express = require('express');
const app = express();
const PORT = 8000;
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const cntStr = 'mongodb+srv://q210:3xfOi1x0YJpG8F31@cluster0.fgcri.mongodb.net/?retryWrites=true&w=majority';
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// q210 3xfOi1x0YJpG8F31

app.listen(PORT,()=>{
    console.log('Server is sucessfully running on PORT:8000')
})



MongoClient.connect(cntStr).then(client => {
    console.log('Database is online')
    const database = client.db('books');
    const readBooks = database.collection('readBooks')
    
    app.get('/',(req,res)=>{
        readBooks.find().toArray().then(result =>{
            const resArray = Array.from( result );
            resArray.forEach(object => {
                for (property in object){
                    switch(property){
                        case 'bookName':
                        case 'author':
                        case 'genre':
                            const target = object[property].split(" ");
                            const replacement = target.map(word => {
                                return word.charAt(0).toUpperCase() + word.substring(1);
                            })
                            object[property] = replacement.join(" ");
                    }}
                })
            res.render('index.ejs',{books: resArray})
        }).catch(err => console.error(err))
    })
    
    app.post('/books',(req,res)=>{
        const object = req.body;
        for (property in object){
            object[property] = object[property].toLowerCase();
        }

        readBooks.insertOne(object).then(result =>{
            res.redirect('/')
        }).catch(prob => {
            if(prob) console.error(prob);
        })
    });

    app.put('/books',(req,res)=>{
        const info = req.body;
        let newStatus = '';
        if(info.read == 'no'){
            newStatus = 'Yes'
        } else {
            newStatus = "No"
        };
        readBooks.findOneAndUpdate(
            {
                bookName: info.bookName
            },
            {
                $set: {
                    read: newStatus
                }
            },
            {
                upsert: false
            })
        .then(result =>{ 
            res.json('Update request sent to mongoDB');
            console.log('result was this:', result)
        })
        .catch(prob =>{
            console.error('Error!:',prob)
        });
    });

    app.delete('/books',(req,res) => {
        const info = req.body;
        readBooks.findOneAndDelete(
            {
                bookName: info.bookName
            }
        ).then(result => {
            if(result.deletedCount === 0) res.json('No more books by that name to delete.');
            else res.json(`Successfully Deleted Book: "${info.bookName.toUpperCase()}"!`);
        }).catch(err => {
            if(err) console.error('Deletion Error:',err);
        })
    })
})
.catch(error => {if(error) console.error('This is a mongoClient error,', error)});