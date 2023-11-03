const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
const userRouter = require("./router/user.router");
const subjectRouter = require("./router/subject.router");
const classRouter = require("./router/class.router");
const assignedTeacherRouter = require("./router/assignedTeacher.router")
const { sequelize } = require("./models/index");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`ip: ${req.ip}, method: ${req.method}, path: ${req.path}`);
  next();
});
app.use("/user", userRouter);
app.use("/subject", subjectRouter);
app.use("/class", classRouter);
app.use("/teacher", assignedTeacherRouter)

app.listen(port, async () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log(`Database Connected!!!!`);
      sequelize.sync({ alter: true });
    })
    .catch((err) => {
      console.log("Error database: -> ", err);
    });

  console.log(`Server starter at ${port}`);
});
