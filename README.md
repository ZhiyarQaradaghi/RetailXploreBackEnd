Steps to run the project:

1. Clone the repository
2. Run `npm install` to install the dependencies
3. Create a `.env` file with the following variables:
   ```
   PORT=3003
   MONGODB_URI=mongodb://localhost:27017
   CORS_ORIGIN=http://localhost:5173
   ```
   
4. Run `npm run init-db` to initialize the database
5. Run `npm run dev` to start the server
