// Open the popup
function openPopup() {
  document.getElementById('popup').style.display = 'block';
}

// Close the popup
function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

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

// Attach click event to trigger the popup
document.getElementById('uglyFace1').addEventListener('click', openPopup);

// Follow page scroll
// window.onscroll = function () {
//   var popup = document.getElementById('popup');
//   if (popup.style.display === 'block') {
//       popup.style.top = window.pageYOffset + window.innerHeight / 2 + 'px';
//   }
// };
