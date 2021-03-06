import 'bootstrap'

import routerInstance from './routes'
import Storage from './storage'

const storage = new Storage()

const loadVideo = (elPlayer, videoFile) => {
  if (!elPlayer) {
    return false
  }

  console.log('load video')

  const elSource = elPlayer.children[0]

  elSource.src = `./media/${videoFile}`
  elPlayer.load()

  if (storage.getItem('videoTimestamp')) {
    elPlayer.currentTime = storage.getItem('videoTimestamp')
  }
  // if (window.history.state.videoTimestamp) {
  //   elPlayer.currentTime = window.history.state.videoTimestamp
  // }
}

// const pushState = (obj) => {
//   const baseState = {
//     videoTimestamp: null,
//     videoFile: 'util.mp4'
//   }

//   storage.setItem('teste', 'ok')
//   storage.setItem('teste2', 'xxxxxx')

//   console.log('s', storage.getItem('teste2'))

//   storage.clear()

//   let currentState = { ...baseState }

//   if (window.history.state) {
//     currentState = { ...window.history.state }
//   }

//   if (!isNaN(obj.videoTimestamp)) {
//     currentState.videoTimestamp = obj.videoTimestamp
//   }
//   if (obj.videoFile) {
//     currentState.videoFile = obj.videoFile
//   }

//   console.log('currentState', currentState)

//   window.history.pushState(currentState, '')
// }

const playerControl = (elPlayer) => {
  if (!elPlayer) {
    return false
  }

  elPlayer.addEventListener('play', evt => {
    console.log('play', evt)
  })
  elPlayer.addEventListener('playing', evt => {
    console.log('playing', evt)
  })
  elPlayer.addEventListener('progress', () => {
    // console.log('progress', evt.timeStamp)
  })
  elPlayer.addEventListener('timeupdate', () => {
    console.log('timeupdate', elPlayer.currentTime)

    // pushState({ videoTimestamp: elPlayer.currentTime })
    storage.setItem('videoTimestamp', elPlayer.currentTime)
  })
  elPlayer.addEventListener('pause', evt => {
    // pushState({ videoTimestamp: evt.target.currentTime })
    storage.setItem('videoTimestamp', evt.target.currentTime)

    console.log('pause', evt.target.currentTime)
  })
  elPlayer.addEventListener('ended', evt => {
    console.log('ended', evt)
  })
  elPlayer.addEventListener('error', evt => {
    console.log('error', evt)
  })
  elPlayer.addEventListener('abort', evt => {
    console.log('abort', evt)
  })
  elPlayer.addEventListener('emptied', evt => {
    console.log('emptied', evt)
  })
}

const checkAuth = (routeInfo) => new Promise(resolve => {
  if (routeInfo.auth) {
    if (!storage.getItem('token')) {
      location.href = '/login'

      return resolve(false)
    }
  }

  return resolve(true)
})


const loadPage = async (elRoot, routeInfo) => {
  if (!routeInfo) {
    // window.history.pushState({ error: true }, '', 'error')
    window.history.pushState(null, '', 'error')
    elRoot.innerHTML = 'This route is not Defined'

    return false
  }

  console.log('routeInfo', routeInfo)

  // if (window.location.pathname === routeInfo.path) {
  //   return false
  // }

  window.history.pushState(null, '', routeInfo.path)

  if (routeInfo.path === '/logout') {
    storage.removeItem('token')
    location.href = '/login'

    return false
  }

  await checkAuth(routeInfo)

  if (!routeInfo.page) {
    elRoot.innerHTML = `You are on the ${routeInfo.name} path`

    return false
  }

  const xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
        elRoot.innerHTML = this.responseText

        const elPlayer = document.getElementById('player'),
          buttons = Array.from(document.querySelectorAll('[video-file]'))

        buttons.forEach(btn => {
          btn.addEventListener('click', evt => {
            const fileName = evt.target.attributes['video-file'].value

            // pushState({ videoFile: fileName, videoTimestamp: 0 })
            storage.setItem('videoFile', fileName)
            storage.setItem('videoTimestamp', 0)

            loadVideo(elPlayer, fileName)
          })
        })

        if (storage.getItem('videoFile')) {
          loadVideo(elPlayer, storage.getItem('videoFile'))
        }
        // if (window.history.state && window.history.state.videoFile) {
        //   console.log('caiu aqui')
        //   loadVideo(elPlayer, window.history.state.videoFile)
        // }

        playerControl(elPlayer)
        // pushState({})
      }
      if (this.status == 404) { elRoot.innerHTML = 'Page not found.' }
    }
  }
  xhttp.open('GET', `./pages/${routeInfo.page}`, true)
  xhttp.send()
}

window.onload = async () => {

  // let routerInstance = require('./routes')

  //get root div for rendering
  let root = document.getElementById('app')

  window.onpopstate = function (event) {
    if (event.state && event.state.videoFile) {
      loadVideo(document.getElementById('player'), event.state.videoFile)
    }

    console.log(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
  }


  //create the route instance

  //get all router links
  let definedRoutes = Array.from(document.querySelectorAll('[router-link]'))


  // method to navigate
  let navigate = async e => {
    let route = e.target.attributes['router-link'].value

    // redirect to the router instance
    let routeInfo = routerInstance.routes.filter(r => r.path === route)[0]

    await loadPage(root, routeInfo)
  }


  //iterate over all defined routes
  definedRoutes.forEach(route => {
    route.addEventListener('click', navigate, false)
  })

  // get current path
  let currentPath = window.location.pathname
  let routeInfo = routerInstance.routes.filter(r => r.path === currentPath)[0]

  await loadPage(root, routeInfo)

  // if (currentPath === '/') {
  //     root.innerHTML = 'You are on Home page'
  // } else {
  //     // check if route exist in the router instance 
  //     let route = routerInstance.routes.filter(r => r.path === currentPath)[0];
  //     if (route) {
  //         root.innerHTML = `You are on the ${route.name} path`
  //     } else {
  //         root.innerHTML = `This route is not Defined`
  //     }

  // }
}