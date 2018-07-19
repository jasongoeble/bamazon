var mysql = require("mysql");
var inquirer = require("inquirer");

//global variables to hold manager inputs
var mgrOper = ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"];
var productList = [];
var productCount = [];

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

//open connection and run manager
connection.connect(function(err){
    if (err) throw err;

    //this query populates the current products table list and their corresponding stock quantities to two different
    //arrays that will be used in other functions
    connection.query("SELECT * FROM bamazon.products", function(err, res)
    {
        if (err) throw err;
        for (var u = 0; u < res.length; u++)
        {
            productList.push(res[u].product_name);
            productCount.push(res[u].stock_quantity);
        }
    });

    //runs the inquirer npm functionality for the manager interface
    inquirer.prompt(managerMenu).then(function(menuAnswers)
    {
        var mgrChoice = menuAnswers.mgrFunction;

        //provide appropriate functionality based on manager's choice
        switch (mgrChoice)
        {
            case mgrOper[0]:
                viewAllSale();
                break;
            case mgrOper[1]:
                viewLowInv();
                break;            
            case mgrOper[2]:
                addToInv();
                break;
            case mgrOper[3]:
                addNewProd();
                break;
            default:
                break;
        }
    });
});

//purchase questions
var managerMenu = 
[
    {
        message: "Please select the function you wish to perform: \n",
        type: "list",
        name: "mgrFunction",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }
];

function viewAllSale()
{
    connection.query("SELECT * FROM bamazon.products", function(err, res){
        if (err) throw err;

        console.log("ID | Name | Price | Quantity");
        for (var i = 0; i < res.length; i++)
        {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
            console.log("--------------------------------------");
            productList.push(res[i].product_name);
            productCount.push(res[i].stock_quantity);
        }
    });

    //close the db connection
    connection.end();
}

function viewLowInv()
{
    connection.query("SELECT * FROM bamazon.products WHERE stock_quantity < 5", function(err, res){
        if (err) throw err;
        if(res.length > 0)
        {            
            console.log("ID | Name | Price | Quantity");
            for (var i = 0; i < res.length; i++)
            {
                console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price + " | " + res[i].stock_quantity);
                console.log("--------------------------------------");
            }
        }
        else
        {
            console.log("Currently, there are no products in the warehouse with less than 5 units.");
        }
    });

    //close the db connection
    connection.end();
}

var newStock = 
[
    {
        message: "Please provide the name of the new product to add to inventory: ",
        type: "input",
        name: "newProdName"
    },
    {
        message: "Please provide the name of the department that will be providing the product: ",
        type: "input",
        name: "addDept",
    },
    {
        message: "Please provide the unit cost for the product: ",
        type: "input",
        name: "newProdPrice",
        validate: function (a)
        {
            if (isNaN(a) || a == "" || a < 0.01)
            {
                console.log("Please enter only a positive number greater than 0.01 dollars for the unit cost.");
                return false;
            }
            else
            {
                return true;
            }

        }
    },
    {
        message: "Please provide the starting inventory count for the product: ",
        type: "input",
        name: "newProdCount",
        validate: function (w)
        { 
            if (isNaN(w) || w == "" ||  w < 1)
            {
                console.log("Please enter only a whole (integer) number greater than 0 for the starting inventory count.");
                return false;
            }
            else
            {
                return true;
            }
        }
    }

];

function addNewProd()
{
    //ask questions about new product
    inquirer.prompt(newStock).then(function(addNewInv)
    {
        var query = connection.query("INSERT INTO bamazon.products SET ?",
                {
                    product_name: addNewInv.newProdName,
                    department_name: addNewInv.addDept,
                    price: addNewInv.newProdPrice,
                    stock_quantity: addNewInv.newProdCount
                },
            function(err, res){
                if (err) throw err;
                console.log("The new product, " + addNewInv.newProdName + ", has successfuly been added to inventory\n");
                connection.end();
        });
    });

}

var addStock = 
[
    {
        message: "Please select the item to which you want to log-in new stock quantities: ",
        type: "list",
        name: "productChoice",
        choices: productList
    },
    {
        message: "Please enter the additional quantity of the item received: ",
        type: "input",
        name: "addtlInv",
        validate: function (q)
        { 
            if (isNaN(q) || q == "")
            {
                console.log("You have not entered a valid additional invevntory count.\n  Please enter only a whole, integer number.");
                return false;
            }
            else
            {
                return true;
            }
        }
    }

];

function addToInv()
{
    //ask questions about which product and how much to add to inventory
    inquirer.prompt(addStock).then(function(addToInvAnswers){

        //use local variable to add additional inventory to existing inventory count
        //when the productList and productCount arrays were populated, the element positions in productListshould coorespond directly
        //to the productCount values

        //  totalQty     existing count in position same as productChoice         +  new inv qty
        var updatedQty = parseInt(productCount[productList.indexOf(addToInvAnswers.productChoice)],10) + parseInt(addToInvAnswers.addtlInv,10);
        
        //define the sql statement to update the appropriate product to the new inventory count
        var query = connection.query("UPDATE bamazon.products SET ? WHERE ?",
            [
                {
                    stock_quantity: updatedQty
        
                },
                {
                    product_name: addToInvAnswers.productChoice
                }
                
            ],
            function(err, res){
                if (err) throw err;
                console.log("Inventory levels updated.\n"+addToInvAnswers.productChoice + "'s inventory has been increased to " + updatedQty + ".");
                connection.end();
        });
    });
}
