import LightRays from "@/components/LightRays";
import ExploreBtn from "@/components/ExploreBtn";


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
      </main>

    </section>
  );
};

export default Page;