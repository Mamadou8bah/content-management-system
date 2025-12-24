const mongoose=require('mongoose');
const dotenv=require('dotenv');
dotenv.config();

function connectToDb(){
    return mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('Succesfully connected to database');
        })
        .catch((error) => {
            console.error('Could not connect to a Database');
            throw error;
        });
}

module.exports=connectToDb;