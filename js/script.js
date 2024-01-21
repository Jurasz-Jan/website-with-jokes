// Open the popup
function openPopup() {
  document.getElementById('popup').style.display = 'block';
}

// Close the popup
function closePopup() {
  document.getElementById('popup').style.display = 'none';
}

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

function htmlToElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  return template.content.firstChild;
}

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
        data.sort((a, b) => b.id - a.id);
      }
      getLikedAndDislikedJokesList().then((likes_dislikes)=>{
              
      // Create card for each joke
      data.forEach((joke) => {
        const jokeCard = document.createElement('div')
        jokeCard.classList.add('card')
        if(likes_dislikes.likes.includes(joke.id))
        {
          var likeButtonClassName = 'btn-success';
          var dislikeButtonClassName = 'btn-primary';
        }
        else if(likes_dislikes.dislikes.includes(joke.id))
        {
          var likeButtonClassName = 'btn-primary';
          var dislikeButtonClassName = 'btn-danger';
        }
        else
        {
          var likeButtonClassName = 'btn-primary';
          var dislikeButtonClassName = 'btn-primary';
        }
        
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

                  <div class="col-auto">
                    <span class="down-button">
                      <button type="button" class="btn btn-danger" onclick=showReportPopup()>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
                          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                        </svg>
                          Report
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
        

        const addCommentField = document.createElement('div');
        addCommentField.id = "add_comment";
        addCommentField.innerHTML = `<div class="comment">
        <hr/>
        <div class="comment-entry">
          <form id="addCommentForm" class="addCommentForm", onsubmit="showAddedComment(event, ${joke.id})">
          <input type="hidden" name="jokeId" value="${joke.id}">
          <textarea id="comment" name="comment" rows="3" style="resize: none" required></textarea>
          <input type="submit" value="Add comment" class="add-comment-button"/>
          </form>
        </div>
        `;

        jokeCard.innerHTML = jokeContent
        commentContainer.appendChild(addCommentField)
        jokeCard.appendChild(commentContainer)
        jokesContainer.appendChild(jokeCard)
            })
            

            getJokeCount().then((x)=>{
              for (let id = 1; id <= x; id++) {
                const upvoteElement = document.getElementById(`upvote${id}`);
                const downvoteElement = document.getElementById(`downvote${id}`);
                const upvoteCountElement = document.getElementById(`upvote_count${id}`);
                const downvoteCountElement = document.getElementById(`downvote_count${id}`);

                if (upvoteElement) {
                    upvoteElement.addEventListener('click', function () {
                      sendVote(id, 1).then((data)=>{
                        if(!data.alreadyVoted)
                        {
                          upvoteElement.classList.remove('btn-primary');
                          upvoteElement.classList.add('btn-success');
                          upvoteCountElement.textContent = parseInt(upvoteCountElement.textContent) + 1;
                          if(downvoteElement.classList.contains('btn-danger')) //byl klikniety downvote wczesniej
                          {
                            fetch('/remove_joke_from_disliked', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({ id })
                            })
                            .catch(error => {
                              console.error('Błąd podczas wysyłania danych:', error);
                            });

                            downvoteCountElement.textContent = parseInt(downvoteCountElement.textContent) - 1;
                            downvoteElement.classList.remove('btn-danger');
                            downvoteElement.classList.add('btn-primary');
                          }
                        }
                      })
                    });
                }
        
                if (downvoteElement) {
                    downvoteElement.addEventListener('click', function () {
                      sendVote(id, -1).then((data)=>{
                        if(!data.alreadyVoted)
                        {
                          downvoteElement.classList.remove('btn-primary');
                          downvoteElement.classList.add('btn-danger');
                          downvoteCountElement.textContent = parseInt(downvoteCountElement.textContent) + 1;
  
                          if(upvoteElement.classList.contains('btn-success')) //byl klikniety upvote wczesniej
                          {
                            console.log(JSON.stringify(id))
                            fetch('/remove_joke_from_liked', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({ id })
                            })
                            .catch(error => {
                              console.error('Błąd podczas wysyłania danych:', error);
                            });
                              
                            upvoteCountElement.textContent = parseInt(upvoteCountElement.textContent) - 1;
                            upvoteElement.classList.remove('btn-success');
                            upvoteElement.classList.add('btn-primary');
                            }                          
                          }  
                        })    
                    });
                }
              }
            });

          })})

      
    .catch((error) => {
      console.log('Error fetching jokes:', error)
    })
})
async function getJokeCount() {
  try {
      console.log('Fetching joke count...');
      const response = await fetch('/joke_count', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
      });

      const data = await response.json();
      maxJokeId = data.id;

      return maxJokeId;
  } catch (error) {
      console.error('Błąd podczas pobierania największego ID:', error);
  }
}

async function getLikedAndDislikedJokesList() {
  try {
      console.log('Fetching likes and dislikes...');
      const response = await fetch('/likes_dislikes_list', {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json'
          },
      });

      const data = await response.json();
      const likes = data.likes;
      const dislikes = data.dislikes;

      return {likes, dislikes}
  } catch (error) {
      console.error('Błąd podczas pobierania likes and dislikes:', error);
  }
}

async function sendVote(id, vote) {
  try{
    dane = {id, vote};
    console.log(JSON.stringify(dane))
  
    response = await fetch('/add_vote', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json' 
      },
      body: JSON.stringify(dane)
    })

    const data = await response.json();
    const alreadyVoted = data.alreadyVoted;
  
    return {alreadyVoted};
  }
  catch(error)
  {
    console.error('Błąd podczas wysyłania danych:', error);
  }
}

function showAddedComment(event, jokeId)
{
  event.preventDefault();

  const parent = event.target.parentNode;
  const last_comment = parent.parentNode.parentNode.previousSibling;
  for (const child of event.target.children) {
    if (child.tagName.toLowerCase() === 'textarea') {
      fetch('/getUserName')
      .then(response => response.json())
      .then(data => {
        console.log('Username:', data.username);
        
        const thisComment = document.createElement('div');
        thisComment.classList.add("comment");
        
        thisComment.innerHTML = createComment(data.username, child.value)
        last_comment.parentNode.insertBefore(thisComment, last_comment.nextSibling);
      })
      .then(()=>{
        child.value = '';
      })
      .catch(error => console.error('Błąd pobierania danych:', error));
      var comment = child.value
      
      fetch('/add_comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ jokeId, comment }),
        })
        .catch(error => {
            console.error('Wystąpił błąd:', error);
        });
      };
  }
}

function logout() {
  fetch('/logout', {
      method: 'POST',
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
  })
  .catch(error => console.error('Error:', error));
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

function showReportPopup() {
  document.getElementById('popup').style.display = 'block';
}

// Funkcja do ukrycia popupa
function hideReportPopup() {
  document.getElementById('popup').style.display = 'none';
}
// Dodaj obsługę kliknięcia do linku
document.getElementById('showPopup').addEventListener('click', function (e) {
  e.preventDefault();
  showPopup();
});



// Attach click event to trigger the popup
//document.getElementById('uglyFace1').addEventListener('click', openPopup);
// Follow page scroll
// window.onscroll = function () {
//   var popup = document.getElementById('popup');
//   if (popup.style.display === 'block') {
//       popup.style.top = window.pageYOffset + window.innerHeight / 2 + 'px';
//   }
// };
