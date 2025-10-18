import { Routes } from '@angular/router';
import { Test } from './test/test';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Home } from './pages/home/home';
import { Unauthorized } from './components/unauthorized/unauthorized';
import { Public } from './pages/public/public';

export const routes: Routes = [
   { path: 'home', component :  Home },
   { path: '', redirectTo: '/home', pathMatch: 'full' },
   { path: 'login', component :  Login },
   { path: 'signup', component :  Signup },
   { path: 'unauthorized', component :  Unauthorized }
];
