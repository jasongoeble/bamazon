var mysql = require("mysql");
var inquirer = require("inquirer");

var superOper = ["View Product Sales by Department", "Add New Department"];

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

//purchase questions
var supervisorMenu = 
[
    {
        message: "Please select the function you wish to perform: \n",
        type: "list",
        name: "supervisorFunctions",
        choices: ["View Product Sales by Department", "Add New Department"]
    }
];

//open connection and run supervisor
connection.connect(function(err){
    if (err) throw err;

    //runs the inquirer npm functionality for the supervisor's interface
    inquirer.prompt(supervisorMenu).then(function(menuAnswers)
    {
        var superChoice = menuAnswers.supervisorFunctions;

        //provide appropriate functionality based on supervisors's choice
        switch (superChoice)
        {
            case superOper[0]:
                viewDeptSale();
                break;
            case superOper[1]:
                addDept();
                break;            
            default:
                break;
        }
    });
});

function viewDeptSale()
{
    connection.query("SELECT departments.department_id AS 'DeptID', departments.department_name AS 'DeptName', departments.over_head_costs AS 'DeptCosts', SUM(products.product_sales) AS 'DeptSales', (SUM(products.product_sales) - departments.over_head_costs) AS 'DeptProfit' FROM products JOIN departments ON products.department_name = departments.department_name GROUP BY departments.department_id", function(err, res)
    {
        if (err) throw err;
        console.log("Dept ID | Dept Name       | Dept Costs | Dept Sales | Dept Profits");
        for (var j = 0; j < res.length; j++)
        {
            console.log(res[j].DeptID + "       |   " + res[j].DeptName + " | " + res[j].DeptCost + "  | " + res[j].DeptSales + "        |" + res[j].DeptProfit);
            console.log("--------------------------------------");
        }
    });

     //close the db connection
     connection.end();
}