import { useState, useId } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Globe } from "lucide-react";

interface Props {
  onApply: () => void;
  variant?: "page" | "modal";
}

export function SpecialRegistrationManualContent({ onApply, variant = "page" }: Props) {
  const { t } = useTranslation("specialRegistration");
  const uid = useId();
  const [sectionOneOpen, setSectionOneOpen] = useState(true);
  const [sectionTwoOpen, setSectionTwoOpen] = useState(true);

  const applyLabel = t("manual.apply");

  return (
    <div className={`sr-manual sr-manual--${variant}`}>

      {/* ── Section 1 ─────────────────────────────────────────────── */}
      <section className="sr-form-section sr-manual-section">
        <button
          type="button"
          className="sr-form-section__toggle sr-manual-section__toggle"
          onClick={() => setSectionOneOpen(prev => !prev)}
          aria-expanded={sectionOneOpen}
          aria-controls={`${uid}-s1-body`}
        >
          <span id={`${uid}-s1-heading`} className="sr-manual-section__title">
            eReturn Special Registration নির্দেশনা-০১
          </span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`sr-form-section__chevron${sectionOneOpen ? " sr-form-section__chevron--open" : ""}`}
          />
        </button>

        {sectionOneOpen && (
          <div
            id={`${uid}-s1-body`}
            className="sr-form-section__body sr-manual-section__body"
            role="region"
            aria-labelledby={`${uid}-s1-heading`}
          >
            <p className="sr-manual__para">
              জাতীয় পরিচয় পত্র রয়েছে এরুপ যে সকল বাংলাদেশী বিদেশে অবস্থান করছেন, তাঁরা{" "}
              নিজের email ব্যবহার করে eReturn সিস্টেমে নিবন্ধন করতে পারবেন। এজন্য করদাতাকে
              সিস্টেমে প্রয়োজনীয় তথ্যপূরণ পূর্বক নিম্নের তথ্যগুলো সংযুক্ত আকারে প্রদান করবেন-
            </p>

            <ol className="sr-manual__list sr-manual__list--ordered">
              <li>টিআইএন,</li>
              <li>বসবাসরত দেশের নাম,</li>
              <li>বসবাসরত দেশের ঠিকানা ও</li>
              <li>মোবাইল/ফোন নম্বর,</li>
              <li>সর্বশেষ বাংলাদেশ ত্যাগের তারিখ,</li>
              <li>জাতীয় পরিচয় পত্র, পাসপোর্ট</li>
              <li>ভিসার কপি</li>
            </ol>

            <p className="sr-manual__para">
              সিস্টেমে ইউজার তৈরি করার জন্য আবেদন করতে হবে। বিদেশে অবস্থানরত বাংলাদেশিদের জন্য
              উপরিউক্ত তথ্য ও প্রমাণ আবশ্যক। কোন তথ্য ঘাটতি থাকলে বা ফরম্যাট অনুসারে আবেদন না
              করলে করদাতার নিবন্ধন অনুমোদযোগ্য হবে না।
            </p>

            <h3 className="sr-manual__subsection-title">নিবন্ধন পদ্ধতিঃ</h3>

            <ol className="sr-manual__list sr-manual__list--ordered">
              <li>
                করদাতা উপরিউক্ত তথ্য ও প্রমাণ সংযুক্ত করে সিস্টেমের মাধ্যমে জাতীয় রাজস্ব বোর্ড
                বরাবর আবেদন সাবমিট করবেন।
              </li>
              <li>
                জাতীয় রাজস্ব বোর্ড, করদাতার আবেদন পরীক্ষান্তে অনুমোদন করবেন। email ভেরিফাই করলে
                করদাতা email এ নোটিফিকেশন ও একটি Registration Link পাবেন।
              </li>
              <li>
                উক্ত লিংক এ প্রবেশ করে রেজিস্ট্রশনের জন্য verify বাটনে ক্লিক করলে করদাতা
                রেজিস্ট্রশন সম্পন্ন করতে পারবেন। উল্লেখ্য, Registration Link ৭ দিন পর মেয়াদ
                উত্তীর্ণ হবে।
              </li>
            </ol>

            <button type="button" className="sr-public-action-btn sr-manual-reg-btn" onClick={onApply}>
              <Globe size={16} strokeWidth={1.8} aria-hidden="true" />
              {applyLabel}
            </button>
          </div>
        )}
      </section>

      {/* ── Section 2 ─────────────────────────────────────────────── */}
      <section className="sr-form-section sr-manual-section">
        <button
          type="button"
          className="sr-form-section__toggle sr-manual-section__toggle"
          onClick={() => setSectionTwoOpen(prev => !prev)}
          aria-expanded={sectionTwoOpen}
          aria-controls={`${uid}-s2-body`}
        >
          <span id={`${uid}-s2-heading`} className="sr-manual-section__title">
            eReturn Special Registration নির্দেশনা-০২
          </span>
          <ChevronDown
            size={16}
            aria-hidden="true"
            className={`sr-form-section__chevron${sectionTwoOpen ? " sr-form-section__chevron--open" : ""}`}
          />
        </button>

        {sectionTwoOpen && (
          <div
            id={`${uid}-s2-body`}
            className="sr-form-section__body sr-manual-section__body"
            role="region"
            aria-labelledby={`${uid}-s2-heading`}
          >
            <p className="sr-manual__para">
              বাংলাদেশি প্রবাসী করদাতারা কীভাবে জাতীয় পরিচয়পত্র ব্যবহার করে অনলাইনে eReturn
              সিস্টেমে অ্যাকাউন্ট বা ইউজার নিবন্ধন করবেন, তার একটি স্পষ্ট ও সহজবোধ্য নির্দেশিকা
              নিচে সাজিয়ে দেওয়া হলো:
            </p>

            <h3 className="sr-manual__subsection-title">
              প্রয়োজনীয় তথ্য ও ডকুমেন্টের তালিকা (Checklist)
            </h3>

            <ol className="sr-manual__list sr-manual__list--ordered">
              <li>ই-টিআইএন (e-TIN) নম্বর</li>
              <li>জাতীয় পরিচয় পত্র (NID)</li>
              <li>পাসপোর্ট-এর কপি</li>
              <li>ভিসা (Visa) বা রেসিডেন্স পারমিট-এর কপি</li>
              <li>বর্তমানে বসবাসরত দেশের নাম</li>
              <li>বিদেশের সম্পূর্ণ ঠিকানা</li>
              <li>যোগাযোগের ফোন/মোবাইল নম্বর (বিদেশের নম্বরসহ)</li>
              <li>সর্বশেষ বাংলাদেশ ত্যাগের তারিখ</li>
              <li>ব্যক্তিগত ইমেইল (Email) ঠিকানা</li>
            </ol>

            <p className="sr-manual__process-line">
              ধাপ ১: আবেদন সাবমিট] ➔ [ধাপ ২: NBR কর্তৃক যাচাই ও লিংক প্রাপ্তি] ➔ [ধাপ সওয়ার্ড ধাপ ১: সিস্টেমে আবেদন ও তথ্য প্রেরণ
            </p>

            <ul className="sr-manual__list sr-manual__list--unordered">
              <li>
                eReturn পোর্টালে প্রবেশ করে নিজের ইমেইল ঠিকানা ব্যবহার করে ফর্ম পূরণ করতে হবে।
              </li>
              <li>
                উপরে উল্লিখিত সকল তথ্য (টিআইএন, বিদেশের ঠিকানা, বাংলাদেশ ত্যাগের তারিখ ইত্যাদি)
                সঠিকভাবে পূরণ করে এনআইডি, পাসপোর্ট ও ভিসার কপি সংযুক্ত (Attach) করুন।
              </li>
              <li>
                সম্পূর্ণ ফরম্যাট মেনে আবেদনটি জাতীয় রাজস্ব বোর্ড (NBR) বরাবর সাবমিট করুন।
              </li>
              <li>
                সাবমিট করার পরে আপনার মেইল একটি ভেরিফিকেশন লিংক যাবে, এই লিঙ্কে ক্লিক করতে হবে।
              </li>
            </ul>

            <h3 className="sr-manual__subsection-title">
              ধাপ ২: NBR অনুমোদন ও ইমেইল ভেরিফিকেশন
            </h3>

            <ul className="sr-manual__list sr-manual__list--unordered">
              <li>এনবিআর (NBR) আপনার প্রদানকৃত তথ্য ও দলিলসমূহ পরীক্ষা-নিরীক্ষা করবে।</li>
              <li>
                আবেদন অনুমোদিত হলে আপনার ব্যক্তিগত ইমেইলে একটি নোটিফিকেশন এবং একটি Registration
                Link পাঠানো হবে।
              </li>
              <li>আপনার ইমেইলে প্রাপ্ত Registration Link-এ ক্লিক করুন।</li>
            </ul>

            <h3 className="sr-manual__subsection-title">গুরুত্বপূর্ণ বিষয়সমূহ:</h3>

            <ul className="sr-manual__list sr-manual__list--unordered">
              <li>
                <strong>অসম্পূর্ণ আবেদন:</strong> কোনো তথ্য বা প্রমাণপত্রের ঘাটতি থাকলে এনবিআর
                আবেদন বাতিল করবে।
              </li>
              <li>
                <strong>লিংকের মেয়াদ:</strong> ইমেইলে পাঠানো রেজিস্ট্রেশন লিংকটি পাওয়ার ৭ দিনের
                মধ্যে ব্যবহার করতে হবে, অন্যথায় লিংকটি মেয়াদোত্তীর্ণ (Expired) হয়ে যাবে।
              </li>
            </ul>

            <button type="button" className="sr-public-action-btn sr-manual-reg-btn" onClick={onApply}>
              <Globe size={16} strokeWidth={1.8} aria-hidden="true" />
              {applyLabel}
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
