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
                path:'groups',
                component: () => import('pages/groups/index.vue')
            },
            {
                path:'groups/view/:name',
                component: () => import('pages/groups/view.vue')
            }
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
