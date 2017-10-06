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

connection.connect(
  console.log("Welcome to Bamazon!")
);

inquirer.prompt([{
  name:'command',
  message: 'What view would you prefer?',
  type: 'list',
  choices: [{
    name: 'Customer-View'
  }, {
    name: 'Manager-View'
  }, {
    name: 'Supervisor-View'
  }]
}]).then(function(answer){
  if(answer.command === 'Customer-View'){
    customerView();
  }
});

function customerView(){
  connection.query('SELECT * FROM products', function(err,res){
    if(err){
      throw err;
    }
    for(var i = 0; i< res.length; i++){
      console.log('--------------------');
      console.log("PRODUCT NAME: " + res[i].product_name);
      console.log("ITEM ID: " + res[i].item_id);
      console.log("PRICE: " + res[i].item_price);
    }

    Console.log("continue prompts here");

  });
}
