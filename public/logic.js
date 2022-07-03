const buttons = document.querySelectorAll('button.updater');
function getBookInfo(button){
    return Array.from( button.parentElement.children).filter(elem => {
        const a = Array.from(elem.classList);
        if (a.includes('read') || a.includes('bookName')) return true;
        else return false
    }).map(elem => elem.textContent)
}


buttons.forEach(button => {
    button.addEventListener('click', _ => {
        const info = getBookInfo(button);

        fetch('/books',{
            method: 'put',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                {
                    bookName: info[0].toLowerCase(),
                    read: info[1].toLowerCase()
                }
            )
        })
        .then(res =>{ if (res.ok) return res.json() })
        .then(response => window.location.reload() )
        .catch(err => {if(err) console.error('Logic.js Error: ',err)})
    })
});

const buttonsDel = document.querySelectorAll('button.deleter');
buttonsDel.forEach(button => {
    button.addEventListener('click', _ => {
        const info = getBookInfo(button);
        if (!confirm(`Are you sure you wish to delete "${info[0]}"? This action can not be reversed.`)) return;
        fetch('/books',{
            method: 'delete',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                {
                    bookName: info[0].toLowerCase(),
                    read: info[1].toLowerCase()
                }
            )
        })
        .then(res =>{ if (res.ok) return res.json() })
        .then(response =>{
            window.scrollTo({ top: 0, behavior: 'smooth' })
            document.querySelector('h1.subtitle').textContent = response + '... Realoding now';
            setTimeout(()=>{
                window.location.reload()
            },5000) 
        })
        .catch(err => {if(err) console.error(err)})
    })
})

console.log('JS is loaded!')