import ExploreCard from "./explore-card";

export default function Explore() {
  return (
    <section className="mx-auto mt-10 sm:mt-16 sm:mb-4 mb-4">
      <h2 className="text-xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center sm:text-left">
        Explore More Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <ExploreCard
          image="/images/event-venue-1.png"
          title="Music Fiesta 2025"
          description="Join an unforgettable night of music and fun."
          location="California"
          date="13 June 2025"
          price="$ 99.99"
          audience="150 Audience"
          time="08:00 PM - 09:00 PM"
          host="Eric Grusdonas"
          cta="Join Now"
        />
        <ExploreCard
          image="/images/event-venue-2.png"
          title="Startup Pitch Battle"
          description="Watch innovative startups compete live on stage."
          location="California"
          date="13 June 2025"
          price="$ 99.99"
          audience="150 Audience"
          time="08:00 PM - 09:00 PM"
          host="Eric Grusdonas"
          cta="Reserve Seat"
        />
      </div>
    </section>
  );
}

