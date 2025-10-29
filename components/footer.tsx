import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-[#000000] text-white py-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-8 text-left items-start justify-items-start">
          {/* Logo and description */}
          <div className="flex flex-col items-start">
            <Image
              src="/images/footer-logo.png"
              alt="Good Life Trainings"
              width={180}
              height={50}
              className="h-12 w-auto mb-4 "
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-2 max-w-[260px]">
              Vivamus tristique odio sit amet velit semper,
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-2 max-w-[260px]">
              eu posuere turpis interdum.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-[260px]">
              Cras egestas purus
            </p>
          </div>

          {/* Company Info */}
          <div className="flex flex-col items-start">
            <h3 className="text-white font-bold text-lg mb-4">Company Info</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="flex flex-col items-start">
            <h3 className="text-white font-bold text-lg mb-4">Help</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/FAQ,s"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-services"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="flex flex-col items-start">
            <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  Twitter
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  YouTube
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400 text-xs sm:text-sm">
            ©2025 Event Core. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
