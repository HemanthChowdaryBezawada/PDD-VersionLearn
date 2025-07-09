const express = require('express');
const cors = require('cors');
const tracksRoute = require('./routes/track');
const chatRoutes = require('./routes/chat');
const teacherRoutes = require('./routes/teacher');

const app = express();

const port = parseInt(process.env.PORT) || process.argv[3] || 8080;

app.use(cors());
app.use(express.json());

app.use("/api/tracks", tracksRoute);
app.use("/api", chatRoutes);
app.use('/api/teachers', teacherRoutes);


app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
})