function createComment(author, comment) {
    return `<div class="comment">
        <hr/>
        <div class="comment-entry">
        
          <div class="comment-top"> 
            <label>
              <img src="../data/pictures/default_user.jpg" alt="pic" class="comment-picture">
              ${author}
            </label>
          </div>
  
          <div class="rightComment"> 
            <p>${comment}</p>
          </div>
        </div>
      </div>
    `;
  }

function toggleComments(event) {
    var obiekt = event.id;
    var indexNapisu = obiekt.indexOf('showCommentsButton');

    if (indexNapisu !== -1) {
        var liczbaStr = obiekt.substring(indexNapisu + 'showCommentsButton'.length);
        var jokeId = parseInt(liczbaStr, 10);
    } else {
        console.log('Nie znaleziono napisu "showCommentsButton".');
    }


    var toggleButton = document.getElementById('showCommentsButton' + jokeId);
    var hiddenElement = document.getElementById('commentContainer' + jokeId);

    var isVisible = window.getComputedStyle(hiddenElement).display !== 'none';

    if (isVisible) {
        hiddenElement.style.display = 'none';
    } else {
        hiddenElement.style.display = 'block'; 
    }
}
  var topJokes = true;
document.addEventListener('DOMContentLoaded', function () {
    fetch('../data/jokes.json')
      .then((response) => response.json())
      .then((data) => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('topjokes')) {
            data.sort((a, b) => b.likes - a.likes);

            const topJokesNav = document.getElementById("topJokesNav");
            const homeNav = document.getElementById("homeNav");
            topJokesNav.classList.value = "nav-item active";
            homeNav.classList.value = "nav-item";   
        } else {
            console.log('Brak parametru "topjokes" w URL.');
        }

        data.forEach((joke) => {
            const jokeCard = document.createElement('div')
            jokeCard.classList.add('card')
            var likeButtonClassName = 'btn-primary';
            var dislikeButtonClassName = 'btn-primary';
  
            const jokeContent = `
            <div class="joke">
                    <!-- Pasek ze zdjęciem profilowym i nazwą użytkownika -->
                    <div class="joke-top">
                      <div class="leftJoke"> 
                        <label>
                          <img src="../data/pictures/default_user.jpg" alt="pic" class="picture">
                          ${joke.author}
                        </label>
                      </div>
                      <div class="plus-minus-container"> 
                      
                        <div class="col-auto">
                          <span class="up-button">
                            <button type="button" class="btn ${likeButtonClassName}" id="upvote${joke.id}">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-arrow-up-square" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                  d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z" />
                              </svg>
                              <span id="upvote_count${joke.id}">${joke.likes}</span>
                            </button>
                          </span>
                        </div>
          
                        <div class="col-auto">
                          <span class="down-button">
                            <button type="button" class="btn ${dislikeButtonClassName}" id="downvote${joke.id}">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                class="bi bi-arrow-down-square" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                  d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                              </svg>
                              <span id="downvote_count${joke.id}">${joke.dislikes}</span>
                            </button>
                          </span>
                        </div>

                      </div>
                    </div>
                    
                    <!-- Pole z treścią żartu -->
                    <div class="mainJoke"> 
                      <p>${joke.joke}</p>
                    </div>
    
                    <!-- Zgłaszanie żartu -->
                    <div class="rightJoke">
        
                    <!-- Pasek z upvote'ami, komentarzami i dodaniem do ulubionych (dla zalogowanych) -->
                        
                    <div class="bottomJoke">

                  <div class="col-auto">
                    <span class="down-button">
                      <button type="button" id="showCommentsButton${joke.id}" class="details-button btn btn-primary" onclick="toggleComments(this)">
                          Comments
                      </button>
                    </span>
                  </div>
                    
                    <!-- Dodac liczbe plusow -->
    
                </div>
                  </div>`
            const commentContainer = document.createElement('div')
            commentContainer.classList.add('comment-container')
            commentContainer.id = "commentContainer" + joke.id;
            commentContainer.innerHTML = "<h4 style=\"padding-left: 1%\">Komentarze</h4>"
            joke.comments.forEach((comment) => {
              // Dodaj każdy komentarz do kontenera
              const commentElement = document.createElement('div');
              commentElement.innerHTML = createComment(comment.author, comment.text);
              commentContainer.appendChild(commentElement.firstChild);
            });
            
            jokeCard.innerHTML = jokeContent
            jokeCard.appendChild(commentContainer)
            jokesContainer.appendChild(jokeCard)
            })
        })
      .catch((error) => {
        console.log('Error fetching jokes:', error)
        })
})

function showReportPopup() {
    document.getElementById('popup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

// Funkcja do ukrycia popupa
function hideReportPopup() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}
// Dodaj obsługę kliknięcia do linku
document.getElementById('showPopup').addEventListener('click', function (e) {
    e.preventDefault();
    showPopup();
});