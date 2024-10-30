import request from "supertest";
import express from "express";
import router from "./user.routes.js";

const app = express();
app.use(express.json());
app.use("/users", router);

jest.mock("../controllers/user.controller.js", () => ({
  getAllUsers: jest.fn((req, res) => res.status(200).send("getAllUsers")),
  getUserById: jest.fn((req, res) => res.status(200).send("getUserById")),
  getFollowers: jest.fn((req, res) => res.status(200).send("getFollowers")),
  getFollowings: jest.fn((req, res) => res.status(200).send("getFollowings")),
  getUsersBySearch: jest.fn((req, res) =>
    res.status(200).send("getUsersBySearch")
  ),
  updateUserById: jest.fn((req, res) => res.status(201).send("updateUserById")),
  followUser: jest.fn((req, res) => res.status(200).send("followUser")),
  unfollowUser: jest.fn((req, res) => res.status(200).send("unfollowUser")),
  addUser: jest.fn((req, res) => res.status(201).send("addUser")),
}));

describe("User Routes", () => {
  it("should get all users", async () => {
    const res = await request(app).get("/users");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("getAllUsers");
  });

  it("should get the user by id", async () => {
    const res = await request(app).get("/users/123");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("getUserById");
  });

  it("should get the followers by userId", async () => {
    const res = await request(app).get("/users/123/followers");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("getFollowers");
  });

  it("should get the followings by userId", async () => {
    const res = await request(app).get("/users/123/followings");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("getFollowings");
  });

  it("should get the users by search keyword", async () => {
    const res = await request(app).get("/users/search/test");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("getUsersBySearch");
  });
});
