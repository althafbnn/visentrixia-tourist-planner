import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Plus,
  Pencil,
  Trash2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  FileText,
  X
} from 'lucide-react';

const CATEGORIES = ['Religious', 'Nature', 'Heritage', 'Cultural', 'Culinary'];

export const AdminDashboard = ({ places, onRefreshPlaces }) => {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState('places');
  const [modalMode, setModalMode] = useState(null);
  const [editingPlace, setEditingPlace] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Religious',
    description: '',
    lat: '7.2185',
    lng: '81.8498',
    distance: '1.0',
    openingHours: '08:00 AM - 06:00 PM',
    entranceFee: '0',
    travelTips: '',
    safetyInfo: '',
    childFriendly: true,
    facilitiesText: 'Parking, Restrooms',
    imageUrl: '/assets/images/hero_akkaraipattu_1792478448218.jpg'
  });

  useEffect(() => {
    async function loadAdminData() {
      try {
        const logsRes = await api.getAuditLogs();
        setAuditLogs(logsRes.logs || []);
      } catch (err) {
        setAuditLogs([]);
      }
    }
    if (user?.role === 'admin') {
      loadAdminData();
    }
  }, [user, places]);

  const openCreateModal = () => {
    setEditingPlace(null);
    setFormData({
      name: '',
      category: 'Religious',
      description: '',
      lat: '7.2185',
      lng: '81.8498',
      distance: '1.0',
      openingHours: '08:00 AM - 06:00 PM',
      entranceFee: '0',
      travelTips: '',
      safetyInfo: '',
      childFriendly: true,
      facilitiesText: 'Parking, Restrooms',
      imageUrl: '/assets/images/hero_akkaraipattu_1792478448218.jpg'
    });
    setModalMode('create');
    setFeedback(null);
  };

  const openEditModal = (place) => {
    setEditingPlace(place);
    setFormData({
      name: place.name,
      category: place.category,
      description: place.description,
      lat: place.location.lat.toString(),
      lng: place.location.lng.toString(),
      distance: place.distance.toString(),
      openingHours: place.openingHours,
      entranceFee: place.entranceFee.toString(),
      travelTips: place.travelTips,
      safetyInfo: place.safetyInfo,
      childFriendly: place.childFriendly,
      facilitiesText: place.facilities.join(', '),
      imageUrl: place.images[0] || '/assets/images/hero_akkaraipattu_1792478448218.jpg'
    });
    setModalMode('edit');
    setFeedback(null);
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'error', text: 'Image file size exceeds the 5MB maximum limit.' });
      return;
    }

    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setFeedback({ type: 'error', text: 'Invalid file format. Please upload JPG, PNG, or GIF.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
        setFeedback({ type: 'success', text: `Loaded image "${file.name}" for upload.` });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      setFeedback({ type: 'error', text: 'Name must be at least 3 characters long.' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      setFeedback({ type: 'error', text: 'Description must be at least 10 characters long.' });
      setIsSubmitting(false);
      return;
    }

    const dist = parseFloat(formData.distance);
    if (isNaN(dist) || dist < 0 || dist > 25) {
      setFeedback({ type: 'error', text: 'Distance must be between 0 and 25 km (Akkaraipattu scope).' });
      setIsSubmitting(false);
      return;
    }

    const lat = parseFloat(formData.lat);
    const lng = parseFloat(formData.lng);
    if (isNaN(lat) || isNaN(lng)) {
      setFeedback({ type: 'error', text: 'Latitude and Longitude must be valid numerical coordinates.' });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim(),
      location: { lat, lng },
      distance: dist,
      openingHours: formData.openingHours.trim(),
      entranceFee: Math.max(0, parseInt(formData.entranceFee, 10) || 0),
      travelTips: formData.travelTips.trim() || 'Modest clothing and plenty of drinking water recommended.',
      safetyInfo: formData.safetyInfo.trim() || 'Please exercise caution and respect local guidelines.',
      childFriendly: formData.childFriendly,
      facilities: formData.facilitiesText.split(',').map((f) => f.trim()).filter(Boolean),
      images: [formData.imageUrl]
    };

    try {
      if (modalMode === 'create') {
        await api.createPlace(payload);
        setFeedback({ type: 'success', text: `Created place "${payload.name}" successfully.` });
      } else if (modalMode === 'edit' && editingPlace) {
        await api.updatePlace(editingPlace.id, payload);
        setFeedback({ type: 'success', text: `Updated place "${payload.name}" successfully.` });
      }

      await onRefreshPlaces();
      const logsRes = await api.getAuditLogs();
      setAuditLogs(logsRes.logs || []);

      setTimeout(() => {
        setModalMode(null);
      }, 1000);
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || 'Operation failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePlace = async (id) => {
    try {
      await api.deletePlace(id);
      setDeleteConfirmId(null);
      await onRefreshPlaces();
      const logsRes = await api.getAuditLogs();
      setAuditLogs(logsRes.logs || []);
    } catch (err) {
      alert(`Failed to delete attraction: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Administrator Control Center</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-stone-900 mt-1">
            Content Management Dashboard
          </h2>
          <p className="text-xs text-stone-500">
            Authenticated administrator: <span className="font-medium text-stone-700">{user?.email}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
            <button
              onClick={() => setActiveSubTab('places')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSubTab === 'places'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Attractions ({places.length})
            </button>
            <button
              onClick={() => setActiveSubTab('audit')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeSubTab === 'audit'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Audit Logs ({auditLogs.length})
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 active:bg-amber-950 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Attraction</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'places' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
            <span>Manage All 25km Radius Place Records</span>
            <span className="font-mono tabular-nums">{places.length} Total Records</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/70 text-stone-600 font-semibold uppercase tracking-wider text-[11px] border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Attraction</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">Operating Hours</th>
                  <th className="py-3 px-4">Entrance Fee</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {places.map((place) => (
                  <tr key={place.id} className="hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={place.images[0] || '/assets/images/hero_akkaraipattu_1792478448218.jpg'}
                          alt={place.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-md object-cover bg-stone-100 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-stone-900 block leading-tight">{place.name}</span>
                          <span className="text-[11px] text-stone-500 line-clamp-1">{place.description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-700">
                      {place.category}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-stone-600">
                      {place.distance} km
                    </td>
                    <td className="py-3 px-4 text-stone-600">
                      {place.openingHours}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-stone-800">
                      {place.entranceFee === 0 ? 'Free' : `LKR ${place.entranceFee}`}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(place)}
                          className="p-1.5 text-stone-600 hover:text-amber-800 hover:bg-stone-100 rounded-md transition-colors"
                          title="Edit attraction"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(place.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete attraction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">System Audit Trail</h3>
              <p className="text-xs text-stone-500">Every administrative create, update, and delete action is permanently audited.</p>
            </div>
            <FileText className="w-5 h-5 text-stone-400" />
          </div>

          <div className="space-y-2">
            {auditLogs.length === 0 ? (
              <p className="text-xs text-stone-500 py-6 text-center">No audit logs recorded yet.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                        {log.action}
                      </span>
                      <span className="text-stone-500 font-mono text-[11px]">{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-stone-800 font-medium">{log.details}</p>
                  </div>
                  <span className="text-[11px] font-mono text-stone-500">{log.adminEmail}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 border border-stone-200 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-stone-900">Confirm Deletion</h4>
              <p className="text-xs text-stone-600 mt-1">
                Are you sure you want to permanently remove this attraction? This action will be recorded in the administrative audit log.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePlace(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {modalMode && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-2xl w-full my-8 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {modalMode === 'create' ? 'Create New Attraction' : `Edit: ${editingPlace?.name}`}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              {feedback && (
                <div
                  className={`p-3 rounded-lg flex items-center gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{feedback.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Attraction Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-700 outline-none"
                    placeholder="e.g. Akkaraipattu Grand Jummah Mosque"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-700 outline-none bg-white cursor-pointer"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-700 outline-none"
                  placeholder="Comprehensive description of the cultural, natural, or historical site..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Distance (km from town) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="25"
                    required
                    value={formData.distance}
                    onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-700 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-700 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={formData.lng}
                    onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-700 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Operating Hours</label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-700 outline-none"
                    placeholder="e.g. 06:00 AM - 06:00 PM"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Entrance Fee (LKR, 0 = Free)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.entranceFee}
                    onChange={(e) => setFormData({ ...formData, entranceFee: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-700 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Travel Tips</label>
                  <textarea
                    rows={2}
                    value={formData.travelTips}
                    onChange={(e) => setFormData({ ...formData, travelTips: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-700 outline-none"
                    placeholder="Visitor tips, best times, photography rules..."
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Safety & Environmental Warning</label>
                  <textarea
                    rows={2}
                    value={formData.safetyInfo}
                    onChange={(e) => setFormData({ ...formData, safetyInfo: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-700 outline-none"
                    placeholder="e.g. Caution: Slippery rocks, ocean undertow..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Facilities (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.facilitiesText}
                    onChange={(e) => setFormData({ ...formData, facilitiesText: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:border-amber-700 outline-none"
                    placeholder="Parking, Restrooms, Water, Guide"
                  />
                </div>

                <div className="pt-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.childFriendly}
                      onChange={(e) => setFormData({ ...formData, childFriendly: e.target.checked })}
                      className="rounded text-amber-800 focus:ring-amber-700"
                    />
                    <span className="text-stone-700 font-semibold">Suitable for Children & Families</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="block text-stone-700 font-semibold">Attraction Image (Upload JPG/PNG, max 5MB)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageFileChange}
                    className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-stone-100 file:text-stone-800 hover:file:bg-stone-200"
                  />
                </div>
                {formData.imageUrl && (
                  <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-stone-200">
                    <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-800 hover:bg-amber-900 active:bg-amber-950 text-white rounded-lg font-semibold shadow-xs"
                >
                  {isSubmitting ? 'Saving...' : modalMode === 'create' ? 'Create Attraction' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
