import { RouteConfig } from 'vue-router'
const routes: RouteConfig[] = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            { 
                path: '', 
                component: () => import('pages/Index.vue') 
            },
            {
                path:'scripts',
                component: () => import('pages/scripts/index.vue')
            },
            {
                path:'scripts/view/:name',
                component: () => import('pages/scripts/view.vue')
            },
            {
                path:'scripts/create',
                component: () => import('pages/scripts/create.vue')
            },
            {
                path:'groups',
                component: () => import('pages/groups/index.vue')
            },
            {
                path:'groups/view/:name',
                component: () => import('pages/groups/view.vue')
            },
            {
                path:'groups/create',
                component: () => import('pages/groups/create.vue')
            },
        ]
    }
];

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
    routes.push({
        path: '*',
        component: () => import('pages/Error404.vue'),
    });
}

export default routes;
