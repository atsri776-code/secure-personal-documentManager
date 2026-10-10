import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:8080/api/documents";

function App() {
  const [documents, setDocuments] = useState([]);
  const [expired, setExpired] = useState([]);
  const [expiringSoon, setExpiringSoon] = useState([]);

  const [form, setForm] = useState({
    documentName: "",
    category: "",
    issueDate: "",
    expiryDate: "",
    notes: "",
  });

  const loadDashboard = async () => {
    try {
      const documentsResponse = await fetch(API);
      const documentsData = await documentsResponse.json();
      setDocuments(documentsData);

      const expiredResponse = await fetch(
        `${API}/status/expired`
      );
      const expiredData = await expiredResponse.json();
      setExpired(expiredData);

      const soonResponse = await fetch(
        `${API}/status/expiring-soon`
      );
      const soonData = await soonResponse.json();
      setExpiringSoon(soonData);

    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const addDocument = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to add document");
      }

      alert("Document added successfully!");

      setForm({
        documentName: "",
        category: "",
        issueDate: "",
        expiryDate: "",
        notes: "",
      });

      loadDashboard();

    } catch (error) {
      console.error(error);
      alert("Unable to add document.");
    }
  };

  const deleteDocument = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      loadDashboard();

    } catch (error) {
      console.error(error);
      alert("Unable to delete document.");
    }
  };

  const getStatus = (expiryDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);

    const difference =
      (expiry - today) / (1000 * 60 * 60 * 24);

    if (difference < 0) {
      return (
        <span className="status expired">
          Expired
        </span>
      );
    }

    if (difference <= 30) {
      return (
        <span className="status soon">
          Expiring Soon
        </span>
      );
    }

    return (
      <span className="status valid">
        Valid
      </span>
    );
  };

  return (
    <div className="app">

      {/* Header */}

      <header className="header">

        <div>
          <h1>
            🔐 Secure Document Manager
          </h1>

          <p>
            Secure Personal Document Management and Expiry Tracking System
          </p>
        </div>

      </header>


      <main className="container">

        {/* Dashboard Cards */}

        <section className="cards">

          <div className="card blue">

            <h3>
              Total Documents
            </h3>

            <p>
              {documents.length}
            </p>

          </div>


          <div className="card red">

            <h3>
              Expired Documents
            </h3>

            <p>
              {expired.length}
            </p>

          </div>


          <div className="card orange">

            <h3>
              Expiring Soon
            </h3>

            <p>
              {expiringSoon.length}
            </p>

          </div>

        </section>


        {/* Add Document */}

        <section className="panel">

          <h2>
            Add New Document
          </h2>

          <form onSubmit={addDocument}>

            <input
              type="text"
              name="documentName"
              placeholder="Document Name"
              value={form.documentName}
              onChange={handleChange}
              required
            />


            <input
              type="text"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
            />


            <div className="field">

              <label>
                Issue Date
              </label>

              <input
                type="date"
                name="issueDate"
                value={form.issueDate}
                onChange={handleChange}
                required
              />

            </div>


            <div className="field">

              <label>
                Expiry Date
              </label>

              <input
                type="date"
                name="expiryDate"
                value={form.expiryDate}
                onChange={handleChange}
                required
              />

            </div>


            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
            />


            <button
              type="submit"
              className="add-button"
            >
              + Add Document
            </button>

          </form>

        </section>


        {/* Documents Table */}

        <section className="panel">

          <div className="table-title">

            <div>

              <h2>
                My Documents
              </h2>

              <p>
                Manage your personal documents and expiry dates.
              </p>

            </div>

            <span className="document-count">
              {documents.length} Documents
            </span>

          </div>


          <div className="table-wrapper">

            <table>

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    Document
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Issue Date
                  </th>

                  <th>
                    Expiry Date
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {documents.map((document) => (

                  <tr key={document.id}>

                    <td>
                      {document.id}
                    </td>

                    <td>
                      <strong>
                        {document.documentName}
                      </strong>
                    </td>

                    <td>
                      {document.category}
                    </td>

                    <td>
                      {document.issueDate}
                    </td>

                    <td>
                      {document.expiryDate}
                    </td>

                    <td>
                      {getStatus(document.expiryDate)}
                    </td>

                    <td>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteDocument(document.id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>


            {documents.length === 0 && (

              <div className="empty">

                <p>
                  No documents found.
                </p>

                <span>
                  Add your first document above.
                </span>

              </div>

            )}

          </div>

        </section>

      </main>

    </div>
  );
}

export default App;