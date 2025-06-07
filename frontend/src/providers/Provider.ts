import simpleRestDataProvider from "@refinedev/simple-rest";

const BASE_URL = import.meta.env.VITE_APP_API_URL ? import.meta.env.VITE_APP_API_URL + '/api' : import.meta.env.VITE_APP_JSON_URL || 'http://localhost:5000';
const base = simpleRestDataProvider(BASE_URL);

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
  create: unwrapData(base.create),

  update: async (resource: string, params: { id: number }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { id, variables } = params;
    const formData = variables instanceof FormData ? variables : new FormData();

    if (!(variables instanceof FormData)) {
      for (const key in variables) {
        formData.append(key, variables[key]);
      }
    }

    formData.append("_method", "PUT");

    const response = await fetch(`${BASE_URL}/${resource}/${id}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    return {
      data: data.data ?? data,
    };
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

export default dataProvider;
