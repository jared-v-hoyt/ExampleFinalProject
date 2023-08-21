# ExampleDatabase

**DISCLAIMER:** _This repository is to be used as a guide in setting up the final project for CSCE-361 at the University of Nebraska-Lincoln._

This guide is divided into two separate sections; the first for users who prefer to code in an environment built specifically for Windows OS, and the second for Mac/Linux users or for Windows users that do not prefer to use Windows-specific tools.

Use the following links to skip to the different sections:

  - [Steps to Recreate The Project: (WINDOWS)](#steps-to-recreate-the-project-windows)
  - [Steps To Recreate The Project: (MAC/WINDOWS/LINUX)](#steps-to-recreate-the-project-macwindowslinux)

## Steps to Recreate The Project: (WINDOWS)

1. Download the following tools (if you haven't already):

   - [SQL Server 2022 (Express)](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
   - [SQL Server Management Studio](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver16)

2. Open SQL Server Management Studio and connect to a local instance of your SQL Server engine.

   - Server type: `Database Engine`
   - Server name: `localhost\SQLEXPRESS`
     - **note:** this is a _backslash_
   - Authentication: `Windows Authentication`

   ![SQL Server Connection](https://media.discordapp.net/attachments/929399365318115369/1141723245230444584/SQL_Server_Connection.png)

3. After connecting, right-click on your database engine (localhost\SQLEXPRESS), select `New Query`, and execute the following code:

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

    EXECUTE GetProducts;
    EXECUTE GetOrderItems 6;
    ```

   You should see the result of the two `EXECUTE` statements appear in the bottom pane.

## Steps To Recreate The Project: (MAC/WINDOWS/LINUX)

1. Download the following tools (if you haven't already):

  - [Azure Data Studio](https://learn.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio?view=sql-server-ver16&tabs=redhat-install%2Credhat-uninstall)
  - [Docker](https://www.docker.com/)

2. Open up a new Terminal/Powershell instance and run the following command:
    ```bash
    docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=yourStrong(!)Password" -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
    ```

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

    EXECUTE GetProducts;
    EXECUTE GetOrderItems 6;
    ```
    You should see the result of the two `EXECUTE` statements appear in the bottom pane.