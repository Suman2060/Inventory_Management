import { enqueueSnackbar } from "notistack";
import type { Category } from "../types/category";
import createApi from "../utils/axios";

const categoryApi = createApi("/category");

export async function getCategories(): Promise<Category[]> {
  try {
    const { data } = await categoryApi.get("/");

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function createCategory(
  category_name: string,
): Promise<Category> {
  try {
    const { data } = await categoryApi.post("/", {
      category_name,
    });

    enqueueSnackbar("New category created", {
      variant: "success",
    });

    return data.data;
  } catch (err) {
    console.error(err);

    enqueueSnackbar("Category not created", {
      variant: "error",
    });

    throw err;
  }
}