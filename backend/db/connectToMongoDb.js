import mongoose from 'mongoose';

const connectToMongoDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("CONNECTED TO DATABASE");
        
    } catch (error) {
        console.log("Error connecting to database",error.message);
        
    }
}

export default connectToMongoDB;