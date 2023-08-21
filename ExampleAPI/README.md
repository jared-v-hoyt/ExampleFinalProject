# ExampleAPI

This README contains all of the necessary steps to create an API that connects to a local instance of a SQL Server database. It is assumed that your database has already been setup.

This guide is divided into two separate sections; the first for users who prefer to code in an environment built specifically for Windows OS, and the second for Mac/Linux users or for Windows users that do not prefer to use Windows-specific tools.

Use the following links to skip to the different sections:

  - [Steps to Recreate The Project: (WINDOWS)](#steps-to-recreate-the-project-windows)
  - [Steps To Recreate The Project: (MAC/WINDOWS/LINUX)](#steps-to-recreate-the-project-macwindowslinux)

## Steps to Recreate The Project: (WINDOWS)

1. Download the following tools (if you haven't already):

    - [Dotnet 7.0](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)
    - [Postman](https://www.postman.com/)
    - [Visual Studio 2022](https://visualstudio.microsoft.com/)

2. Open Visual Studio and do the following:
    - Select `Create a new project`
    - Select the `ASP.NET Core Web API` template and hit next
    - Give your API a name and hit next
    - Create the project with the following options:
        - Framework: .NET 7.0
        - Authentication: None
        - Configure for HTTPS: no
        - Enable Docker: no
        - Use controllers: yes
        - Enable OpenAPI support: no
        - Do not use top-level statements: yes

3. Delete `Controllers/WeatherForecastController.cs` and `WeatherForecast.cs`.

4. In `Properties/launchsettings.json`, modify the `http` and `IIS Express` launchUrl(s) so that each of them is just an empty string (e.g. `"launchUrl": ""`).

5. Navigate to `Project -> Manage NuGet Packages` and install the following packages:
    - Microsoft.Extensions.Configuration
    - Microsoft.Extensions.Configuration.Json
    - System.Data.SqlClient

6. Add a connection string to the project's configuration by navigating to `appsettings.json` and updating the file with the following code:
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

7. Right-click on your project and select `Add -> New Folder`. Name this folder `Models`. Right-click on this new folder and select `Add -> New Item` and name this file `Product.cs`. Update the file with the following code:
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

8. Right-click on the `Controllers` directory, select `Add -> New Scaffold Item -> API Controller with read/write actions`, name this controller `ProductController.cs` (when naming your controllers, make sure that the name of the file always includes the word *Controller* at the end), and update the file with the following code:
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
            public IEnumerable<Product> Get()
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

                    return products;
                }
                catch
                {
                    return products;
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

9. Navigate to `Program.cs` and update the file with the following code:
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

10. Run the API by clicking the green play button near the top-middle of the IDE.

11. Open Postman and send a `GET` request to `http://localhost:<port>/api/product` to ensure that everything is working correctly.

## Steps To Recreate The Project: (MAC/WINDOWS/LINUX)

1. Download the following tools (if you haven't already):

    - [Dotnet 7.0](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)
    - [Postman](https://www.postman.com/)
    - [Visual Studio Code](https://code.visualstudio.com/)
      - `Visual NuGet` extension from Full Stack Spider
  

2. Using the command line, navigate to where you want to store the project and execute the following command:

    ```bash
    dotnet new webapi --no-https --no-openapi --use-program-main --name ExampleAPI
    ```

    Open the newly-created directory in Visual Studio Code.

3. Delete `Controllers/WeatherForecastController.cs` and `WeatherForecast.cs`.

4. In `Properties/launchsettings.json`, modify the `http` and `IIS Express` launchUrl(s) so that each of them is just an empty string (e.g. `"launchUrl": ""`).

5. Right-click on the `.csproj` file and select `Visual NuGet: Manage Packages` and install the following packages:
    - Microsoft.Extensions.Configuration
    - Microsoft.Extensions.Configuration.Json
    - System.Data.SqlClient

6. Add a connection string to the project's configuration by navigating to `appsettings.json` and updating the file with the following code:
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
        "local_database": "Server=localhost,1433;Database=ExampleDatabase;User Id=sa;Password=yourStrong(!)Password;"
      }
    }
    ```

7. Create a new directory named `Models` and a new file named `Product.cs` in that directory. Update the file with the following code:
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

8. Right-click on the `Controllers` directory and create a new file named `ProductController.cs` (when naming your controllers, make sure that the name of the file always includes the word *Controller* at the end). Update the file with the following code:
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
            public IEnumerable<Product> Get()
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

                    return products;
                }
                catch
                {
                    return products;
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

9. Navigate to `Program.cs` and update the file with the following code:
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

10. Run the API by running the following command in the terminal:
    ```bash
      dotnet run
    ```

11. Open Postman and send a `GET` request to `http://localhost:<port>/api/product` to ensure that everything is working correctly.