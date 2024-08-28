import { useEffect, useState } from "react";
import { Category, LibraryItemType } from "../types";
import Listgroup from "../components/ListGroup";
import { getCategories } from "../services/categoryService";
import {
  getLibraryItems,
  deleteLibraryItem,
} from "../services/libraryItemService";
import { user } from "../services";
import { Link } from "react-router-dom";
import LibraryItemList from "../components/LibraryItemList";

const DEFAULT_CATEGORY: Category = { id: "", name: "All Categories" };

function LibraryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<LibraryItemType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<"category" | "type">("category");

  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesResponse = await getCategories();
        setCategories([DEFAULT_CATEGORY, ...categoriesResponse]);

        const itemsResponse = await getLibraryItems();
        const itemsWithAbbreviation = itemsResponse.map(
          (item: LibraryItemType) => ({
            ...item,
            abbreviation: getAbbreviation(item.title),
          })
        );
        setItems(itemsWithAbbreviation);
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
      const itemsResponse = await getLibraryItems();
      const itemsWithAbbreviation = itemsResponse.map(
        (item: LibraryItemType) => ({
          ...item,
          abbreviation: getAbbreviation(item.title),
        })
      );
      setItems(itemsWithAbbreviation);
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  function handleCategorySelect(category: Category) {
    setSelectedCategory(category);
  }

  const filteredItems = selectedCategory.id
    ? items.filter((item) => item.categoryId === selectedCategory.id)
    : items;

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOption === "category") {
      return a.categoryId.localeCompare(b.categoryId);
    }
    return a.type.localeCompare(b.type);
  });

  return (
    <div className="container p-3">
      <div className="row">
        <div className="col-3">
          <div className="mb-3">
            {user && (
              <Link to="/categories/new" className="btn btn-primary w-100">
                <i className="bi bi-plus-circle"></i> New Category
              </Link>
            )}
          </div>
          <Listgroup
            items={categories}
            selectedItem={selectedCategory}
            onItemSelect={handleCategorySelect}
          />
        </div>
        <div className="col-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            {user && (
              <Link to="/library-items/new" className="btn btn-primary">
                <i className="bi bi-plus-circle"></i> New Item
              </Link>
            )}
            <select
              className="form-select w-auto"
              value={sortOption}
              onChange={(e) =>
                setSortOption(e.target.value as "category" | "type")
              }
            >
              <option value="category">Sort by Category</option>
              <option value="type">Sort by Type</option>
            </select>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p className="text-danger">{error}</p>}
          {!loading && (
            <LibraryItemList items={sortedItems} onDelete={handleDelete} />
          )}
        </div>
      </div>
    </div>
  );
}

function getAbbreviation(title: string) {
  return title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default LibraryPage;
