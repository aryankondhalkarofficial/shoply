import dns from "node:dns/promises";

dns.setServers(["1.1.1.1", "1.0.0.1"]);
import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

await connectDB();
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
