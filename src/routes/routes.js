import AuthLayout from '@/layouts/AuthLayout.vue';


const routes = [
  {
    path: '/',
    redirect: 'home',
    component: AuthLayout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import(/* webpackChunkName: "demo" */ '../views/Home.vue')
      },
    ]
  },
];



export default routes;
