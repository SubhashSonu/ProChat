require('dotenv').config();
const express = require("express");

const cors = require("cors");
const  authRoutes = require("./routes/auth.route");
const  messageRoutes = require("./routes/message.route");
const connectDB = require('./lib/connections');
const cookieParser = require("cookie-parser");
const { app, server } = require('./lib/socket');
const path = require("path");




const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();


// connect mongodb
connectDB();

// middleware
app.use(express.json({ limit: '5mb' })); // used to extract json data from the body
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("/{*any}",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    })
}







server.listen(PORT,()=>{
 console.log(`Server is started on port : ${PORT}`);
});