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

const API_BASEURL = "http://localhost:8586/api/library-items";
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
  // Konvertera borrowDate till en ISO-sträng om det är en Date-instans, annars lämna som null
  const itemForApi = {
    ...item,
    borrowDate:
      item.borrowDate instanceof Date
        ? item.borrowDate.toISOString()
        : item.borrowDate || null,
  };

  try {
    // Skicka en PUT-förfrågan med axios
    console.log("Objekt är ", itemForApi);
    const response = await axios.put<LibraryItemType>(
      libraryItemUrl(id), // Din API-url för att uppdatera ett bibliotekspost
      itemForApi,
      {
        headers: { "x-auth-token": getAuthToken() }, // Använd din autentiseringstoken
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating library item with id ${id}:`, error);
    throw error; // Kasta felet så att det kan fångas och hanteras på en högre nivå
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

// import { LibraryItemType } from "../types";
// import axios from "../axiosConfig";
// import { AxiosError } from "axios";

// const API_BASEURL = "http://localhost:8586/api/library-items";

// function getAuthToken() {
//   return localStorage.getItem("token");
// }

// const instance = axios.create({
//   baseURL: API_BASEURL,
//   headers: { "x-auth-token": getAuthToken() },
// });

// export async function getLibraryItems() {
//   try {
//     const response = await axios.get("/library-items");
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching library items:", error);
//     throw error;
//   }
// }

// export const getLibraryItem = async (id: string): Promise<LibraryItemType> => {
//   try {
//     const response = await instance.get<LibraryItemType>(`/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching library item with id ${id}:`, error);
//     throw new Error(`Failed to fetch library item with id ${id}`);
//   }
// };

// export const createLibraryItem = async (
//   item: LibraryItemType
// ): Promise<void> => {
//   const itemForApi = {
//     ...item,
//     borrowDate:
//       item.borrowDate instanceof Date
//         ? item.borrowDate.toISOString()
//         : item.borrowDate || null,
//   };

//   if (!itemForApi.categoryId || itemForApi.categoryId.trim() === "") {
//     throw new Error("Category ID is required.");
//   }

//   try {
//     await instance.post("/", itemForApi);
//   } catch (error: unknown) {
//     if (error instanceof AxiosError) {
//       console.error(
//         "Error creating library item:",
//         error.response?.data || error.message
//       );
//     } else if (error instanceof Error) {
//       console.error("Error creating library item:", error.message);
//     } else {
//       console.error("An unknown error occurred:", error);
//     }
//     throw error;
//   }
// };

// export const updateLibraryItem = async (
//   item: LibraryItemType
// ): Promise<void> => {
//   const itemForApi = {
//     ...item,
//     borrowDate:
//       item.borrowDate instanceof Date
//         ? item.borrowDate // Skicka Date-objektet som det är
//         : item.borrowDate || null,
//   };

//   if (!itemForApi.id) {
//     throw new Error("ID is required for updating an item.");
//   }

//   if (!itemForApi.categoryId || itemForApi.categoryId.trim() === "") {
//     throw new Error("Category ID is required.");
//   }

//   try {
//     await instance.put(`/${itemForApi.id}`, itemForApi);
//   } catch (error: unknown) {
//     if (error instanceof AxiosError) {
//       console.error(
//         "Error updating library item:",
//         error.response?.data || error.message
//       );
//     } else if (error instanceof Error) {
//       console.error("Error updating library item:", error.message);
//     } else {
//       console.error("An unknown error occurred:", error);
//     }
//     throw error;
//   }
// };

// // export const updateLibraryItem = async (
// //   item: LibraryItemType
// // ): Promise<void> => {
// //   const itemForApi = {
// //     ...item,
// //     borrowDate:
// //       item.borrowDate instanceof Date
// //         ? item.borrowDate.toISOString() // Konvertera till ISO-sträng om det är en Date
// //         : item.borrowDate || null, // Behåll som null om det inte är en Date och inte finns
// //   };

// //   if (!itemForApi.id) {
// //     throw new Error("ID is required for updating an item.");
// //   }

// //   if (!itemForApi.categoryId || itemForApi.categoryId.trim() === "") {
// //     throw new Error("Category ID is required.");
// //   }

// //   try {
// //     await instance.put(`/${itemForApi.id}`, itemForApi);
// //   } catch (error: unknown) {
// //     if (error instanceof AxiosError) {
// //       console.error(
// //         "Error updating library item:",
// //         error.response?.data || error.message
// //       );
// //     } else if (error instanceof Error) {
// //       console.error("Error updating library item:", error.message);
// //     } else {
// //       console.error("An unknown error occurred:", error);
// //     }
// //     throw error;
// //   }
// // };

// // export const updateLibraryItem = async (
// //   item: LibraryItemType
// // ): Promise<void> => {
// //   const itemForApi = {
// //     ...item,
// //     borrowDate:
// //       item.borrowDate instanceof Date
// //         ? item.borrowDate.toISOString()
// //         : item.borrowDate || null,
// //   };

// //   if (!itemForApi.id) {
// //     throw new Error("ID is required for updating an item.");
// //   }

// //   if (!itemForApi.categoryId || itemForApi.categoryId.trim() === "") {
// //     throw new Error("Category ID is required.");
// //   }

// //   try {
// //     await instance.put(`/${itemForApi.id}`, itemForApi);
// //   } catch (error: unknown) {
// //     if (error instanceof AxiosError) {
// //       console.error(
// //         "Error updating library item:",
// //         error.response?.data || error.message
// //       );
// //     } else if (error instanceof Error) {
// //       console.error("Error updating library item:", error.message);
// //     } else {
// //       console.error("An unknown error occurred:", error);
// //     }
// //     throw error;
// //   }
// // };

// export const deleteLibraryItem = async (id: string): Promise<void> => {
//   try {
//     await instance.delete(`/${id}`);
//   } catch (error) {
//     console.error(`Error deleting library item with id ${id}:`, error);
//     throw new Error(`Failed to delete library item with id ${id}`);
//   }
// };
