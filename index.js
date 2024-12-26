import express from "express";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  password: "Kx-tsc2ciddKx-tsc2cidd",
  database: "world",
  host: "localhost",
  port: 5432,
});
db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const result = await db.query("SELECT country_code FROM visited_countries");

  const countries = result.rows.map((country) => country.country_code);
  res.render("index.ejs", { countries: countries, total: countries.length });
});

app.post("/add", async (req, res) => {
  const userInput = req.body.country.toLowerCase();
  const countriesList = await db.query(
    "SELECT country_code, country_name FROM countries"
  );

  const theCountry = countriesList.rows.find(
    (country) => country.country_name.toLowerCase() === userInput
  );
  const countryCode = theCountry ? theCountry.country_code : null;

  if (countryCode) {
    await db.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [
      countryCode,
    ]);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log("Server running at port " + port);
});
