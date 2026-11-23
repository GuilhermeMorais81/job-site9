import { Routes } from '@angular/router';
import { Login } from './login/login'
import { Signup } from './signup/signup';
import { Display } from './display/display';
import { Detail } from './detail/detail';

export const routes: Routes = [
    {
        path: '',
        component: Display,
        title: 'Open roles · Workwise'
    },
    {
        path: 'jobs/:id',
        component: Detail,
        title: 'Role · Workwise'
    },
    {
        path: 'login',
        component: Login,
        title: 'Log in · Workwise'
    },
    {
        path: 'signup',
        component: Signup,
        title: 'Create an account · Workwise'
    },
    {
        path: '**',
        redirectTo: ''
    }
];
