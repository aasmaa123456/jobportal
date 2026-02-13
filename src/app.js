import express from 'express';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Controllers
import userRoutes from './routes/user.routes.js';//crud
import jobRoutes from './routes/job.routes.js';//crud

const app = express();

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true })); // Body parser for form data
app.use(express.json());//api requests
app.use(cookieParser());//cookies
app.use(session({
    secret: 'supersecretkey', // In prod, use environment variable
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Global Context Middleware (for EJS)
import { setLastVisit } from './middlewares/last-visit.middleware.js';
app.use(setLastVisit);
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;//user available in all ejs files
    next();
});

// Routes
app.use('/', userRoutes);
app.use('/jobs', jobRoutes);

app.get('/', (req, res) => {
    res.render('landing', { title: 'Welcome to JobPortal' });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
