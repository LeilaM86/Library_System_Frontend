import React, { useEffect, useState } from "react";
import { getCategories } from "../services/categoryService";
import {
  getLibraryItems,
  deleteLibraryItem,
} from "../services/libraryItemService";
import { Category, LibraryItemType } from "../types";
import LibraryItemList from "./LibraryItemList";

const Items: React.FC = () => {
  const [libraryItems, setLibraryItems] = useState<LibraryItemType[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [itemsResponse, categoriesResponse] = await Promise.all([
          getLibraryItems(),
          getCategories(),
        ]);
        setLibraryItems(itemsResponse);
        setCategories(categoriesResponse);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteLibraryItem(id);
      setLibraryItems((prevItems) =>
        prevItems.filter((item) => item.id !== id)
      );
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  const categoryMap = new Map(categories.map((cat) => [cat.id, cat.name]));

  const itemsWithCategory = libraryItems.map((item) => ({
    ...item,
    categoryName: categoryMap.get(item.categoryId) || "Unknown",
  }));

  return (
    <div>
      <h1>Library Items</h1>
      <LibraryItemList items={itemsWithCategory} onDelete={handleDelete} />
    </div>
  );
};

export default Items;
