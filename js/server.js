const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;  
const viewsPath = path.join(__dirname, '../views');
const dirPath = path.join(__dirname, '../');
const usersFilePath = path.join(__dirname, '../data/users.json');
const jokesFilePath = path.join(__dirname, '../data/jokes.json');

app.use(morgan('dev')); // Dodaj express-session-logger
app.use(
    session({
        secret: 'supersekretnyklucz',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false, // Ustaw na true, jeśli korzystasz z HTTPS
            maxAge: 86400000, // Długość ważności ciasteczka w milisekundach (24 godziny)
        },
    })
);

app.use(express.json());

app.use(express.static(dirPath));
app.use(express.static(viewsPath));
app.use(bodyParser.urlencoded({ extended: true }));

const usersDatabase = [];

app.use((err, req, res, next) => {
    console.error(err.stack);
    next(err);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(viewsPath, 'index.html'));
});

app.post('/register', (req, res) => {
    const { fullname, email, username, password } = req.body;

    let users = [];
    try {
        const usersData = fs.readFileSync(usersFilePath, 'utf8'); //czytaj dane z pliku json
        users = JSON.parse(usersData);
    } catch (error) {
        console.error('Błąd odczytu danych użytkowników:', error.message);
    }

    const existingUserEmail = users.find((user) => user.email === email);
    if (existingUserEmail) {
        return res.send('Użytkownik o podanym adresie e-mail już istnieje.');
    }

    const existingUserName = users.find((user) => user.username === username);
    if (existingUserName) {
        return res.send('Użytkownik o podanej nazwie uzytkownika już istnieje.');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    users.push({ fullname, email, username, password: hashedPassword, liked_jokes: [], disliked_jokes: [] }); //dodaj usera
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8'); //zapisz dane do pliku

    res.sendFile(path.join(viewsPath, 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    let users = [];
    try {
        const usersData = fs.readFileSync(usersFilePath, 'utf8'); //czytaj dane z pliku json
        users = JSON.parse(usersData);
    } catch (error) {
        console.error('Błąd odczytu danych użytkowników:', error.message);
    }

    const user = users.find((user) => user.username === username); //sprawdz czy user istnieje
    console.log("Zalogowano: ", user);
    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = { email: user.email, username: user.username }; //logowanie udane - ustaw sesję
        req.session.isLoggedIn = true;
        console.log("Ustanowiono sesje: ", req.session);
        //res.sendFile('/index_registered.html');
        res.redirect('index_registered.html');
    } else {
        res.send('Błędny login lub hasło.');
    }
});

app.post('/logout', (req, res) => {
    console.log('logged out');
    req.session.destroy((err) => {
        if (err) {
            console.error('Błąd podczas zamykania sesji:', err);
        } else {
            res.redirect('/login'); // Przekierowanie po wylogowaniu
        }
    });
});

app.post('/add_joke', (req, res) => {
    const { jokeText } = req.body;

    let jokes = [];
    try {
        const jokesData = fs.readFileSync(jokesFilePath, 'utf8'); //czytaj dane z pliku json
        jokes = JSON.parse(jokesData);
    } catch (error) {
        console.error('Błąd odczytu danych zartow:', error.message);
    }
    
    const newJoke = {
        id: jokes[jokes.length - 1].id + 1,
        joke: jokeText,
        author: req.session.user.username,
        comments: [],
        likes: 0,
        dislikes:0
    };
    //mozna dodac jakies basicowe rozpoznawanie czy danego zartu jeszcze nie bylo

    jokes.push(newJoke);
    fs.writeFileSync(jokesFilePath, JSON.stringify(jokes, null, 2), 'utf8'); //zapisz dane do pliku

    //res.sendFile('/index_registered.html');
    res.sendFile(path.join(viewsPath, 'index_registered.html'));
});

app.get('/likes_dislikes_list', (req, res) => {
    const username = req.session.user.username;

    try {
        const usersData = fs.readFileSync(usersFilePath, 'utf8');
        users = JSON.parse(usersData);
    } catch (error) {
        return res.status(500).json({ error: 'Wystąpił błąd odczytu danych użytkowników' });
    }

    const sender = users.find(j => j.username === username);

    try{
        const likes = sender.liked_jokes;
        const dislikes = sender.disliked_jokes;
        res.json({ likes, dislikes });
    } catch (error) {
        return res.status(500).json({ error: 'Wystąpił błąd odczytu danych aktywnego uzytkownika' });
    }

    res.end();
});

app.post('/changeEmail', (req, res) => {
    const { newEmail } = req.body;
    const username = req.session.user.username;
    
    let users = [];
    try {
        const usersData = fs.readFileSync(usersFilePath, 'utf8');
        users = JSON.parse(usersData);
    } catch (error) {
        console.error('Błąd odczytu danych użytkowników:', error.message);
    }
    
    const user = users.find(user => user.username === username);
    user.email = newEmail;

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    res.send('Email changed successfully!');
});

app.post('/changePassword', (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const username = req.session.user.username;
    console.log('hasla: ', req.body);
    let users = [];
    try {
        const usersData = fs.readFileSync(usersFilePath, 'utf8');
        users = JSON.parse(usersData);
    } catch (error) {
        console.error('Błąd odczytu danych użytkowników:', error.message);
    }
    
    const user = users.find((user) => user.username === username);
    if (user && bcrypt.compareSync(currentPassword, user.password)) {
        const hashedPassword = bcrypt.hashSync(newPassword, 10);
        user.password = hashedPassword;

        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
        res.send('Password changed successfully!');
    } else {
        res.send('Current password is incorrect!');
    }
});


app.post('/remove_joke_from_liked', (req, res) => {
    const { id } = req.body;
    const username = req.session.user.username;

    let users = []
    try {
        const usersData = fs.readFileSync(usersFilePath, 'utf8');
        users = JSON.parse(usersData);
    } catch (error) {
        return res.status(500).json({ error: 'Wystąpił błąd odczytu danych użytkowników' });
    }

    let jokes = [];
    try {
        const jokesData = fs.readFileSync(jokesFilePath, 'utf8');
        jokes = JSON.parse(jokesData);
    } catch (error) {
        console.error('Błąd odczytu danych zartow:', error.message);
        return res.status(500).json({ error: 'Wystąpił błąd odczytu danych zartów' });
    }

    const sender = users.find(j => j.username === username);
    const joke = jokes.find(j => j.id === id);

    //console.log("sender: ", sender);
    if(sender)
    {
        var indexToRemove = sender.liked_jokes.indexOf(id);
        if (indexToRemove !== -1) {
            sender.liked_jokes.splice(indexToRemove, 1);
            joke.likes -= 1;
        }
        //console.log('Server: Usunieto zart z lubianych: id=', id);
    }

    res.end();
    
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    fs.writeFileSync(jokesFilePath, JSON.stringify(jokes, null, 2), 'utf8');
});

app.post('/remove_joke_from_disliked', (req, res) => {
    const { id } = req.body;
    const username = req.session.user.username;

    let users = [];
    try {
        const usersData = fs.readFileSync(usersFilePath, 'utf8');
        users = JSON.parse(usersData);
    } catch (error) {
        return res.status(500).json({ error: 'Wystąpił błąd odczytu danych użytkowników' });
    }

    let jokes = [];
    try {
        const jokesData = fs.readFileSync(jokesFilePath, 'utf8');
        jokes = JSON.parse(jokesData);
    } catch (error) {
        return res.status(500).json({ error: 'Wystąpił błąd odczytu danych zartów' });
    }

    const sender = users.find(j => j.username === username);
    const joke = jokes.find(j => j.id === id);

    if(sender)
    {
        var indexToRemove = sender.disliked_jokes.indexOf(id);
        if (indexToRemove !== -1) {
            sender.disliked_jokes.splice(indexToRemove, 1);
            joke.dislikes -= 1;
        }
        //console.log('Server: Usunieto zart z nielubianych: id=', id);
    }
    
    res.end();

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
    fs.writeFileSync(jokesFilePath, JSON.stringify(jokes, null, 2), 'utf8');
});

app.get('/joke_count', (req, res) => {
    try {
        const jokesData = fs.readFileSync(jokesFilePath, 'utf8');
        const jokes = JSON.parse(jokesData);

        const najwiekszeId = jokes.length > 0 ? jokes[jokes.length - 1].id : 0;

        res.json({ id: najwiekszeId });
    } catch (error) {
        res.status(500).json({ error: 'Wystąpił błąd podczas przetwarzania żądania' });
    }
});

app.post('/add_vote', (req, res) => {
    const { id, vote } = req.body;
    const username = req.session.user.username;

   // console.log("add vote:", id, vote, username, req.session, req.session.user);

    let jokes = [];
    try {
        const jokesData = fs.readFileSync(jokesFilePath, 'utf8');
        jokes = JSON.parse(jokesData);
    } catch (error) {
        return res.status(500).json({ error: 'Wystąpił błąd podczas odczytu zartów' });
    }
    
    let users = [];
    try {
        const usersData = fs.readFileSync(usersFilePath, 'utf8');
        users = JSON.parse(usersData);
    } catch (error) {
        return res.status(500).json({ error: 'Wystąpił błąd podczas odczytu użytkowników' });
    }

    const joke = jokes.find(j => j.id === id);
    const sender = users.find(j => j.username === username);
    var result = false;

    if(vote == 1)
    {
        if(sender.liked_jokes.includes(id))
            result = true;
        else
        {
            sender.liked_jokes.push(id);
            joke.likes += 1;
    
            //console.log(`Użytkownik ${sender.username} upvotowal żart o ID ${id}`);
        }
    }
    else
    {
        if(sender.disliked_jokes.includes(id))
            result = true;
        else
        {
            sender.disliked_jokes.push(id);
        joke.dislikes += 1;

        //console.log(`Użytkownik ${sender.username} downvotowal żart o ID ${id}`);
        }
    }

    fs.writeFileSync(jokesFilePath, JSON.stringify(jokes, null, 2), 'utf8');
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');

    res.json({alreadyVoted: result})
    //res.redirect('/index_registered.html');
});


app.post('/add_comment', (req, res) => {
    const { jokeId, comment } = req.body;
    const username = req.session.user.username;
    //console.log("DODAWANIE KOMENTAZRZA ID", jokeId);
    let jokes = [];
    try {
        const jokesData = fs.readFileSync(jokesFilePath, 'utf8');
        jokes = JSON.parse(jokesData);
    } catch (error) {
        console.error('Błąd odczytu danych zartow:', error.message);
    }

    const joke = jokes.find(j => j.id === jokeId);
    const newComment = { author: username, text: comment };
    joke.comments.push(newComment); 

    fs.writeFileSync(jokesFilePath, JSON.stringify(jokes, null, 2), 'utf8');
    res.end();
    //res.redirect(req.get('referer'));
    //res.send('/index_registered.html'); //zrobic bez tego i zeby sie dodalo od razzu
    //res.sendFile(path.join(viewsPath, 'index_registered.html'));
    //res.redirect('/index_registered.html');
});


app.get('/getUserName', (req, res) => {
    const username = req.session.user.username;
    console.log("Getusername: ", username)
    res.json({ username });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});