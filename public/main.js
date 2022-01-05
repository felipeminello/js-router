import routerInstance from './js/routes.js'
import Storage from './js/storage.js'

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

const loadPage = (elRoot, routeInfo) => {
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

window.onload = () => {

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
  let navigate = e => {
    let route = e.target.attributes['router-link'].value

    // redirect to the router instance
    let routeInfo = routerInstance.routes.filter(r => r.path === route)[0]

    console.log('routeInfo', routeInfo)

    if (!routeInfo) {
      // window.history.pushState({ error: true }, '', 'error')
      window.history.pushState(null, '', 'error')
      root.innerHTML = 'This route is not Defined'
    } else {
      // window.history.pushState({ 'path': routeInfo.path, 'user_id': 5 }, '', routeInfo.path)
      window.history.pushState(null, '', routeInfo.path)

      console.log('History.state after pushState: ', window.history.state)

      loadPage(root, routeInfo)
    }
  }


  //iterate over all defined routes
  definedRoutes.forEach(route => {
    route.addEventListener('click', navigate, false)
  })

  // get current path
  let currentPath = window.location.pathname
  let routeInfo = routerInstance.routes.filter(r => r.path === currentPath)[0]

  loadPage(root, routeInfo)

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