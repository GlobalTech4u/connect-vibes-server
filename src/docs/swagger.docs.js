import swaggerJsdoc from "swagger-jsdoc";

import userSchema from "../schemas/user.schemas.json" assert { type: "json" };
import postSchema from "../schemas/post.schemas.json" assert { type: "json" };
import followerSchema from "../schemas/follower.schemas.json" assert { type: "json" };
import pictureSchema from "../schemas/picture.schemas.json" assert { type: "json" };
import likeSchema from "../schemas/like.schemas.json" assert { type: "json" };
import attachmentSchema from "../schemas/attachment.schemas.json" assert { type: "json" };

const SERVER_APP_URL = process.env.SERVER_APP_URL;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Connect Vibes APIs",
      version: "1.0.0",
    },
    servers: [
      {
        url: SERVER_APP_URL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Attachment: attachmentSchema,
        Follower: followerSchema,
        Like: likeSchema,
        Picture: pictureSchema,
        Post: postSchema,
        User: userSchema,
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/controllers/*.js"],
};

const swaggerDocument = swaggerJsdoc(options);

const swaggerUIOptions = {
  swaggerOptions: {
    validatorUrl: null,
  },
};

export { swaggerDocument, swaggerUIOptions };
