import express from 'express';
import publicRoutes from "./routes/public.ts";
import privateRoutes from "./routes/private.ts";

const app = express();

app.use(express.json())
app.use('/', publicRoutes)
app.use('/', privateRoutes)

app.listen(3000, () => {
    console.log('🔥 Server is running on port 3000');
});

export default app