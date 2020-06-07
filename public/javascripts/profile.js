window.addEventListener('DOMContentLoaded',() => {
    const avatarImg = document.querySelector('#avatar-display')
    const avatarInput = document.querySelector('#avatar-input')
    const avatarForm = document.querySelector('#avatar-form')

    avatarImg.addEventListener('click', (event) => {        
       avatarInput.click()
      
    })

    avatarInput.addEventListener('change',(event) => {           
        
        avatarForm.submit()
    })
    //TOTO Async update of Avatar ? to try
})