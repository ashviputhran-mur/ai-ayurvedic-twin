import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, OperationType, handleFirestoreError } from '../firebase';
import { Package, Plus, RefreshCw, AlertTriangle, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  ingredients: string[];
  remedies: string[];
  category: string;
}

export const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    stock: 0,
    description: '',
    category: 'General',
    ingredients: [],
    remedies: []
  });

  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
    });
    return () => unsubscribe();
  }, []);

  const handleUpdateStock = async (id: string, newStock: number) => {
    try {
      await updateDoc(doc(db, 'products', id), { stock: newStock });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `products/${id}`);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), newProduct);
      setIsAdding(false);
      setNewProduct({ name: '', price: 0, stock: 0, description: '', category: 'General', ingredients: [], remedies: [] });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'products');
    }
  };

  if (loading) return <div className="p-8 text-center text-sm font-mono text-[#6B7280]">Loading Inventory...</div>;

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="tech-card bg-[#1E2D24] text-white">
          <div className="flex items-center gap-3 mb-4">
            <Package className="text-[#C5A059]" size={20} />
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">Total Products</span>
          </div>
          <div className="text-3xl font-bold">{products.length}</div>
        </div>
        <div className="tech-card">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-red-500" size={20} />
            <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Low Stock Alerts</span>
          </div>
          <div className="text-3xl font-bold text-red-500">
            {products.filter(p => p.stock < 10).length}
          </div>
        </div>
        <div className="tech-card">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="text-[#4C6B5F]" size={20} />
            <span className="text-xs font-bold uppercase tracking-widest text-[#6B7280]">Inventory Value</span>
          </div>
          <div className="text-3xl font-bold text-[#4C6B5F]">
            ${products.reduce((acc, p) => acc + (p.price * p.stock), 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Inventory List */}
      <div className="tech-card">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#6B7280]">Inventory Management</h3>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="accent-button flex items-center gap-2 text-xs"
          >
            <Plus size={14} />
            Add Product
          </button>
        </div>

        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleAddProduct}
            className="mb-8 p-6 bg-[#F9FAF7] border border-[#E5E7EB] rounded-2xl grid grid-cols-2 gap-4"
          >
            <input 
              placeholder="Product Name" 
              className="p-3 rounded-xl border border-[#E5E7EB] text-sm"
              value={newProduct.name}
              onChange={e => setNewProduct({...newProduct, name: e.target.value})}
              required
            />
            <input 
              type="number" 
              placeholder="Price" 
              className="p-3 rounded-xl border border-[#E5E7EB] text-sm"
              value={newProduct.price}
              onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
              required
            />
            <input 
              type="number" 
              placeholder="Initial Stock" 
              className="p-3 rounded-xl border border-[#E5E7EB] text-sm"
              value={newProduct.stock}
              onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
              required
            />
            <select 
              className="p-3 rounded-xl border border-[#E5E7EB] text-sm"
              value={newProduct.category}
              onChange={e => setNewProduct({...newProduct, category: e.target.value})}
            >
              <option>General</option>
              <option>Skin Care</option>
              <option>Digestion</option>
              <option>Immunity</option>
            </select>
            <div className="col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setIsAdding(false)} className="text-xs font-bold text-[#6B7280] uppercase">Cancel</button>
              <button type="submit" className="accent-button text-xs">Save Product</button>
            </div>
          </motion.form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E5E7EB] text-[10px] uppercase tracking-widest text-[#6B7280] font-bold">
                <th className="pb-4">Product</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Price</th>
                <th className="pb-4">Stock</th>
                <th className="pb-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {products.map((product) => (
                <tr key={product.id} className="group">
                  <td className="py-4">
                    <div className="font-bold text-sm text-[#1E2D24]">{product.name}</div>
                  </td>
                  <td className="py-4 text-xs text-[#6B7280]">{product.category}</td>
                  <td className="py-4 text-sm font-mono">${product.price.toFixed(2)}</td>
                  <td className="py-4">
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold",
                      product.stock < 10 ? "bg-red-100 text-red-600" : "bg-[#4C6B5F]/10 text-[#4C6B5F]"
                    )}>
                      {product.stock} units
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleUpdateStock(product.id, product.stock + 10)}
                        className="p-2 hover:bg-[#C5A059]/10 text-[#C5A059] rounded-lg transition-colors"
                        title="Restock +10"
                      >
                        <RefreshCw size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
