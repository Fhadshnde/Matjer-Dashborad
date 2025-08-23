import React, { useState, useEffect, useRef } from "react";

export default function OffersManagement() {
  const [offers, setOffers] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOffer, setSelectedOffer] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOffers();
    fetchProducts();
    fetchCategories();
    fetchSections();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch("https://products-api.cbc-apps.net/offers/general", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOffers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://products-api.cbc-apps.net/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProductsList(Array.isArray(data) ? data : data.products || []);
    } catch (e) {
      setProductsList([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("https://products-api.cbc-apps.net/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : data.categories || []);
    } catch (e) {
      setCategories([]);
    }
  };

  const fetchSections = async () => {
    try {
      const res = await fetch("https://products-api.cbc-apps.net/sections", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSections(Array.isArray(data) ? data : data.sections || []);
    } catch (e) {
      setSections([]);
    }
  };

  const fetchOfferById = async (id) => {
    try {
      const res = await fetch(`https://products-api.cbc-apps.net/offers/general/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const fetchOfferProducts = async (id) => {
    try {
      const res = await fetch(`https://products-api.cbc-apps.net/offers/general/${id}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  const addProductToOffer = async (offerId, product) => {
    try {
      const res = await fetch(`https://products-api.cbc-apps.net/offers/general/${offerId}/products`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: [product] }),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error(err);
        return;
      }
      await fetchOffers();
    } catch (e) {
      console.error(e);
    }
  };

  const toggleOffer = async (id) => {
    try {
      await fetch(`https://products-api.cbc-apps.net/offers/general/${id}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOffers();
    } catch (e) {
      console.error(e);
    }
  };

  const deactivateOffer = async (id) => {
    try {
      await fetch(`https://products-api.cbc-apps.net/offers/general/${id}/deactivate`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOffers();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteOffer = async (id) => {
    try {
      await fetch(`https://products-api.cbc-apps.net/offers/general/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOffers();
    } catch (e) {
      console.error(e);
    }
  };

  const deleteProductFromOffer = async (offerId, productId) => {
    try {
      await fetch(`https://products-api.cbc-apps.net/offers/general/${offerId}/products/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOffers();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F]">
      <div className="bg-[#1A1A1A]/80 border-b border-white/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Offers Management</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab("all")} className={`px-4 py-2 rounded ${activeTab==="all"?"bg-[#5E54F2] text-white":"bg-gray-700 text-gray-300"}`}>جميع العروض</button>
          <button onClick={() => setActiveTab("active")} className={`px-4 py-2 rounded ${activeTab==="active"?"bg-[#5E54F2] text-white":"bg-gray-700 text-gray-300"}`}>العروض المفعلة</button>
          <button onClick={() => setActiveTab("inactive")} className={`px-4 py-2 rounded ${activeTab==="inactive"?"bg-[#5E54F2] text-white":"bg-gray-700 text-gray-300"}`}>العروض الموقوفة</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.filter(offer => {
            if(activeTab==="all") return true;
            if(activeTab==="active") return offer.isActive;
            if(activeTab==="inactive") return !offer.isActive;
          }).map((offer) => (
            <div key={offer.id} className="offer-card bg-[#1A1A1A] border border-white/5 rounded-xl overflow-hidden hover:border-[#5E54F2]/50 transition-all group">
              <div className="relative">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  <button onClick={() => toggleOffer(offer.id)} className="px-2 py-1 bg-blue-500 text-white rounded">Toggle</button>
                  <button onClick={() => deactivateOffer(offer.id)} className="px-2 py-1 bg-red-500 text-white rounded">Deactivate</button>
                  <button onClick={() => deleteOffer(offer.id)} className="px-2 py-1 bg-gray-500 text-white rounded">Delete</button>
                </div>
                <div className="h-48 bg-gradient-to-br from-[#5E54F2]/20 to-[#7C3AED]/20 flex items-center justify-center">
                  {offer.image && <img src={offer.image} alt={offer.title} className="max-h-full max-w-full object-contain" />}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-1">{offer.title}</h3>
                <p className="text-sm text-[#94A3B8]">{offer.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
