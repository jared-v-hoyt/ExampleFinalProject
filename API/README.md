# API

This README contains all of the necessary steps to create an API that connects to a local instance of a SQL Server database. It is assumed that your database has already been setup.

## Table of Contents

- [Steps To Recreate The Project: (Windows)](#steps-to-recreate-the-project-windows)
- [Steps To Recreate The Project: (Mac/Windows/Linux)](#steps-to-recreate-the-project-macwindowslinux)

## Steps To Recreate The Project: (Windows)

01. Download the following tools (if you haven't already):

- [Dotnet 7.0](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)
- [Postman](https://www.postman.com/)
- [Visual Studio 2022](https://visualstudio.microsoft.com/)

02. Open Visual Studio and do the following:

- Select `Create a new project`
- Select the `ASP.NET Core Web API` template and hit next
- Give your API a name and hit next
- Create the project with the following options:
  - **Framework:** *.NET 7.0*
  - **Authentication:** *None*
  - **Configure for HTTPS:** *no*
  - **Enable Docker:** *no*
  - **Use controllers:** *yes*
  - **Enable OpenAPI support:** *no*
  - **Do not use top-level statements:** *yes*

03. Delete the following files:

- `Controllers/WeatherForecastController.cs`
- `WeatherForecast.cs`.

04. In `Properties/launchsettings.json`, make the following changes for both `http` and `IIS Express`:

- `"launchBrowswer": false`
- `"launchUrl": ""`

05. Click `Project` from the menu bar and select `Manage NuGet Packages`. Install the following packages:

- Microsoft.Extensions.Configuration
- Microsoft.Extensions.Configuration.Json
- System.Data.SqlClient

    The first two packages you just installed allow you to access project configuration options (you will be using this to access a connection string) and the third package you installed allows you interact with a SQL Server database.

06. Add a connection string to the project's configuration by navigating to `appsettings.json` and updating the file with the following code:

    ```json
    {
        "Logging": {
            "LogLevel": {
                "Default": "Information",
                "Microsoft.AspNetCore": "Warning"
            }
        },
        "AllowedHosts": "*",
        "ConnectionStrings": {
            "local_database": "Server=localhost\\SQLEXPRESS;Database=ExampleDatabase;Trusted_Connection=True;"
        }
    }
    ```

    If you named your database something else, ensure that you update the connection string with the name of *your* database.

07. Right-click on the project and select `Add -> New Folder`. Name this folder `Models`. Right-click on this new folder and select `Add -> New Item`. Name this file `Product.cs`. Update the file with the following code:

    ```c#
    namespace ExampleAPI.Models
    {
        public class Product
        {
            public int ProductId { get; set; }
            public string ProductName { get; set; }
            public decimal UnitPrice { get; set; }

            public Product(int ProductId, string ProductName, decimal UnitPrice)
            {
                this.ProductId = ProductId;
                this.ProductName = ProductName;
                this.UnitPrice = UnitPrice;
            }
        }
    }
    ```

    This file "models" how the Product table is set up in the SQL Server database you created.

08. Right-click on the `Controllers` directory, select `Add -> New Scaffold Item -> API Controller with read/write actions`. Name this controller `ProductController.cs` (when naming controllers, the convention is to ensure that the name of the file always ends in the word *Controller*), and update the file with the following code:

    ```c#
    using Microsoft.AspNetCore.Mvc;
    using System.Data;
    using System.Data.SqlClient;
    using ExampleAPI.Models;

    namespace ExampleAPI.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]
        public class ProductController : ControllerBase
        {
            private readonly IConfiguration configuration;

            public ProductController(IConfiguration configuration)
            {
                this.configuration = configuration;
            }

            [HttpGet]
            public ObjectResult Get()
            {
                List<Product> products = new();

                try
                {
                    using (SqlConnection connection = new(configuration.GetConnectionString("local_database")))
                    {
                        SqlCommand command = new ("GetProducts", connection)
                        {
                            CommandType = CommandType.StoredProcedure
                        };

                        connection.Open();

                        using SqlDataReader reader = command.ExecuteReader();
                        
                        while (reader.Read())
                        {
                            Product product = new(reader.GetInt32(0), reader.GetString(1), reader.GetDecimal(2));
                            products.Add(product);
                        }
                    }

                    return Ok(products);
                }
                catch (Exception exception)
                {
                    return BadRequest(exception);
                }
            }

            [HttpGet("{id}")]
            public string Get(int id)
            {
                return "value";
            }

            [HttpPost]
            public void Post([FromBody] string value)
            {
            }

            [HttpPut("{id}")]
            public void Put(int id, [FromBody] string value)
            {
            }

            [HttpDelete("{id}")]
            public void Delete(int id)
            {
            }
        }
    }
    ```

    Let's go through what is happening in this controller.  First,

    ```c#
    [Route("api/[controller]")]
    [ApiController]
    ```

    are what are known as *attributes* in C# and associate metadeta with the code that follows. In this case, we are declaring that the code in the `ProductController` class is associated with a specific URL route (in this case, `<base_url>/api/product`) and that the class is a controller for the API we are building.

    Next,

    ```c#
    private readonly IConfiguration configuration;

    public ProductController(IConfiguration configuration)
    {
        this.configuration = configuration;
    }
    ```

    uses dependency injection to initialize a variable named `configuration` whenever an instance of `ProductController` is created. The `configuration` variable gives us access to the project's configuration files which are needed to be able to reference the project's connection string (which is stored in `appsettings.json`).

    Next,

    ```c#
    [HttpGet]
    ```

    is an attribute belonging to the [Microsoft.AspNetCore.Mvc](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc?view=aspnetcore-7.0) namespace. This attribute identifies an action that supports the **HTTP GET** method when sending a **GET** request (without parameters) to `<base_url>/api/product`.

    Finally,

    ```c#
    public ObjectResult Get()
    {
        ...
        return Ok(products);
        ...
    }
    ```

    specifies a function that opens up a connection to the SQL Server database, executes the `GetProducts` stored procedure, and returns the result. The `Ok` in this instance declares that the request was successful and will send back a `200` response code along with the data that is being returned from the stored procedure.

09. Navigate to `Program.cs` and update the file with the following code:

    ```c#
    namespace ExampleAPI
    {
        public class Program
        {
            public static void Main(string[] args)
            {
                var builder = WebApplication.CreateBuilder(args);

                builder.Services.AddControllers();
                builder.Services.AddCors(options =>
                {
                    options.AddPolicy(name: "_MyAllowSubdomainPolicy",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod();
                    });
                });

                var app = builder.Build();

                // Use CORS middleware
                app.UseCors("_MyAllowSubdomainPolicy");

                app.UseAuthorization();
                app.MapControllers();
                app.Run();
            }
        }
    }
    ```

    The notable lines of code here are

    ```c#
    builder.Services.AddCors(options =>
    {
        ...
            policy.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
        ...
    }
    ```

    and

    ```c#
    app.UseCors("_MyAllowSubdomainPolicy");
    ```

    These lines of code tell the [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) (CORS) mechanism to allow requests from the URL `http://localhost:3000`. Essentially, this grants our frontend application (Next.js application which runs on port 3000) access to the API.

    In practice, this is not the most secure way of handling requests, but for all intents and purposes, it will work fine.

10. Start the API by clicking the green play button near the top-middle of the IDE.

11. Open Postman and send a `GET` request to `http://localhost:<port>/api/product` to ensure that everything is working correctly. The specific port can be found in `Properties/launchSettings.json` in the `http` profile as the value of the `applicationURL` key.

## Steps To Recreate The Project: (Mac/Windows/Linux)

01. Download the following tools (if you haven't already):

- [Dotnet 7.0](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)
- [Postman](https://www.postman.com/)
- [Visual Studio Code](https://code.visualstudio.com/)
  - **Visual NuGet** extension from Full Stack Spider

02. Using the command line, navigate to where you want to store the project and execute the following command:

    ```bash
    dotnet new webapi --no-https --no-openapi --use-program-main --name ExampleAPI
    ```

    Open the newly-created directory in Visual Studio Code.

03. Delete the following files:

- `Controllers/WeatherForecastController.cs`
- `WeatherForecast.cs`.

04. In `Properties/launchsettings.json`, make the following changes for both `http` and `IIS Express`:

- `"launchBrowswer": false`
- `"launchUrl": ""`

05. Right-click on the `.csproj` file and select `Visual NuGet: Manage Packages` and install the following packages:

- Microsoft.Extensions.Configuration
- Microsoft.Extensions.Configuration.Json
- System.Data.SqlClient

  The first two packages you just installed allow you to access project configuration options (you will be using this to access a connection string) and the third package you installed allows you interact with a SQL Server database.

06. Add a connection string to the project's configuration by navigating to `appsettings.json` and updating the file with the following code:

    ```json
    {
        "Logging": {
            "LogLevel": {
                "Default": "Information",
                "Microsoft.AspNetCore": "Warning"
            }
        },
        "AllowedHosts": "*",
        "ConnectionStrings": {
            "local_database": "Server=localhost,1433;Database=ExampleDatabase;User Id=sa;Password=P@ssw0rd;"
        }
    }
    ```

07. Create a new directory named `Models` and a new file named `Product.cs` in that directory. Update the file with the following code:

    ```c#
    namespace ExampleAPI.Models
    {
        public class Product
        {
            public int ProductId { get; set; }
            public string ProductName { get; set; }
            public decimal UnitPrice { get; set; }

            public Product(int ProductId, string ProductName, decimal UnitPrice)
            {
                this.ProductId = ProductId;
                this.ProductName = ProductName;
                this.UnitPrice = UnitPrice;
            }
        }
    }
    ```

08. Right-click on the `Controllers` directory and create a new file named `ProductController.cs` (when naming your controllers, make sure that the name of the file always includes the word *Controller* at the end). Update the file with the following code:

    ```c#
    using Microsoft.AspNetCore.Mvc;
    using System.Data;
    using System.Data.SqlClient;
    using ExampleAPI.Models;

    namespace ExampleAPI.Controllers
    {
        [Route("api/[controller]")]
        [ApiController]
        public class ProductController : ControllerBase
        {
            private readonly IConfiguration configuration;

            public ProductController(IConfiguration configuration)
            {
                this.configuration = configuration;
            }

            [HttpGet]
            public ObjectResult Get()
            {
                List<Product> products = new();

                try
                {
                    using (SqlConnection connection = new(configuration.GetConnectionString("local_database")))
                    {
                        SqlCommand command = new ("GetProducts", connection)
                        {
                            CommandType = CommandType.StoredProcedure
                        };

                        connection.Open();

                        using SqlDataReader reader = command.ExecuteReader();
                        
                        while (reader.Read())
                        {
                            Product product = new(reader.GetInt32(0), reader.GetString(1), reader.GetDecimal(2));
                            products.Add(product);
                        }
                    }

                    return Ok(products);
                }
                catch (Exception exception)
                {
                    return BadRequest(exception);
                }
            }

            [HttpGet("{id}")]
            public string Get(int id)
            {
                return "value";
            }

            [HttpPost]
            public void Post([FromBody] string value)
            {
            }

            [HttpPut("{id}")]
            public void Put(int id, [FromBody] string value)
            {
            }

            [HttpDelete("{id}")]
            public void Delete(int id)
            {
            }
        }
    }
    ```

    Let's go through what is happening in this controller.  First,

    ```c#
    [Route("api/[controller]")]
    [ApiController]
    ```

    are what are known as *attributes* in C# and associate metadeta with the code that follows. In this case, we are declaring that the code in the `ProductController` class is associated with a specific URL route (in this case, `<base_url>/api/product`) and that the class is a controller for the API we are building.

    Next,

    ```c#
    private readonly IConfiguration configuration;

    public ProductController(IConfiguration configuration)
    {
        this.configuration = configuration;
    }
    ```

    uses dependency injection to initialize a variable named `configuration` whenever an instance of `ProductController` is created. The `configuration` variable gives us access to the project's configuration files which are needed to be able to reference the project's connection string (which is stored in `appsettings.json`).

    Next,

    ```c#
    [HttpGet]
    ```

    is an attribute belonging to the [Microsoft.AspNetCore.Mvc](https://learn.microsoft.com/en-us/dotnet/api/microsoft.aspnetcore.mvc?view=aspnetcore-7.0) namespace. This attribute identifies an action that supports the **HTTP GET** method when sending a **GET** request (without parameters) to `<base_url>/api/product`.

    Finally,

    ```c#
    public ObjectResult Get()
    {
        ...
        return Ok(products);
        ...
    }
    ```

    specifies a function that opens up a connection to the SQL Server database, executes the `GetProducts` stored procedure, and returns the result. The `Ok` in this instance declares that the request was successful and will send back a `200` response code along with the data that is being returned from the stored procedure.

09. Navigate to `Program.cs` and update the file with the following code:

    ```c#
    namespace ExampleAPI
    {
      public class Program
        {
            public static void Main(string[] args)
            {
                var builder = WebApplication.CreateBuilder(args);

                // Add services to the container.
                builder.Services.AddControllers();
                builder.Services.AddCors(options =>
                {
                    options.AddPolicy(name: "_MyAllowSubdomainPolicy",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:3000")
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
                });

                var app = builder.Build();

                // Use CORS middleware
                app.UseCors("_MyAllowSubdomainPolicy");

                app.UseAuthorization();
                app.MapControllers();
                app.Run();
            }
        }
    }
    ```

    The notable lines of code here are

    ```c#
    builder.Services.AddCors(options =>
    {
        ...
            policy.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
        ...
    }
    ```

    and

    ```c#
    app.UseCors("_MyAllowSubdomainPolicy");
    ```

    These lines of code tell the [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) (CORS) mechanism to allow requests from the URL `http://localhost:3000`. Essentially, this grants our frontend application (Next.js application which runs on port 3000) access to the API.

    In practice, this is not the most secure way of handling requests, but for all intents and purposes, it will work fine.

10. Start the API by running the following command in the terminal:

    ```bash
    dotnet run
    ```

11. Open Postman and send a `GET` request to `http://localhost:<port>/api/product` to ensure that everything is working correctly. The specific port can be found in `Properties/launchSettings.json` in the `http` profile as the value of the `applicationURL` key.
