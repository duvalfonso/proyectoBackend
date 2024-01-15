const modalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const modalBackgrounds = document.querySelectorAll('.modal-container')
// const addToCartButtons = document.querySelectorAll('.add-to-cart')

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

// async function getCart () {
//   await fetch('/api/users/profile/carts')
//     .then(res => res.json())
//     .then(json => {
//       const cart = json.payload.cart._id
//       return cart
//     })
//     .catch(err => console.error(err))
// }

// addToCartButtons.forEach(button => {
//   button.addEventListener('click', function (e) {
//     const cart = getCart()
//     addToCart(cart, addToCartButtons, 1)
//   })
// })

// async function addToCart (cartId, productId, quantity) {
//   const response = await fetch(`/api/moncarts${cartId}/product/${productId}`, {
//     method: 'POST',
//     body: quantity,
//     headers: {
//       'Content-Type': 'Application/json'
//     }
//   })
// }
