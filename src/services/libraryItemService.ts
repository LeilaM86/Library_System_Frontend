import axios from "axios";
import { LibraryItemType } from "../types";

interface LibraryItemFormData {
  id?: string;
  title: string;
  abbreviation: string;
  type: string;
  categoryId: string;
  isBorrowable: boolean;
  borrowDate?: Date | string | null;
  borrower?: string;
}

const API_BASEURL = "http://localhost:7577/api/library-items";
//const CREDENTIALS = "?username=leila&accessCode=TnYtEb&auth=true";

function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

function libraryItemUrl(id?: string): string {
  return id ? `${API_BASEURL}/${id}` : `${API_BASEURL}`;
}

export async function getLibraryItems(): Promise<LibraryItemType[]> {
  try {
    const response = await axios.get<LibraryItemType[]>(libraryItemUrl(), {
      headers: { "x-auth-token": getAuthToken() },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching library items:", error);
    throw error;
  }
}

export async function getLibraryItem(id: string): Promise<LibraryItemType> {
  try {
    const response = await axios.get<LibraryItemType>(libraryItemUrl(id), {
      headers: { "x-auth-token": getAuthToken() },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching library item with id ${id}:`, error);
    throw error;
  }
}

export async function saveLibraryItem(
  item: LibraryItemFormData
): Promise<LibraryItemType> {
  const itemForApi = {
    ...item,
    borrowDate:
      item.borrowDate instanceof Date
        ? item.borrowDate.toISOString()
        : item.borrowDate || null,
  };

  try {
    const headers = { "x-auth-token": getAuthToken() };
    if (item.id) {
      const response = await axios.put<LibraryItemType>(
        libraryItemUrl(item.id),
        itemForApi,
        { headers }
      );
      return response.data;
    } else {
      const response = await axios.post<LibraryItemType>(
        libraryItemUrl(),
        itemForApi,
        { headers }
      );
      return response.data;
    }
  } catch (error) {
    console.error("Error saving library item:", error);
    throw error;
  }
}

export async function updateLibraryItem(
  id: string,
  item: LibraryItemType
): Promise<LibraryItemType> {
  const itemForApi = {
    ...item,
    borrowDate:
      item.borrowDate instanceof Date
        ? item.borrowDate.toISOString()
        : item.borrowDate || null,
  };

  try {
    console.log("Objekt är ", itemForApi);
    const response = await axios.put<LibraryItemType>(
      libraryItemUrl(id),
      itemForApi,
      {
        headers: { "x-auth-token": getAuthToken() },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating library item with id ${id}:`, error);
    throw error;
  }
}

export async function deleteLibraryItem(id: string): Promise<void> {
  try {
    await axios.delete(libraryItemUrl(id), {
      headers: { "x-auth-token": getAuthToken() },
    });
  } catch (error) {
    console.error(`Error deleting library item with id ${id}:`, error);
    throw error;
  }
}
