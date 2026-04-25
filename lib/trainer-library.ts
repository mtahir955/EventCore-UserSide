import { apiClient } from "@/lib/apiClient";

export type TrainerLibraryRecord = {
  id: string;
  name: string;
  title: string;
  bio: string;
  image: string;
  email: string;
  phone: string;
  website: string;
  socials: {
    linkedin: string;
    twitter: string;
    instagram: string;
    facebook: string;
    tiktok: string;
  };
};

export const EMPTY_TRAINER_RECORD: TrainerLibraryRecord = {
  id: "",
  name: "",
  title: "",
  bio: "",
  image: "",
  email: "",
  phone: "",
  website: "",
  socials: {
    linkedin: "",
    twitter: "",
    instagram: "",
    facebook: "",
    tiktok: "",
  },
};

const TRAINER_LIBRARY_ENDPOINT = "/trainers/library";

export const normalizeTrainerRecord = (trainer: any): TrainerLibraryRecord => ({
  id: String(trainer?.id || trainer?.trainerId || trainer?._id || ""),
  name: String(trainer?.name || trainer?.fullName || ""),
  title: String(trainer?.title || trainer?.role || trainer?.designation || ""),
  bio: String(trainer?.bio || trainer?.description || ""),
  image: String(trainer?.image || trainer?.avatar || ""),
  email: String(trainer?.email || ""),
  phone: String(trainer?.phone || trainer?.phoneNumber || ""),
  website: String(trainer?.website || trainer?.socials?.website || ""),
  socials: {
    linkedin: String(trainer?.socials?.linkedin || trainer?.linkedin || ""),
    twitter: String(trainer?.socials?.twitter || trainer?.twitter || ""),
    instagram: String(trainer?.socials?.instagram || trainer?.instagram || ""),
    facebook: String(trainer?.socials?.facebook || trainer?.facebook || ""),
    tiktok: String(trainer?.socials?.tiktok || trainer?.tiktok || ""),
  },
});

const extractTrainerArray = (payload: any) => {
  const candidates = [
    payload?.data?.trainers,
    payload?.data?.items,
    payload?.data,
    payload?.trainers,
    payload?.items,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.map(normalizeTrainerRecord);
    }
  }

  return [];
};

export const fetchTrainerLibrary = async () => {
  const response = await apiClient.get(TRAINER_LIBRARY_ENDPOINT);
  return extractTrainerArray(response.data);
};

const appendTrainerPayload = (
  formData: FormData,
  trainer: TrainerLibraryRecord,
  imageFile?: File | null
) => {
  formData.append("name", trainer.name);
  formData.append("title", trainer.title);
  formData.append("role", trainer.title);
  formData.append("designation", trainer.title);
  formData.append("bio", trainer.bio);
  formData.append("description", trainer.bio);
  formData.append("email", trainer.email);
  formData.append("phone", trainer.phone);
  formData.append("website", trainer.website);
  formData.append("linkedin", trainer.socials.linkedin);
  formData.append("twitter", trainer.socials.twitter);
  formData.append("instagram", trainer.socials.instagram);
  formData.append("facebook", trainer.socials.facebook);
  formData.append("tiktok", trainer.socials.tiktok);
  formData.append("socials", JSON.stringify(trainer.socials));

  if (trainer.image && !imageFile) {
    formData.append("image", trainer.image);
  }

  if (imageFile) {
    formData.append("image", imageFile);
  }
};

export const saveTrainerLibraryRecord = async (
  trainer: TrainerLibraryRecord,
  imageFile?: File | null
) => {
  const formData = new FormData();
  appendTrainerPayload(formData, trainer, imageFile);

  const response = trainer.id
    ? await apiClient.put(`${TRAINER_LIBRARY_ENDPOINT}/${trainer.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
    : await apiClient.post(TRAINER_LIBRARY_ENDPOINT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

  return normalizeTrainerRecord(response.data?.data || response.data || trainer);
};

export const deleteTrainerLibraryRecord = async (trainerId: string) => {
  await apiClient.delete(`${TRAINER_LIBRARY_ENDPOINT}/${trainerId}`);
};

export const serializeEventTrainersForFormData = (
  formData: FormData,
  trainers: TrainerLibraryRecord[]
) => {
  const serialized = trainers.map((trainer, index) => {
    const nextTrainer = {
      name: trainer.name,
      title: trainer.title,
      role: trainer.title,
      designation: trainer.title,
      bio: trainer.bio,
      description: trainer.bio,
      image: trainer.image && !trainer.image.startsWith("data:") ? trainer.image : "",
      email: trainer.email,
      phone: trainer.phone,
      website: trainer.website,
      socials: trainer.socials,
      linkedin: trainer.socials.linkedin,
      twitter: trainer.socials.twitter,
      instagram: trainer.socials.instagram,
      facebook: trainer.socials.facebook,
      tiktok: trainer.socials.tiktok,
    };

    if (trainer.image?.startsWith("data:")) {
      const [meta, rawBase64] = trainer.image.split(",");
      const mime = meta?.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
      const ext = mime.split("/")[1] || "jpg";
      const bytes = atob(rawBase64 || "");
      const buffer = new Uint8Array(bytes.length);

      for (let i = 0; i < bytes.length; i += 1) {
        buffer[i] = bytes.charCodeAt(i);
      }

      formData.append(
        "trainerImages",
        new File([buffer], `trainer-${index + 1}.${ext}`, { type: mime })
      );
    }

    return nextTrainer;
  });

  formData.append("trainers", JSON.stringify(serialized));
};
