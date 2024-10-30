import request from "supertest";
import express from "express";
import router from "./post.routes.js";
import { upload } from "../utils/multer.util.js";
import { POST_ATTACHMENTS_FIELD } from "../constants/common.constants.js";

const app = express();
app.use(express.json());
app.use("/posts", router);

jest.mock("../controllers/post.controller.js", () => ({
  getAllUserPosts: jest.fn((req, res) =>
    res.status(200).send("getAllUserPosts")
  ),
  getPostByPostId: jest.fn((req, res) =>
    res.status(200).send("getPostByPostId")
  ),
  addPost: jest.fn((req, res) => res.status(201).send("addPost")),
  deletePost: jest.fn((req, res) => res.status(200).send("deletePost")),
  getLatestPostForFeeds: jest.fn((req, res) =>
    res.status(200).send("getLatestPostForFeeds")
  ),
  likePost: jest.fn((req, res) => res.status(200).send("likePost")),
  unlikePost: jest.fn((req, res) => res.status(200).send("unlikePost")),
  sharePost: jest.fn((req, res) => res.status(200).send("sharePost")),
}));

describe("Post Routes", () => {
  it("should get all user posts", async () => {
    const res = await request(app).get("/posts");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("getAllUserPosts");
  });

  it("should get the latest post for feeds", async () => {
    const res = await request(app).get("/posts/newsfeed");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("getLatestPostForFeeds");
  });

  it("should get a post by postId", async () => {
    const res = await request(app).get("/posts/123");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("getPostByPostId");
  });

  it("should delete a post by postId", async () => {
    const res = await request(app).delete("/posts/123");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("deletePost");
  });

  it("should like a post", async () => {
    const res = await request(app).post("/posts/123/like");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("likePost");
  });

  it("should unlike a post", async () => {
    const res = await request(app).post("/posts/123/unlike");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("unlikePost");
  });

  it("should share a post", async () => {
    const res = await request(app).post("/posts/123/share");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual("sharePost");
  });
});
