const modalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const modalBackgrounds = document.querySelectorAll('.modal-container')
const addToCartButtons = document.querySelectorAll('.add-to-cart')

modalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = document.getElementById(button.dataset.modalTarget)
    openModal(modal)
  })
})

closeModalButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal-container')
    closeModal(modal)
  })
})

function openModal (modal) {
  if (modal === null) return
  modal.classList.add('active')
}

function closeModal (modal) {
  if (modal === null) return
  modal.classList.remove('active')
}

modalBackgrounds.forEach(modalBackground => {
  modalBackground.addEventListener('click', function (e) {
    if (e.target === modalBackground) {
      e.target.classList.remove('active')
    }
  })
})

addToCartButtons.forEach(button => {
  button.addEventListener('click', function (e) {
    const productId = e.currentTarget.dataset.productId
    console.log(productId)
    const cartId = e.currentTarget.dataset.cart
    console.log(e.currentTarget.dataset)
    addToCart(cartId, productId, 1)
  })
})

async function addToCart (cartId, productId, quantity) {
  const response = await fetch(`/api/moncarts/${cartId}/product/${productId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ quantity })
  })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      console.log(response)
    })
    .catch(err => {
      console.error(err)
    })
}
