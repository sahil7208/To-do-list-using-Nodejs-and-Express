import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost", 
  database: "permalist",
  password: "sahil1234",
  port: 5432
})

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

app.get("/", async (req, res) => {
 try
 { const result = await db.query("SELECT * FROM items ORDER BY id ASC");
  items =  result.rows;
  //console.log(items);
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
} catch(err)
{
  console.log(err)
}
});

app.post("/add", async(req, res) => {
  const item = req.body.newItem;
   await db.query("INSERT INTO items(title) values($1)", [item])
   res.redirect("/");
});

app.post("/edit", async(req, res) => {
  let id = req.body.updatedItemId;
  console.log(id)
  let name = req.body["updatedItemTitle"]
  console.log(name);
  try
 { 
   await db.query("UPDATE items SET title = ($1) WHERE id = $2", [name, id]);
  res.redirect('/');
}catch(err)
{
  console.log(err);
}
});


app.post("/delete", async(req, res) => {
  try
  {
    const id = req.body.deleteItemId
  await db.query("DELETE FROM items WHERE id=$1", [id])
  res.redirect("/");
}catch(err)
{
  console.log(err);
}
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

