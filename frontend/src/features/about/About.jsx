import { SectionHeading } from '../../components/SectionHeading';
import { Reveal } from '../../components/Reveal';
import { aboutLines } from '../../data/about';

export const About = () => {
  return (
    <section id="about" className="section-padding py-20" aria-label="About">
      <SectionHeading
        command="cat about.txt"
        prompt="$"
        description="Background, engineering focus, and technical direction."
      />

      <Reveal>
        <div className="border border-[#2E2A21] bg-[#16140F] p-6 md:p-8 rounded-[2px] max-w-[65ch]">
          <div className="space-y-4 font-mono text-sm md:text-base text-[#B9B09A] leading-relaxed">
            {aboutLines.map((line, idx) => (
              <p key={idx} className="flex items-start gap-3">
                <span
                  className="text-[#E8A33D]/60 select-none shrink-0 font-mono text-xs pt-0.5"
                  aria-hidden="true"
                >
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <span className="text-[#F1E9D2]">{line}</span>
              </p>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default About;
