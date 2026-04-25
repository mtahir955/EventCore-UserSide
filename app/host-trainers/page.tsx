"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Sidebar } from "../host-dashboard/components/sidebar";
import {
  deleteTrainerLibraryRecord,
  EMPTY_TRAINER_RECORD,
  fetchTrainerLibrary,
  saveTrainerLibraryRecord,
  TrainerLibraryRecord,
} from "@/lib/trainer-library";

export default function HostTrainersPage() {
  const [trainers, setTrainers] = useState<TrainerLibraryRecord[]>([]);
  const [currentTrainer, setCurrentTrainer] = useState<TrainerLibraryRecord>(
    EMPTY_TRAINER_RECORD
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      setTrainers(await fetchTrainerLibrary());
    } catch (error) {
      console.error("Failed to load trainer library", error);
      toast.error("Failed to load trainers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  const resetForm = () => {
    setCurrentTrainer(EMPTY_TRAINER_RECORD);
    setImageFile(null);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      setImageFile(file);
      setCurrentTrainer((current) => ({
        ...current,
        image: String(loadEvent.target?.result || ""),
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTrainer = async () => {
    if (!currentTrainer.name.trim() || !currentTrainer.bio.trim()) {
      toast.error("Trainer name and bio are required.");
      return;
    }

    try {
      setSaving(true);
      const saved = await saveTrainerLibraryRecord(currentTrainer, imageFile);
      setTrainers((current) => {
        const others = current.filter((trainer) => trainer.id !== saved.id);
        return [saved, ...others];
      });
      toast.success(currentTrainer.id ? "Trainer updated." : "Trainer created.");
      resetForm();
    } catch (error: any) {
      console.error("Failed to save trainer", error);
      toast.error(error?.message || "Trainer library endpoint is not ready yet.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTrainer = async (trainerId: string) => {
    try {
      await deleteTrainerLibraryRecord(trainerId);
      setTrainers((current) => current.filter((trainer) => trainer.id !== trainerId));
      toast.success("Trainer deleted.");
      if (currentTrainer.id === trainerId) resetForm();
    } catch (error: any) {
      console.error("Failed to delete trainer", error);
      toast.error(error?.message || "Trainer delete endpoint is not ready yet.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFB]">
      <Sidebar active="Trainers" />

      <main className="flex-1 overflow-auto md:ml-[256px] dark:bg-[#101010]">
        <div className="px-4 py-6 sm:px-6 md:px-8 md:py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold sm:text-3xl">Trainer Library</h1>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Create once, then reuse trainers across event create and edit flows.
            </p>
          </div>

          <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#101010]">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">Library</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {trainers.length} reusable trainer profile(s)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadTrainers}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium dark:border-gray-700"
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <p className="text-sm text-gray-500">Loading trainers...</p>
              ) : trainers.length === 0 ? (
                <p className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700">
                  No reusable trainers yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {trainers.map((trainer) => (
                    <div
                      key={trainer.id || `${trainer.name}-${trainer.title}`}
                      className="rounded-xl border border-gray-200 p-4 dark:border-gray-800"
                    >
                      <div className="flex items-start gap-4">
                        {trainer.image ? (
                          <img
                            src={trainer.image}
                            alt={trainer.name}
                            className="h-14 w-14 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-14 w-14 rounded-full bg-[#FFF5E6]" />
                        )}

                        <div className="min-w-0 flex-1">
                          <p className="font-semibold">{trainer.name}</p>
                          <p className="text-sm text-[#D19537]">{trainer.title}</p>
                          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {trainer.bio || "No bio added yet."}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentTrainer(trainer);
                            setImageFile(null);
                          }}
                          className="h-10 rounded-lg bg-[#FFF5E6] px-4 text-sm font-semibold text-[#D19537]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTrainer(trainer.id)}
                          className="h-10 rounded-lg bg-red-50 px-4 text-sm font-semibold text-[#D6111A]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-[#101010]">
              <div className="mb-5">
                <h2 className="text-lg font-semibold">
                  {currentTrainer.id ? "Edit Trainer" : "Create Trainer"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Core fields are name, title or role, bio, and image. Contact links are optional.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Image</label>
                  {currentTrainer.image ? (
                    <img
                      src={currentTrainer.image}
                      alt="Trainer"
                      className="h-24 w-24 rounded-xl object-cover"
                    />
                  ) : null}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="mt-3 block text-sm" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="text"
                    value={currentTrainer.name}
                    onChange={(e) =>
                      setCurrentTrainer((current) => ({ ...current, name: e.target.value }))
                    }
                    className="h-12 rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={currentTrainer.title}
                    onChange={(e) =>
                      setCurrentTrainer((current) => ({ ...current, title: e.target.value }))
                    }
                    className="h-12 rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                    placeholder="Title / role"
                  />
                </div>

                <textarea
                  value={currentTrainer.bio}
                  onChange={(e) =>
                    setCurrentTrainer((current) => ({ ...current, bio: e.target.value }))
                  }
                  className="min-h-[120px] w-full rounded-lg border border-gray-200 px-4 py-3 text-sm dark:border-gray-700 dark:bg-[#181818]"
                  placeholder="Bio"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="email"
                    value={currentTrainer.email}
                    onChange={(e) =>
                      setCurrentTrainer((current) => ({ ...current, email: e.target.value }))
                    }
                    className="h-12 rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    value={currentTrainer.phone}
                    onChange={(e) =>
                      setCurrentTrainer((current) => ({ ...current, phone: e.target.value }))
                    }
                    className="h-12 rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                    placeholder="Phone"
                  />
                </div>

                <input
                  type="url"
                  value={currentTrainer.website}
                  onChange={(e) =>
                    setCurrentTrainer((current) => ({ ...current, website: e.target.value }))
                  }
                  className="h-12 rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                  placeholder="Website"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    type="url"
                    value={currentTrainer.socials.linkedin}
                    onChange={(e) =>
                      setCurrentTrainer((current) => ({
                        ...current,
                        socials: { ...current.socials, linkedin: e.target.value },
                      }))
                    }
                    className="h-12 rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                    placeholder="LinkedIn URL"
                  />
                  <input
                    type="url"
                    value={currentTrainer.socials.twitter}
                    onChange={(e) =>
                      setCurrentTrainer((current) => ({
                        ...current,
                        socials: { ...current.socials, twitter: e.target.value },
                      }))
                    }
                    className="h-12 rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                    placeholder="Twitter / X URL"
                  />
                  <input
                    type="url"
                    value={currentTrainer.socials.instagram}
                    onChange={(e) =>
                      setCurrentTrainer((current) => ({
                        ...current,
                        socials: { ...current.socials, instagram: e.target.value },
                      }))
                    }
                    className="h-12 rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                    placeholder="Instagram URL"
                  />
                  <input
                    type="url"
                    value={currentTrainer.socials.facebook}
                    onChange={(e) =>
                      setCurrentTrainer((current) => ({
                        ...current,
                        socials: { ...current.socials, facebook: e.target.value },
                      }))
                    }
                    className="h-12 rounded-lg border border-gray-200 px-4 text-sm dark:border-gray-700 dark:bg-[#181818]"
                    placeholder="Facebook URL"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleSaveTrainer}
                    disabled={saving}
                    className="h-11 flex-1 rounded-xl bg-[#D19537] px-6 text-sm font-semibold text-white"
                  >
                    {saving ? "Saving..." : currentTrainer.id ? "Update Trainer" : "Create Trainer"}
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
