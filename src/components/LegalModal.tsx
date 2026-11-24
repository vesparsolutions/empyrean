import React, { useEffect } from 'react';
import { X, ShieldCheck, FileText, ExternalLink } from 'lucide-react';

export type LegalTab = 'privacy' | 'terms';

interface LegalModalProps {
  isOpen: boolean;
  activeTab: LegalTab;
  onClose: () => void;
  onTabChange: (tab: LegalTab) => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  activeTab,
  onClose,
  onTabChange,
}) => {
  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 animate-fadeIn"
    >
      {/* Dark frosted overlay backdrop */}
      <div
        className="absolute inset-0 bg-[#071026]/85 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main parchment card modal */}
      <div
        className="relative z-10 w-full max-w-4xl max-h-[90vh] bg-[#FAF4E8] text-[#1a0f05] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] border border-[#b45309]/30 flex flex-col overflow-hidden animate-scaleUp font-body"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="shrink-0 bg-[#FAF4E8] border-b border-[#b45309]/20 px-5 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b45309]/10 border border-[#b45309]/25 flex items-center justify-center text-[#991b1b]">
              {activeTab === 'privacy' ? (
                <ShieldCheck className="w-5 h-5 text-[#991b1b]" />
              ) : (
                <FileText className="w-5 h-5 text-[#991b1b]" />
              )}
            </div>
            <div>
              <h2
                id="legal-modal-title"
                className="font-sub text-lg sm:text-2xl font-bold uppercase tracking-wider text-[#1a0f05]"
              >
                {activeTab === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h2>
              <p className="text-[11px] sm:text-xs font-mono text-[#b45309] font-medium">
                Last Updated: 24 November 2026 • IIM Jammu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch pills */}
            <div className="hidden sm:flex items-center bg-[#b45309]/10 p-1 rounded-full border border-[#b45309]/20 text-xs font-sub font-semibold">
              <button
                type="button"
                onClick={() => onTabChange('privacy')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === 'privacy'
                    ? 'bg-[#991b1b] text-[#fff8ed] shadow-sm font-bold'
                    : 'text-[#1a0f05]/75 hover:text-[#991b1b]'
                }`}
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => onTabChange('terms')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  activeTab === 'terms'
                    ? 'bg-[#991b1b] text-[#fff8ed] shadow-sm font-bold'
                    : 'text-[#1a0f05]/75 hover:text-[#991b1b]'
                }`}
              >
                Terms of Service
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 sm:p-2.5 rounded-full hover:bg-[#b45309]/15 text-[#1a0f05] transition-colors cursor-pointer"
              aria-label="Close legal modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MOBILE TAB SWITCHER */}
        <div className="sm:hidden flex border-b border-[#b45309]/15 bg-[#FAF4E8]">
          <button
            type="button"
            onClick={() => onTabChange('privacy')}
            className={`flex-1 py-2.5 text-xs font-sub font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
              activeTab === 'privacy'
                ? 'border-[#991b1b] text-[#991b1b] bg-[#b45309]/5'
                : 'border-transparent text-[#1a0f05]/65'
            }`}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={() => onTabChange('terms')}
            className={`flex-1 py-2.5 text-xs font-sub font-bold uppercase tracking-wider text-center border-b-2 transition-all ${
              activeTab === 'terms'
                ? 'border-[#991b1b] text-[#991b1b] bg-[#b45309]/5'
                : 'border-transparent text-[#1a0f05]/65'
            }`}
          >
            Terms of Service
          </button>
        </div>

        {/* SCROLLABLE LEGAL BODY CONTENT */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-8 md:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8 text-sm sm:text-base leading-relaxed text-[#2c1d11]">
          {activeTab === 'privacy' ? (
            /* ==========================================================
               PRIVACY POLICY CONTENT
               ========================================================== */
            <article className="space-y-6">
              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  1. Introduction
                </h3>
                <p>
                  Welcome to the official website of Empyrean, the annual fest of the Indian Institute of Management Jammu (IIM Jammu).
                </p>
                <p>
                  At Empyrean, we value your privacy and are committed to protecting the personal information shared with us through our website. This Privacy Policy explains what information we collect, how it is used, how it is protected and the circumstances under which it may be shared.
                </p>
                <p>
                  This website has been designed and developed by Vespar Solutions, which provides website development and technical support to Empyrean.
                </p>
                <p>
                  By accessing or using this website, you acknowledge that you have read this Privacy Policy.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  2. Information We Collect
                </h3>
                <p>Depending on the features you use, we may collect the following information:</p>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm">
                  <li>
                    <strong className="text-[#1a0f05]">Personal Information:</strong> Full name, email address and mobile number.
                  </li>
                  <li>
                    <strong className="text-[#1a0f05]">Academic Information:</strong> College or university name, institution, course and academic year.
                  </li>
                  <li>
                    <strong className="text-[#1a0f05]">Registration Information:</strong> Selected events, team details, participant information, registration status and ticket-related details.
                  </li>
                  <li>
                    <strong className="text-[#1a0f05]">Payment Verification Information:</strong> Transaction Reference Number (UTR) submitted by participants for payment verification.
                  </li>
                  <li>
                    <strong className="text-[#1a0f05]">Communication Information:</strong> Information provided when contacting the organising team or submitting an enquiry.
                  </li>
                  <li>
                    <strong className="text-[#1a0f05]">Technical Information:</strong> Browser type, device information, IP address, access timestamps and basic website usage data, where collected automatically.
                  </li>
                </ul>
                <p className="text-xs sm:text-sm italic text-[#5c4033]">
                  We collect information relevant to event registration, participation, payment verification and website functionality.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  3. How We Use Your Information
                </h3>
                <p>The information collected may be used for the following purposes:</p>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm">
                  <li>Processing event registrations and participation requests.</li>
                  <li>Generating, managing and verifying event tickets and registrations.</li>
                  <li>Verifying payments using the submitted UTR numbers.</li>
                  <li>Communicating important announcements, event updates and registration-related information.</li>
                  <li>Managing participant records and coordinating event operations.</li>
                  <li>Responding to enquiries, feedback and support requests.</li>
                  <li>Maintaining website functionality, security and performance.</li>
                  <li>Preventing fraudulent registrations, payment discrepancies and unauthorised access.</li>
                </ul>
                <p className="text-xs sm:text-sm font-medium text-[#1a0f05]">
                  Your information will be used for legitimate event-related and website-related purposes.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  4. Payments and Transaction Verification
                </h3>
                <p>
                  Empyrean does not directly process online payments through its website and does not operate a payment gateway.
                </p>
                <p>
                  Where an event requires a registration fee, participants are provided with a payment QR code to complete the transaction through their preferred UPI or banking application.
                </p>
                <p>
                  After completing the payment, participants may be required to submit their Unique Transaction Reference (UTR) number through the website for verification by the organising team.
                </p>
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#b45309]/10 border border-[#b45309]/20 space-y-2 text-xs sm:text-sm">
                  <p className="font-semibold text-[#991b1b]">Please note:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Payments are completed through external UPI or banking applications and not processed by the Empyrean website.</li>
                    <li>The website collects the submitted UTR number solely for transaction verification and registration management.</li>
                    <li>Empyrean does not collect UPI PINs, banking passwords, card details or OTPs through its website.</li>
                    <li>Registration or ticket confirmation may be subject to successful payment verification by the organising team.</li>
                    <li>Participants are advised to retain their transaction details until their registration has been confirmed.</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  5. Information Sharing and Disclosure
                </h3>
                <p>
                  Empyrean does not sell participants&apos; personal information to third parties.
                </p>
                <p>Information may be shared, where necessary, with:</p>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm">
                  <li>
                    <strong className="text-[#1a0f05]">IIM Jammu and the Empyrean Organising Team:</strong> For event coordination, registration management and operational requirements.
                  </li>
                  <li>
                    <strong className="text-[#1a0f05]">Technology and Service Providers:</strong> Third-party providers involved in website hosting, database management, communication and other technical services.
                  </li>
                  <li>
                    <strong className="text-[#1a0f05]">Vespar Solutions:</strong> For website maintenance, technical support, troubleshooting and related development activities, where access to information is necessary.
                  </li>
                  <li>
                    <strong className="text-[#1a0f05]">Legal Authorities:</strong> Where disclosure is required under applicable laws or pursuant to a valid legal request.
                  </li>
                </ul>
                <p className="text-xs sm:text-sm font-medium text-[#1a0f05]">
                  Any sharing of information will be limited to what is reasonably necessary for the relevant purpose.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  6. Data Storage and Security
                </h3>
                <p>
                  We take reasonable technical and organisational measures to protect the information collected through this website against unauthorised access, alteration, disclosure, loss or misuse.
                </p>
                <p>
                  Access to personal information is intended to be restricted to authorised individuals and service providers who require it for their responsibilities.
                </p>
                <p>
                  While we strive to protect your information, no method of electronic storage or transmission over the internet can be guaranteed to be completely secure.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  7. Data Retention
                </h3>
                <p>
                  Personal information will be retained only for as long as reasonably necessary to fulfil the purposes outlined in this Privacy Policy, including event administration, registration verification, record management, resolving disputes and complying with applicable legal requirements.
                </p>
                <p>
                  When information is no longer required, appropriate steps will be taken to delete it or otherwise dispose of it securely, subject to applicable retention requirements.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  8. Cookies and Website Technologies
                </h3>
                <p>
                  Our website may use cookies or similar technologies to support essential website functionality, improve performance and understand general usage patterns.
                </p>
                <p>
                  You may be able to manage or disable cookies through your browser settings. However, disabling certain cookies may affect the functionality of some website features.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  9. Third-Party Websites and Services
                </h3>
                <p>
                  Our website may contain links to external websites, platforms or services, including payment applications, event registration platforms and other third-party resources.
                </p>
                <p>
                  These external platforms operate independently and have their own privacy policies and practices. Empyrean and Vespar Solutions are not responsible for the privacy practices, content or security of external websites.
                </p>
                <p>
                  We encourage visitors to review the privacy policies of third-party platforms before sharing personal information with them.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  10. Your Privacy and Information Requests
                </h3>
                <p>You may contact us if you wish to:</p>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm">
                  <li>Request information about the personal data associated with your registration.</li>
                  <li>Request correction of inaccurate or incomplete information.</li>
                  <li>Request deletion of information where applicable.</li>
                  <li>Withdraw consent where processing is based on consent, subject to applicable requirements.</li>
                  <li>Raise concerns regarding the collection or use of your personal information.</li>
                </ul>
                <p className="text-xs sm:text-sm text-[#5c4033]">
                  Such requests will be reviewed and addressed in accordance with applicable laws and operational requirements.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  11. Changes to This Privacy Policy
                </h3>
                <p>
                  Empyrean reserves the right to update or modify this Privacy Policy whenever necessary to reflect changes in website functionality, event operations, technology or applicable legal requirements.
                </p>
                <p>
                  Any updates will be published on this page along with the revised last-updated date. Visitors are encouraged to review this page periodically.
                </p>
              </section>

              <section className="space-y-3 p-4 sm:p-5 rounded-xl bg-[#FAF5EB] border border-[#b45309]/25">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  12. Contact Us
                </h3>
                <p className="text-xs sm:text-sm">
                  For questions, concerns or requests relating to this Privacy Policy or the handling of your personal information, you may contact:
                </p>
                <div className="space-y-2 text-xs sm:text-sm pt-1">
                  <div>
                    <strong className="block text-[#1a0f05]">Empyrean – Indian Institute of Management Jammu</strong>
                    Email:{' '}
                    <a
                      href="mailto:empyrean@iimj.ac.in"
                      className="text-[#991b1b] font-medium hover:underline inline-flex items-center gap-1"
                    >
                      empyrean@iimj.ac.in <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    <strong className="block text-[#1a0f05]">Website Development Partner – Vespar Solutions</strong>
                    Email:{' '}
                    <a
                      href="mailto:founders@vesparsolutions.in"
                      className="text-[#991b1b] font-medium hover:underline inline-flex items-center gap-1"
                    >
                      founders@vesparsolutions.in <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-[#5c4033] pt-1">
                  For privacy-related requests, please contact the Empyrean organising team in the first instance.
                </p>
              </section>

              <div className="pt-4 border-t border-[#b45309]/20 text-center text-xs font-mono text-[#5c4033]">
                <p className="font-semibold text-[#1a0f05]">Empyrean | Indian Institute of Management Jammu</p>
                <p>Website designed and developed by Vespar Solutions.</p>
              </div>
            </article>
          ) : (
            /* ==========================================================
               TERMS OF SERVICE CONTENT
               ========================================================== */
            <article className="space-y-6">
              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  1. Introduction
                </h3>
                <p>
                  Welcome to the official website of Empyrean, the annual fest of the Indian Institute of Management Jammu (IIM Jammu).
                </p>
                <p>
                  These Terms of Service govern your access to and use of the Empyrean website, including its event listings, registration facilities, ticketing services and other features.
                </p>
                <p>
                  This website has been designed and developed by Vespar Solutions, which provides website development and technical support to Empyrean.
                </p>
                <p>
                  By accessing this website, registering for an event or using any of its services, you agree to comply with these Terms of Service. If you do not agree with these terms, please refrain from using the website.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  2. Eligibility and User Responsibilities
                </h3>
                <p>By using this website, you confirm that:</p>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm">
                  <li>The information you provide during registration is accurate, complete and up to date.</li>
                  <li>You are authorised to provide the personal information submitted through the website.</li>
                  <li>You will not use the website for fraudulent, unlawful or unauthorised activities.</li>
                  <li>You will not attempt to disrupt, damage, manipulate or gain unauthorised access to the website or its systems.</li>
                  <li>You will comply with the rules, instructions and guidelines communicated by the Empyrean Organising Committee.</li>
                </ul>
                <p className="text-xs sm:text-sm font-medium text-[#1a0f05]">
                  Participants are responsible for ensuring that all information submitted during registration is correct.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  3. Event Registration
                </h3>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm">
                  <li>The website may provide information about various events, competitions, activities and other fest-related programmes organised as part of Empyrean.</li>
                  <li>Registration must be completed through the designated registration process for the respective event.</li>
                  <li>Certain events may require individual registration, while others may require team registration.</li>
                  <li>Registration confirmation is subject to the requirements and eligibility criteria specified for the respective event.</li>
                  <li>Submission of a registration form does not necessarily guarantee participation unless the registration has been successfully confirmed.</li>
                  <li>Participants are responsible for reviewing event-specific instructions, deadlines and eligibility requirements before registering.</li>
                  <li>The Empyrean Organising Committee reserves the right to verify registration details and reject registrations containing inaccurate, misleading or incomplete information.</li>
                  <li>Where an event uses an external registration platform, its additional terms and conditions may also apply.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  4. Payments and Transaction Verification
                </h3>
                <p>Certain events or activities may require a registration or participation fee.</p>
                <p>Empyrean does not directly process online payments through its website and does not operate a payment gateway.</p>
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#b45309]/10 border border-[#b45309]/20 space-y-2 text-xs sm:text-sm">
                  <p className="font-semibold text-[#991b1b]">Where a fee is applicable:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Participants will be provided with a designated QR code or payment instructions.</li>
                    <li>Payments must be completed using the participant&apos;s preferred UPI or banking application.</li>
                    <li>Participants may be required to submit their Unique Transaction Reference (UTR) number through the website for payment verification.</li>
                    <li>Registration or ticket confirmation may remain pending until the organising team successfully verifies the submitted transaction details.</li>
                    <li>Participants are responsible for entering the correct UTR number and retaining their transaction confirmation until verification is complete.</li>
                    <li>Submission of a UTR number alone does not constitute confirmation of successful payment.</li>
                    <li>Participants must not share their UPI PIN, banking passwords, OTPs or other confidential payment credentials through the website.</li>
                    <li>Empyrean will not be responsible for transactions made to unauthorised accounts or through payment details obtained from unofficial sources.</li>
                  </ul>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  5. Tickets and Entry
                </h3>
                <p>Where digital or QR-based tickets are issued, the following conditions apply:</p>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm">
                  <li>A ticket is considered valid only after the applicable registration and payment verification requirements have been fulfilled.</li>
                  <li>Each ticket or QR code is intended for the participant or registration for which it was issued.</li>
                  <li>Participants must present their valid ticket or QR code at the designated entry point when required.</li>
                  <li>Entry is subject to successful ticket verification and compliance with the event&apos;s admission requirements.</li>
                  <li>The organising team reserves the right to deny entry in cases involving invalid, duplicated, altered or unverifiable tickets.</li>
                  <li>Screenshots, forwarded tickets or other copies may be subject to additional verification by the entry management team.</li>
                  <li>Possession of a ticket does not override event-specific eligibility requirements or admission rules.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  6. Event Schedules and Modifications
                </h3>
                <p>
                  Empyrean may include multiple events, competitions, performances and activities conducted across different venues and schedules.
                </p>
                <p className="font-semibold text-[#1a0f05]">The Empyrean Organising Committee reserves the right to:</p>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm">
                  <li>Modify event schedules, timings, venues or formats.</li>
                  <li>Make changes to event rules, eligibility criteria or participation requirements.</li>
                  <li>Modify event line-ups, activities or programme details.</li>
                  <li>Postpone, suspend or cancel an event due to operational, administrative, safety or unforeseen circumstances.</li>
                </ul>
                <p className="text-xs sm:text-sm text-[#5c4033]">
                  Any significant changes will be communicated through the official Empyrean website or other designated communication channels. Participants are encouraged to check official announcements for the latest event-related information.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  7. Cancellations and Refunds
                </h3>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm">
                  <li>Cancellation and refund conditions may vary depending on the specific event and its registration requirements.</li>
                  <li>Participants must refer to the refund and cancellation instructions communicated for the respective event.</li>
                  <li>Any refund request will be reviewed by the Empyrean Organising Committee in accordance with the applicable event policy.</li>
                  <li>In cases of event postponement, cancellation or significant changes, the organising committee will communicate the applicable arrangements to registered participants.</li>
                  <li>Submission of an incorrect UTR number, duplicate registration or incomplete payment verification may delay the resolution of a registration or refund request.</li>
                  <li>Nothing in these Terms is intended to exclude any refund or other entitlement that cannot lawfully be excluded under applicable law.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  8. Participant Conduct
                </h3>
                <p>All participants are expected to maintain appropriate conduct throughout Empyrean and its associated activities.</p>
                <p className="font-semibold text-[#1a0f05]">Participants must:</p>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm">
                  <li>Follow instructions issued by the organising committee, volunteers and authorised event personnel.</li>
                  <li>Respect fellow participants, guests, faculty members, organisers and institutional property.</li>
                  <li>Refrain from harassment, discrimination, intimidation, abusive behaviour or disruptive activities.</li>
                  <li>Avoid damaging or misusing event facilities, equipment or infrastructure.</li>
                  <li>Comply with applicable campus rules, safety regulations and venue-specific instructions.</li>
                </ul>
                <p className="text-xs sm:text-sm text-[#5c4033]">
                  The organising committee reserves the right to take appropriate action, including restricting participation or denying entry, in response to misconduct or violations of event rules, subject to applicable policies and law.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  9. Intellectual Property
                </h3>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm">
                  <li>All content available on the Empyrean website, including its visual identity, logos, graphics, text, photographs, artwork, design elements and other materials, may be protected by intellectual property laws.</li>
                  <li>Unless otherwise stated, such content may not be copied, reproduced, distributed, modified or used for commercial purposes without prior permission from the relevant rights holder.</li>
                  <li>The Empyrean name, branding and associated institutional identity belong to their respective rights holders.</li>
                  <li>The website&apos;s development and technical support by Vespar Solutions do not transfer ownership of Empyrean&apos;s branding or institutional content to Vespar Solutions.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  10. Third-Party Services and External Links
                </h3>
                <p>
                  The website may contain links to external websites, registration platforms, payment applications and other third-party services.
                </p>
                <p>
                  These services operate independently and may be governed by their own terms, privacy policies and conditions.
                </p>
                <p>
                  Empyrean and Vespar Solutions do not control the availability, security, content or operational policies of external platforms. Users are encouraged to review the applicable terms and policies before using any third-party service.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  11. Website Availability and Disclaimer
                </h3>
                <p>
                  We make reasonable efforts to maintain the availability and proper functioning of the website.
                </p>
                <p>
                  However, uninterrupted or error-free access cannot be guaranteed. The website may occasionally become unavailable due to maintenance, technical issues, hosting disruptions or other circumstances beyond reasonable control.
                </p>
                <p>
                  Event details, schedules, availability and other information published on the website are subject to updates and corrections. Users are encouraged to rely on official announcements from the Empyrean Organising Committee for important event-related information.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  12. Limitation of Liability
                </h3>
                <p>
                  To the extent permitted under applicable law, Empyrean and IIM Jammu shall not be liable for losses arising from:
                </p>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm">
                  <li>Temporary website interruptions or technical difficulties.</li>
                  <li>Errors in information submitted by participants.</li>
                  <li>Payment delays or transaction failures occurring through external banking or UPI applications.</li>
                  <li>Disruptions or failures of third-party platforms.</li>
                  <li>Unauthorised use of participant credentials or information resulting from circumstances beyond reasonable control.</li>
                </ul>
                <p className="text-xs sm:text-sm text-[#5c4033]">
                  Vespar Solutions acts as the website development and technical support partner and is not the organiser of Empyrean. Decisions relating to event management, participant eligibility, admission, schedules and refunds rest with the authorised organising authorities. Nothing in this section excludes liability that cannot legally be excluded under applicable law.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  13. Suspension and Restriction of Access
                </h3>
                <p>The Empyrean website administrators reserve the right to restrict, suspend or terminate access to website features where a user:</p>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1.5 text-xs sm:text-sm">
                  <li>Violates these Terms of Service.</li>
                  <li>Provides fraudulent or misleading information.</li>
                  <li>Attempts to exploit or manipulate registration or ticketing systems.</li>
                  <li>Engages in activities that threaten website security or disrupt its functioning.</li>
                </ul>
                <p className="text-xs sm:text-sm text-[#5c4033]">
                  Such action may be taken where reasonably necessary to protect the website, its users and event operations.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  14. Changes to These Terms
                </h3>
                <p>
                  Empyrean reserves the right to modify or update these Terms of Service from time to time to reflect changes in event operations, website functionality or applicable legal requirements.
                </p>
                <p>
                  Revised terms will be published on this page along with the updated date. Continued use of the website after such changes have been published constitutes acceptance of the updated terms, to the extent permitted by applicable law.
                </p>
              </section>

              <section className="space-y-3">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  15. Governing Law and Jurisdiction
                </h3>
                <p>
                  These Terms of Service shall be governed by and interpreted in accordance with the laws of India.
                </p>
                <p>
                  Any disputes arising in connection with the use of this website shall be subject to the jurisdiction of the competent courts in Jammu, Jammu and Kashmir, India, subject to applicable law.
                </p>
              </section>

              <section className="space-y-3 p-4 sm:p-5 rounded-xl bg-[#FAF5EB] border border-[#b45309]/25">
                <h3 className="font-sub text-base sm:text-lg font-bold text-[#991b1b] uppercase tracking-wide">
                  16. Contact Information
                </h3>
                <p className="text-xs sm:text-sm">
                  For questions, concerns or clarification regarding these Terms of Service, please contact:
                </p>
                <div className="space-y-2 text-xs sm:text-sm pt-1">
                  <div>
                    <strong className="block text-[#1a0f05]">Empyrean – Indian Institute of Management Jammu</strong>
                    Email:{' '}
                    <a
                      href="mailto:empyrean@iimj.ac.in"
                      className="text-[#991b1b] font-medium hover:underline inline-flex items-center gap-1"
                    >
                      empyrean@iimj.ac.in <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    <strong className="block text-[#1a0f05]">Website Development Partner – Vespar Solutions</strong>
                    Email:{' '}
                    <a
                      href="mailto:founders@vesparsolutions.in"
                      className="text-[#991b1b] font-medium hover:underline inline-flex items-center gap-1"
                    >
                      founders@vesparsolutions.in <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-[#5c4033] pt-1">
                  For matters relating to event registrations, tickets, payments, refunds and participation, please contact the Empyrean Organising Committee.
                </p>
              </section>

              <div className="pt-4 border-t border-[#b45309]/20 text-center text-xs font-mono text-[#5c4033]">
                <p className="font-semibold text-[#1a0f05]">Empyrean | Indian Institute of Management Jammu</p>
                <p>Website designed and developed by Vespar Solutions.</p>
              </div>
            </article>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="shrink-0 bg-[#FAF4E8] border-t border-[#b45309]/20 px-5 sm:px-8 py-3.5 sm:py-4 flex items-center justify-between">
          <p className="text-[11px] sm:text-xs text-[#5c4033] font-mono">
            Official Policy Document • Empyrean 2026
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#991b1b] via-[#b45309] to-[#991b1b] text-[#fff8ed] text-xs font-sub font-bold uppercase tracking-wider hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
