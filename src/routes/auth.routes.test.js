import request from "supertest";
import express from "express";
import router from "./auth.routes.js";

const app = express();
app.use(express.json());
app.use("/users", router);

jest.mock("../controllers/auth.controller.js", () => ({
  loginUser: jest.fn((req, res) => res.status(200).send("loginUser")),
}));

describe("Auth Routes", () => {
  it("should login user", async () => {
    const res = await request(app)
      .post("/users/login")
      .send({ username: "test", password: "test" });
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("loginUser");
  });
});
