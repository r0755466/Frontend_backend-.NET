import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

// We need some prerequesed models 
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule} from '@angular/common/http';

//Need to store input from users 
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [  RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {

  title = 'Todo';
  tasks: any = []; // Use a more specific type if possible
  newtask="";
  APIURL = "http://localhost:8000/"; 


  constructor(private http: HttpClient) {}

  ngOnInit() { // Correct lifecycle hook
    this.get_tasks(); 
  }

  get_tasks() {
    this.http.get(this.APIURL + "get_tasks").subscribe((res: any) => {
      this.tasks = res; 
    });
  }

  add_task(){
    // Form of data & apend the data coming from the user
    let body=new FormData();
    body.append('task',this.newtask);
    this.http.post(this.APIURL+"add_tasks",body).subscribe((res)=>{
      this.newtask="";
      // refresh the task by calling 
      console.log(this.newtask);
      alert(res)

      this.get_tasks();
    }) 
  }

  delete_task(id:any){

    // Form of data & apend the data coming from the user
    let body=new FormData();

    body.append('id',id);
    console.log(id);
    
    this.http.post(this.APIURL+"delete_tasks",body).subscribe((res)=>{
      // refresh the task by calling 
      
      alert(res)
      this.get_tasks();
      
    }) 

}

}
