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


  deleteOne: async (resource: any, params: { id: number }) => {
    try {
      const response = await axiosInstance.delete(
          `/api/${resource?.resource}/${resource.id}`,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
      );
      return response.data;
    } catch (error) {
      handleHttpError(error);
    }
  },

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
  const defaultMessage = "Có lỗi xảy ra";
  const defaultStatusCode = 400;

  if (error?.response?.data) {
    const { message, errors } = error.response.data;

    // Normalize the error message
    let errorMessage = message || defaultMessage;

    // Handle cases where errors is an array
    if (errors) {
      if (Array.isArray(errors)) {
        // If errors is an array, extract messages
        if (errors.length > 0) {
          errorMessage = errors
              .map((err: any) => {
                if (typeof err === "string") return err;
                if (typeof err === "object" && err.message) return err.message;
                return JSON.stringify(err); // Fallback for unknown error formats
              })
              .join(", ");
        }
      } else if (typeof errors === "string") {
        errorMessage = errors;
      }
    }

    throw {
      message: errorMessage,
      statusCode: error?.response?.status || defaultStatusCode,
      errors: errors || undefined,
    };
  }

  throw {
    message: defaultMessage,
    statusCode: defaultStatusCode,
    errors: undefined,
  };
}

export default dataProvider;
