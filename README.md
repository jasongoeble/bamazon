#bamazon

mysql and node homework

The goal in this project is to provide a simple node to SQL db interaction, demonstrating the following:
    -simple customer purchasing
    -simple management db updating
    -simple reporting

The database is named: bamazon

The two tables behind the scenes are: 
    -products
        item_id, product_name, department_name, price, stock_quantity, product_sales
    -departments
        -department_id, department_name, over_head_costs

Issues:
    -when creating the manager functionality I wanted to make it so that both adding new stock and viewing inventory would
    include any new products that get added.  unfortunately, I was unable to figure out how to use a variable or a function
    to populate the inquirer "choices" feature.  based on the documentation it should be able to handle an array, but it does not work with just a variable name that is an array.
    -after each function, for both managers and customers, executes the program ends.  i ran out of time on this assignment to figure out a nice way to prompt the user whether they wanted to return to the main menue.
    -as i spent a lot more time than i had planned learning inquirer i did not have enough time to include a tabular npm package to make table presentation more visually appealing