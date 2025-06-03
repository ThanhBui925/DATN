import simpleRestDataProvider from "@refinedev/simple-rest";

const base = simpleRestDataProvider("http://localhost:8000/api");

function unwrapData(fn: Function) {
  return async (resource: any, params: any) => {
    const res = await fn(resource, params);
    return {
      ...res,
      data: res.data.data ?? res.data, // lấy data bên trong data nếu có, hoặc lấy luôn res.data
      total: res.data.total ?? (Array.isArray(res.data.data) ? res.data.data.length : undefined),
    };
  };
}

const dataProvider = {
  getList: unwrapData(base.getList),
  getOne: unwrapData(base.getOne),
  create: unwrapData(base.create),
  update: unwrapData(base.update),
  deleteOne: unwrapData(base.deleteOne),
  // Nếu cần, thêm các method khác tương tự
};

export default dataProvider;
