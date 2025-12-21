const mongoose=require('mongoose');

function connectToDb(){
    return mongoose.connect('mongodb://localhost:27017/cmsdb')
        .then(() => {
            console.log('Succesfully connected to database');
        })
        .catch((error) => {
            console.error('Could not connect to a Database');
            throw error;
        });
}

module.exports=connectToDb;