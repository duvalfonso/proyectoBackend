const socket = io()

const listContainer = document.querySelector('.list-container')

socket.on('update-list', data => {
  const item = `<li id=${data.id}>${data.id} - ${data.title}</li>`
  listContainer.insertAdjacentHTML('beforeend', item)
})

socket.on('remove-product', data => {
  const prod = document.getElementById(`${data}`)
  prod.remove()
})
