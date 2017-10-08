// ***** DEPENDENCIES *****
const mysql = require('mysql');
const inquirer = require('inquirer');

// ***** VARIABLES *****
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'bamazon'
});

connection.connect(function(err) {
  if (err) {
    throw err;
  }

  console.log("Welcome to Bamazon!");


  inquirer.prompt([{
    name: 'command',
    message: 'What view would you prefer?',
    type: 'list',
    choices: [{
      name: 'Customer-View'
    }, {
      name: 'Manager-View'
    }, {
      name: 'Supervisor-View'
    }]
  }]).then(function(answer) {
    if (answer.command === 'Customer-View') {
      customerView();
    } else if (answer.command === 'Manager-View') {
      managerView();
    }
  });

  function customerView() {
    connection.query('SELECT * FROM products', function(err, res) {
      if (err) {
        throw err;
      }
      // display information for the items for sale
      for (var i = 0; i < res.length; i++) {
        console.log('--------------------');
        console.log("PRODUCT NAME: " + res[i].product_name);
        console.log("ITEM ID: " + res[i].item_id);
        console.log("PRICE: " + res[i].price);
        console.log("Quantity: " + res[i].stock_quantity);
      }
      // prompt the user to choose an item id, as well as a quantity
      inquirer.prompt([{
        name: 'idNum',
        type: 'input',
        message: 'What item would you like to purchase? Please enter item ID to select',
        validate: function(input) {
          if (input === '') {
            console.log('Try again!')
            return false;
          } else {
            return true;
          }
        }
      }, {
        name: 'quantity',
        type: 'input',
        message: 'How many of these would you want?',
        validate: function(input) {
          if (input === '') {
            console.log('Try again!')
            return false;
          } else {
            return true;
          }
        }
      }]).then(function(answer) {
        let idNum = answer.idNum;
        let quantity = parseInt(answer.quantity);
        let queryStr = 'SELECT * FROM products WHERE ?';

        connection.query(queryStr, {
          item_id: idNum
        }, function(err, results, field) {
          if (err) {
            throw err;
          }

          let productData = results[0];
          let costToUser = productData.price * quantity;
          console.log("Your total will be $" + costToUser + " for " + quantity + " units of " + productData.product_name);

          if (quantity > productData.stock_quantity) {
            console.log("Insufficient quantity!");

          } else {
            console.log('Your order will now be completed. The warehouse will be informed.');
            let newTotal = productData.stock_quantity - quantity;


            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newTotal
              },
              {
                item_id: idNum
              }
            ], function(err, results) {
              if (err) {
                throw err;
              }
            });
            connection.end();
          }
        });
      });
    });

  }

  function managerView() {
    inquirer.prompt([{
      name: 'command',
      message: 'What would you like to do?',
      type: 'list',
      choices: [{
        name: 'View Products For Sale'
      }, {
        name: 'View Low Inventory'
      }, {
        name: 'Add To Inventory'
      }, {
        name: 'Add New Product'
      }]
    }]).then(function(answer) {
      if (answer.command === 'View Products For Sale') {
        connection.query("SELECT * FROM products", function(err, res) {
          if (err) {
            throw err;
          }

          for (var i = 0; i < res.length; i++) {
            console.log('--------------------');
            console.log("PRODUCT NAME: " + res[i].product_name);
            console.log("ITEM ID: " + res[i].item_id);
            console.log("PRICE: " + res[i].price);
            console.log("Quantity: " + res[i].stock_quantity);
          }
          console.log('--------------------');
        });
        connection.end();
      } else if (answer.command === 'View Low Inventory') {
        connection.query("SELECT * FROM products WHERE stock_quantity < 100", function(err, res) {
          if (err) {
            throw err;
          }

          for (var i = 0; i < res.length; i++) {
            console.log('--------------------');
            console.log("PRODUCT NAME: " + res[i].product_name);
            console.log("ITEM ID: " + res[i].item_id);
            console.log("PRICE: " + res[i].price);
            console.log("Quantity: " + res[i].stock_quantity);
          }
          console.log('--------------------');
        });
        connection.end();

      } else if (answer.command === 'Add To Inventory') {
        inquirer.prompt([{

          name: 'item_id',
          type: 'input',
          message: 'Please Enter the item ID for the inventory you would like to update',
          filter: Number

        }, {

          name: 'quantity',
          type: 'input',
          message: 'Please enter the amount of units you would like to add',
          filter: Number

        }]).then(function(answer){

          let item = parseInt(answer.item_id);
          let quantity = parseInt(answer.quantity);

          connection.query("SELECT * FROM products WHERE ?", { item_id: item}, function(err, res){
            if(err){
              throw err;
            }
            let productData = res[0];
            let newQuantity = productData.stock_quantity + quantity;

            connection.query("UPDATE products SET ? WHERE ?",[{
              stock_quantity: newQuantity
            },{
              item_id:item
            }], function(err, res){
              if(err){
                throw err;
              }

                console.log("Inventory has been updated");
                connection.end();
              });

          });

        });
      } else if (answer.command === 'Add New Product') {

          inquirer.prompt([{

            name: 'product_name',
            type: 'input',
            message: 'Please enter the product name',

          }, {

            name: 'department_name',
            type: 'input',
            message: 'Please enter the department category',

          }, {
            name: 'price',
            type: 'input',
            message: 'Please enter the per unit price'
          }, {
            name: 'stock_quantity',
            type: 'input',
            message: 'Please enter the amount of inventory you want to start with'
          }]).then(function(answer){
            let name = answer.product_name;
            let category = answer.department_name;
            let price = answer.price;
            let quantity = answer.stock_quantity;

            connection.query("INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES('"+name+"', '"+category+"', '"+price+"', '"+quantity+"')", function(err, res, field){
              if(err){
                throw err;
              }
              console.log("New item has been inserted to DB under ID " + res.insertID);
              connection.end();
            });
          });
      }
    });


  }
});
