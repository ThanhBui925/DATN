import simpleRestDataProvider from "@refinedev/simple-rest";

const base = simpleRestDataProvider("http://localhost:8000/api");
const BASE_URL = "http://localhost:8000/api";

function unwrapData(fn: Function) {
  return async (resource: any, params: any) => {
    const res = await fn(resource, params);

    // Lấy data thực sự
    const data = res.data.data ?? res.data;

    // Tính tổng số bản ghi (total)
    let total;
    if (typeof res.data.total === "number") {
      total = res.data.total;
    } else if (Array.isArray(res.data.data)) {
      total = res.data.data.length;
    } else if (Array.isArray(data)) {
      total = data.length;
    } else {
      total = undefined; // hoặc 0 nếu bạn muốn mặc định
    }

    return {
      ...res,
      data,
      total,
    };
  };
}

// Thêm method forceDelete để gọi API custom xóa vĩnh viễn
const forceDelete = async (resource: string, params: { id: number }) => {
  const url = `http://localhost:8000/api/${resource}/${params.id}/force-delete`;

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // Thêm token nếu có: Authorization
    },
  });

  const data = await response.json();

  return {
    data: data.data ?? data,
  };
};


const dataProvider = {
  getList: unwrapData(base.getList),
  getOne: unwrapData(base.getOne),
  create: unwrapData(base.create),
  update: unwrapData(base.update),
  // các method khác như getList, getOne ...

  deleteOne: unwrapData(base.deleteOne),  // xóa mềm

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
