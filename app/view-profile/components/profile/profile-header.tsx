import Image from "next/image";

export default function ProfileHeader() {
  return (
    <section className="pt-8 sm:pt-10 text-center">
      <h1 className="text-[24px] sm:text-[32px] sm:text-left font-semibold mb-6 sm:mb-0">
        My Profile
      </h1>

      <div className="flex flex-col items-center mt-2 sm:mt-6">
        <p className="text-lg font-medium mb-3">Profile Photo</p>
        <div className="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full ring-1 ring-border bg-gray-100 flex items-center justify-center">
          <Image
            src="/images/profile.jpg"
            width={112}
            height={112}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
