"use client";

import { useEffect, useMemo, useState } from "react";
import { FileUp, RefreshCcw, Trash2, UserPlus, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  EMPTY_TRAINER_RECORD,
  TrainerLibraryRecord,
  fetchTrainerLibrary,
  normalizeTrainerRecord,
  saveTrainerLibraryRecord,
} from "@/lib/trainer-library";

type AddTrainersSectionProps = {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
};

const STORAGE_KEY = "eventDraft";

export default function AddTrainersSection({
  setActivePage,
}: AddTrainersSectionProps) {
  const [trainerLibrary, setTrainerLibrary] = useState<TrainerLibraryRecord[]>([]);
  const [selectedTrainers, setSelectedTrainers] = useState<TrainerLibraryRecord[]>([]);
  const [trainerDraft, setTrainerDraft] = useState<TrainerLibraryRecord>(
    EMPTY_TRAINER_RECORD
  );
  const [saveToLibrary, setSaveToLibrary] = useState(true);
  const [draftImageFile, setDraftImageFile] = useState<File | null>(null);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [savingTrainer, setSavingTrainer] = useState(false);
  const [error, setError] = useState("");

  const selectedIds = useMemo(
    () => new Set(selectedTrainers.map((trainer) => trainer.id).filter(Boolean)),
    [selectedTrainers]
  );

  const saveTrainersToLocalStorage = (trainers: TrainerLibraryRecord[]) => {
    if (typeof window === "undefined") return;

    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as any;
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          ...existing,
          trainers,
        })
      );
    } catch (storageError) {
      console.error("Failed to save trainers to localStorage", storageError);
    }
  };

  const loadTrainerLibrary = async () => {
    try {
      setLoadingLibrary(true);
      const trainers = await fetchTrainerLibrary();
      setTrainerLibrary(trainers);
    } catch (libraryError) {
      console.error("Failed to load trainer library", libraryError);
      setTrainerLibrary([]);
    } finally {
      setLoadingLibrary(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedDraft = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      if (Array.isArray(savedDraft?.trainers)) {
        setSelectedTrainers(savedDraft.trainers.map(normalizeTrainerRecord));
      }
    } catch (storageError) {
      console.error("Failed to load trainers from localStorage", storageError);
    }

    loadTrainerLibrary();
  }, []);

  const resetDraft = () => {
    setTrainerDraft(EMPTY_TRAINER_RECORD);
    setDraftImageFile(null);
    setSaveToLibrary(true);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setDraftImageFile(file);
      setTrainerDraft((current) => ({
        ...current,
        image: String(loadEvent.target?.result || ""),
      }));
    };
    reader.readAsDataURL(file);
  };

  const addTrainerToSelection = (trainer: TrainerLibraryRecord) => {
    setSelectedTrainers((current) => {
      const exists = current.some(
        (entry) =>
          (trainer.id && entry.id === trainer.id) ||
          (entry.name === trainer.name && entry.title === trainer.title)
      );

      if (exists) return current;

      const updated = [...current, trainer];
      saveTrainersToLocalStorage(updated);
      return updated;
    });
    setError("");
  };

  const removeTrainerFromSelection = (trainerId: string, trainerName: string) => {
    const updated = selectedTrainers.filter(
      (trainer) => trainer.id !== trainerId && trainer.name !== trainerName
    );
    setSelectedTrainers(updated);
    saveTrainersToLocalStorage(updated);
  };

  const handleCreateTrainer = async () => {
    if (!trainerDraft.name.trim() || !trainerDraft.bio.trim()) {
      setError("Add at least a trainer name and bio before saving.");
      return;
    }

    try {
      setSavingTrainer(true);
      setError("");

      const localTrainer = {
        ...trainerDraft,
        id: trainerDraft.id || `draft-${Date.now()}`,
      };

      if (!saveToLibrary) {
        addTrainerToSelection(localTrainer);
        resetDraft();
        toast.success("Trainer added to this event.");
        return;
      }

      const savedTrainer = await saveTrainerLibraryRecord(localTrainer, draftImageFile);
      setTrainerLibrary((current) => {
        const others = current.filter((trainer) => trainer.id !== savedTrainer.id);
        return [savedTrainer, ...others];
      });
      addTrainerToSelection(savedTrainer);
      resetDraft();
      toast.success("Trainer saved to your library and added to the event.");
    } catch (saveError: any) {
      console.error("Failed to save trainer", saveError);
      addTrainerToSelection({
        ...trainerDraft,
        id: trainerDraft.id || `draft-${Date.now()}`,
      });
      setError(
        saveError?.message ||
          "Trainer library is not available yet, so the trainer was only added to this event."
      );
    } finally {
      setSavingTrainer(false);
    }
  };

  const handleSaveAndContinue = () => {
    saveTrainersToLocalStorage(selectedTrainers);
    setActivePage("set-images");
  };

  return (
    <div className="px-4 sm:px-6 md:px-8 pb-8">
      <div className="mx-auto max-w-[1200px] rounded-2xl border border-[#E8E8E8] bg-white p-4 sm:p-6 md:p-8 dark:bg-[#101010] dark:border-gray-800">
        <div className="mb-8">
          <h3 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold mb-2">
            Trainers
          </h3>
          <p className="text-[13px] sm:text-[14px] md:text-[16px] text-[#666666] dark:text-gray-300">
            Trainers are now optional. You can skip this step, reuse trainers from
            your library, or create a new trainer with contact and social details.
          </p>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold">Trainer Library</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Reuse the same trainer profiles across events.
                </p>
              </div>

              <button
                type="button"
                onClick={loadTrainerLibrary}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium dark:border-gray-700"
              >
                <RefreshCcw className="h-4 w-4" />
                Refresh
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {loadingLibrary ? (
                <p className="text-sm text-gray-500">Loading trainers...</p>
              ) : trainerLibrary.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 p-5 text-sm text-gray-500 dark:border-gray-700">
                  Your reusable trainer library is empty right now.
                </div>
              ) : (
                trainerLibrary.map((trainer) => (
                  <div
                    key={trainer.id || `${trainer.name}-${trainer.title}`}
                    className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
                  >
                    <div className="flex items-start gap-3">
                      {trainer.image ? (
                        <img
                          src={trainer.image}
                          alt={trainer.name}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF5E6] text-[#D19537]">
                          <UserPlus className="h-5 w-5" />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold">{trainer.name}</p>
                        <p className="text-sm text-[#D19537]">
                          {trainer.title || "Trainer"}
                        </p>
                        <p className="mt-2 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                          {trainer.bio || "No bio added yet."}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => addTrainerToSelection(trainer)}
                      disabled={selectedIds.has(trainer.id)}
                      className={`mt-4 h-10 w-full rounded-lg text-sm font-semibold ${
                        selectedIds.has(trainer.id)
                          ? "bg-gray-100 text-gray-500 dark:bg-[#1a1a1a]"
                          : "bg-[#D19537] text-white"
                      }`}
                    >
                      {selectedIds.has(trainer.id) ? "Added to event" : "Add to Event"}
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-lg font-semibold">Selected for This Event</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    These profiles will render on the event page after publish.
                  </p>
                </div>
                <span className="rounded-full bg-[#FFF5E6] px-3 py-1 text-xs font-semibold text-[#D19537]">
                  {selectedTrainers.length} selected
                </span>
              </div>

              {selectedTrainers.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No trainers selected. You can continue without adding any.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedTrainers.map((trainer) => (
                    <div
                      key={trainer.id || `${trainer.name}-${trainer.title}`}
                      className="flex items-start justify-between gap-3 rounded-lg bg-[#FAFAFB] p-4 dark:bg-[#161616]"
                    >
                      <div>
                        <p className="font-semibold">{trainer.name}</p>
                        <p className="text-sm text-[#D19537]">{trainer.title}</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          {trainer.bio || "No bio added yet."}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeTrainerFromSelection(trainer.id, trainer.name)
                        }
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#D6111A]"
                        aria-label={`Remove ${trainer.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 p-5 dark:border-gray-800">
            <div className="mb-5">
              <h4 className="text-lg font-semibold">Create New Trainer</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Use the new core fields: name, title or role, bio, image, and optional
                contact links.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Image</label>
                {trainerDraft.image ? (
                  <div className="relative h-28 w-28 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                    <img
                      src={trainerDraft.image}
                      alt="Trainer preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setTrainerDraft((current) => ({ ...current, image: "" }));
                        setDraftImageFile(null);
                      }}
                      className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex h-12 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 text-sm text-gray-600 dark:border-gray-700 dark:text-gray-300">
                    <FileUp className="h-4 w-4" />
                    Upload trainer image
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </label>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Name <span className="text-[#D6111A]">*</span>
                  </label>
                  <input
                    type="text"
                    value={trainerDraft.name}
                    onChange={(e) =>
                      setTrainerDraft((current) => ({ ...current, name: e.target.value }))
                    }
                    className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Title / Role</label>
                  <input
                    type="text"
                    value={trainerDraft.title}
                    onChange={(e) =>
                      setTrainerDraft((current) => ({ ...current, title: e.target.value }))
                    }
                    className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                    placeholder="Lead coach"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Bio <span className="text-[#D6111A]">*</span>
                </label>
                <textarea
                  value={trainerDraft.bio}
                  onChange={(e) =>
                    setTrainerDraft((current) => ({ ...current, bio: e.target.value }))
                  }
                  className="min-h-[120px] w-full rounded-lg border border-gray-200 px-4 py-3 text-sm dark:border-gray-700 dark:bg-[#181818]"
                  placeholder="Short biography for the event page"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="email"
                  value={trainerDraft.email}
                  onChange={(e) =>
                    setTrainerDraft((current) => ({ ...current, email: e.target.value }))
                  }
                  className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                  placeholder="Email (optional)"
                />
                <input
                  type="text"
                  value={trainerDraft.phone}
                  onChange={(e) =>
                    setTrainerDraft((current) => ({ ...current, phone: e.target.value }))
                  }
                  className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                  placeholder="Phone (optional)"
                />
              </div>

              <input
                type="url"
                value={trainerDraft.website}
                onChange={(e) =>
                  setTrainerDraft((current) => ({ ...current, website: e.target.value }))
                }
                className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                placeholder="Website (optional)"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="url"
                  value={trainerDraft.socials.linkedin}
                  onChange={(e) =>
                    setTrainerDraft((current) => ({
                      ...current,
                      socials: { ...current.socials, linkedin: e.target.value },
                    }))
                  }
                  className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                  placeholder="LinkedIn URL"
                />
                <input
                  type="url"
                  value={trainerDraft.socials.twitter}
                  onChange={(e) =>
                    setTrainerDraft((current) => ({
                      ...current,
                      socials: { ...current.socials, twitter: e.target.value },
                    }))
                  }
                  className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                  placeholder="Twitter / X URL"
                />
                <input
                  type="url"
                  value={trainerDraft.socials.instagram}
                  onChange={(e) =>
                    setTrainerDraft((current) => ({
                      ...current,
                      socials: { ...current.socials, instagram: e.target.value },
                    }))
                  }
                  className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                  placeholder="Instagram URL"
                />
                <input
                  type="url"
                  value={trainerDraft.socials.facebook}
                  onChange={(e) =>
                    setTrainerDraft((current) => ({
                      ...current,
                      socials: { ...current.socials, facebook: e.target.value },
                    }))
                  }
                  className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                  placeholder="Facebook URL"
                />
                <input
                  type="url"
                  value={trainerDraft.socials.tiktok}
                  onChange={(e) =>
                    setTrainerDraft((current) => ({
                      ...current,
                      socials: { ...current.socials, tiktok: e.target.value },
                    }))
                  }
                  className="h-12 w-full rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                  placeholder="TikTok URL"
                />
              </div>

              <label className="flex items-center justify-between rounded-xl bg-[#FAFAFB] px-4 py-3 text-sm dark:bg-[#161616]">
                <span>Save this trainer to my reusable library</span>
                <input
                  type="checkbox"
                  checked={saveToLibrary}
                  onChange={(e) => setSaveToLibrary(e.target.checked)}
                  className="h-4 w-4 accent-[#D19537]"
                />
              </label>

              {error ? <p className="text-sm text-[#D6111A]">{error}</p> : null}

              <button
                type="button"
                onClick={handleCreateTrainer}
                disabled={savingTrainer}
                className="h-12 w-full rounded-xl bg-[#D19537] text-sm font-semibold text-white"
              >
                {savingTrainer ? "Saving trainer..." : "Save Trainer"}
              </button>
            </div>
          </section>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <button
          onClick={() => setActivePage("set-eventsettings")}
          className="h-11 rounded-xl bg-[#FFF5E6] px-6 font-semibold text-[#D19537]"
        >
          Go Back
        </button>
        <button
          onClick={handleSaveAndContinue}
          className="h-11 rounded-xl bg-[#D19537] px-6 font-semibold text-white"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}
