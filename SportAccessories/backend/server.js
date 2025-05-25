const express= require('express');
const  mongoose= require('mongoose');
const PORT=3001;
const app= express();

mongoose.connect('mongodb://localhost:27017', {

})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
app.get('/', (req, res) => {
    try{
        res.send('Hello World!');
    }
    catch(err){
        console.error('Error in root route:', err);
        res.status(500).send('Internal Server Error');
    }
    
});
app.listen(PORT, (err) => {
    if(err){
        console.error(`Error starting server: ${err}`);
        return;
    }
    console.log(`Server is running on http://localhost:${PORT}`);
}
);