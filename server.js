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
            res.render('index.ejs',{books: result})
            console.log('Webpage rendered!')
        }).catch(err => console.error(err))
    })
    
    app.post('/books',(req,res)=>{
        readBooks.insertOne(req.body).then(result =>{
            res.redirect('/')
        }).catch(prob => {
            if(prob) console.error(prob);
        })
    });

    app.put('/books',(req,res)=>{
        const info = req.body;
        console.log(info);
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
    })
})
.catch(error => {if(error) console.error('This is a mongoClient error,', error)});