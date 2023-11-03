const subscribedStudentsServices = require("../services/subscribeStudent");

async function subcribeToTeacher(req, res) {
  try {
    const createObject = {};
    createObject.teacher_id = req.body.teacher_id;
    createObject.student_id = req.userdata.user_id;
    createObject.teacher_approval = false;
    const whereOptions = {};
    await subscribedStudentsServices.subcribeToTeacher({
      createObject: createObject,
    });
    whereOptions.student_id = req.userdata.user_id;
    const details = await subscribedStudentsServices.getSubsription({
      whereOptions: whereOptions,
    });
    res.status(200).json({
      message: `You are subscribed`,
      subsciptions: details,
    });
  } catch (error) {
    console.log(error, "Internal error");
    res.status(500).json({
      message: `Internal Error`,
      error: error,
    });
  }
}


module.exports = {
  subcribeToTeacher,
};
