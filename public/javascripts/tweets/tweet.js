deleteTweetBtnBinder = () => {
    const deleteElements = document.querySelectorAll('.tweet-list-delete')
    deleteElements.forEach((btn) => {
        btn.addEventListener('click',(event) => {
            const tweetId = event.target.getAttribute('tweetId')
            // console.log('Asking for delete for : ' + tweetId)
            if(axios){
                axios.delete('/tweets/'+tweetId).then((response) => {
                    const tweetListContainer = document.querySelector('#tweet-list-container')
                    tweetListContainer.innerHTML= (!!response.data || deleteElements.length ==1)?response.data:tweetListContainer.innerHTML
                    deleteTweetBtnBinder()
                }).catch((err) => {
                    console.log(err)
                })
            }else{
                console.log("Unable to delete Tweets without Axios")
            }
        }) 
    })
}

window.addEventListener('DOMContentLoaded',() => {
    deleteTweetBtnBinder();
    
})