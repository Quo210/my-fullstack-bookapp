const express = require('express');
const app = express();
const PORT = 8000;


app.listen(PORT,()=>{
    console.log('Server is sucessfully running on PORT:8000')
})

app.get('/',(req,res)=>{
    res.sendFile(`${__dirname}/index.html`);
    
})