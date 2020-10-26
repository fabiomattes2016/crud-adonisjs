'use strict'

const Route = use('Route')

Route.get('/products', 'ProductController.index')
Route.post('/products', 'ProductController.store')
Route.get('/products/:id', 'ProductController.show')
Route.put('/products/:id', 'ProductController.update')
Route.delete('/products/:id', 'ProductController.destroy')
