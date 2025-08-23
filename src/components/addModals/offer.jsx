import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddOfferPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("https://products-api.cbc-apps.net/products")
      .then((res) => setProducts(res.data.products))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
      .get("https://products-api.cbc-apps.net/categories")
      .then((res) => setCategories(res.data.categories || res.data.products))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios
      .get("https://products-api.cbc-apps.net/sections")
      .then((res) => setSections(res.data.sections || res.data.products))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("يجب تسجيل الدخول أولاً");
      return;
    }
    if (!selectedCategory || !selectedSection) {
      alert("يجب اختيار الفئة والقسم");
      return;
    }
    if (products.length === 0) {
      alert("لا توجد منتجات للإرسال");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      image: image.trim(),
      isActive,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      categoryId: Number(selectedCategory),
      sectionId: Number(selectedSection),
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        originalPrice: p.originalPrice,
        price: p.price,
        wholesalePrice: p.wholesalePrice,
        stock: p.stock,
        averageRating: p.averageRating,
        mainImageUrl: p.mainImageUrl,
        categoryId: p.categoryId,
        sectionId: p.sectionId,
        supplierId: p.supplierId,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        colors: p.colors,
        measurements: p.measurements,
        category: p.category,
        section: p.section,
        supplier: p.supplier,
        displayPrice: p.displayPrice,
        availablePrices: p.availablePrices,
      })),
    };

    try {
      const res = await axios.post(
        "https://products-api.cbc-apps.net/offers/general",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("تم إضافة العرض بنجاح!");
      console.log(res.data);
      setTitle("");
      setDescription("");
      setImage("");
      setIsActive(true);
      setStartDate("");
      setEndDate("");
      setSelectedCategory("");
      setSelectedSection("");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(
        "حدث خطأ أثناء إضافة العرض: " +
          (err.response?.data?.message || "خطأ غير معروف")
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6">إضافة عرض جديد</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">العنوان</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">الوصف</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">صورة العرض</label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="ضع رابط الصورة"
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">تاريخ البداية</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">تاريخ النهاية</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold">الفئة</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">اختر الفئة</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold">القسم</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">اختر القسم</option>
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          إضافة العرض
        </button>
      </form>
    </div>
  );
}
