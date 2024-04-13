const express=require("express")
const dotenv=require('dotenv')
const connectToDB = require("./Db/db")
const userRoutes=require("./routes/userRoutes")
const productRoutes=require("./routes/productRoutes")
const orderRoutes=require("./routes/orderRoutes") 
const cors=require("cors")
const app=express()
// const Razorpay = require("razorpay");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
dotenv.config()
const port=process.env.port || 4000

//Routes
app.use("/api/user",userRoutes)
app.use("/api/product",productRoutes)
app.use("/api/order",orderRoutes)

app.get("/api/getkey", (req,res)=>res.status(200).json({key: process.env.Razor_Pay_Api_key}))

app.listen(port,()=>{
    console.log(`Backend started succesfully at http://localhost:${port}`)  
})

connectToDB();

