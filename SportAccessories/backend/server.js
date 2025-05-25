const express= require('express');
const PORT=3001;
const app= express();

app.listen(PORT, (err) => {
    if(err){
        console.error(`Error starting server: ${err}`);
        return;
    }
    console.log(`Server is running on http://localhost:${PORT}`);
}
);