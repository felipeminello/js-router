const express = require('express')
const morgan = require('morgan')

const app = express()

app.use(morgan('dev'))
app.use(express.static('public'))

const path = require('path')
const fs = require('fs')

const routes = [
  {
    path: '/',
    file: 'index.html'
  },
  {
    path: '/login',
    file: 'login.html'
  },
  {
    path: '/forgot-password',
    file: 'forgot.html'
  }
]

app.get('*', (req, res) => {
  const route = routes.find(r => r.path === req.params['0'])

  if (!route) {
    return res.sendFile(path.resolve('src', 'views', 'error', '404.html'))
  }

  if (!route.file) {
    return res.sendFile(path.resolve('src', 'views', 'error', '500.html'))
  }

  const filePath = path.resolve('src', 'views', route.file)

  if (!fs.existsSync(filePath)) {
    return res.sendFile(path.resolve('src', 'views', 'error', '500.html'))
  }

  return res.sendFile(filePath)
  // return res.sendFile(__dirname + '/public/index.html')
})

app.listen(7000, () => console.log('App is listening on port 7000'))