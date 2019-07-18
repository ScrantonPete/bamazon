// Dependencies

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
// displays product list for user to see fro SQL query

console.log("WELCOME TO SLIPPERY PETE's HOMEBREW SUPPLY!");
var displayProducts = function() {
  var query = "Select * FROM products";
  connection.query(query, function(err, res) {
    if (err) throw err;
    var displayTable = new Table({
      head: ["Item ID", "Product Name", "Department", "Price", "Quantity"],
      colWidths: [10, 30, 25, 10, 10]
    });
    var IDlist = [];
    for (var i = 0; i < res.length; i++) {
      displayTable.push([
        res[i].position,
        res[i].product_name,
        res[i].department_name,
        "$" + res[i].price,
        res[i].stock_quantity
      ]);
      IDlist.push(res[i].position);
    }

    console.log(displayTable.toString());
    purchaseProduct(IDlist);
  });
};

// function that asks the user what item and how many they would like to purchase

function purchaseProduct(IDlist) {
  inquirer
    .prompt([
      {
        name: "ID",
        type: "list",
        message: "Please enter the Item ID you would like to purchase.",
        choices: IDlist
      },
      {
        name: "Quantity",
        type: "input",
        message:
          "How many of that item (or POUNDS of Malt) would you like to purchase?",
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
  connection.query("SELECT * FROM products WHERE position = " + ID, function(
    err,
    res
  ) {
    if (err) {
      console.log(err);
    }

    if (purchaseQuantity <= res[0].stock_quantity) {
      var cost = (res[0].price * purchaseQuantity).toFixed(2);
      console.log(
        "GOOD NEWS! Your request is available since we have " +
          res[0].stock_quantity +
          " " +
          res[0].product_name +
          "(s) in stock. Hopefully this will get you BREW READY!!"
      );
      console.log(
        "That will be $" +
          cost +
          " for " +
          purchaseQuantity +
          " " +
          res[0].product_name +
          "(s)."
      );

      inquirer
        .prompt({
          name: "confirmPurchase",
          type: "list",
          message: "Confirm the above purchase?",
          choices: ["YES", "NO"]
        })
        .then(function(answer) {
          console.log(answer);
          if (answer.confirmPurchase === "YES") {
            sellProduct(
              res[0].position,
              res[0].stock_quantity - purchaseQuantity
            );
          } else if (answer.confirmPurchase === "NO") {
            console.log("That's fine! Please check out our other products!");
            startOver();
          } else {
            connection.end();
          }
        });
    } else {
      console.log(
        "We don't have that many " +
          res[0].product_name +
          "(s) in stock. Please request a lower quantity."
      );
      startOver();
    }
  });
}

function sellProduct(id, qty) {
  console.log("Thank you for your purchase! HAPPY BREWING!");
  connection.query(
    "UPDATE products SET stock_quantity = " + qty + " WHERE position= " + id
  );
  startOver();
}

function startOver() {
  inquirer
    .prompt({
      name: "startOver",
      type: "list",
      message:
        "Would you like to see the product list again and shop some more? If not choose [NO] to exit",
      choices: ["YES", "NO"]
    })
    .then(function(answer) {
      if (answer.startOver === "YES") {
        displayProducts();
      } else if (answer.startOver === "NO") {
        console.log("That's fine! Until next time HAPPY BREWING!");
        connection.end();
      } else {
        console.log("Choice not recognized");
      }
    });
}

displayProducts();
