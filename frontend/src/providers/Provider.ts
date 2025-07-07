import simpleRestDataProvider from "@refinedev/simple-rest";
import {axiosInstance} from "../utils/axios";

const BASE_URL = import.meta.env.VITE_APP_API_URL ? import.meta.env.VITE_APP_API_URL + '/api' : import.meta.env.VITE_APP_JSON_URL || 'http://localhost:5000';
const base = simpleRestDataProvider(BASE_URL, axiosInstance);

// eslint-disable-next-line @typescript-eslint/ban-types
function unwrapData(fn: Function) {
  return async (resource: any, params: any) => {
    const res = await fn(resource, params);
    const data = res.data.data ?? res.data;
    let total;

    if (typeof res.data.total === "number") {
      total = res.data.total;
    } else if (Array.isArray(res.data.data)) {
      total = res.data.data.length;
    } else if (Array.isArray(data)) {
      total = data.length;
    }

    return {
      ...res,
      data,
      total,
    };
  };
}

const dataProvider = {
  getList: unwrapData(base.getList),
  getOne: unwrapData(base.getOne),

  create: async (resource: any) => {
    try {
      const res = await base.create(resource);
      const data = res.data.data ?? res.data;

      return {
        ...res,
        data,
      };
    } catch (error) {
      handleHttpError(error);
    }
  },


  update: async (resource: any) => {
    try {
      let formData: FormData;

      if (resource.variables instanceof FormData) {
        formData = resource.variables;
      } else {
        formData = new FormData();
        if (typeof resource.variables === "object" && resource.variables !== null) {
          for (const key in resource.variables) {
            if (Object.prototype.hasOwnProperty.call(resource.variables, key)) {
              formData.append(key, resource.variables[key]);
            }
          }
        }
      }

      formData.append("_method", "PUT");

      const response = await axiosInstance.post(
          `/api/${resource?.resource}/${resource.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
      );

      const data = response.data;

      return {
        data: data.data ?? data,
      };
    } catch (error) {
      handleHttpError(error);
    }
  },


  deleteOne: unwrapData(base.deleteOne),

  forceDelete: async (resource: string, params: { id: number }) => {
    const url = `${BASE_URL}/${resource}/${params.id}/force-delete`;

    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Force delete failed");
    }

    const data = await response.json();

    return { data };
  },
};

function handleHttpError(error: any) {
  if (error?.response?.data?.errors) {
    throw {
      message: error?.response?.data?.message || "Có lỗi xảy ra",
      statusCode: error?.response?.status || 400,
      errors: error?.response?.data?.errors,
    };
  }
  throw error;
}

export default dataProvider;
