# BAmazon
BAmazon Homework

BAmazon is Amazon-like storefront with the MySQL, and Node.js. The app will take in orders from customers and deplete stock from the store's inventory. It also has manager, and supervisor menu. The manager menu lets user view all products, show low inventory products, update inventory, and add new products. While the supervisor menu lets user track product sales across the store's departments, create new department, and create new users.

Link to Video and Screenshots: <https://cfcrotty.github.io/BAmazon/screenshot.html>

### Sample Terminal Images:
![Sample Terminal Image 1](https://cfcrotty.github.io/BAmazon/assets/images/main.png)
![Sample Terminal Image 2](https://cfcrotty.github.io/BAmazon/assets/images/customer.png)

### Default Credentials:
Manager Credentials: manager(username) | password(password)
Supervisor Credentials: supervisor(username) | password(password)

### How to Use:
1. I am using Node.js packages(mysql, colors, and inquirer) so the user needs to install dependencies using `npm i` in the terminal. Create database and tables with mock data using the BAmazon.sql

2. User can run the JavaScript using `node index.js`.

3. Then, user has to select one from these menu:

    - Customer
        * Diplays all products in a table and allows customers to buy a product by product ID. The table shows product ID, product name, and price. To buy a product, first enter the product ID, then the number of items to buy. It will show if the process is successful then, ask if customer want to shop for more.

        ![Customer Sample](https://cfcrotty.github.io/BAmazon/assets/images/customer.png)

    - Manager
        * Allows user to display all products, view low inventory products, update inventory, and add more products in the database. First, user has to login using default user(username: manager, password: password). Then, select from manager menu:
            - View Products for Sale - shows all products in a table which has the product ID, name, department name, price, and stock quantity.
            - View Low Inventory - shows a table of products that has stock quantity less than 5.
            - Add to Inventory - allows user to add more to the items quantity currently in store. User has to enter the product ID then, the additional quantity to add to the current count.
            - Add New Product - lets user add new products in the databse/store. User has to enter the product ID, the price, the stock quantity, and department to which the item belongs. It will show if the process is successful then, show a menu(Manager Menu, Main Menu, or Exit).

        ![Manager Sample](https://cfcrotty.github.io/BAmazon/assets/images/manager3.png)
            
    - Supervisor
        * Allows user to display sales report by department, add new department and create new user. First user has to login using default user(username: supervisor, password: password). Then, select from supervisor menu:
            - View Product Sales by Department - display sales report of each department in a table with department ID, department name, over head cost, and total profit of each departments.
            - Create New Department - lets user create new department by entering the department name, and over head cost.
            - Create New User - enables user to create new user by entering the user full name, username, password, and user type(manager or supervisor).

        ![Supervisor Sample](https://cfcrotty.github.io/BAmazon/assets/images/supervisor2.png)
            
- - -

The project is useful because it provides an example of languages/technologies I learned and show what I can do as a developer. I am using MySQL, Node.js, Bootstrap, HTML, and CSS.

For questions or concerns, please go to my website at carafelise.com or send an email at admin@carafelise.com. I maintain and developed this project.