import AdminJS, { ListActionResponse, RecordActionResponse } from "adminjs";
import * as AdminJSMongoose from "@adminjs/mongoose";
import * as dotenv from "dotenv";
import AdminJSExpress from "@adminjs/express";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "./models/user";
import userResource from "./resources/userResource";
import orderResource from "./resources/orderResource";

dotenv.config();

AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

const start = async () => {
  const connection = await mongoose.connect(process.env.MongoDB);
  const app = express();

  const adminJs = new AdminJS({
    resources: [userResource, orderResource],
    databases: [connection],
    rootPath: "/admin",
  });


  const adminJsRouter = AdminJSExpress.buildAuthenticatedRouter(adminJs, {
    authenticate: async (email, password) => {
      const user = await User.findOne({
        email: email,
      });
      if (user) {
        const matched = await bcrypt.compare(password, user.password);
        if (matched) {
          return user;
        }
      }
      return false;
    },
    cookiePassword: process.env.COOKIE_SECRET,
    maxRetries: {
      count: 5,
      duration: 120,
    },
  });

  adminJs.watch();

  app.use(adminJs.options.rootPath, adminJsRouter);
  // app.use('/webhook', require('./routes/webhook'));

  app.listen(process.env.PORT, () => console.log(`AdminJS is running under localhost:${process.env.Port}/admin`));
};
start();