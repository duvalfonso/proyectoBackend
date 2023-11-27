const modalButtons = document.querySelectorAll('[data-modal-target]')
const closeModalButtons = document.querySelectorAll('[data-close-button]')
const modalBackgrounds = document.querySelectorAll('.modal-container')

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
