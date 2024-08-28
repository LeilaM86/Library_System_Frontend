import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Book,
  ReferenceBook,
  DVD,
  Audiobook,
  LibraryItemType,
  Category,
} from "../types";
import { getCategories } from "../services/categoryService";
import {
  deleteLibraryItem,
  getLibraryItem,
  saveLibraryItem,
  updateLibraryItem,
} from "../services/libraryItemService";

const DEFAULT_ITEM: { [K in LibraryItemType["type"]]: LibraryItemType } = {
  book: {
    id: "",
    title: "",
    type: "book",
    isBorrowable: false,
    categoryId: "",
    author: "",
    nbrPages: 0,
    abbreviation: "",
    borrowDate: null,
    borrower: "",
  },
  referencebook: {
    id: "",
    title: "",
    type: "referencebook",
    isBorrowable: false,
    categoryId: "",
    author: "",
    nbrPages: 0,
    abbreviation: "",
    borrowDate: null,
    borrower: "",
  },
  dvd: {
    id: "",
    title: "",
    type: "dvd",
    isBorrowable: false,
    categoryId: "",
    runTimeMinutes: 0,
    abbreviation: "",
    borrowDate: null,
    borrower: "",
  },
  audiobook: {
    id: "",
    title: "",
    type: "audiobook",
    isBorrowable: false,
    categoryId: "",
    runTimeMinutes: 0,
    abbreviation: "",
    borrowDate: null,
    borrower: "",
  },
};

const LibraryItemFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const [item, setItem] = useState<LibraryItemType>(DEFAULT_ITEM.book);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [borrowerName, setBorrowerName] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse);

        if (id) {
          try {
            const fetchedItem = await getLibraryItem(id);
            setItem(fetchedItem);
            setBorrowerName(fetchedItem.borrower || "");
          } catch (error) {
            console.error(`Error fetching library item with id ${id}:`, error);
            setError("Failed to fetch library item");
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleFieldChange = (name: string, value: any) => {
    setItem((prevItem) => {
      if (name === "isBorrowable") {
        return {
          ...prevItem,
          [name]: value,
        } as LibraryItemType;
      }

      if (prevItem.type === "book" || prevItem.type === "referencebook") {
        return {
          ...prevItem,
          [name]: value,
        } as Book | ReferenceBook;
      } else if (prevItem.type === "dvd" || prevItem.type === "audiobook") {
        return {
          ...prevItem,
          [name]: value,
        } as DVD | Audiobook;
      }
      return prevItem;
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!item.categoryId) {
      setError("Category ID is required.");
      return;
    }

    try {
      if (item.id) {
        await updateLibraryItem(item.id, item);
      } else {
        await saveLibraryItem(item);
      }
      navigate("/library-items");
    } catch (error) {
      console.error("Error saving library item:", error);
      setError("Failed to save library item. Please login");
    }
  };

  const handleDelete = async () => {
    try {
      if (item.id) {
        await deleteLibraryItem(item.id);
        navigate("/library-items");
      }
    } catch (error) {
      console.error("Error deleting library item:", error);
      setError("Failed to delete library item");
    }
  };

  const handleCheckOut = () => {
    if (!borrowerName) {
      setError("Borrower's name is required.");
      return;
    }

    if (
      item.isBorrowable &&
      (item.type === "book" || item.type === "dvd" || item.type === "audiobook")
    ) {
      const updatedItem: LibraryItemType = {
        ...item,
        borrower: borrowerName,
        borrowDate: new Date(),
      };

      updateLibraryItem(item.id, updatedItem)
        .then((response) => {
          console.log("Item updated successfully", response);
          setItem(updatedItem);
          setBorrowerName("");
          setError(null);
        })
        .catch((error) => {
          console.error("Error checking out item:", error);
          setError("Failed to check out item. Please login");
        });
    } else {
      setError("Item is not borrowable or invalid item type");
    }
  };

  const handleReturn = async () => {
    try {
      const updatedItem = {
        ...item,
        borrower: "",
        borrowDate: null,
      } as LibraryItemType;

      await updateLibraryItem(item.id, updatedItem);
      setItem(updatedItem);
      setBorrowerName("");
    } catch (error) {
      console.error("Error returning item:", error);
      setError("Failed to return item");
    }
  };

  const isReferenceBookType = item.type === "referencebook";
  const isBookType = item.type === "book";
  const isDVDType = item.type === "dvd";
  const isAudiobookType = item.type === "audiobook";

  if (loading) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <h1 className="form-title">
        {item.id ? "Edit Library Item" : "New Library Item"}
      </h1>
      {error && <p className="form-error">{error}</p>}
      <form onSubmit={handleSubmit} className="library-item-form">
        <div className="form-group">
          <label className="form-label">Title:</label>
          <input
            type="text"
            name="title"
            value={item.title}
            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Abbreviation:</label>
          <input
            type="text"
            name="abbreviation"
            value={item.abbreviation || ""}
            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Type:</label>
          <select
            name="type"
            value={item.type}
            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
            className="form-select"
          >
            <option value="book">Book</option>
            <option value="dvd">DVD</option>
            <option value="audiobook">Audiobook</option>
            <option value="referencebook">Reference Book</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Borrowable:</label>
          <input
            type="checkbox"
            name="isBorrowable"
            checked={item.isBorrowable || false}
            onChange={(e) => handleFieldChange(e.target.name, e.target.checked)}
            className="form-checkbox"
          />
        </div>
        {(isBookType || isReferenceBookType) && (
          <>
            <div className="form-group">
              <label className="form-label">Author:</label>
              <input
                type="text"
                name="author"
                value={(item as Book | ReferenceBook).author}
                onChange={(e) =>
                  handleFieldChange(e.target.name, e.target.value)
                }
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Number of Pages:</label>
              <input
                type="number"
                name="nbrPages"
                value={(item as Book | ReferenceBook).nbrPages}
                onChange={(e) =>
                  handleFieldChange(e.target.name, Number(e.target.value))
                }
                className="form-input"
                required
              />
            </div>
          </>
        )}
        {isDVDType && (
          <div className="form-group">
            <label className="form-label">Runtime (minutes):</label>
            <input
              type="number"
              name="runTimeMinutes"
              value={(item as DVD).runTimeMinutes}
              onChange={(e) =>
                handleFieldChange(e.target.name, Number(e.target.value))
              }
              className="form-input"
              required
            />
          </div>
        )}
        {isAudiobookType && (
          <div className="form-group">
            <label className="form-label">Runtime (minutes):</label>
            <input
              type="number"
              name="runTimeMinutes"
              value={(item as Audiobook).runTimeMinutes}
              onChange={(e) =>
                handleFieldChange(e.target.name, Number(e.target.value))
              }
              className="form-input"
              required
            />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Category:</label>
          <select
            name="categoryId"
            value={item.categoryId}
            onChange={(e) => handleFieldChange(e.target.name, e.target.value)}
            className="form-select"
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Borrower's Name:</label>
          <input
            type="text"
            value={borrowerName}
            onChange={(e) => setBorrowerName(e.target.value)}
            className="form-input"
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="form-submit-button save-button">
            Save
          </button>
          {item.id && (
            <>
              <button
                type="button"
                onClick={handleCheckOut}
                className="form-action-button save-button"
              >
                Check Out
              </button>
              <button
                type="button"
                onClick={handleReturn}
                className="form-action-button save-button"
              >
                Return
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="form-delete-button delete-button"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default LibraryItemFormPage;
