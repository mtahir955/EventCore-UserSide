import { apiClient } from "@/lib/apiClient";

export type EventCategoryOption = {
  id?: string;
  value: string;
  label: string;
  description?: string;
  isActive?: boolean;
};

export const DEFAULT_EVENT_CATEGORY_OPTIONS: EventCategoryOption[] = [
  { value: "event", label: "Event" },
  { value: "training", label: "Training" },
  { value: "klee", label: "KLEE" },
  { value: "other", label: "Other" },
];

const TENANT_CATEGORIES_ENDPOINT = "/categories/tenant";
const ADMIN_CATEGORIES_ENDPOINT = "/super-admin/categories";

const normalizeCategory = (entry: any): EventCategoryOption | null => {
  const label = String(entry?.label || entry?.name || entry?.title || "").trim();
  const value = String(entry?.value || entry?.slug || entry?.code || label)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (!label || !value) return null;

  return {
    id: entry?.id ? String(entry.id) : undefined,
    value,
    label,
    description: entry?.description || "",
    isActive:
      entry?.isActive === undefined ? true : Boolean(entry?.isActive),
  };
};

const extractCategoryArray = (payload: any) => {
  const candidates = [
    payload?.data?.categories,
    payload?.data?.items,
    payload?.data,
    payload?.categories,
    payload?.items,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.map(normalizeCategory).filter(Boolean) as EventCategoryOption[];
    }
  }

  return [];
};

export const fetchTenantEventCategories = async () => {
  const response = await apiClient.get(TENANT_CATEGORIES_ENDPOINT);
  const categories = extractCategoryArray(response.data).filter(
    (category) => category.isActive !== false
  );

  return categories;
};

export const fetchAdminEventCategories = async () => {
  const response = await apiClient.get(ADMIN_CATEGORIES_ENDPOINT);
  const categories = extractCategoryArray(response.data);
  return categories.length > 0 ? categories : DEFAULT_EVENT_CATEGORY_OPTIONS;
};

export const saveAdminEventCategory = async (
  category: Partial<EventCategoryOption> & { label: string; value?: string },
  categoryId?: string
) => {
  const normalizedValue = String(category.value || category.label)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const payload = {
    label: category.label,
    name: category.label,
    title: category.label,
    value: normalizedValue,
    slug: normalizedValue,
    description: category.description || "",
    isActive: category.isActive !== false,
  };

  const response = categoryId
    ? await apiClient.put(`${ADMIN_CATEGORIES_ENDPOINT}/${categoryId}`, payload)
    : await apiClient.post(ADMIN_CATEGORIES_ENDPOINT, payload);

  return response.data?.data || response.data;
};

export const deleteAdminEventCategory = async (categoryId: string) => {
  await apiClient.delete(`${ADMIN_CATEGORIES_ENDPOINT}/${categoryId}`);
};
