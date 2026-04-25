"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Sidebar } from "../admin/components/sidebar";
import {
  deleteAdminEventCategory,
  EventCategoryOption,
  fetchAdminEventCategories,
  saveAdminEventCategory,
} from "@/lib/event-categories";

const EMPTY_CATEGORY: EventCategoryOption = {
  value: "",
  label: "",
  description: "",
  isActive: true,
};

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<EventCategoryOption[]>([]);
  const [currentCategory, setCurrentCategory] = useState<EventCategoryOption>(EMPTY_CATEGORY);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setCategories(await fetchAdminEventCategories());
    } catch (error) {
      console.error("Failed to load categories", error);
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => setCurrentCategory(EMPTY_CATEGORY);

  const handleSaveCategory = async () => {
    if (!currentCategory.label.trim()) {
      toast.error("Category name is required.");
      return;
    }

    try {
      setSaving(true);
      const value =
        currentCategory.value ||
        currentCategory.label
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");

      const saved = await saveAdminEventCategory(
        { ...currentCategory, value },
        currentCategory.id
      );

      setCategories((current) => {
        const normalized = {
          id: saved?.id || currentCategory.id || value,
          label: saved?.label || currentCategory.label,
          value: saved?.value || value,
          description: saved?.description || currentCategory.description,
          isActive:
            saved?.isActive === undefined
              ? currentCategory.isActive !== false
              : Boolean(saved.isActive),
        };

        const others = current.filter((category) => category.id !== normalized.id);
        return [normalized, ...others];
      });

      toast.success(currentCategory.id ? "Category updated." : "Category created.");
      resetForm();
    } catch (error: any) {
      console.error("Failed to save category", error);
      toast.error(error?.message || "Category management endpoint is not available yet.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (category: EventCategoryOption) => {
    if (!category.id) {
      setCategories((current) => current.filter((entry) => entry.value !== category.value));
      return;
    }

    try {
      await deleteAdminEventCategory(category.id);
      setCategories((current) => current.filter((entry) => entry.id !== category.id));
      toast.success("Category deleted.");
    } catch (error: any) {
      console.error("Failed to delete category", error);
      toast.error(error?.message || "Category delete endpoint is not available yet.");
    }
  };

  return (
    <div className="flex min-h-screen bg-secondary dark:bg-[#101010]">
      <Sidebar activePage="Event Categories" />

      <main className="flex-1 overflow-auto lg:ml-[250px] dark:bg-[#101010]">
        <div className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold">Event Categories</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Manage the category list that tenant create and edit flows now use.
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1fr_360px]">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#101010]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Current Categories</h2>
                <button
                  type="button"
                  onClick={loadCategories}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium dark:border-gray-700"
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <p className="text-sm text-gray-500">Loading categories...</p>
              ) : (
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div
                      key={category.id || category.value}
                      className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-semibold">{category.label}</p>
                          <p className="text-xs text-gray-500">slug: {category.value}</p>
                          {category.description ? (
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              {category.description}
                            </p>
                          ) : null}
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            category.isActive === false
                              ? "bg-gray-100 text-gray-500"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {category.isActive === false ? "Inactive" : "Active"}
                        </span>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setCurrentCategory(category)}
                          className="h-10 rounded-lg bg-[#FFF5E6] px-4 text-sm font-semibold text-[#D19537]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(category)}
                          className="h-10 rounded-lg bg-red-50 px-4 text-sm font-semibold text-[#D6111A]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  {categories.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No categories returned yet.
                    </p>
                  ) : null}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#101010]">
              <h2 className="text-lg font-semibold">
                {currentCategory.id ? "Edit Category" : "Create Category"}
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Changes here feed the tenant category dropdowns.
              </p>

              <div className="mt-5 space-y-4">
                <input
                  type="text"
                  value={currentCategory.label}
                  onChange={(e) =>
                    setCurrentCategory((current) => ({ ...current, label: e.target.value }))
                  }
                  className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                  placeholder="Category name"
                />
                <input
                  type="text"
                  value={currentCategory.value}
                  onChange={(e) =>
                    setCurrentCategory((current) => ({ ...current, value: e.target.value }))
                  }
                  className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                  placeholder="Slug (optional)"
                />
                <textarea
                  value={currentCategory.description || ""}
                  onChange={(e) =>
                    setCurrentCategory((current) => ({
                      ...current,
                      description: e.target.value,
                    }))
                  }
                  className="min-h-[120px] w-full rounded-lg border border-gray-200 px-4 py-3 text-sm dark:border-gray-700 dark:bg-[#181818]"
                  placeholder="Description"
                />
                <label className="flex items-center justify-between rounded-xl bg-[#FAFAFB] px-4 py-3 text-sm dark:bg-[#161616]">
                  <span>Active category</span>
                  <input
                    type="checkbox"
                    checked={currentCategory.isActive !== false}
                    onChange={(e) =>
                      setCurrentCategory((current) => ({
                        ...current,
                        isActive: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[#D19537]"
                  />
                </label>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleSaveCategory}
                    disabled={saving}
                    className="h-11 flex-1 rounded-xl bg-[#D19537] px-6 text-sm font-semibold text-white"
                  >
                    {saving ? "Saving..." : currentCategory.id ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="h-11 rounded-xl bg-[#FFF5E6] px-6 text-sm font-semibold text-[#D19537]"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
