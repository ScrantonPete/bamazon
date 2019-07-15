var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "hahaha8282",
  database: "bamazondb"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
});
// function which prompts the user for what action they should take

var displayProducts = function() {
  var query = "Select * FROM products";
  connection.query(query, function(err, res) {
    if (err) throw err;
    var displayTable = new Table({
      head: ["Item ID", "Product Name", "Department", "Price", "Quantity"],
      colWidths: [10, 25, 25, 10, 14]
    });
    for (var i = 0; i < res.length; i++) {
      displayTable.push([
        res[i].position,
        res[i].product_name,
        res[i].department_name,
        "$" + res[i].price,
        res[i].stock_quantity
      ]);
    }
    console.log(displayTable.toString());
    purchaseProduct();
  });
};

function purchaseProduct() {
  inquirer
    .prompt([
      {
        name: "ID",
        type: "input",
        message: "Please enter the Item ID you would like to purchase.",
        filter: Number
      },
      {
        name: "Quantity",
        type: "input",
        message: "How many of that item would you like to purchase?",
        fliter: Number
      }
    ])
    .then(function(answers) {
      var itemSelected = answers.ID;
      var quantitySelected = answers.Quantity;
      purchaseRequested(itemSelected, quantitySelected);
    });
}

function purchaseRequested(ID, purchaseQuantity) {
  connection.query("Select * FROM products WHERE position = " + ID, function(
    err,
    res
  ) {
    if (err) {
      console.log(err);
    }
    if (purchaseQuantity <= res[0].stock_quantity) {
      var cost = res[0].price * purchaseQuantity;
      console.log(
        "The product in stock and it looks like you're ready to start brewing!"
      );
      console.log(
        "That will be $" +
          cost +
          "for " +
          purchaseQuantity +
          " " +
          res[0].product_name +
          ". Thank you!"
      );
      connection.query(
        "UPDARE products SET stock_quantity = stock_quantity -" +
          purchaseQuantity +
          "WHERE position= " +
          ID
      );
    } else {
      console.log(
        "We don't have that many " +
          res[0].product_name +
          "in stock. Please request a lower quantity."
      );
    }
    displayProducts();
  });
}
displayProducts();
