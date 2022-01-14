//router instance
let Router = function (name, routes) {
  return {
    name,
    routes
  }
}

let routerInstance = new Router('routerInstance', [
  {
    path: '/',
    name: 'Root',
    auth: {
      showVideo: true
    }
  },
  {
    path: '/about',
    name: 'About',
    page: 'about.html'
  },
  {
    path: '/logout',
    name: 'Logout',
  },
  {
    path: '/login',
    name: 'Login',
    page: 'login.html'
  },
  {
    path: '/video',
    name: 'Video',
    page: 'video.html'
  },
  {
    path: '/contact',
    name: 'Contact'
  }
])

export default routerInstance