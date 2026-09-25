require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server Lapor Pak running on http://localhost:${PORT}`);
  console.log(`Swagger Docs available on http://localhost:${PORT}/api-docs`);
});
