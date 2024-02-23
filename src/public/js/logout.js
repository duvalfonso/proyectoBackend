const logout = async () => {
  try {
    const response = await fetch('/api/sessions/logout', {
      method: 'POST',
      credentials: 'same-origin'
    })

    if (response.ok) {
      window.location.replace('/login')
    } else {
      console.error('Logout failed:', response.statusText)
    }
  } catch (error) {
    console.error('Error during logout:', error)
  }
}

document.getElementById('logout').addEventListener('click', logout)
