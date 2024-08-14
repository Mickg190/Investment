

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

const users = [];

app.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const user = users.find((user) => user.username === username);
	if (!user || !(await bcrypt.compare(password, user.password))) {
		return res.status(401).send('Invalid username or password');
	}
	const token = jwt.sign({ username }, 'secretkey');
	res.send({ token });
});

app.post('/signup', async (req, res) => {
	const { username, password } = req.body;
	if (users.find((user) => user.username === username)) {
		return res.status(400).send('Username already taken');
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	users.push({ username, password: hashedPassword });
	res.send('Signup successful');
});

app.listen(3000, () => {
	console.log('Server listening on port 3000');
});
