import app from './app';
import { connectToDatabase } from './config/database';

const PORT = process.env.PORT || 8000;

async function startServer() {
	try {
		await connectToDatabase();
		console.log('Connected to database');

		app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
		});
	} catch (err) {
		console.error('Error starting server:', err);
		process.exit(1);
	}
}

startServer();