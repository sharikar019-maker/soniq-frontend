import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import adminApi from "../../fetch/adminapi";
const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [deletingId, setDeletingId] = useState(null); 

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      
      const res = await adminApi.get("/products");
      
      const fetched = res.data?.data || [];

      
      setProducts(fetched);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    try {
      setDeletingId(id);
     
      await adminApi.delete(`/products/${id}`);
      
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete product", err);
      const message = err.response?.data?.message || "Failed to delete product";
      alert(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="p-6">Loading products...</p>;
  if (error)   return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          to="/admin/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Rating</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-t hover:bg-gray-50"> {/* ✅ _id */}
                  <td className="p-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-14 h-14 object-cover rounded"
                    />
                  </td>

                  <td className="p-4 font-medium">{product.title}</td>

                  <td className="p-4 capitalize">{product.category || "—"}</td>

                  <td className="p-4">₹{product.price}</td>

                  <td className="p-4">{product.rating ?? "—"}</td>

                  <td className="p-4">
                    <div className="flex gap-3">
                      
                      <Link
                        to={`/admin/products/edit/${product._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(product._id)} 
                        disabled={deletingId === product._id}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        {deletingId === product._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsList;