import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'MENUITEMS.MENU.TEXT',
    isTitle: true
  },
  {
    id: 2,
    label: 'MENUITEMS.DASHBOARDS.TEXT',
    icon: 'bx-home-circle',
    subItems: [
      {
        id: 3,
        label: 'MENUITEMS.DASHBOARDS.LIST.DEFAULT',
        link: '/dashboard',
        parentId: 2
      },
      {
        id: 4,
        label: 'MENUITEMS.DASHBOARDS.LIST.SAAS',
        link: '/dashboards/saas',
        parentId: 2
      },
      {
        id: 5,
        label: 'MENUITEMS.DASHBOARDS.LIST.CRYPTO',
        link: '/dashboards/crypto',
        parentId: 2
      },
      {
        id: 6,
        label: 'MENUITEMS.DASHBOARDS.LIST.BLOG',
        link: '/dashboards/blog',
        parentId: 2
      },
      {
        id: 7,
        label: 'MENUITEMS.DASHBOARDS.LIST.JOBS',
        link: '/dashboards/jobs',
        parentId: 2,
      },
    ]
  },
  {
    id: 8,
    isLayout: true
  },
  {
    id: 9,
    label: 'MENUITEMS.APPS.TEXT',
    isTitle: true
  },
  {
    id: 10,
    label: 'MENUITEMS.CALENDAR.TEXT',
    icon: 'bx-calendar',
    link: '/calendar',
  },
  {
    id: 11,
    label: 'MENUITEMS.CHAT.TEXT',
    icon: 'bx-chat',
    link: '/chat',

  },
  {
    id: 21,
    label: 'MENUITEMS.EMAIL.TEXT',
    icon: 'bx-envelope',
    subItems: [
      {
        id: 22,
        label: 'MENUITEMS.EMAIL.LIST.INBOX',
        link: '/email/inbox',
        parentId: 21
      },
      {
        id: 23,
        label: 'MENUITEMS.EMAIL.LIST.READEMAIL',
        link: '/email/read/1',
        parentId: 21
      },
      {
        id: 24,
        label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.TEXT',
        badge: {
          variant: 'success',
          text: 'MENUITEMS.EMAIL.LIST.TEMPLATE.BADGE',
        },
        parentId: 21,
        subItems: [
          {
            id:25,
            label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.LIST.BASIC',
            link: '/email/basic',
            parentId:24
          },
          {
            id:26,
            label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.LIST.ALERT',
            link: '/email/alert',
            parentId:24
          },
          {
            id:27,
            label: 'MENUITEMS.EMAIL.LIST.TEMPLATE.LIST.BILLING',
            link: '/email/billing',
            parentId:24
          }
        ]
      }
    ]
  },
  {
    id: 30,
    label: 'MENUITEMS.PROJECTS.TEXT',
    icon: 'bx-briefcase-alt-2',
    subItems: [
      {
        id: 31,
        label: 'MENUITEMS.PROJECTS.LIST.GRID',
        link: '/projects/grid',
        parentId: 30
      },
      {
        id: 32,
        label: 'MENUITEMS.PROJECTS.LIST.PROJECTLIST',
        link: '/projects/list',
        parentId: 30
      },
      {
        id: 33,
        label: 'MENUITEMS.PROJECTS.LIST.OVERVIEW',
        link: '/projects/overview',
        parentId: 30
      },
      {
        id: 34,
        label: 'MENUITEMS.PROJECTS.LIST.CREATE',
        link: '/projects/create',
        parentId: 30
      }
    ]
  },
  {
    id: 35,
    label: 'MENUITEMS.TASKS.TEXT',
    icon: 'bx-task',
    subItems: [
      {
        id: 36,
        label: 'MENUITEMS.TASKS.LIST.TASKLIST',
        link: '/tasks/list',
        parentId: 35
      },
      {
        id: 37,
        label: 'MENUITEMS.TASKS.LIST.KANBAN',
        link: '/tasks/kanban',
        parentId: 35
      },
      {
        id: 38,
        label: 'MENUITEMS.TASKS.LIST.CREATETASK',
        link: '/tasks/create',
        parentId: 35
      }
    ]
  },
  {
    id: 39,
    label: 'MENUITEMS.CONTACTS.TEXT',
    icon: 'bxs-user-detail',
    subItems: [
      {
        id: 40,
        label: 'MENUITEMS.CONTACTS.LIST.USERGRID',
        link: '/contacts/grid',
        parentId: 39
      },
      {
        id: 41,
        label: 'MENUITEMS.CONTACTS.LIST.USERLIST',
        link: '/contacts/list',
        parentId: 39
      },
      {
        id: 42,
        label: 'MENUITEMS.CONTACTS.LIST.PROFILE',
        link: '/contacts/profile',
        parentId: 39
      }
    ]
  },
  {
    id: 47,
    label: 'MENUITEMS.JOBS.TEXT',
    icon: 'bx-briefcase-alt',
    subItems: [
      {
        id: 48,
        label: 'MENUITEMS.JOBS.LIST.JOBLIST',
        link: '/jobs/list',
        parentId: 47
      },
      {
        id: 49,
        label: 'MENUITEMS.JOBS.LIST.JOBGRID',
        link: '/jobs/grid',
        parentId: 47
      },
      {
        id: 100, //  l'id doit etre  unique
        label: 'All Application',
        link: '/jobs/allapplication', // Lien vers AllapplicationComponent
        parentId: 47 // Identifiant du parent  
      },
      
      {
        id: 50,
        label: 'MENUITEMS.JOBS.LIST.APPLYJOB',
        link: '/jobs/apply',
        parentId: 47
      },
      {
        id: 51,
        label: 'MENUITEMS.JOBS.LIST.JOBDETAILS',
        link: '/jobs/details',
        parentId: 47
      },
      {
        id: 52,
        label: 'MENUITEMS.JOBS.LIST.JOBCATEGORIES',
        link: '/jobs/categories',
        parentId: 47
      },
      {
        id: 53,
        label: 'MENUITEMS.JOBS.LIST.CANDIDATE.TEXT',
        badge: {
          variant: 'success',
          text: 'MENUITEMS.EMAIL.LIST.TEMPLATE.BADGE',
        },
        parentId: 47,
        subItems: [
          {
            id:54,
            label: 'MENUITEMS.JOBS.LIST.CANDIDATE.LIST.LIST',
            link: '/jobs/candidate-list',
            parentId:47
                    },
                    {
                        id:55,
                        label: 'MENUITEMS.JOBS.LIST.CANDIDATE.LIST.OVERVIEW',
                        link: '/jobs/candidate-overview',
                        parentId:47
                    }
                ]
            }
        ]
    },

];

