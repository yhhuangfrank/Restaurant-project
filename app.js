//! require express
const express = require("express");
const app = express();
const port = 3000;
// - require express-handlebars
const exphbs = require("express-handlebars");
//- get retaurant from json file
const restaurantList = require("./restaurant.json").results;

//! template engine setting
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//! load static files
app.use(express.static("public"));

//! set server route
app.get("/", (req, res) => {
  res.render("index", { restaurant: restaurantList });
});

app.get("/restaurants/:restaurant_id", (req, res) => {
  //- get restaurant detail
  const id = req.params.restaurant_id;
  const restaurant = restaurantList.find((item) => item.id.toString() === id);
  res.render("show", { restaurant });
});

//- search for certain restaurants
app.get("/search", (req, res) => {
  const keyword = req.query.keyword.toLowerCase().trim();
  let restaurant = restaurantList.filter(
    (item) =>
      item.name.toLowerCase().trim().includes(keyword) ||
      item.name_en.toLowerCase().trim().includes(keyword) ||
      item.category.trim().includes(keyword)
  );
  //! search by rating
  if (!isNaN(Number(keyword))) {
    restaurant = restaurantList.filter(
      (item) => item.rating >= Number(keyword)
    );
  }
  //! 若找不到restaurant顯示error頁面
  if (!restaurant.length) {
    res.render("error");
  } else {
    res.render("index", { restaurant, keyword });
  }
});

//! route for not found
app.get("*", (req, res) => {
  res.render("error");
});

//! listen to server
app.listen(port, () => {
  console.log(`Server is listening to http://localhost:${port}`);
});
