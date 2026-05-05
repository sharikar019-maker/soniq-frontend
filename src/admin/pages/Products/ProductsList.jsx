import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProductsList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(data => {
        // newest product first
        const sortedProducts = [...data].reverse();
        setProducts(sortedProducts);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    });

    setProducts(prev => prev.filter(p => p.id !== id));
  };

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
              <th className="p-4">Price</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map(product => (
              <tr key={product.id} className="border-t">
                <td className="p-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-14 h-14 object-cover rounded"
                  />
                </td>

                <td className="p-4 font-medium">
                  {product.title}
                </td>

                <td className="p-4">
                  ₹{product.price}
                </td>

                <td className="p-4 flex gap-3">
                  <Link
                    to={`/admin/products/edit/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default ProductsList;