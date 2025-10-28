import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import OrderSummary from "../check-out/components/checkout/order-summary";
import BasicInformation from "../check-out/components/checkout/form-sections/basic-information";
import ContactDetails from "../check-out/components/checkout/form-sections/contact-details";
import PaymentDetails from "../check-out/components/checkout/form-sections/payment-details";

export default function Page() {
  return (
    <main className="bg-background text-foreground">
      {/* Header */}
      <Header />

      {/* Main Checkout Section */}
      <section className="mx-auto w-full max-w-[1440px] px-6 md:px-10 pb-12">
        {/* Two-column layout */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_420px]">
          {/* Left column - Forms */}
          <div className="space-y-8">
            <BasicInformation />
            <ContactDetails />
            <PaymentDetails />
          </div>

          {/* Right column - Order Summary */}
          <aside className="lg:pt-2">
            <OrderSummary />
          </aside>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
