const express = require("express");
const teacherModel = require("../models/teacherModel");
const mongoose = require('mongoose');

let router = express.Router();

router.post("/", async (req, res) => {
  const teacher = req.body;
  const isExists = await teacherModel.findOne({ email: teacher.email });
  if (isExists) return res.status(200).send({ message: "Teacher Already Exists.." });
  const newTeacher = new teacherModel({
    name: teacher.name,
    email: teacher.email,
    mobile: teacher.mobile,
    gender: teacher.gender,
  });
  newTeacher.save()
    .then((data) => {
      console.log("DATA SAVED : ", data);
      return res.status(200).send({ message: "Teacher Data Saved.." });
    })
    .catch((e) => {
      return res.status(201).send({ message: "Error : ", e });
    });
});

router.get("/", (req, res) => {
  teacherModel.find()
    .then((data) => {
      if (data.length > 0) return res.send(data);
      else return res.send({ message: 'No Data Found' });
    })
    .catch((e) => {
      return res.send({ message: e });
    });
});



//Delete Student by Id
router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  const student = await teacherModel.findById(id);
  console.log(student);
  if (student) {
    teacherModel.deleteOne(student)
      .then(() => {
        return res.send({ message: "Student Deleted" });
      });
  } else {
    return res.send({ message: `Data Not Found For ID: ${id}` })
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.send('Not a Valid Id');
  const data = await teacherModel.findById(id);
  if (data) return res.send(data);
})

router.put('/:id', async (req, res) => {
  const _id = req.params.id;
  const name = req.body.name;
  const gender = req.body.gender;
  const email = req.body.email;
  const mobile = req.body.mobile;
  if (!mongoose.Types.ObjectId.isValid(_id)) return res.send('Not a Valid Id');
  const isExists = await teacherModel.findById(_id);
  if (isExists) {
    const update = await teacherModel.update({ _id }, { name, gender, email, mobile });
    if (update) return res.send({ message: "Student Data Updated.." });
  }
})


module.exports = router;
