
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./react-magma-icons.cjs.production.min.js')
} else {
  module.exports = require('./react-magma-icons.cjs.development.js')
}
