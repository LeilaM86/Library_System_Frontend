import React, { useState, useEffect } from "react";
import { Category } from "../types";
import {
  deleteCategory,
  getCategories,
  getCategory,
  saveCategory,
} from "../services/categoryService";

const CategoryFormPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (currentCategory) {
      setName(currentCategory.name);
    } else {
      setName("");
    }
  }, [currentCategory]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      setError("Failed to fetch categories");
    }
  };

  const handleSave = async () => {
    if (!name) return;

    try {
      const categoryData = currentCategory
        ? { id: currentCategory.id, name }
        : { name };
      await saveCategory(categoryData);
      fetchCategories();
      setCurrentCategory(null);
      setName("");
      setError(null);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        setError(error.response.data);
      } else {
        setError("Failed to save category. Please login");
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      fetchCategories();
      setCurrentCategory(null);
      setError(null);
    } catch (error) {
      setError("Failed to delete category. Please login");
    }
  };

  const handleCategoryClick = async (id: string) => {
    try {
      const category = await getCategory(id);
      setCurrentCategory(category);
      setError(null);
    } catch (error) {
      setError("Failed to fetch category details");
    }
  };

  return (
    <div className="category-form-container">
      <h1 className="title">Category Form</h1>
      {error && <p className="error">{error}</p>}
      <div className="form-group">
        <input
          className="input-field"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category Name"
        />
        <div className="button-group">
          <button className="button save-button" onClick={handleSave}>
            {currentCategory ? "Update" : "Add"} Category
          </button>
          {currentCategory && (
            <button
              className="button delete-button"
              onClick={() => handleDelete(currentCategory.id!)}
            >
              Delete Category
            </button>
          )}
        </div>
      </div>
      <h2 className="subtitle">Categories</h2>
      <ul className="category-list">
        {categories.map((category) => (
          <li
            className="category-item"
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFormPage;
