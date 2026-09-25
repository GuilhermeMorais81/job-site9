const express = require('express');
const app = express();
app.use(express.json());
const PORT = 3000;
const database = require("./database/connection.js");

database.authenticate().then(() => console.log("SUCESSFULLY CONNECTED TO DATABASE"));
app.listen(PORT, () => console.log(`SERVER LISTENING AT PORT ${PORT}`));
