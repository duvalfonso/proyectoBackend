import ProductManager from './managers/productManager.js'

const productManager = new ProductManager('./files/products.json');

(async () => {
  await productManager.initialize()

  await productManager.addProduct('Product 1', 'Description 1', 9.99, 'thumbnail1.jpg', '10000', 10)
  await productManager.addProduct('Product 2', 'Description 2', 19.99, 'thumbnail2.jpg', '10001', 5)
  await productManager.addProduct('Product 3', 'Description 3', 49.99, 'thumbnail3.jpg', '10002', 15)
  await productManager.addProduct('Product 4', 'Description 4', 13.99, 'thumbnail4.jpg', '10003', 5)
  await productManager.addProduct('Product 5', 'Description 5', 12.99, 'thumbnail5.jpg', '10004', 10)
  await productManager.addProduct('Product 6', 'Description 6', 11.99, 'thumbnail6.jpg', '10005', 20)
  await productManager.addProduct('Product 7', 'Description 7', 11.49, 'thumbnail7.jpg', '10006', 10)
  await productManager.addProduct('Product 8', 'Description 8', 3.99, 'thumbnail8.jpg', '10007', 12)
  await productManager.addProduct('Product 9', 'Description 9', 4.99, 'thumbnail9.jpg', '10008', 24)
  await productManager.addProduct('Product 10', 'Description 10', 41.99, 'thumbnail10.jpg', '10009', 31)
  await productManager.getProductById(4)
  await productManager.updateProduct(4, { price: 29.99, stock: 3 })
  await productManager.getProductById(4)
  await productManager.getProductsList()
  await productManager.deleteProduct(10)
  await productManager.getProductsList()
})()
