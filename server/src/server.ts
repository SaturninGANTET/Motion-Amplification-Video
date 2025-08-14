import express from "express";
import cors from "cors";

const app = express()


const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(cors({
  origin: 'http://localhost:5173',  // TODO .env
}));

app.use(express.json())

app.use(require('./router/video'))
app.use(require('./router/output'))



app.listen(3001,() => {
    console.log('Server is running at port 3001');
})