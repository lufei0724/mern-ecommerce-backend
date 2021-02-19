const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { TestScheduler } = require("jest");

const api = supertest(app);

describe("when there is initially one user in DB", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const hashPassword = await bcrypt.hash("mondayOne", 10);
    const user = new User({
      username: "peterm",
      email: "peterm@gmail.com",
      hashPassword,
    });

    await user.save();
  });

  test("sign in failed without email", async () => {
    const loginUser = {
      password: "mondayOne",
    };

    await api
      .post("/api/signin")
      .send(loginUser)
      .expect(400, { error: "Email is required." });
  });

  test("sign in failed with incorrect email", async () => {
    const loginUser = {
      email: "aaa",
      password: "mondayOne",
    };

    await api
      .post("/api/signin")
      .send(loginUser)
      .expect(400, { error: "Email is not found." });
  });

  test("sign in failed without password", async () => {
    const loginUser = {
      email: "peterm@gmail.com",
    };

    await api
      .post("/api/signin")
      .send(loginUser)
      .expect(400, { error: "Password is required." });
  });

  test("sign in failed with incorrect password", async () => {
    const loginUser = {
      email: "peterm@gmail.com",
      password: "monday",
    };

    await api
      .post("/api/signin")
      .send(loginUser)
      .expect(400, { error: "Password is not correct." });
  });

  test("sign in succeed with correct email and password", async () => {
    const loginUser = {
      email: "peterm@gmail.com",
      password: "mondayOne",
    };

    await api
      .post("/api/signin")
      .send(loginUser)
      .expect(200)
      .expect((res) => {
        res.body = {
          email: res.body.email,
        };
      })
      .expect({ email: "peterm@gmail.com" });
  });
  afterAll(() => {
    mongoose.connection.close();
  });
});
