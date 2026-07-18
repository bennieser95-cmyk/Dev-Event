'use client';

import Image from "next/image";
import posthog from "posthog-js";

const ExploreBtn = () => {
    const handleClick = () => {
        console.log('Click');
        posthog.capture('explore_clicked');
    };

    return (
        <button type="button" id="explore-btn" className="mt-7 max-auto" onClick={handleClick}>

            <a href="#events">
                ExploreBtn
                <Image src="/icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
            </a>
        </button>
    )
}
export default ExploreBtn