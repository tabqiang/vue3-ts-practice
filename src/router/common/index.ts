export default [
  {
    path: '/',
    redirect: '/page-a'
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/NotFound/NotFound.vue')
  }
]
