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

    [HttpPost("delete_tasks")]
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
