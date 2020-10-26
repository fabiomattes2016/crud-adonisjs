'use strict'

const Product = use('App/Models/Product')

class ProductController {
  async index({ response }) {
    const products = await Product.all()

    return response.status(200).send(products)
  }

  async show({ response, params }) {
    const id = params.id
    const product = await Product.query().where('id', id).fetch()

    if (product.lenght >= 0) {
      return response.status(404).send({
        success: false,
        message: 'Produto não encontrado!'
      })
    }

    return response.status(200).send(product)
  }

  async store({ request, response }) {
    const data = request.all()

    if (!data.description) {
      return response.status(400).send({
        success: false,
        message: 'Informe uma descrição!'
      })
    }

    if (!data.price) {
      return response.status(400).send({
        success: false,
        message: 'Informe um preço!'
      })
    }

    if (!data.stock) {
      return response.status(400).send({
        success: false,
        message: 'Informe o estoque atual!'
      })
    }

    await Product.create(data)

    return response.status(200).send({
      success: true,
      message: 'Produto cadastrado com sucesso!'
    })
  }

  async update({ request, response, params }) {
    const id = params.id
    const data = request.all()
    const product = await Product.find(id)

    if (!data.description) {
      return response.status(400).send({
        success: false,
        message: 'Informe uma descrição!'
      })
    }

    if (!data.price) {
      return response.status(400).send({
        success: false,
        message: 'Informe um preço!'
      })
    }

    if (!data.stock) {
      return response.status(400).send({
        success: false,
        message: 'Informe o estoque atual!'
      })
    }

    product.merge(data)
    await product.save()

    return response.status(200).send({
      success: true,
      message: 'Produto atualizado com sucesso'
    })
  }

  async destroy({ response, params }) {
    const id = params.id
    const product = await Product.find(id)

    await product.delete()

    return response.status(200).send({
      success: true,
      message: 'Produto excluido com sucesso!'
    })
  }
}

module.exports = ProductController
