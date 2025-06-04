
import { useNotification } from "@refinedev/core";
import { useMutation } from "@tanstack/react-query";

export const useForceDelete = () => {
  const resource = "categories";
  const { open } = useNotification();

  const { mutate, ...rest } = useMutation(
    async (id: number) => {
      // gọi api force-delete trực tiếp
      const res = await fetch(`http://localhost:8000/api/${resource}/${id}/force-delete`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Xóa vĩnh viễn thất bại");
      }
      return res.json();
    },
    {
      onSuccess: () => {
        open?.({
          type: "success",
          message: "Xoá vĩnh viễn thành công!",
        });
      },
      onError: (error: any) => {
        open?.({
          type: "error",
          message: "Xoá thất bại",
          description: error.message,
        });
      },
    }
  );

  const forceDelete = (id: number, onSuccess?: () => void) => {
    mutate(id, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return { forceDelete, ...rest };
};
