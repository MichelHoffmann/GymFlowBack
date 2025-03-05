import express from 'express';
import publicRoutes from "./routes/public.js";

const app = express();

app.use(express.json())
app.use('/', publicRoutes)

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

export default app