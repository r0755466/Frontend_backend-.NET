
# My First App: Angular Frontend + .NET Backend

## Project Overview

**MY FIRST APP, Documentation:**

### GOAL:

- **Frontend:** Angular 18
- **Backend:** .NET Core Web API
- **Database:** SQL Server (Microsoft)

The frontend is powered by Angular 18 and Node.js, which is used to translate native JavaScript for better browser compatibility. The backend is built with .NET Core Web API, handling most of the REST API and backend logic.

### Technologies Used

- **Frontend:** Angular 18
- **Backend:** .NET Core Web API
- **Database:** Microsoft SQL Server
- **Other Tools:** Node.js, Newtonsoft.Json (for data serialization)

---

## Project Setup and Steps

### Angular CLI Setup

We start by installing Angular CLI globally using Node.js:

```bash
npm install -g @angular/cli@latest

```

Verify the installation with:

```bash
ng --version
```

### Enable Script Execution (Windows PowerShell)

```bash
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Creating and Serving the Angular App

```bash
ng new my-first-app

```
Start the app:

```bash
ng serve
```

## Visual Studio Setup for .NET Core Web API

1. **Create a new Web API project in Visual Studio.**
2. Install the required NuGet packages, including `Newtonsoft.Json` for data serialization.

### Enabling CORS

In production, make sure to only allow trusted origins by enabling CORS:

```csharp
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//JSON Seriallizer
// Did not work to explecit add the NewtonSoft Allow AddNewtonsoftJson(); 

builder.Services.AddControllersWithViews().AddNewtonsoftJson();

var app = builder.Build();


//Enable CORS 
app.UseCors(x => x.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();


```
We need to specify to what database we want to connect in the appsettings.json


```json
{
  "ConnectionStrings": {
    "mydb": "Server=(localdb)\\Local;Database=mydb;Integrated Security=True;"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}

```

Than we create an specific controller, this is our rest API code: 
| **Method**             | **Endpoint**    | **HTTP Verb** | **Functionality**                                    |
|------------------------|----------------|---------------|-----------------------------------------------------|
| `GetTasks()`           | `/get_tasks`   | `GET`         | Retrives all tasks from the `todo` database table and returns them as JSON. |
| `AddTasks(string task)` | `/add_tasks`   | `POST`        | Adds a new task to the `todo` database table with the provided task value.  |
| `DeleteTasks(string id)` | `/delete_tasks` | `DELETE`      | Deletes a task from the `todo` database table based on the provided task ID.  |

### Key Code Compnents

- **ControllerBase Inheriance**: The `TodoController` inherites from `ControllerBase`, making it an API controller.
- **Depndency Injection**: The controller uses dependency injection to access the `IConfiguration` object.
- **SQL Database Interation**: The code connects to a SQL Server database using ADO.NET with `SqlConnection`, `SqlCommand`, and `SqlDataReader`.
- **HTTP Endpoints**:
  - The `GET` request retrives tasks from the database.
  - The `POST` request adds a new task to the database.
  - The `DELETE` request removes a task based on its ID.
- **Error Handeling**: The `POST` and `DELETE` endpoints return success or failure messages based on the operation result.

```csharp

using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;

namespace WebApplication1.Controllers
{
  [ApiController]

  public class TodoController : ControllerBase
  {
    private readonly IConfiguration _configuration;

    // Constructor to initialize the configuration
    public TodoController(IConfiguration configuration)
    {
      _configuration = configuration;
    }

    /// <summary>
    /// Retrieves tasks from the database and returns them as JSON.
    /// </summary>
    /// <returns>A JsonResult containing the tasks in JSON format.</returns>
    [HttpGet("get_tasks")]
    public JsonResult GetTasks()
    {
      string query = "SELECT * FROM todo";
      DataTable table = new DataTable();
      string sqlDatasource = _configuration.GetConnectionString("mydb");

      using (SqlConnection myCon = new SqlConnection(sqlDatasource))
      {
        myCon.Open();

        using (SqlCommand myCommand = new SqlCommand(query, myCon))
        {
          using (SqlDataReader myReader = myCommand.ExecuteReader())
          {
            table.Load(myReader);
          }
        }
      }

      // Return the DataTable as JSON
      return new JsonResult(table);
    }

    /// <summary>
    /// Adds a new task to the database.
    /// </summary>
    /// <param name="task">The task to be added, provided as a form value.</param>
    /// <returns>A JsonResult indicating the success or failure of the operation.</returns>
    [HttpPost("add_tasks")]
    public JsonResult AddTasks([FromForm] string task)
    {
      string query = "INSERT INTO todo (task) VALUES (@task)";
      string sqlDatasource = _configuration.GetConnectionString("mydb");

      using (SqlConnection myCon = new SqlConnection(sqlDatasource))
      {
        myCon.Open();

        using (SqlCommand myCommand = new SqlCommand(query, myCon))
        {
          myCommand.Parameters.AddWithValue("@task", task);
          int result = myCommand.ExecuteNonQuery(); // ExecuteNonQuery is used for non-query commands

          // Return success or failure message as JSON
          if (result > 0)
          {
            return new JsonResult(new { Message = "Added Successfully" });
          }
          else
          {
            return new JsonResult(new { Message = "Error adding the task" }) { StatusCode = 500 };
          }
        }
      }
    }

    [HttpDelete("delete_tasks")]
    public JsonResult DeleteTasks([FromForm] string id)
    {
      string query = "delete from todo where id=@id ";
      string sqlDatasource = _configuration.GetConnectionString("mydb");

      using (SqlConnection myCon = new SqlConnection(sqlDatasource))
      {
        myCon.Open();

        using (SqlCommand myCommand = new SqlCommand(query, myCon))
        {
          myCommand.Parameters.AddWithValue("@id", id);
          int result = myCommand.ExecuteNonQuery(); // ExecuteNonQuery is used for non-query commands


          // Return success or failure message as JSON
          if (result > 0)
          {
            return new JsonResult(new { Message = "Deleted Successfully" });
          }
          else
          {
            return new JsonResult(new { Message = "Error Deleting" }) { StatusCode = 500 };
          }
        }
      }
    }





  }
}



```

