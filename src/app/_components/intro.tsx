import { SITE_DESCRIPTION, SITE_TITLE } from "@/lib/constants";

export function Intro() {
  return (
    <section className="flex-col md:flex-row flex items-center md:justify-between mt-4 mb-8 md:mb-4">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight md:pr-8">
        {SITE_TITLE}
      </h1>
      <h4 className="text-center md:text-left text-lg mt-5 md:pl-8">
        {SITE_DESCRIPTION}
      </h4>
    </section>
  );
}
