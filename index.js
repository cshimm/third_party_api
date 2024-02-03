import express from 'express'

const app = express();
const port = process.env.PORT || 3000
app.set('view engine', 'ejs');
app.set('port', port);
app.get('/', (req, res) => {
    try {
        res.type('text/html');
        res.status(200);
        fetchFeaturedGames()
            .then(data => {
                return res.render('home', {data});
            })
            .catch(e => {
                return res.type('text/plain').status(e.status).send(e);
            });
    } catch (e) {
        res.type('text/plain');
        return res.status(500).send(e);
    }
});
app.get('/profile/:steamid', (req, res) => {
    try {
        res.type('text/html');
        res.status(200);
        fetchSteamProfile(req.params.steamid)
            .then(data => {
                if (!data) return res.type('text/plain').status(404).send('Error fetching profile');
                return res.render('profile', {data});
            })
            .catch(e => console.error(e));
    } catch (e) {
        res.type('text/plain');
        return res.status(500).send(e);
    }
});
app.use((req, res) => {
    return res.status(404).send('404 Not found');
});
const profileEndpoint = (id) => `https://steamcommunity.com/miniprofile/${id}/json/`
const fetchSteamProfile = async (steamid) => {
    const response = await fetch(profileEndpoint(steamid));
    const responseData = await response.json();
    return response.ok ?
        responseData :
        console.error(`Error fetching resource: ${response.status}`, responseData);
}
const featuredEndpoint = 'https://store.steampowered.com/api/featured'
const fetchFeaturedGames = async () => {
    const response = await fetch(featuredEndpoint);
    const responseData = await response.json();
    return response.ok ?
        responseData :
        console.error(`Error fetching resource: ${response.status}`, responseData);
}
app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});