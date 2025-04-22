import { app } from "./index.js";
import { connectDB } from "./database/db.js";

// connectDB();

app.listen(process.env.PORT, () => {
    console.log(`server is running on port: ${process.env.PORT}`.bgMagenta.black.bold)
})          