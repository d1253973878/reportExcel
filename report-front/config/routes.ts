export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/login',
          },
        ]
      },
      {
        name: 'report-design',
        path: '/report/design/:id',
        component: './ReportDesigner',
      },
      {
        name: 'report-preview',
        path: '/report/preview/:id',
        component: './ReportPreview',
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                redirect: '/report/list',
              },
              {
                name: 'list.report-list',
                icon: 'snippets',
                path: '/report/list',
                component: './ReportTable',
              },
              {
                name: 'list.screen-list',
                icon: 'play-square',
                path: '/screen/list',
                component: './ListTableList',
              },
              {
                component: './404',
              }
            ],
          },
          {
            component: './404',
          },
        ],
      }
    ]
  },
  {
    component: './404',
  },
];
