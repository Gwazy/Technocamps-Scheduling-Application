const status = require("http-status");

const { Course } = require("../models");
const courseModel = Course;
const has = require("has-keys");

module.exports = {
  async getCourseById(req, res) {
    if (!has(req.params, "id"))
      throw { code: status.BAD_REQUEST, message: "You must specify the id" };

    let { id } = req.params;

    let data = await courseModel.findOne({ where: { id } });

    if (!data) throw { code: status.BAD_REQUEST, message: "Course not found" };

    res.json({ status: true, message: "Returning course", data });
  },
  async getCourses(req, res) {
    let data = await courseModel.findAll();

    res.json({ status: true, message: "Returning courses", data });
  },
  async newCourse(req, res) {
    if (!req.body.name || !req.body.capacity)
      throw {
        code: status.BAD_REQUEST,
        message: "Need params 'name' and 'capacity'",
      };
    let { name, capacity } = req.body;
    await courseModel.create({ name, capacity });

    res.json({ status: true, message: "Successfully created course" });
  },
  async updateCourse(req, res) {
    if (!req.body.id || !req.body.name || !req.body.capacity)
      throw {
        code: status.BAD_REQUEST,
        message: "You must specify the id, name and capacity",
      };
    let { id, name, capacity } = req.body;

    await courseModel.updateCourse({ name, capacity }, { where: { id } });
    res.json({ status: true, message: "Course updated" });
  },
  async deleteCourse(req, res) {
    if (!has(req.params, "id"))
      throw { code: status.BAD_REQUEST, message: "You must specify the id" };

    let { id } = req.params;

    await courseModel.destory({ where: { id } });

    res.json({ status: true, message: "Course deleted" });
  },
};
