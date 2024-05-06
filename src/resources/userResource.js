import User from "../models/user";
import bcrypt from "bcrypt";

const canEdit = ({ currentAdmin, record }) => {
  return currentAdmin && (
    currentAdmin.role === 'admin'
    || currentAdmin._id === record.param('_id')
  )
}

const userResource = {
  resource: User,
  options: {
    parent: {
      icon: "User",
    },
    properties: {
      password: { isVisible: { edit: true, show: false, list: false, filter: false, } },
    },
    actions: {
      new: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === "admin",
        before: async (request) => {
          if (request.payload?.password) {
            request.payload.password = await bcrypt.hash(
              request.payload.password,
              10
            );
          }
          return request;
        },
      },
      show: {
        after: async (response) => {
          response.record.params.password = "";
          return response;
        },
      },
      edit: {
        isAccessible: canEdit,
        before: async (request) => {
          if (request.method === "post") {
            if (request.payload?.password) {
              request.payload.password = await bcrypt.hash(
                request.payload.password,
                10
              );
            } else {
              delete request.payload?.password;
            }
          }
          return request;
        },
        after: async (response) => {
          response.record.params.password = "";
          return response;
        },
      },
      delete: {
        isAccessible: ({ currentAdmin }) => currentAdmin.role === "admin",
      },
      list: {
        after: async (response) => {
          response.records.forEach((record) => {
            record.params.password = "";
          });
          return response;
        },
      },
    },
  },
};

export default userResource;