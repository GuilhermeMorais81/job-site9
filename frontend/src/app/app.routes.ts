import { Routes } from '@angular/router';
import { Window } from './components/window/window';
import { Detail } from './components/detail/detail';

export const routes: Routes = [
    {path:"", component:Window},
    {path:"jobs/:id", component:Detail}
];
