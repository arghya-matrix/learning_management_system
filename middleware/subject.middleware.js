const subjectServices = require("../services/subject.services");

async function validateSubject(req, res, next) {
  if (!req.body.Name) {
    res.status(403).json({
      message: `Subject Name is required to add in list`,
    });
    return;
  }
  if (!req.body.grade) {
    res.status(403).json({
      message: `Enter grade to which the subject belongs`,
    });
    return;
  }
  const whereOptions = {};
  whereOptions.Name = req.body.Name;
 
  const subject = await subjectServices.getSubject({
    whereOptions: whereOptions,
  });
  if (subject.count > 0) {
    res.status(409).json({
      message: `Subject already added`,
      subject: subject.rows,
    });
    return;
  }
  next();
}

module.exports = {
  validateSubject,
};
