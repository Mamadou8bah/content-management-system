import { Routes } from '@angular/router';
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
        component: ArticlesLibrary

    },
    {
        path: 'users',
        component: UsersPage
    },
    {
        path: 'roles',
        component: RolesPage
    },
   
];
