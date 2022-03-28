document.addEventListener("DOMContentLoaded", function() {
    const userObj = {
        id: 10,
        username: "Jacob"
    }
    
    fetch("http://localhost:3000/books")
    .then(resp => resp.json())
    .then(books => {
        console.log(books)
        renderBooks(books)
    })

    function renderBooks(books) {
        books.forEach(book => {
            const list = document.querySelector("#list");
            const title = document.createElement("li");

            title.textContent = book.title;
            title.addEventListener('click', () => {
                const bookCard = document.querySelector("#show-panel");

                bookCard.textContent = "";

                const img = document.createElement('img')
                const title = document.createElement("h2");
                const subtitle = document.createElement("h4")
                const author = document.createElement('h3')
                const description = document.createElement("p")
                const likes = document.createElement('ul')
                const likeBttn = document.createElement('button')
                

                img.src = book.img_url
                title.textContent = book.title;
                subtitle.textContent = book.subtitle;
                author.textContent = book.author
                description.textContent = book.description
                book.users.forEach(user => {
                    const like = document.createElement('li');
                    like.textContent = user.username
                    likes.append(like)
                })
                likeBttn.textContent = "Like"
                let timesClicked = 0
                likeBttn.addEventListener('click', () => {
                    timesClicked++;

                    if (timesClicked === 0 || timesClicked % 2 === 0) {
                        likeBttn.textContent = "Like"

                        fetch(`http://localhost:3000/books/${book.id}`, {
                        method: "PATCH",
                        headers: {
                            'Content-type': 'application/JSON'
                        },
                        body: JSON.stringify({
                            "users": [
                                ...book.users, 
                                userObj]
                        })
                        })
                        .then(resp => resp.json())
                        .then(users => {
                            console.log(users)
                            const like = document.createElement('li')
                                like.textContent = userObj.username
                            likes.append(like)
                        })}
                        else (timesClicked % 2 !== 0 && timesClicked > 0) {
                        likeBttn.textContent = "Unlike"

                        fetch(`http://localhost:3000/books/${book.id}`, {
                            method: 'PATCH',
                            headers: {
                                'Content-type': 'application/json'
                            },
                            body: JSON.stringify({
                                "users": [
                                    book.users.pop()
                                ]
                            })
                        })
                        .then(resp => resp.json())
                        .then(users => {
                            console.log(users)
                            likes.lastChild.remove()
                        })
                    }
                bookCard.append(img, title, subtitle, author, description, likes, likeBttn)
            })})
        list.append(title);
            }   
    )}
});
