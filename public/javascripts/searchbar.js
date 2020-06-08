window.addEventListener('DOMContentLoaded',() => {
    const searchMenuContainer = document.querySelector('#search-menu-container')
    const searchInput = document.querySelector('#search-input')
    let refTimout = null
    if(searchMenuContainer && searchInput){
        window.addEventListener('click',() => {
            searchMenuContainer.innerHTML = ''
        })
        searchMenuContainer.addEventListener('click',(event) => {
            event.stopPropagation();
        })
        searchInput.addEventListener('input',(event) => {
            if(refTimout) clearTimeout(refTimout)
            refTimout = setTimeout(() => {
                const searchkey = event.target.value
                if(axios){
                    axios.get('/users/search?search='+encodeURIComponent(searchkey))
                    .then(response => {                    
                        searchMenuContainer.innerHTML= (!!response.data)?response.data:searchMenuContainer.innerHTML
                    })
                    .catch(err => {
                        console.log(err)
                    })
                }else{
                    console.log("Unable to search user without Axios")
                }
                console.log(searchkey)
            },500)
        })
    }
})