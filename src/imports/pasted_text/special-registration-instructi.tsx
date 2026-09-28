



## Master prompt

Deeply inspect the existing project before making changes. The current login flow is implemented in `src/app/components/auth/LoginForm.tsx`, where the **“Special Registration for NRB”** button navigates directly to `/special-registration`. The public form is implemented in `src/app/pages/public/SpecialRegistrationPublicPage.tsx`, and the public route is registered in `src/app/routes.tsx`.

Change this flow so users read the supplied Special Registration instructions before opening the application form.

### Required user flow

1. Keep the existing `/special-registration` route and form unchanged.
2. Add a new public route:

`/special-registration/instructions`

3. Change only the login-page **“Special Registration for NRB”** button so it navigates to `/special-registration/instructions`.
4. The instructions page must display the complete content from the attached document.
5. Each **Apply** action on the instructions page must navigate to the existing `/special-registration` form.
6. Add a **User Manual** button to the existing Special Registration form page.
7. Clicking that button must open the complete instructions inside a modal without leaving or resetting the form.

### Files and component structure

Use the existing project architecture. Do not put the same manual markup in multiple files.

Create:

- `src/app/pages/public/SpecialRegistrationInstructionsPage.tsx`
- `src/app/components/special-registration/SpecialRegistrationManualContent.tsx`
- `src/app/components/special-registration/SpecialRegistrationManualModal.tsx`

Update only the related files:

- `src/app/components/auth/LoginForm.tsx`
- `src/app/pages/public/SpecialRegistrationPublicPage.tsx`
- `src/app/routes.tsx`
- `src/app/locales/en/specialRegistration.json`
- `src/app/locales/bn/specialRegistration.json`
- `src/styles/special-registration.css`
- Relevant tests for this flow

Use one reusable `SpecialRegistrationManualContent` component for both the standalone instructions page and the modal. Give it an `onApply` callback:

- On the instructions page, `onApply` navigates to `/special-registration`.
- Inside the form-page modal, `onApply` closes the modal and returns the user to the form.
- Opening or closing the modal must not clear, modify or revalidate any form data.

Do not repurpose the global `HelpDrawer`. This must be a dedicated public Special Registration manual.

### Instructions page layout

Reuse the existing public Special Registration page header, logo, typography, language switch, width, spacing, background and responsive behaviour.

The page should contain:

- Existing eReturn/NBR brand header
- Page title: `eReturn Special Registration নির্দেশনা`
- Existing EN/বাংলা language switch
- A centered content area using the same `1000px` maximum width as the form
- Two clearly separated manual sections
- An **Apply** button after each section, matching the source document
- No new visual theme, colours, gradients, illustrations or unrelated navigation

Present the content as a readable user manual using the existing design tokens:

- Clear heading hierarchy
- Semantic ordered and unordered lists
- Comfortable Bengali line height
- Consistent paragraph spacing
- Subtle existing card borders and surface colours
- Existing button components and styles
- No horizontal scrolling
- No decorative styling that competes with the instructions

The document contains two instruction versions. Do not merge them, choose between them, remove duplication or rewrite them. Display both as separate sections so no supplied content is lost.

### Exact manual content

Use the following text exactly as supplied. Do not correct spelling, grammar, punctuation, capitalization, mixed Bengali/English terms, numbering or the malformed process line. Do not translate the body content. The exact Bengali manual must remain visible in both EN and BN interface modes. fileciteturn0file0

#### Section one

**eReturn Special Registration নির্দেশনা-০১**

জাতীয় পরিচয় পত্র রয়েছে এরুপ যে সকল বাংলাদেশী বিদেশে অবস্থান করছেন, তাঁরা  নিজের email ব্যবহার করে eReturn সিস্টেমে নিবন্ধন করতে পারবেন। এজন্য করদাতাকে সিস্টেমে প্রয়োজনীয় তথ্যপূরণ পূর্বক নিম্নের তথ্যগুলো সংযুক্ত আকারে প্রদান করবেন-

১। টিআইএন,  
২। বসবাসরত দেশের নাম,  
৩। বসবাসরত দেশের ঠিকানা ও  
৪। মোবাইল/ফোন নম্বর,  
৫। সর্বশেষ বাংলাদেশ ত্যাগের তারিখ,  
৬। জাতীয় পরিচয় পত্র, পাসপোর্ট  
৭। ভিসার কপি

