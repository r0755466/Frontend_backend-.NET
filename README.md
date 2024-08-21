
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


### Dockterising the project 

First started with the front end, the main problem I found was that I could not reach the browser. The cause was that I needed to specify in the `CMD ["ng", "serve", "--host", "0.0.0.0"]` that the host was `0.0.0.0`.

Also made some minor changes in the `package.json`, specifically to the `start` script:

```json
"start": "ng serve --host 0.0.0.0 --port 4200",

```dockerfile

# Need node to run angular 
FROM node:16-alpine3.11 as angular 

# Reference to our working dir 
WORKDIR /app

# We make an copy of all the files in the directory 
COPY . .

# We install the needed 
RUN npm install 
RUN npm build 

# Gone use an other image, but swithc to the working directory 
FROM httpd:alpine3.15

# default where apache saves the html files... , we change to there 
WORKDIR /usr/local/apache2/htdocs

EXPOSE 4200
# We gone copy our angular files from the image to there 
COPY --from=angular /app/dist/my-first-app .

CMD ["ng", "serve", "--host", "0.0.0.0"]

```

### Backend API

The virtualisation initializes, but I can't reach the backend URL. After checking the ports and considering different other reasons, I wonder if the mistake is not in the Dockerfile but in the Docker Compose file.

Docker-compose of the full project: 

```yml

version: '3.8'
services:
  backend:
    build:
      context: ./API
      dockerfile: Dockerfile
    container_name: dotnet-api
    ports:
      - "8000:8000" # Maps host port 8000 to container port 8080 (HTTP)
      - "7296:8081" # Maps host port 7296 to container port 8081 (HTTPS)
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Server=database;Database=mydb;User=Login;Password=Login1234;
    
    depends_on:
      - database
    networks:
      - app-network

  database:
    image: mysql:8.0
    container_name: mysql-db
    restart: always
    environment:
      MYSQL_DATABASE: mydb
      MYSQL_USER: Login
      MYSQL_PASSWORD: Login1234
      MYSQL_ALLOW_EMPTY_PASSWORD: yes
    ports:
      - "3306:3306"
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - app-network

  frontend:
    image: node:18-alpine
    container_name: angular-frontend
    build:
      context: ./my-first-app
      dockerfile: Dockerfile
    ports:
      - "4200:4200"
    environment:
      - CHOKIDAR_USEPOLLING=true
    volumes:
      - ./my-first-app:/app
    working_dir: /app
    command: sh -c "npm install && npm start"
    depends_on:
      - backend
    networks:
      - app-network

volumes:
  db-data:

networks:
  app-network:

```

Dockerfile for the backend

```dockerfile
# See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

# This stage is used when running from VS in fast mode (Default for Debug configuration)
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app

EXPOSE 8080
EXPOSE 8081

# This stage is used to build the service project
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["WebApplication1/WebApplication1.csproj", "WebApplication1/"]
RUN dotnet restore "./WebApplication1/WebApplication1.csproj"
COPY . .
WORKDIR "/src/WebApplication1"
RUN dotnet build "./WebApplication1.csproj" -c $BUILD_CONFIGURATION -o /app/build

# This stage is used to publish the service project to be copied to the final stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./WebApplication1.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# This stage is used in production or when running from VS in regular mode (Default when not using the Debug configuration)
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
RUN ls -al
ENTRYPOINT ["dotnet", "WebApplication1.dll"]

```