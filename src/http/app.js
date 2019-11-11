'use strict';

exports.name = 'http.app';

exports.requires = [
	'@dotenv',
	'@express',
	'@path',
	'@express-session',
	'@cookie-parser',
	'@morgan',
	'@body-parser',
	'@cors',
	'@helmet',
	'@http-errors',	
	'services.connection',
	'middlewares.errors-handle',
	'routes.index',
	'routes.auth',
	'routes.phonebooks'
];

exports.factory = function (
	env,
	express,
	path,
	session,
	cookieParser,
	logger,
	bodyParser,
	cors,
	helmet,
	createError,
	connecter,
	midErrorsHandle,
	indexRouter,
	authRouter,
	phonebooksRouter) {	
		
	connecter.connect();

	const app = express();
	app.use(logger('combined'));
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(session({
		secret: process.env.SESSION_KEY,
		cookie: { maxAge: 60000 * 30 },
		saveUninitialized: true,
		resave: true
	}));
	app.use(express.static('./public'));

	// Set view engine.
	app.set('views', path.join(path.resolve(__dirname, '../..'), 'views'));
	app.set('view engine', 'pug');

	// Using bodyParser to parse JSON bodies into JS objects
	app.use(bodyParser.urlencoded({ extended: true }));

	// CORS.	
	app.use(cors());

	// Adding Helmet to enhance your API's security
	app.use(helmet());

	// Register routers.
	app.use('/', indexRouter);
	app.use('/auth/', authRouter);
	app.use('/', phonebooksRouter);

	// Catch 404 and forward to error handler
	app.use(function (req, res, next) {
		next(createError(404));
	});

	// Handle errors
	app.use(midErrorsHandle);

	return app;
};
