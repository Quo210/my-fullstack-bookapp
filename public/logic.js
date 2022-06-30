const buttons = document.querySelectorAll('button.updater');
buttons.forEach(button => {
    button.addEventListener('click', _ => {
        const info = Array.from( button.parentElement.children).filter(elem => {
            const a = Array.from(elem.classList);
            if (a.includes('read') || a.includes('bookName')) return true;
            else return false
        }).map(elem => elem.textContent);

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
        .catch(err => {if(err) console.error(err)})
    })
})

console.log('JS is loaded!')