import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Category } from '../types';
import { formatIDR } from '../utils/format';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  Edit2, 
  Trash2, 
  Smartphone as PhoneIcon, 
  Cable, 
  Wifi, 
  Wrench, 
  MoreHorizontal, 
  X,
  AlertTriangle,
  Info
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, addToast } = useApp();

  // --- Search & Filter States ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  
  // --- Form & Modal States ---
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState('');
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    category: 'HP' as Category,
    brand: '',
    purchasePrice: '',
    sellingPrice: '',
    stock: '',
    minStock: '',
    image: ''
  });

  // --- Open Modals ---
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'HP' as Category,
      brand: '',
      purchasePrice: '',
      sellingPrice: '',
      stock: '10',
      minStock: '3',
      image: ''
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      brand: product.brand,
      purchasePrice: product.purchasePrice.toString(),
      sellingPrice: product.sellingPrice.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      image: product.image || ''
    });
    setFormError('');
    setShowModal(true);
  };

  // --- Submit form ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!formData.name.trim()) return setFormError('Nama produk wajib diisi.');
    if (!formData.brand.trim()) return setFormError('Brand/merek wajib diisi.');
    
    const buyPrice = parseFloat(formData.purchasePrice);
    const sellPrice = parseFloat(formData.sellingPrice);
    const stockVal = parseInt(formData.stock);
    const minStockVal = parseInt(formData.minStock);

    if (isNaN(buyPrice) || buyPrice < 0) return setFormError('Harga beli harus berupa angka positif.');
    if (isNaN(sellPrice) || sellPrice < 0) return setFormError('Harga jual harus berupa angka positif.');
    if (isNaN(stockVal) || stockVal < 0) return setFormError('Stok barang harus berupa angka positif.');
    if (isNaN(minStockVal) || minStockVal < 0) return setFormError('Batas stok minimal harus berupa angka positif.');

    const productPayload = {
      name: formData.name.trim(),
      category: formData.category,
      brand: formData.brand.trim(),
      purchasePrice: buyPrice,
      sellingPrice: sellPrice,
      stock: stockVal,
      minStock: minStockVal,
      image: formData.image.trim() || undefined
    };

    if (editingProduct) {
      // Edit
      const res = updateProduct({
        ...productPayload,
        id: editingProduct.id,
        createdAt: editingProduct.createdAt
      });
      if (res.success) {
        setShowModal(false);
      } else {
        setFormError(res.message);
      }
    } else {
      // Add
      const res = addProduct(productPayload);
      if (res.success) {
        setShowModal(false);
      } else {
        setFormError(res.message);
      }
    }
  };

  // --- Delete confirmation ---
  const handleDelete = (id: string, name: string) => {
    setProductToDelete({ id, name });
  };

  // --- Auto-generate vector avatars based on Category ---
  const renderProductIcon = (category: Category, className: string = 'h-5 w-5') => {
    switch (category) {
      case 'HP':
        return <PhoneIcon className={`${className} text-blue-600 dark:text-blue-400`} />;
      case 'Aksesoris':
        return <Cable className={`${className} text-emerald-600 dark:text-emerald-400`} />;
      case 'Pulsa & Data':
        return <Wifi className={`${className} text-amber-500`} />;
      case 'Service':
        return <Wrench className={`${className} text-purple-500`} />;
      default:
        return <MoreHorizontal className={`${className} text-slate-500`} />;
    }
  };

  const getCategoryBadgeStyle = (category: Category) => {
    switch (category) {
      case 'HP':
        return 'bg-blue-50 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-100 dark:border-blue-900/20';
      case 'Aksesoris':
        return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/20';
      case 'Pulsa & Data':
        return 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-100 dark:border-amber-900/20';
      case 'Service':
        return 'bg-purple-50 text-purple-800 dark:bg-purple-950/40 dark:text-purple-300 border-purple-100 dark:border-purple-900/20';
      default:
        return 'bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-300 border-slate-100 dark:border-slate-800';
    }
  };

  // --- Filtering & Sorting ---
  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categoriesList: (Category | 'All')[] = ['All', 'HP', 'Aksesoris', 'Pulsa & Data', 'Service', 'Lain-lain'];

  return (
    <div className="space-y-6">
      
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            Manajemen Produk HP & Aksesoris
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
            Daftar persediaan barang, harga pokok, harga eceran toko, dan kelola katalog barang.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/15 cursor-pointer hover:shadow-lg transition-all"
          id="btn-add-product"
        >
          <Plus className="h-4.5 w-4.5" /> Tambah Barang
        </button>
      </div>

      {/* Filtering & Layout Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari produk berdasarkan nama atau brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-950/60 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-hidden focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
            id="input-product-search"
          />
        </div>

        {/* Categories Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850 bg-slate-50/20 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800'
              }`}
              id={`filter-cat-${cat}`}
            >
              {cat === 'All' ? 'Semua' : cat}
            </button>
          ))}
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1.5 border border-slate-100 dark:border-slate-800 rounded-xl p-1 bg-slate-50/50 dark:bg-slate-950/40">
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="Daftar Tabel"
            id="btn-view-mode-table"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
            title="Daftar Grid"
            id="btn-view-mode-grid"
          >
            <Grid className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* Main product display */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-3 shadow-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl text-slate-400">
            <Info className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {searchTerm || selectedCategory !== 'All' ? 'Pencarian tidak ditemukan' : 'Katalog Produk Kosong'}
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm">
            {searchTerm || selectedCategory !== 'All'
              ? 'Silakan cari kata kunci lain atau pilih kategori yang berbeda untuk menemukan katalog produk.'
              : 'Belum ada produk yang didaftarkan. Klik tombol "Tambah Barang" untuk menginput produk perdana Anda.'}
          </p>
          {(searchTerm || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
              id="btn-clear-product-filters"
            >
              Reset Filter & Pencarian
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        
        // --- TABLE VIEW ---
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-950/40 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800/80">
                  <th className="py-4 px-5">Nama Barang</th>
                  <th className="py-4 px-4">Brand</th>
                  <th className="py-4 px-4">Kategori</th>
                  <th className="py-4 px-4 text-right">Harga Pokok (Beli)</th>
                  <th className="py-4 px-4 text-right">Harga Eceran (Jual)</th>
                  <th className="py-4 px-4 text-center">Stok</th>
                  <th className="py-4 px-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
                {filteredProducts.map((p) => {
                  const isLowStock = p.stock <= p.minStock;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl shrink-0">
                            {renderProductIcon(p.category)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100 leading-snug">{p.name}</p>
                            {isLowStock && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 mt-0.5 animate-pulse">
                                <AlertTriangle className="h-3 w-3" /> Stok Kritis (Min: {p.minStock})
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-600 dark:text-slate-400">{p.brand}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getCategoryBadgeStyle(p.category)}`}>
                          {p.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-500 font-medium">{formatIDR(p.purchasePrice)}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-950 dark:text-white">{formatIDR(p.sellingPrice)}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono ${
                          p.stock === 0 
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300' 
                            : isLowStock 
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' 
                              : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                        }`}>
                          {p.stock} unit
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all cursor-pointer"
                            title="Edit Produk"
                            id={`btn-edit-prod-${p.id}`}
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                            title="Hapus Produk"
                            id={`btn-delete-prod-${p.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        
        // --- GRID VIEW ---
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4.5">
          {filteredProducts.map((p) => {
            const isLowStock = p.stock <= p.minStock;
            return (
              <div 
                key={p.id} 
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4.5 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Visual Category Icon Background */}
                <div className="absolute right-0 top-0 opacity-5 p-2 shrink-0">
                  {renderProductIcon(p.category, 'h-24 w-24 translate-x-4 -translate-y-4')}
                </div>

                <div className="space-y-3 z-10 relative">
                  {/* Badge Row */}
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${getCategoryBadgeStyle(p.category)}`}>
                      {p.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{p.brand}</span>
                  </div>

                  {/* Name */}
                  <div className="space-y-0.5">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate leading-snug" title={p.name}>
                      {p.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">ID: {p.id}</p>
                  </div>

                  {/* Price Row */}
                  <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-100/30 dark:border-slate-850 rounded-xl">
                    <div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block uppercase leading-none">Harga Beli</span>
                      <span className="text-xs font-mono font-medium text-slate-500 mt-0.5 block">{formatIDR(p.purchasePrice)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block uppercase leading-none">Harga Jual</span>
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white mt-0.5 block">{formatIDR(p.sellingPrice)}</span>
                    </div>
                  </div>

                  {/* Stock Row */}
                  <div className="flex items-center justify-between text-xs font-semibold pt-1 border-t border-slate-100 dark:border-slate-800/40">
                    <span className="text-slate-400">Tersedia:</span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                      p.stock === 0 
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300' 
                        : isLowStock 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' 
                          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
                    }`}>
                      {p.stock} unit
                    </span>
                  </div>

                  {isLowStock && (
                    <div className="p-2 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100/40 dark:border-rose-900/10 rounded-xl flex items-center gap-1.5 text-[10.5px] font-bold text-rose-600 dark:text-rose-400 leading-none">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 animate-bounce" /> Stok berada di bawah batas minimum ({p.minStock})
                    </div>
                  )}
                </div>

                {/* Grid card actions */}
                <div className="flex items-center justify-end gap-1.5 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/40 z-10 relative">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors"
                    id={`grid-btn-edit-${p.id}`}
                  >
                    <Edit2 className="h-3 w-3" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-100 dark:border-rose-900/10 text-xs font-bold text-rose-600 dark:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 cursor-pointer transition-colors"
                    id={`grid-btn-delete-${p.id}`}
                  >
                    <Trash2 className="h-3 w-3" /> Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- ADD / EDIT PRODUCT MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setShowModal(false)} />
          
          {/* Content Pane */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/30 dark:bg-slate-950/20">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingProduct ? 'Perbarui Rincian Produk' : 'Daftarkan Produk Baru'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                id="btn-close-product-modal"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5.5 space-y-4">
              
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" /> {formError}
                </div>
              )}

              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Nama Produk *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Charger Xiaomi Fast charging 33W"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-hidden focus:border-blue-500"
                  id="form-product-name"
                />
              </div>

              {/* Brand and Category Row */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Brand / Merek *</label>
                  <input
                    type="text"
                    required
                    placeholder="Samsung, Xiaomi, Anker"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-hidden focus:border-blue-500"
                    id="form-product-brand"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Kategori *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full px-3 py-2 text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                    id="form-product-category"
                  >
                    <option value="HP">HP</option>
                    <option value="Aksesoris">Aksesoris</option>
                    <option value="Pulsa & Data">Pulsa & Data</option>
                    <option value="Service">Service</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>
              </div>

              {/* Purchase Price and Selling Price */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Harga Beli (Pokok) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="Harga modal"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-hidden focus:border-blue-500"
                      id="form-product-buyprice"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Harga Jual (Eceran) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="Harga toko"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-hidden focus:border-blue-500"
                      id="form-product-sellprice"
                    />
                  </div>
                </div>
              </div>

              {/* Stock and Min Stock Row */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Stok Saat Ini *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Stok gudang"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-hidden focus:border-blue-500"
                    id="form-product-stock"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Batas Stok Minimal *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Alert level"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50/50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 rounded-xl border border-slate-100 dark:border-slate-800 focus:outline-hidden focus:border-blue-500"
                    id="form-product-minstock"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4.5 py-2 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer transition-colors"
                  id="btn-cancel-product-submit"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-all"
                  id="btn-submit-product-form"
                >
                  {editingProduct ? 'Simpan Perubahan' : 'Daftarkan Barang'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setProductToDelete(null)} />
          
          {/* Content Pane */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/30 dark:bg-slate-950/20">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0" /> Konfirmasi Hapus Produk
              </h3>
              <button
                onClick={() => setProductToDelete(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                id="btn-close-delete-modal"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <div className="p-5.5 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Apakah Anda yakin ingin menghapus produk <span className="font-bold text-slate-900 dark:text-white">"{productToDelete.name}"</span>?
              </p>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-xl text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
                Semua data stok produk ini akan dihapus. Histori penjualan lama yang melibatkan produk ini akan tetap tersimpan di riwayat transaksi Anda.
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="px-4.5 py-2 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer transition-colors"
                  id="btn-cancel-product-delete"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    deleteProduct(productToDelete.id);
                    setProductToDelete(null);
                  }}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-all"
                  id="btn-confirm-product-delete"
                >
                  Hapus Produk
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
