const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/config.js");
const routes = require("./routes/routes");
const cors = require("cors");
const helmet = require("helmet");
const { Server } = require("socket.io");

const { createServer } = require("node:http");
const { join } = require("node:path");

const app = express();
const server = createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
    console.log(msg)
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");
app.use(cors());
app.use(helmet());

app.set(express.urlencoded({ extended: false }));
app.set(express.json());

const uri = `mongodb://${config.database.host}:${config.database.port}/${config.database.name}`;

mongoose.connect(uri);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose.connection.on("connected", () => {
  // console.log("Mongoose connected to " + uri);

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error: " + err);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected");
});
mongoose.connection.on("close", () => {
  console.log("Mongoose connection closed");
});
