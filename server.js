require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const UserSchema = new mongoose.Schema({ name: String, email: String, password: String });
const User = mongoose.model('User', UserSchema);

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.json({ success: false, message: 'User already exists!' });

    await new User({ name, email, password }).save();
    res.json({ success: true, message: 'Signup Successful!' });
});

app.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email, password: req.body.password });
    res.json(user ? { success: true, message: 'Login Successful!' } : { success: false, message: 'Invalid Credentials' });
});

app.listen(5000, () => console.log(`Server running on port 5000`));
