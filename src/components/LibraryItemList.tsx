import React, { useState, useEffect } from "react";
import { LibraryItemType, Category } from "../types";
import { Link } from "react-router-dom";
import { getCategories } from "../services/categoryService";

interface LibraryItemListProps {
  items: LibraryItemType[];
  onDelete: (id: string) => void;
}

const LibraryItemList: React.FC<LibraryItemListProps> = ({
  items = [],
  onDelete,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const categoryMap = new Map(
    categories.map((category) => [category.id, category.name])
  );

  items.forEach((item) => {
    item.categoryName = categoryMap.get(item.categoryId) || "Unknown";
  });

  return (
    <div className="list-group">
      {items.map((item) => (
        <div
          key={item.id}
          className="list-group-item d-flex justify-content-between align-items-center"
        >
          <div>
            <h5 className="mb-1">
              {item.title} ({item.abbreviation})
            </h5>
            <p className="mb-1">
              <strong>Type:</strong> {item.type} <br />
              <strong>Category:</strong> {item.categoryName} <br />
              <strong>Status:</strong>{" "}
              {item.isBorrowable && item.borrower ? (
                <>
                  Borrowed by {item.borrower} on{" "}
                  {item.borrowDate
                    ? new Date(item.borrowDate).toLocaleDateString()
                    : "Unknown"}
                </>
              ) : item.isBorrowable ? (
                "Available"
              ) : (
                "Not borrowable"
              )}
            </p>
          </div>
          <div>
            <Link
              to={`/library-items/${item.id}`}
              className="btn btn-sm btn-secondary me-2"
            >
              Edit
            </Link>
            <button
              onClick={() => onDelete(item.id)}
              className="btn btn-sm btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LibraryItemList;