সিস্টেমে ইউজার তৈরি করার জন্য  আবেদন করতে হবে। বিদেশে অবস্থানরত বাংলাদেশিদের জন্য উপরিউক্ত তথ্য ও প্রমাণ আবশ্যক। কোন তথ্য ঘাটতি থাকলে বা ফরম্যাট অনুসারে আবেদন না করলে করদাতার নিবন্ধন অনুমোদযোগ্য হবে না।

**নিবন্ধন পদ্ধতিঃ**

1. করদাতা উপরিউক্ত তথ্য ও প্রমাণ সংযুক্ত করে সিস্টেমের মাধ্যমে জাতীয় রাজস্ব বোর্ড বরাবর আবেদন সাবমিট করবেন।
2. জাতীয় রাজস্ব বোর্ড, করদাতার আবেদন পরীক্ষান্তে অনুমোদন করবেন।  email ভেরিফাই করলে করদাতা email এ নোটিফিকেশন ও একটি Registration Link পাবেন।
3. উক্ত লিংক এ প্রবেশ করে রেজিস্ট্রশনের জন্য verify বাটনে ক্লিক করলে করদাতা রেজিস্ট্রশন সম্পন্ন করতে পারবেন। উল্লেখ্য, Registration Link ৭ দিন পর মেয়াদ উত্তীর্ণ হবে।

Add an **Apply** button immediately after this section.

#### Section two

**eReturn Special Registration নির্দেশনা-০২**

বাংলাদেশি প্রবাসী করদাতারা কীভাবে জাতীয় পরিচয়পত্র ব্যবহার করে অনলাইনে eReturn সিস্টেমে অ্যাকাউন্ট বা ইউজার নিবন্ধন করবেন, তার একটি স্পষ্ট ও সহজবোধ্য নির্দেশিকা নিচে সাজিয়ে দেওয়া হলো:

**প্রয়োজনীয় তথ্য ও ডকুমেন্টের তালিকা (Checklist)**

1. ই-টিআইএন (e-TIN) নম্বর
2. জাতীয় পরিচয় পত্র (NID)
3. পাসপোর্ট-এর কপি
4. ভিসা (Visa) বা রেসিডেন্স পারমিট-এর কপি
5. বর্তমানে বসবাসরত দেশের নাম
6. বিদেশের সম্পূর্ণ ঠিকানা
7. যোগাযোগের ফোন/মোবাইল নম্বর (বিদেশের নম্বরসহ)
8. সর্বশেষ বাংলাদেশ ত্যাগের তারিখ
9. ব্যক্তিগত ইমেইল (Email) ঠিকানা

Render this next line exactly as written. Allow it to wrap naturally without clipping or horizontal overflow:

`ধাপ ১: আবেদন সাবমিট] ➔ [ধাপ ২: NBR কর্তৃক যাচাই ও লিংক প্রাপ্তি] ➔ [ধাপ সওয়ার্ড ধাপ ১: সিস্টেমে আবেদন ও তথ্য প্রেরণ`

- eReturn পোর্টালে প্রবেশ করে নিজের ইমেইল ঠিকানা ব্যবহার করে ফর্ম পূরণ করতে হবে।
- উপরে উল্লিখিত সকল তথ্য (টিআইএন, বিদেশের ঠিকানা, বাংলাদেশ ত্যাগের তারিখ ইত্যাদি) সঠিকভাবে পূরণ করে এনআইডি, পাসপোর্ট ও ভিসার কপি সংযুক্ত (Attach) করুন।
- সম্পূর্ণ ফরম্যাট মেনে আবেদনটি জাতীয় রাজস্ব বোর্ড (NBR) বরাবর সাবমিট করুন।
- সাবমিট করার পরে আপনার মেইল একটি ভেরিফিকেশন লিংক যাবে, এই লিঙ্কে ক্লিক করতে হবে।

**ধাপ ২: NBR অনুমোদন ও ইমেইল ভেরিফিকেশন**

- এনবিআর (NBR) আপনার প্রদানকৃত তথ্য ও দলিলসমূহ পরীক্ষা-নিরীক্ষা করবে।
- আবেদন অনুমোদিত হলে আপনার ব্যক্তিগত ইমেইলে একটি নোটিফিকেশন এবং একটি Registration Link পাঠানো হবে।
- আপনার ইমেইলে প্রাপ্ত Registration Link-এ ক্লিক করুন।

