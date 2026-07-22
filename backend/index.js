import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.js";

const port = 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Inventory API running");
});

app.use("/products", productRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});