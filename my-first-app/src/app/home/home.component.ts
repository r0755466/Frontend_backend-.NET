import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

// We need some prerequesed models 
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule} from '@angular/common/http';

//Need to store input from users 
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {


}
