var mysql = require("mysql");
var inquirer = require("inquirer");

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

    console.log("connected as id " + connection.threadId);
    
    //runs the inquirer npm functionality for the manager interface
    inquirer.prompt(supervisorMenu).then(function(menuAnswers)
    {
        var superChoice = menuAnswers.supervisorFunction;

        //provide appropriate functionality based on manager's choice
        switch (superChoice)
        {
            case superChoice[0]:
                viewDeptSale();
                break;
            case superChoice[1]:
                addDept();
                break;            
            default:
                break;
        }
    });
});

function viewDeptSale()
{
    connection.query("SELECT DISTINCT(A.department_id) AS Dept_ID, A.department_name AS Dept_Name, A.over_head_costs AS Dept_Costs, B.product_sales AS Dept_Sales (SUM(B.product_sales) - A.over_head_costs) AS Profits FROM departments AS A LEFT JOIN products AS B ON A.department_name = B.department_name GROUP BY A.department_id, B.product_sales", function(err, res)
    {
        if (err) throw err;
        /*for (var j = 0; j < res.length; j++)
        {
            console.log(res[j].Dept_ID + " | " + res[j].Dept_Name + " | " + res[j].Dept_Costs + " | " + res[j].Dept_Sales + " | " + res[j].Profits);
            console.log("--------------------------------------");
        }*/
        console.log(res);
    });

    console.log(qery.sql);
     //close the db connection
     connection.end();
}