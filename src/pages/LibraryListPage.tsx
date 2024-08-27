import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLibraryItems } from "../services/libraryItemService";
import { LibraryItemType } from "../types";

const LibraryListPage: React.FC = () => {
  const [items, setItems] = useState<LibraryItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const itemsResponse = await getLibraryItems();
        setItems(itemsResponse);
      } catch (err) {
        setError("Failed to fetch library items");
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Borrowable</th>
            <th>Borrower</th>
            <th>Borrow Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                {item.title} {item.abbreviation}
              </td>
              <td>{item.type}</td>
              <td>{item.isBorrowable ? "Yes" : "No"}</td>
              <td>{item.borrower ? item.borrower : "-"}</td>

              <td>
                {item.borrowDate
                  ? new Date(item.borrowDate).toLocaleDateString()
                  : "-"}
              </td>
              <td>
                <Link
                  to={`/library-items/${item.id}`}
                  className="btn btn-primary"
                >
                  Edit
                </Link>
                <Link
                  to={`/library-items/delete/${item.id}`}
                  className="btn btn-danger"
                >
                  Delete
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LibraryListPage;
