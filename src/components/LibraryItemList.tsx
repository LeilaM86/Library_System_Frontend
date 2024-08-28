import React from "react";
import { LibraryItemType } from "../types";
import { Link } from "react-router-dom";

interface LibraryItemListProps {
  items: LibraryItemType[];
  onDelete: (id: string) => void;
}

const LibraryItemList: React.FC<LibraryItemListProps> = ({
  items,
  onDelete,
}) => {
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
              <strong>Category:</strong> {item.categoryId} <br />
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
