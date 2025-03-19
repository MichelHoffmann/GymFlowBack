import express from 'express';
import publicRoutes from "./routes/public.ts";
import privateRoutes from "./routes/private.ts";
import cors from 'cors'

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json())
app.use(cors())
app.use('/', publicRoutes)
app.use('/', privateRoutes)

app.listen(PORT, () => {
  console.log("🔥 Server is running on port 3000");
});

export default app
