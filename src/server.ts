import app from "./app";
import { connectDatabase } from "./config/db.config";

const PORT = 8080;
const DB_URL = "mongodb://localhost:27017/team_14_db";
// const DB_URL = 'mongodb+srv://';


//* listen
app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});

connectDatabase(DB_URL);