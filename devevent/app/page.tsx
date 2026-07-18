import LightRays from "@/components/LightRays";
import ExploreBtn from "@/components/ExploreBtn";
import EventLearnMoreBtn from "@/components/EventLearnMoreBtn";
import Image from 'next/image';

const Page = () => {
  return (
    <section id="home" className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <LightRays
          raysOrigin="top-center"
          raysColor="#5dfeca"
          raysSpeed={0.5}
          lightSpread={0.9}
          rayLength={1.4}
          followMouse={true}
          mouseInfluence={0.02}
          noiseAmount={0.0}
          distortion={0.01}
          className="custom-rays"
        />
      </div>

      <main>
        <h1 className="text-center">
          The Hub for Every Dev
          <br />
          Event You Can&apos;t Miss
        </h1>
        <p className="subheading">
          Hackathons, Meetups, and Conferences, All in One Place
        </p>
        <ExploreBtn />

        <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>

          <ul className="events">
            {[1, 2, 3, 4, 5].map((event) => (
              <li key={event} className="event-card">
                <div className="event-image">
                  <img
                    src={`/images/event${event}.png`}
                    alt={`Event ${event}`}
                  />
                </div>
                <div className="event-details">
                  <h4>Event {event}</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  </p>
                  <EventLearnMoreBtn eventId={event} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>


    </section>
  );
};

export default Page;