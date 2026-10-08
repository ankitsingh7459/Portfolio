import { SectionHeading } from '../../components/SectionHeading';
import { Reveal } from '../../components/Reveal';
import { stackData } from '../../data/stack';

export const Stack = () => {
  const entries = Object.entries(stackData);

  return (
    <section id="stack" className="section-padding py-20" aria-label="Tech Stack">
      <SectionHeading
        command="cat stack.json"
        prompt="$"
        description="Core languages, libraries, platforms, and databases used in production."
      />

      <Reveal>
        <div className="border border-[#2E2A21] bg-[#16140F] p-6 md:p-8 rounded-[2px] max-w-3xl">
          <div className="font-mono text-sm leading-relaxed">
            <span className="text-[#E8A33D] select-none block" aria-hidden="true">
              &#123;
            </span>

            <dl className="space-y-4 pl-4 md:pl-6 my-2">
              {entries.map(([category, items], idx) => (
                <div key={category} className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                  <dt className="text-[#F1E9D2] shrink-0 font-semibold">
                    &quot;{category}&quot;:
                  </dt>
                  <dd className="flex-1 flex flex-wrap items-center">
                    <span className="text-[#E8A33D] mr-1 select-none" aria-hidden="true">
                      [
                    </span>
                    <ul
                      className="inline-flex flex-wrap gap-x-2 gap-y-1 list-none p-0 m-0"
                      aria-label={category}
                    >
                      {items.map((item, itemIdx) => (
                        <li key={item} className="inline-flex items-center text-[#B9B09A]">
                          <span className="text-[#F1E9D2]">&quot;{item}&quot;</span>
                          {itemIdx < items.length - 1 && (
                            <span className="text-[#E8A33D] select-none mr-1" aria-hidden="true">
                              ,
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                    <span className="text-[#E8A33D] ml-1 select-none" aria-hidden="true">
                      ]
                    </span>
                    {idx < entries.length - 1 && (
                      <span className="text-[#E8A33D] select-none" aria-hidden="true">
                        ,
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <span className="text-[#E8A33D] select-none block" aria-hidden="true">
              &#125;
            </span>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default Stack;
