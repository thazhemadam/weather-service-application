

const weatherForm = document.getElementById('search')
// const weatherForm = document.querySelector('form')

const search = document.getElementById('input')
const content = document.getElementById('content')

weatherForm.addEventListener('submit',(e)=>{
    
    e.preventDefault()
    
    const location = search.value
    const url = "/weather?address="+location
    content.textContent = 'Loading your request.'


    fetch(url).then((response)=>{
        response.json().then((data)=>{

            if(data.error){            
                content.textContent = data.error
            }
            else{            
                content.textContent = data.location + '\n\n' + data.forecast
            }
        })
    })
})


