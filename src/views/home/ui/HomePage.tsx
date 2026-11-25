import { About } from "@/widgets/about";
import { Contact } from "@/widgets/contact";
import { Hero } from "@/widgets/hero";
import { Preloader } from "@/widgets/preloader";
import { Services } from "@/widgets/services";
import { Stack } from "@/widgets/stack";
import { Work } from "@/widgets/work";
import { PageReady } from "@/shared/lib/page-ready";

/** Without scripts the intro screen would never lift — hide it and let the content show. */
const noScriptStyles =
    "[data-preloader]{display:none!important}[data-enter]{animation:none!important}";

export function HomePage() {
    return (
        <>
            <noscript>
                <style>{noScriptStyles}</style>
            </noscript>
            <Preloader />
            <Hero />
            <About />
            <Work />
            <Services />
            <Stack />
            <Contact />
            <PageReady />
        </>
    );
}
