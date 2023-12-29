document.addEventListener('DOMContentLoaded', function () {
  const jokesContainer = document.getElementById('jokesContainer')

  fetch('../data/jokes.json')
    .then((response) => response.json())
    .then((data) => {
      // Create card for each joke
      data.forEach((joke) => {
        const jokeCard = document.createElement('div')
        jokeCard.classList.add('card')

        const jokeContent = `
            <div class="card-header">Joke #${joke.id}</div>
            <div class="card-body">
              <p>${joke.joke}</p>
              <h1>AAA</h1>
              <p><strong>Answer:</strong> ${joke.answer}</p>
              <p>Likes: ${joke.likes}</p>
            </div>
          `

        jokeCard.innerHTML = jokeContent
        jokesContainer.appendChild(jokeCard)
      })
    })
    .catch((error) => {
      console.log('Error fetching jokes:', error)
    })
})
x   