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
    let data = await courseModel.findAll({ order: ["id"] });

    res.json({ status: true, message: "Returning courses", data });
  },
  async newCourse(req, res) {
    if (!req.body.name || !req.body.capacity || !req.body.description)
      throw {
        code: status.BAD_REQUEST,
        message: "Need params 'name' and 'capacity' and 'description'",
      };
    let { name, capacity, visability, description } = req.body;
    await courseModel.create({ name, description, capacity, visability });

    res.json({ status: true, message: "Successfully created course" });
  },
  async updateCourse(req, res) {
    if (!req.body.id)
      throw { code: status.BAD_REQUEST, message: "You must specify the id" };

    let { id, name, description, capacity, visability } = req.body;
    await courseModel
      .update({ name, description, capacity, visability }, { where: { id } })
      .then(res.json({ status: true, message: "Course updated" }))
      .catch((err) => res.json(err));
  },
  async deleteCourse(req, res) {
    if (!has(req.params, "id"))
      throw { code: status.BAD_REQUEST, message: "You must specify the id" };

    let { id } = req.params;

    await courseModel.destroy({ where: { id } });

    res.json({ status: true, message: "Course deleted" });
  },
};
