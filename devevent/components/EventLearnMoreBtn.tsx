'use client';

import posthog from "posthog-js";

interface EventLearnMoreBtnProps {
  eventId: number;
}

const EventLearnMoreBtn = ({ eventId }: EventLearnMoreBtnProps) => {
  const handleClick = () => {
    posthog.capture('learn_more_clicked', {
      event_id: eventId,
    });
  };

  return (
    <button className="event-button" onClick={handleClick}>
      Learn More
    </button>
  );
};

export default EventLearnMoreBtn;
