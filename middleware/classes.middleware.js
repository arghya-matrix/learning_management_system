async function classesValidation(req, res, next) {
  const timeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] [apAP][mM]$/;
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

  if (!req.body.subject_id) {
    res.status(403).json({
      message: `Subject Id required`,
    });
    return;
  }
  if (!req.body.teacher && req.userdata.type !== "Teacher") {
    res.status(403).json({
      message: `Teacher id is required`,
    });
    return;
  }
  if (!req.body.total_students || req.body.total_students <= 0) {
    res.status(403).json({
      message: `Total Students field can not be empty or must be greater than zero`,
    });
    return;
  }
  if (!req.body.time || !req.body.date) {
    res.status(403).json({
      message: `Date and time field is required to create class`,
    });
  }
  if (req.body.date && req.body.time) {
    const dateString = req.body.date;
    const timeString = req.body.time;
    if (dateRegex.test(dateString) && timeRegex.test(timeString)) {
      console.log("Valid date format.");
      next();
    } else {
      res.status(403).json({
        message: `Invalid date or time format`,
      });
      return;
    }
  }
  if(!req.body.grade){
    res.status(403).json({
      message:`Grade required to add class`
    })
  }
}

module.exports = { classesValidation };
