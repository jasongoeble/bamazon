var mysql = require("mysql");
var inquirer = require("inquirer");

//global variables to hold user inputs and perform calculations and triggers
var productID = "";
var unitCount = "";
var availableUnitCount = 0;
var unitCost = 0;
var productSales = 0;
var validated = false;

//this initiates the connection to the database
var connection = mysql.createConnection({
    //hosted locally
    host: "localhost",
    //standard local host port
    port: 3306,
    //username for my local db
    user: "root",
    //password for my local db
    password: "L3tm31nn0w!",
        //specific db to use
        database: "bamazon",
        insecureAuth: true
});

//open connection and run program
connection.connect(function(err){
    if (err) throw err;
    
    displayAllProducts();
    
    //runs the inquirer npm functionality for the purchase questions and returns the user input
    inquirer.prompt(purchaseQuestions).then(function(answers)
    {
        //set global variable value for the product ID desired
        productID = answers.purchase_ID;
        //set global vairable value for the total number of units desired
        unitCount = answers.unit_count;

        validatePurchaseRequest(productID, unitCount);
    });
});

function displayAllProducts()
{
    var query = connection.query("SELECT * FROM bamazon.products", function(err, res){
        if (err) throw err;
        for (var i = 0; i < res.length; i++)
        {
            console.log("\n"+res[i].item_id + " | " + res[i].product_name + " | " + res[i].price);
            console.log("--------------------------------------");
        }
    });
}

function validatePurchaseRequest(prodID,items)
{
    var query = connection.query("SELECT stock_quantity, price, product_sales FROM bamazon.products WHERE item_id = " + prodID, function(err, res)
    {
        if (err) throw err;
        //if there is enough available stock to fill the purchase request
        if (res.stock_quantity > items)
        {
            //set global variable to the number of units in the database
            availableUnitCount = res.stock_quantity;
            //set global variable to the unit cost of the item in the database
            unitCost = res.price;
            //set global variable to the product sales field for the item in the database
            productSales = res.product_sales;
            //set global variable to true, indicating that the order can be filled
            validated = true;

            if (validated)
            {
                //execute the purchas request
                runPurchase(productID, unitCount, unitCost, productSales);
            }
            else
            {
                
                connection.end();
            }
        }
        else
        {
            console.log("Your purchase request exceeded the in stock quantity.  \n Please check the store at a later date.");
            validated = false;
            connection.end();
        }


    });
}

function runPurchase(prodToPurch, countToPurch, unitCost, productSales)
{
    console.log("Initiating your purchase now...\n");
    
    //set a variable equal to the new stock count
    availableUnitCount = availableUnitCount - countToPurch;
    
    //set a variable equal to the purchase cost
    var totalCost = countToPurch * unitCost;

    //set a variable equal to the new product sales value 
    var newProductSales = productSales + totalCost;

    //update the database with the reduction in stock and the new amount of product sales
    var query = connection.query("UPDATE bamazon.products SET ? WHERE ?",
    [
        {
            stock_quantity: availableUnitCount,
            product_sales: newProductSales

        },
        {
            item_id: prodToPurch
        }
        
    ],
    function(err, res){
        console.log("Warehouse inventory updated!\n  Your total purchase price was: $" + totalCost);
        if (err) throw err;
        connection.end();
    });
}

//purchase questions
var purchaseQuestions = 
[
    {
        message: "Please enter the ID of the item you would like to buy: ",
        type: "input",
        name: "purchase_ID",
        validate: function (x)
        {
            if (isNaN(x) || x == '' || x < 1 || x > 15)
            {
                console.log("You have not entered a valid item ID.  \nPlease refer to the original table of items for sale.\n")
                return false;
            }
            else
            {
                return true;
            }

        }

    },
    {
        message: "How many units would you like to purchase: ",
        type: "input",
        name: "unit_count",
        validate: function (y)
        { 
            if (isNaN(y) || y == "")
            {
                console.log("You have not entered a valid unit count.  \nPlease refer to the original table of items for sale.\n")
                return false;
            }
            else
            {
                return true;
            }
        }
    }
];