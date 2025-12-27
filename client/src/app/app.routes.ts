import { Routes } from '@angular/router';
import { RoleGuard } from './role.guard';
import { ArticlesPage } from './articles-page/articles-page';
import { UsersPage } from './users-page/users-page';
import { RolesPage } from './roles-page/roles-page';
import { ArticleDetails } from './article-details/article-details';


import { ArticlesLibrary } from './articles-library/articles-library';
import { LoginPage } from './login-page/login-page';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'articles',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginPage

    },
    {
        path: 'articles/:id',
        component: ArticleDetails
    },
    {
        path: 'articles',
        component: ArticlesPage
    },
    {
        path: 'articles-library',
        component: ArticlesLibrary,
        canActivate: [RoleGuard],
        data: { allowedRoles: ['SuperAdmin', 'Manager', 'Contributor'] } 
    },
    {
        path: 'users',
        component: UsersPage,
        canActivate: [RoleGuard],
        data: { allowedRoles: ['SuperAdmin', 'Manager'] }
    },
    {
        path: 'roles',
        component: RolesPage,
        canActivate: [RoleGuard],
        data: { allowedRoles: ['SuperAdmin'] }
    },
   
];
