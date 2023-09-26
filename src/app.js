import ProductManager from './managers/productManager.js'

const productManager = new ProductManager()

productManager.addProduct('Product 1', 'Description 1', 9.99, 'thumbnail1.jpg', '10000', 10)
productManager.addProduct('Product 2', 'Description 2', 19.99, 'thumbnail2.jpg', '10001', 5)

console.log('Products List:', productManager.getProductsList())
console.log(productManager.getProductById(1))
console.log(productManager.getProductById(3))
