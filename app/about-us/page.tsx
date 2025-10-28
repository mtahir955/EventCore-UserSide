"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#101010] text-black dark:text-white transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[450px] flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/images/about-hero.jpg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          {/* Keep overlay same brightness in both modes */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            LIVIN&apos; THE{" "}
            <span className="text-[#89FC00] italic font-serif">Good Life</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/95 leading-relaxed">
            Discover the essential solutions that power every successful event,
            from planning to unforgettable experiences.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-10 md:px-16 py-12 sm:py-20 md:py-24 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 md:order-1">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">
              About{" "}
              <span className="text-[#89FC00] italic font-serif">
                Good Life Training
              </span>
            </h2>

            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
              varius faucibus massa sollicitudin amet augue. Nibh metus a semper
              purus mauris duis. Lorem eu neque, tristique quis duis. Nibh
              scelerisque ac adipiscing velit non nulla in amet pellentesque.
              Sit turpis pretium eget maecenas. Vestibulum dolor mattis
              consectetur eget commodo vitae.
            </p>

            <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
              Amet pellentesque sit pulvinar lorem mi a, euismod risus rhoncus.
              Elementum ullamcorper nec, habitasse vulputate. Eget dictum quis
              est sed egestas tellus, a lectus. Quam ullamcorper in fringilla
              arcu aliquet tomes arcu. Lacinia eget faucibus urna, nam risus nec
              elementum cras porta. Sed elementum, sed dolor purus dolor dui. Ut
              dictum nulla pulvinar vulputate sit sagittis in eleifend
              dignissim. Natoque mauris cras molestie velit. Maecenas eget
              adipiscing quisque viverra lectus arcu, tincidunt ultrices
              pellentesque.
            </p>

            <Link href="/contact-us">
            <Button className="bg-[#0077F7] hover:bg-[#0066DD] text-white px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg rounded-full">
              Get Started
            </Button>
            </Link>
          </div>

          {/* Image */}
          <div className="relative h-[280px] sm:h-[400px] md:h-[600px] order-1 md:order-2">
            <Image
              src="/images/about.png"
              alt="Team meeting"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-gray-50 dark:bg-[#1A1A1A] py-12 sm:py-16 md:py-20 transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 md:px-16 text-center">
          {/* Stars */}
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 sm:w-6 sm:h-6 fill-[#FFD700] text-[#FFD700]"
              />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-gray-100 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2">
            &quot;
            <span className="text-[#89FC00] italic font-serif">
              Good Life Training
            </span>{" "}
            made our conference seamless and stress-free. Everything was
            perfectly organized, and our guests loved the experience!&quot;
          </blockquote>

          {/* Author Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Avatar%20Image-vhwVQXvTh84eptfz94cJWsdilwjBAV.png"
                alt="Olivia Grant"
                width={56}
                height={56}
                className="rounded-full"
              />
              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">
                  Olivia Grant
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                  Mindset & Growth Expert
                </div>
              </div>
            </div>

            {/* Divider (hidden on mobile) */}
            <div className="hidden sm:block h-12 w-px bg-gray-300 dark:bg-gray-700" />

            {/* Logo */}
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/webflow-Logo-UGcKFzTTM8HxjXdtPhHmsBqmivFi2O.png"
              alt="Webflow"
              width={90}
              height={24}
              className="h-6 w-auto opacity-90 dark:opacity-100"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
