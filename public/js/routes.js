//router instance
let Router = function (name, routes) {
    return {
        name,
        routes
    }
};

let routerInstance = new Router('routerInstance', [
    {
        path: "/",
        name: "Root"
    },
    {
        path: '/about',
        name: "About",
        page: 'about.html'
    },
    {
        path: '/video',
        name: "Video",
        page: 'video.html'
    },
    {
        path: '/contact',
        name: "Contact"
    }
])


export default routerInstance