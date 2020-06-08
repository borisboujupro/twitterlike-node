window.addEventListener('DOMContentLoaded',() => {
    const forgotPasswordBtn = document.querySelector('#forgot-password-button')  
    const emailInput = document.querySelector('#email')
    forgotPasswordBtn.addEventListener('click',(event) => {        
        const predefinedEmail = (emailInput)?emailInput.value:""
        if(Swal){
            Swal.fire({
                icon:'question',
                title:'Renseignez votre mail',
                input: 'email',
                inputValue : predefinedEmail,
                inputPlaceholder : 'aaa@bbb.ccc',
                showCloseButton: true,
                showCancelButton: true,
                showLoaderOnConfirm: true,
                preConfirm: (emailPreConfirm) => {
                    return axios.post("/users/forgot-password", {
                                email: emailPreConfirm
                            }).then(response => {
                                console.log(response)
                                if (response.status !== 200) {
                                    throw new Error(response.statusText)
                                }
                                return response.data
                            }).catch(error => {
                                Swal.showValidationMessage(
                                    `Une erreur est survenue : ${(error.response)?error.response.data:error}`
                                )
                            });                    
                }
            }).then((result) => {
                const email = result.value.email
                if(email){
                    Swal.fire({
                        icon: "success",
                        title: `Vous avez recu un email avec les instructions à cette adresse : ${email}`
                    });
                }
            })
        }else{
            console.log("Unable to perform Password reset without Swal")
        }
    })
})