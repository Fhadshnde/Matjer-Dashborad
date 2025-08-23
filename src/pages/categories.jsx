import React, { useState, useEffect } from 'react';
import AddCategoryModal from '../components/addModals/category';
import EditCategoryModal from '../components/editModals/category';
import DeleteCategoryModal from '../components/deleteModal/deleteCategory';

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://31.97.35.42:4500/categories');
      const data = await response.json();
      if (data && data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      {/* Header */}
      <div className="bg-[#1A1A1A]/80 border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Categories Management</h1>
            </div>
            <AddCategoryModal onSubmit={fetchCategories} />
          </div>
        </div>
      </div>

      {/* Categories Stats */}
      <div dir="rtl" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
            <h3 className="text-[#94A3B8] text-sm">📂 مجموع الأقسام</h3>
            <p className="text-2xl font-bold text-white mt-1">{categories.length}</p>
          </div>
          <div className="bg-[#1A1A1A] border border-white/5 rounded-xl p-6">
            <h3 className="text-[#94A3B8] text-sm">🛒 مجموع المنتجات</h3>
            <p className="text-2xl font-bold text-white mt-1">
              {categories.reduce((acc, cat) => acc + (cat.productsCount || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              dir="rtl"
              className="category-card bg-[#1A1A1A] border border-white/5 rounded-xl p-6 hover:border-[#5E54F2]/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#5E54F2] to-[#7C3AED] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                  {category.image ? (
                    <img className="w-full h-full object-cover rounded-xl" src={category.image} alt={category.name} />
                  ) : (
                    <span className="text-white text-sm">No Image</span>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-[#94A3B8] hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    <EditCategoryModal categoryId={category.id} onSubmit={fetchCategories} />
                  </button>
                  <button className="p-2 text-[#94A3B8] hover:text-red-400 hover:bg-white/5 rounded-lg transition-all">
                    <DeleteCategoryModal id={category.id} onDelete={fetchCategories} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
              <p className="text-sm text-[#94A3B8] mb-4">{category.description || 'بدون وصف'}</p>

              <div className="text-sm text-[#CBD5E1]">
                <p>🛒 عدد المنتجات: {category.productsCount}</p>
                <p>📂 عدد الأقسام الفرعية: {category.sectionsCount}</p>
              </div>

              {/* عرض الأقسام التابعة */}
              {category.sections && category.sections.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-[#5E54F2] text-sm font-semibold mb-2">الأقسام التابعة:</h4>
                  <ul className="list-disc list-inside text-[#94A3B8] text-sm space-y-1">
                    {category.sections.map((section) => (
                      <li key={section.id}>
                        {section.name} ({section.productsCount} منتج)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* Empty State for Add New */}
          <div className="category-card bg-[#1A1A1A] border border-dashed border-white/10 rounded-xl p-6 hover:border-[#5E54F2]/50 transition-all cursor-pointer group">
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
              <div className="w-16 h-16 bg-[#5E54F2]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#5E54F2]/20 transition-colors">
                <svg className="w-8 h-8 text-[#5E54F2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">إضافة قسم جديد</h3>
              <p className="text-sm text-[#94A3B8]">قم بإنشاء قسم جديد لتنظيم المنتجات</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesManagement;
