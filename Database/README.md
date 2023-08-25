# Database

The idea behind the setup of this database is to make it as easy as possible for every student in the group to have access to the data without needing anyone to pay for hosting capabilities. To achieve this, **every student in the group needs to have their own local, identical copy of the database**.

This means that each student in the group will need to have their own installation of SQL Server and will need to manually insert the data into their own database. It also means that the students will not be able to access data from any other student's database. However, if each student has an identical copy of the database and of the data within the database, it will *appear* as though you all are working from the same database.

## Table of Contents

- [Steps To Recreate The Project (Windows)](#steps-to-recreate-the-project-windows)
- [Steps To Recreate The Project (Mac/Windows/Linux)](#steps-to-recreate-the-project-macwindowslinux)

## Steps To Recreate The Project (Windows)

1. Download the following tools (if you haven't already):

    - [SQL Server 2022 (Express)](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
    - [SQL Server Management Studio](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16)

2. Open SQL Server Management Studio and connect to a local instance of the SQL Server engine using the following options:

    ![SQL Server Connection](https://media.discordapp.net/attachments/929399365318115369/1141723245230444584/SQL_Server_Connection.png)

3. After connecting, right-click on your database engine (`localhost\SQLEXPRESS`), select `New Query`, and execute the following code:

    ```sql
    CREATE DATABASE ExampleDatabase;
    GO
    ```

4. Refresh the explorer and you should now see your newly-created database by expanding the `Databases` folder.

    ![Newly-created database](https://media.discordapp.net/attachments/929399365318115369/1141727127478210570/New_Database.png)

    Right click on `ExampleDatabase`, select `New Query`, and execute the following code:

    ```sql
    USE ExampleDatabase;

    DROP TABLE IF EXISTS OrderItems;
    DROP TABLE IF EXISTS Orders;
    DROP TABLE IF EXISTS Products;

    DROP PROCEDURE IF EXISTS GetProducts;
    DROP PROCEDURE IF EXISTS GetOrderItems;

    CREATE TABLE Products
    (
      ProductId INT PRIMARY KEY IDENTITY(1, 1) NOT NULL,
      ProductName VARCHAR(MAX) NOT NULL,
      UnitPrice MONEY NOT NULL
    );

    CREATE TABLE Orders
    (
      OrderId INT PRIMARY KEY IDENTITY(1, 1) NOT NULL,
      OrderDate DATE NOT NULL
    );

    CREATE TABLE OrderItems
    (
      OrderItemId INT PRIMARY KEY IDENTITY(1, 1) NOT NULL,
      OrderId INT FOREIGN KEY REFERENCES Orders (OrderId) NOT NULL,
      ProductId INT FOREIGN KEY REFERENCES Products (ProductId) NOT NULL,
      Quantity INT NOT NULL
    );

    INSERT INTO Products (ProductName, UnitPrice)
    VALUES ('Toothpaste (Colgate, 6oz)', 2.50),
           ('T-shirt (Hanes, basic crewneck)', 10.00),
           ('Milk (1 gallon)', 4.00),
           ('Cereal (Kellogg''s, 14oz)', 4.00),
           ('Paper Towels (Bounty, 6 rolls)', 8.00),
           ('Shampoo (Pantene, 12 oz)', 5.00),
           ('Toilet Paper (Charmin, 12 rolls)', 8.00),
           ('Laptop (HP, 15.6" display)', 800.00),
           ('Bed Sheets (Queen size)', 40.00),
           ('Cookware Set (non-stick, 10-piece) ', 50.00);

    INSERT INTO Orders (OrderDate)
    VALUES ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17');

    INSERT INTO OrderItems (OrderId, ProductId, Quantity)
    VALUES (1, 1, 1),
           (1, 2, 4),
           (2, 3, 1),
           (2, 4, 2),
           (3, 1, 1),
           (3, 6, 1),
           (4, 8, 1),
           (5, 10, 1),
           (6, 5, 2),
           (6, 7, 2);
    GO

    CREATE PROCEDURE GetProducts
      AS
      BEGIN
        SELECT * FROM Products
      END
    GO

    CREATE PROCEDURE GetOrderItems @OrderId INT
      AS
      BEGIN
        SELECT Products.ProductName, Products.UnitPrice, OrderItems.Quantity FROM OrderItems
        INNER JOIN Products ON (OrderItems.ProductId = Products.ProductId)
        WHERE OrderItems.OrderId = @OrderId;
      END
    GO
    ```

    Let's go through what is happening in this code. First,

    ```sql
    DROP TABLE IF EXISTS OrderItems;
    DROP TABLE IF EXISTS Orders;
    DROP TABLE IF EXISTS Products;

    ...

    CREATE TABLE Products
    (
      ProductId INT PRIMARY KEY IDENTITY(1, 1) NOT NULL,
      ProductName VARCHAR(MAX) NOT NULL,
      UnitPrice MONEY NOT NULL
    );

    CREATE TABLE Orders
    (
      OrderId INT PRIMARY KEY IDENTITY(1, 1) NOT NULL,
      OrderDate DATE NOT NULL
    );

    CREATE TABLE OrderItems
    (
      OrderItemId INT PRIMARY KEY IDENTITY(1, 1) NOT NULL,
      OrderId INT FOREIGN KEY REFERENCES Orders (OrderId) NOT NULL,
      ProductId INT FOREIGN KEY REFERENCES Products (ProductId) NOT NULL,
      Quantity INT NOT NULL
    );
    ```

    creates three tables, `Products`, `Orders`, and `OrderItems`. The `DROP TABLE IF EXISTS` commands allow you to update your table schema if you decide to make changes to its composition later on. It's important to note that the three `DROP TABLE IF EXISTS` lines appear in *opposite* order that the tables are created in. This is important if your tables reference each other (which `OrderItems` does).

    Next,

    ```sql
    INSERT INTO Products (ProductName, UnitPrice)
    VALUES ('Toothpaste (Colgate, 6oz)', 2.50),
    ...

    GO
    ```

    inserts data into the tables that were just created. It's important to note the `GO` command at the very end. This specifies that all commands that precede it are executed in batch. This is important for the code that follows.

    ```sql
    CREATE PROCEDURE GetProducts
      AS
      BEGIN
        SELECT * FROM Products
      END
    GO

    CREATE PROCEDURE GetOrderItems @OrderId INT
    ...
    GO
    ```

    This code creates two stored procedures called `GetProducts` and `GetOrderItems`, respectively. Stored procedures allow for safer code execution when called from an API. You'll notice that each stored procedure ends in the `GO` keyword. This is because stored procedures have to be the *only* query run in its batch. These `GO` statments allow us to create multiple stored procedures in the same query file.

    Notice, too, that stored procedures can also take parameters as input. `GetOrderItems` takes in an `INT` named `@OrderId` as input and uses that parameter in its query. If you want to see the result of these stored procedures in SQL Server Management Studio, you can run the following commands individually by highlighting them and clicking the green execute play button:

    ```sql
    EXECUTE GetProducts;
    EXECUTE GetOrderItems 6;
    ```

    You should see the result of the two `EXECUTE` statements appear in the bottom pane.

## Steps To Recreate The Project (Mac/Windows/Linux)

1. Download the following tools (if you haven't already):

- [Azure Data Studio](https://learn.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio?view=sql-server-ver16&tabs=redhat-install%2Credhat-uninstall)
- [Docker](https://www.docker.com/)

2. Since SQL Server is not native to Mac or Linux, we need to use Microsoft's official [Docker image](https://hub.docker.com/_/microsoft-mssql-server) to simulate an environment that can run SQL Server. Make sure that Docker is running and then open up a new Terminal/Powershell instance and run the following command:

    ```bash
    docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=P@ssw0rd" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
    ```

    If you want to change the password, then, from the official documentation, the password needs to be "*at least 8 characters including uppercase, lowercase letters, base-10 digits and/or non-alphanumeric symbols.*"

    **Note:** any time you are trying to access the database, you need to ensure that the SQL Server container is running. You can do this by going to the *containers* tab in Docker Desktop and hitting the play button next to the appropriate container.

3. Open Azure Data Studio and connect to the SQL Server instance using the following parameters:

    ![SQL Server Connection](https://media.discordapp.net/attachments/929399365318115369/1143153990431936592/Azure_Data_Studio_Connection.png)

    where your password is the password that you set up in step 2. If prompted, click *Enable Trust Server Certificate*.

4. Navigate to `File -> New Query` and run the following query:

    ```sql
    CREATE DATABASE ExampleDatabase;
    GO
    ```

5. From the solution explorer on the left, right-click on the new database (you might need to refresh the explorer), select `New Query`, and run the following query:

    ```sql
    USE ExampleDatabase;

    DROP TABLE IF EXISTS OrderItems;
    DROP TABLE IF EXISTS Orders;
    DROP TABLE IF EXISTS Products;

    DROP PROCEDURE IF EXISTS GetProducts;
    DROP PROCEDURE IF EXISTS GetOrderItems;

    CREATE TABLE Products
    (
      ProductId INT PRIMARY KEY IDENTITY(1, 1) NOT NULL,
      ProductName VARCHAR(MAX) NOT NULL,
      UnitPrice MONEY NOT NULL
    );

    CREATE TABLE Orders
    (
      OrderId INT PRIMARY KEY IDENTITY(1, 1) NOT NULL,
      OrderDate DATE NOT NULL
    );

    CREATE TABLE OrderItems
    (
      OrderItemId INT PRIMARY KEY IDENTITY(1, 1) NOT NULL,
      OrderId INT FOREIGN KEY REFERENCES Orders (OrderId) NOT NULL,
      ProductId INT FOREIGN KEY REFERENCES Products (ProductId) NOT NULL,
      Quantity INT NOT NULL
    );

    INSERT INTO Products (ProductName, UnitPrice)
    VALUES ('Toothpaste (Colgate, 6oz)', 2.50),
           ('T-shirt (Hanes, basic crewneck)', 10.00),
           ('Milk (1 gallon)', 4.00),
           ('Cereal (Kellogg''s, 14oz)', 4.00),
           ('Paper Towels (Bounty, 6 rolls)', 8.00),
           ('Shampoo (Pantene, 12 oz)', 5.00),
           ('Toilet Paper (Charmin, 12 rolls)', 8.00),
           ('Laptop (HP, 15.6" display)', 800.00),
           ('Bed Sheets (Queen size)', 40.00),
           ('Cookware Set (non-stick, 10-piece) ', 50.00);

    INSERT INTO Orders (OrderDate)
    VALUES ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17'),
           ('2023-08-17');

    INSERT INTO OrderItems (OrderId, ProductId, Quantity)
    VALUES (1, 1, 1),
           (1, 2, 4),
           (2, 3, 1),
           (2, 4, 2),
           (3, 1, 1),
           (3, 6, 1),
           (4, 8, 1),
           (5, 10, 1),
           (6, 5, 2),
           (6, 7, 2);
    GO

    CREATE PROCEDURE GetProducts
      AS
      BEGIN
        SELECT * FROM Products
      END
    GO

    CREATE PROCEDURE GetOrderItems @OrderId INT
      AS
      BEGIN
        SELECT Products.ProductName, Products.UnitPrice, OrderItems.Quantity FROM OrderItems
        INNER JOIN Products ON (OrderItems.ProductId = Products.ProductId)
        WHERE OrderItems.OrderId = @OrderId;
      END
    GO
    ```

    Let's go through what is happening in this code. First,

    ```sql
    DROP TABLE IF EXISTS OrderItems;
    DROP TABLE IF EXISTS Orders;
    DROP TABLE IF EXISTS Products;

    ...

    CREATE TABLE Products
    (
      ProductId INT PRIMARY KEY IDENTITY(1, 1) NOT NULL,
      ProductName VARCHAR(MAX) NOT NULL,
      UnitPrice MONEY NOT NULL
    );

    CREATE TABLE Orders
    (
      OrderId INT PRIMARY KEY IDENTITY(1, 1) NOT NULL,
      OrderDate DATE NOT NULL
    );

    CREATE TABLE OrderItems
    (
      OrderItemId INT PRIMARY KEY IDENTITY(1, 1) NOT NULL,
      OrderId INT FOREIGN KEY REFERENCES Orders (OrderId) NOT NULL,
      ProductId INT FOREIGN KEY REFERENCES Products (ProductId) NOT NULL,
      Quantity INT NOT NULL
    );
    ```

    creates three tables, `Products`, `Orders`, and `OrderItems`. The `DROP TABLE IF EXISTS` commands allow you to update your table schema if you decide to make changes to its composition later on. It's important to note that the three `DROP TABLE IF EXISTS` lines appear in *opposite* order that the tables are created in. This is important if your tables reference each other (which `OrderItems` does).

    Next,

    ```sql
    INSERT INTO Products (ProductName, UnitPrice)
    VALUES ('Toothpaste (Colgate, 6oz)', 2.50),
    ...

    GO
    ```

    inserts data into the tables that were just created. It's important to note the `GO` command at the very end. This specifies that all commands that precede it are executed in batch. This is important for the code that follows.

    ```sql
    CREATE PROCEDURE GetProducts
      AS
      BEGIN
        SELECT * FROM Products
      END
    GO

    CREATE PROCEDURE GetOrderItems @OrderId INT
    ...
    GO
    ```

    This code creates two stored procedures called `GetProducts` and `GetOrderItems`, respectively. Stored procedures allow for safer code execution when called from an API. You'll notice that each stored procedure ends in the `GO` keyword. This is because stored procedures have to be the *only* query run in its batch. These `GO` statments allow us to create multiple stored procedures in the same query file.

    Notice, too, that stored procedures can also take parameters as input. `GetOrderItems` takes in an `INT` named `@OrderId` as input and uses that parameter in its query. If you want to see the result of these stored procedures in SQL Server Management Studio, you can run the following commands individually by highlighting them and clicking the green execute play button:

    ```sql
    EXECUTE GetProducts;
    EXECUTE GetOrderItems 6;
    ```

    You should see the result of the two `EXECUTE` statements appear in the bottom pane.
