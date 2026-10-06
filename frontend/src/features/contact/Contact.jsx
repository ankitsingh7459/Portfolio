import { SectionHeading } from '../../components/SectionHeading';
import { Reveal } from '../../components/Reveal';
import { useContactForm } from './useContactForm';
import { contactData } from '../../data/contact';

const isRealUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (
    trimmed === '' ||
    trimmed === '#' ||
    trimmed.startsWith('[FILL') ||
    trimmed.includes('[FILL') ||
    trimmed === 'null' ||
    trimmed === 'undefined'
  ) {
    return false;
  }
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('/')
  );
};

export const Contact = () => {
  const {
    formData,
    errors,
    status,
    statusMessage,
    nameRef,
    emailRef,
    messageRef,
    handleChange,
    handleSubmit,
    resetForm,
    isSubmitting,
  } = useContactForm();

  const isEmailReal = isRealUrl(contactData.email);
  const isLinkedInReal = isRealUrl(contactData.linkedinUrl);
  const isGithubReal = isRealUrl(contactData.githubUrl);

  return (
    <section id="contact" className="section-padding py-20" aria-label="Contact">
      <SectionHeading
        command={contactData.heading || 'mail ankit'}
        prompt={contactData.prompt || '$'}
        description={contactData.description || 'Send a message or reach out directly for engineering work.'}
      />

      <div className="max-w-2xl">
        <Reveal>
          <div className="border border-[#2E2A21] bg-[#16140F] p-6 md:p-8 rounded-[2px]">
            {/* Success state */}
            {status === 'success' ? (
              <div role="status" className="space-y-4 font-mono text-sm">
                <div className="border border-[#8FB573]/40 bg-[#8FB573]/10 text-[#8FB573] p-4 rounded-[2px] flex items-center gap-2">
                  <span aria-hidden="true">&gt;</span>
                  <span>{statusMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-[#E8A33D] hover:underline focus-visible:outline-2 focus-visible:outline-[#E8A33D] rounded-[2px]"
                >
                  $ mail --again
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Status banner for server / rate limit / network errors */}
                {(status === 'error' || status === 'rate_limited') && (
                  <div
                    role="alert"
                    className="border border-[#D9644A]/40 bg-[#D9644A]/10 text-[#D9644A] p-3.5 rounded-[2px] font-mono text-xs flex items-center gap-2"
                  >
                    <span aria-hidden="true">//</span>
                    <span>{statusMessage}</span>
                  </div>
                )}

                {/* Name Field */}
                <div>
                  <label htmlFor="contact-name" className="block font-mono text-xs text-[#B9B09A] mb-1.5">
                    name <span className="text-[#E8A33D]">*</span>
                  </label>
                  <input
                    ref={nameRef}
                    id="contact-name"
                    name="name"
                    type="text"
                    maxLength={100}
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                    placeholder="Your name"
                    className="w-full bg-[#1E1B15] border border-[#706654] focus:border-[#E8A33D] rounded-[2px] px-3.5 py-2.5 font-mono text-sm text-[#F1E9D2] placeholder-[#B9B09A]/40 min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 transition-colors"
                  />
                  {errors.name && (
                    <p id="contact-name-error" className="font-mono text-xs text-[#D9644A] mt-1.5 flex items-center gap-1">
                      <span aria-hidden="true">//</span>
                      <span>{errors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="contact-email" className="block font-mono text-xs text-[#B9B09A] mb-1.5">
                    email <span className="text-[#E8A33D]">*</span>
                  </label>
                  <input
                    ref={emailRef}
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                    placeholder="you@domain.com"
                    className="w-full bg-[#1E1B15] border border-[#706654] focus:border-[#E8A33D] rounded-[2px] px-3.5 py-2.5 font-mono text-sm text-[#F1E9D2] placeholder-[#B9B09A]/40 min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 transition-colors"
                  />
                  {errors.email && (
                    <p id="contact-email-error" className="font-mono text-xs text-[#D9644A] mt-1.5 flex items-center gap-1">
                      <span aria-hidden="true">//</span>
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="contact-message" className="block font-mono text-xs text-[#B9B09A] mb-1.5">
                    message <span className="text-[#E8A33D]">*</span>
                  </label>
                  <textarea
                    ref={messageRef}
                    id="contact-message"
                    name="message"
                    rows={5}
                    maxLength={2000}
                    value={formData.message}
                    onChange={handleChange}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                    placeholder="Brief outline of the project, question, or opportunity..."
                    className="w-full bg-[#1E1B15] border border-[#706654] focus:border-[#E8A33D] rounded-[2px] p-3.5 font-mono text-sm text-[#F1E9D2] placeholder-[#B9B09A]/40 min-h-[120px] focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 transition-colors resize-y"
                  />
                  {errors.message && (
                    <p id="contact-message-error" className="font-mono text-xs text-[#D9644A] mt-1.5 flex items-center gap-1">
                      <span aria-hidden="true">//</span>
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="font-mono text-sm font-semibold bg-[#E8A33D] text-[#16140F] px-6 py-2.5 rounded-[2px] hover:bg-[#E8A33D]/90 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 transition-colors inline-flex items-center gap-2"
                  >
                    <span>{isSubmitting ? 'sending...' : 'send message'}</span>
                    <span aria-hidden="true">→</span>
                  </button>
                  <span className="font-mono text-[10px] text-[#B9B09A]/60">
                    max 2000 chars
                  </span>
                </div>
              </form>
            )}
          </div>
        </Reveal>

        {/* Direct Links section */}
        <Reveal delay={0.1}>
          <div className="mt-8 border-t border-[#2E2A21] pt-6 font-mono text-xs space-y-2">
            <p className="text-[#B9B09A]">
              <span className="text-[#E8A33D] mr-2" aria-hidden="true">//</span>
              <span>direct channels:</span>
            </p>
            <div className="flex flex-wrap items-center gap-4 text-[#B9B09A]">
              {isGithubReal ? (
                <a
                  href={contactData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E8A33D] hover:underline focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 rounded-[2px] inline-flex items-center gap-1"
                >
                  <span>github</span>
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              ) : (
                <span className="text-[#B9B09A]/60 select-none">[github]</span>
              )}

              {isLinkedInReal ? (
                <a
                  href={contactData.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#E8A33D] hover:underline focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 rounded-[2px] inline-flex items-center gap-1"
                >
                  <span>linkedin</span>
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              ) : (
                <span className="text-[#B9B09A]/60 select-none">[linkedin: pending]</span>
              )}

              {isEmailReal && (
                <a
                  href={contactData.email.startsWith('mailto:') ? contactData.email : `mailto:${contactData.email}`}
                  className="hover:text-[#E8A33D] hover:underline focus-visible:outline-2 focus-visible:outline-[#E8A33D] focus-visible:outline-offset-2 rounded-[2px] inline-flex items-center gap-1"
                >
                  <span>email</span>
                  <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
