// import dotenv from "dotenv";
import "dotenv/config";
// import + call in a same line

import app from "./app";
import { connectDatabase } from "./config/db.config";
import ENV_CONFIG from "./config/env.config";
import { verifyMailServerConnection } from "./config/nodemailer.config";
import { sendEmail } from "./utils/emailServer.utils";

const PORT = ENV_CONFIG.PORT;
const DB_URI = ENV_CONFIG.DB_URI;
// const DB_URL = 'mongodb+srv://';


//* listen
app.listen(PORT, ()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
    verifyMailServerConnection();
    sendEmail();
});

connectDatabase(DB_URI);