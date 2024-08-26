import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

// We need some prerequesed models 
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule} from '@angular/common/http';

//Need to store input from users 
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

// Stand alone components, better and  something new of Angular..
//The RouterLink component makes it possbile to click on the Tasks, about exc..

@Component({
  selector: 'app-root',
  standalone: true,
  imports: 
  [
   RouterOutlet,
   CommonModule,
   FormsModule,
   ReactiveFormsModule,
   HttpClientModule,
   RouterLink
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
 
 
})

export class AppComponent {

  
}