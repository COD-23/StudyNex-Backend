const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const connectDatabase = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const orgRoutes = require('./routes/orgRoutes');
const channelRoutes = require("./routes/channelRoutes");

app.use(cors());
app.use(express.json());

dotenv.config();
const port = process.env.PORT || '3001';

connectDatabase();

app.use("/api/",userRoutes);
app.use("/api/",orgRoutes);
app.use("/api/",channelRoutes);

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});