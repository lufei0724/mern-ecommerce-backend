const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const api = supertest(app);

describe("Admin signup", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test("failed without username", async () => {
    const user = {
      email: "mattl@gmail.com",
      password: "mondayOne",
    };

    await api
      .post("/api/admin/signup")
      .send(user)
      .expect(400, { error: "Name is required." });
  });

  test("failed without email", async () => {
    const user = {
      username: "mattl",
      password: "mondayOne",
    };

    await api
      .post("/api/admin/signup")
      .send(user)
      .expect(400, { error: "Email is required." });
  });

  test("failed with invalid email adress", async () => {
    const user = {
      username: "mattl",
      email: "aaa",
      password: "mondayOne",
    };

    await api
      .post("/api/admin/signup")
      .send(user)
      .expect(400, { error: "Email is invalid." });
  });

  test("failed without password", async () => {
    const user = {
      username: "mattl",
      email: "mattl@gmail.com",
    };

    await api
      .post("/api/admin/signup")
      .send(user)
      .expect(400, { error: "Password is required." });
  });

  test("failed with existing email", async () => {
    const hashPassword = await bcrypt.hash("mondayOne", 10);
    const user = new User({
      username: "peterm",
      email: "peterm@gmail.com",
      hashPassword,
    });

    await user.save();

    const signupUser = {
      username: "mattl",
      email: "peterm@gmail.com",
      password: "mondayOne",
    };

    await api
      .post("/api/admin/signup")
      .send(signupUser)
      .expect(400, { error: "Email is already in use." });
  });

  test("failed with password less than 6 characters", async () => {
    const user = {
      username: "mattl",
      email: "mattl@gmail.com",
      password: "monda",
    };

    await api
      .post("/api/admin/signup")
      .send(user)
      .expect(400, { error: "Password must be at least 6 characters." });
  });

  test("succeed with correct info", async () => {
    const user = {
      username: "mattl",
      email: "mattl@gmail.com",
      password: "mondayOne",
    };

    await api
      .post("/api/admin/signup")
      .send(user)
      .expect(200)
      .expect((res) => {
        res.body = {
          email: res.body.email,
          role: res.body.role,
        };
      })
      .expect({ email: "mattl@gmail.com", role: "admin" });
  });
  afterAll(() => {
    mongoose.connection.close();
  });
});
