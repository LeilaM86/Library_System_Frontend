import axios from "axios";
import { Category } from "../types";

interface CategoryFormData {
  id?: string;
  name: string;
}

const API_BASEURL = "http://localhost:7577/api/categories";
//const CREDENTIALS = "?username=leila&accessCode=TnYtEb&auth=true";

function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

function categoryUrl(id?: string): string {
  return id ? `${API_BASEURL}/${id}` : `${API_BASEURL}`;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await axios.get<Category[]>(categoryUrl(), {
      headers: { "x-auth-token": getAuthToken() },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export async function getCategory(id: string): Promise<Category> {
  try {
    const response = await axios.get<Category>(categoryUrl(id), {
      headers: { "x-auth-token": getAuthToken() },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching category with id ${id}:`, error);
    throw error;
  }
}

export async function saveCategory(
  category: CategoryFormData
): Promise<Category> {
  try {
    const headers = { "x-auth-token": getAuthToken() };
    if (category.id) {
      const response = await axios.put<Category>(
        categoryUrl(category.id),
        category,
        { headers }
      );
      return response.data;
    } else {
      const response = await axios.post<Category>(categoryUrl(), category, {
        headers,
      });
      return response.data;
    }
  } catch (error) {
    console.error("Error saving category:", error);
    throw error;
  }
}

export async function updateCategory(
  id: string,
  category: CategoryFormData
): Promise<Category> {
  try {
    const response = await axios.put<Category>(categoryUrl(id), category, {
      headers: { "x-auth-token": getAuthToken() },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating category with id ${id}:`, error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<Category> {
  try {
    const response = await axios.delete<Category>(categoryUrl(id), {
      headers: { "x-auth-token": getAuthToken() },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting category with id ${id}:`, error);
    throw error;
  }
}
