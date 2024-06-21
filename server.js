const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const csvtojson = require("csvtojson");
const cors = require("cors");
const app = express();
const upload = multer({ dest: "uploads/" });

// Configuração do MongoDB
mongoose.connect("mongodb://localhost:27017/nome_do_banco", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const DataSchema = new mongoose.Schema({}, { strict: false });
const DataModel = mongoose.model("Data", DataSchema);

app.use(cors());
app.use(express.json());

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const csvFilePath = req.file.path;
    const jsonArray = await csvtojson().fromFile(csvFilePath);
    await DataModel.insertMany(jsonArray);
    res.status(200).send("Dados inseridos com sucesso!");
  } catch (error) {
    res.status(500).send("Erro ao inserir dados: " + error.message);
  }
});

app.listen(5000, () => {
  console.log("Servidor rodando na porta 5000...");
});
