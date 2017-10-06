// ***** DEPENDENCIES *****
const mysql = require('mysql');
const inquirer = require('inquirer');

// ***** VARIABLES *****
let connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'bamazon'
});

connection.connect(function(err){
  if(err){
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

      connection.query(queryStr, {item_id: idNum}, function(err, results, field) {
          if (err) {
            throw err;
          }

          let productData = results[0];

            if (quantity > productData.stock_quantity) {
              console.log("Insufficient quantity!");

            }

            else{
              console.log('Your order will now be completed. The warehouse will be informed.');
              let newTotal = productData.stock_quantity - quantity;


              connection.query("UPDATE products SET ? WHERE ?",[
                {
                  stock_quantity: newTotal
                },
                {
                  item_id: idNum
                }
              ], function(err, results){
                if(err){
                  throw err;
                }

                connection.query('SELECT item_id FROM products WHERE ?', {item_id: idNum}, function(err, res){
                  if (err) {
                    throw err
                  }

                  console.log(res);

                });
              });
              connection.end();
            }
      });
    });
  });

}
});
