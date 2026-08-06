import express from "express";
import cors from "cors";
import productRoutes from "./routes/product.js";
import categoryRoutes from "./routes/categories.js"

const port = 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Inventory API running");
});

// Chrome DevTools probes this endpoint on localhost; return empty success to avoid noisy 404 logs.
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
    res.status(204).end();
});

app.use("/products", productRoutes);
app.use("/category",categoryRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});