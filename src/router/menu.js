export const NAV = [
    {
        id: 1,
        key: 'sub1',
        icon: 'SettingOutlined',
        label: '权限管理',
        title: '权限管理',
        path: '',
        children: [
            {key: 'sub1-1', label: '用户管理', title: '用户管理', path: '/usr'},
            {key: 'sub1-2', label: '前端用户管理',title: '前端用户管理', path: '/frontUsr'},
            {key: 'sub1-3', label: '菜单管理',title: '菜单管理', path: '/menu'},
        ]
    },
    {
        id: 2,
        key: 'sub2',
        icon: 'SoundOutlined',
        label: '公告管理',
        title: '公告管理',
        path: '/notice',
        children: []
    },
    {
        id: 3,
        key: 'sub3',
        icon: 'FileDoneOutlined',
        label: '打卡管理',
        title: '打卡管理',
        path: '/clock',
        children: []
    },
    {
        id: 4,
        key: 'sub4',
        icon: 'EnvironmentOutlined',
        label: '一刻钟圈',
        title: '一刻钟圈',
        path: '/circle',
        children: []
    },
    {
        id: 5,
        key: 'sub5',
        icon: 'ProfileOutlined',
        label: '任务管理',
        title: '任务管理',
        path: '/task',
        children: []
    },
    {
        id: 6,
        key: 'sub6',
        icon: 'SmileOutlined',
        label: '活动管理',
        title: '活动管理',
        path: '',
        children: [
            {key: 'sub6-1', label: '社区活动',title: '社区活动', path: '/area'},
            {key: 'sub6-2', label: '培训活动',title: '培训活动', path: '/train'},
        ]
    },
    {
        id: 7,
        key: 'sub7',
        icon: 'ShoppingOutlined',
        label: '商城管理',
        title: '商城管理',
        path: '',
        children: [
            {key: 'sub13-1', label: '商家管理',title: '商家管理', path: '/merchant'},
            {key: 'sub13-2', label: '商品管理',title: '商品管理', path: '/product'},
        ]
    },
    {
        id: 8,
        key: 'sub8',
        icon: 'MoneyCollectOutlined',
        label: '积分管理',
        title: '积分管理',
        path: '',
        children: [
            {key: 'sub7-1', label: '积分规则',title: '积分规则', path: '/pointRule'},
        ]
    },
    {
        id: 9,
        key: 'sub9',
        icon: 'AlertOutlined',
        label: '帮帮团公告',
        title: '帮帮团公告',
        path: '/helpNotice',
        children: []
    },
]