**গুরুত্বপূর্ণ বিষয়সমূহ:**

- অসম্পূর্ণ আবেদন: কোনো তথ্য বা প্রমাণপত্রের ঘাটতি থাকলে এনবিআর আবেদন বাতিল করবে।
- লিংকের মেয়াদ: ইমেইলে পাঠানো রেজিস্ট্রেশন লিংকটি পাওয়ার ৭ দিনের মধ্যে ব্যবহার করতে হবে, অন্যথায় লিংকটি মেয়াদোত্তীর্ণ (Expired) হয়ে যাবে।

Add an **Apply** button immediately after this section.

### User Manual button on the form page

Add a dedicated **User Manual** button inside the existing Special Registration public-page header, beside the language switch.

Use the existing button and icon system:

- Use a relevant existing Lucide icon such as `BookOpen`
- Use an outlined or ghost button style from the current design system
- Desktop and tablet: show icon and label
- Very small mobile widths: the label may visually collapse to an icon, but it must retain an accessible `aria-label` and `title`
- Keep the language switch visible
- Do not allow the header to overflow or break the brand area

Do not change the form introduction, fields, sections, uploaders, validation, country selector, submission logic, success state, API service or repository.

### Manual modal behaviour

Use the existing `AppModal` component from `src/app/components/modals/AppModal.tsx`. Do not create another modal framework.

Modal requirements:

- Size: `xl` on desktop
- Existing centred popup behaviour on desktop
- Existing bottom-sheet behaviour on mobile
- Header title: `eReturn Special Registration নির্দেশনা`
- Header close button
- Vertically scrollable body
- Fixed footer
- Footer buttons must remain in one row
- Add a secondary **Close** button in the footer
- Render the exact same `SpecialRegistrationManualContent` component used by the standalone page
- Clicking either embedded **Apply** button closes the modal and returns focus to the form
- Escape closes the modal
- Backdrop click closes the modal
- Lock background scrolling while open
- Restore focus to the User Manual button after closing
- Preserve the form’s current values, uploaded files, expanded sections, errors and scroll position

Do not display the modal underneath another layer. It must remain above the form and page header.

### Language handling

The source manual body is Bengali-only and must not be rewritten or automatically translated.

Localize only the surrounding interface labels:

English:

- User Manual
- Close
- Apply
- Special Registration Instructions

Bangla:

- ব্যবহারকারী নির্দেশিকা
- বন্ধ করুন
- Apply
- বিশেষ নিবন্ধন নির্দেশিকা

Changing the language must update the shell labels, but the supplied manual body must remain exactly unchanged.

### Accessibility

- Use one page-level `h1`
- Use logical `h2` and `h3` headings inside the manual
- Use semantic `ol`, `ul` and `li` elements
- Do not create list numbering with visual-only text where semantic lists can preserve it
- Keep visible keyboard focus states
- Ensure all controls have at least a 44px mobile tap target
- The modal must have `role="dialog"`, `aria-modal="true"` and an associated title
- The process line must wrap safely on narrow screens
- Bengali text must remain readable at all supported font-size settings

### Validation and testing

Add focused tests confirming:

1. The login-page Special Registration button opens `/special-registration/instructions`.
2. Both instruction sections render.
3. The exact malformed process line remains unchanged.
4. Each Apply button opens `/special-registration`.
5. Direct access to `/special-registration` still opens the existing form.
6. The User Manual button opens the modal.
7. The modal displays both complete instruction sections.
8. Closing the modal preserves entered form data.
9. Modal Apply closes the modal without resetting the form.
10. The layout has no horizontal overflow on mobile.
11. Existing Special Registration tests still pass.

Run the project build and test suite after implementation. Fix only issues caused by this task.

### Golden Rules

- Do not break solved issues.
- Do not change unrelated files.
- Do not remove working features.
- Do not change the existing `/special-registration` form route.
- Do not modify APIs, repositories, validation or submission logic.
- Do not rewrite, correct, merge, translate or remove any supplied manual text.
- Reuse the existing modal, button, typography, spacing and colour systems.
- Test desktop, tablet and mobile behaviour.
- Keep EN/BN interface parity while preserving the Bengali source manual exactly.