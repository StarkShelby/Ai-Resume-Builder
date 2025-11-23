// Template04.tsx
// Fully revised single-file TypeScript React component.
// - All visible example text from /mnt/data/resume04.png used as placeholders (multi-line where needed).
// - Under-the-hood values start empty so placeholders are reference-only and can be deleted/overwritten.
// - Bullets use a textarea per bullet (multi-line), delete (×) aligned at end, no overlap.
// - Works with parent onUpdate/onAdd/onRemove like original integration.
// - TailwindCSS classes assumed.
// - Option B behavior implemented: editing a particular placeholder experience block converts that block into a real experience item; other placeholders remain placeholders.

import React, { useRef } from "react";
import { TemplateProps, ResumeData } from "../../app/create/types";

/* ---------------------------------------------
   Path to uploaded image (kept for reference / preview)
   --------------------------------------------- */
const TEMPLATE_IMAGE_URL = "/mnt/data/resume04.png";

/* ---------------------------------------------
   Screenshot placeholder texts (exact)
   --------------------------------------------- */

/* PROFESSIONAL EXPERIENCE placeholders */
const EXP_PLACEHOLDERS = [
    {
        position: "Administrative Assistant",
        company: "Sep 20XX – Present | Redford & Sons, Chicago, IL",
        bullets: [
            "Schedule and coordinate meetings, appointments, and travel arrangements for supervisors and managers.",
            "Trained 2 administrative assistants during a period of company expansion to ensure attention to detail and adherence to company procedures.",
            "Developed new filing and organizational practices, saving the company $3,000 per year in contracted labor expenses.",
            "Maintain utmost discretion when dealing with sensitive topic",
        ],
    },
    {
        position: "Secretary",
        company: "June 20XX – August 20XX | Bright Spot Ltd. Boston, MA",
        bullets: [
            "Type documents such as correspondence, drafts, memos, and emails, and prepared 3 reports weekly for management",
            "Opened, sorted, and distributed incoming messages and correspondence",
            "Purchased and maintained office supplied inventories, and always carefully adhered to budgeting practices",
            "Greeted visitors and helped them either find the appropriate person or schedule an appointment",
        ],
    },
    {
        position: "Secretary",
        company: "June 20XX – August 20XX | Suntrust Financial. Chicago, IL",
        bullets: [
            "Recorded, transcribed and distributed weekly meetings",
            "Answered upwards of 20 phone calls daily, taking detailed messages",
            "Arranged appointments and ensured executives arrived to meetings with clients on time",
        ],
    },
];

/* SUMMARY placeholder (long multi-line paragraph) */
const SUMMARY_PLACEHOLDER = `Administrative Assistant with 6+ years of experience organizing presentations, preparing facility reports, and maintaining the utmost confidentiality. Possess a B.A. in History and expertise in Microsoft Excel. Looking to leverage my knowledge and experience into a role as Project Manager.`;

/* EDUCATION placeholder lines */
const EDUCATION_PLACEHOLDER = {
    degree: "Bachelor of Arts in History — GPA 3.5",
    details: "Graduated magna cum laude\nResume Genius University Chicago, IL\nMay 20XX",
};

/* CONTACT placeholders (multi-line where appropriate) */
const CONTACT_PLACEHOLDERS = {
    phone: "(123) 456-7890",
    email: "david.perez@mail.com",
    address: "47 W 13th St\nNew York, NY 10011",
};

/* SKILLS placeholders */
const SKILLS_PLACEHOLDERS = [
    "Microsoft Office",
    "MailChimp",
    "HubSpot",
    "Google Workspace",
    "Problem Solving",
];

/* ADDITIONAL SKILLS placeholders */
const ADDITIONAL_PLACEHOLDERS = [
    "Spanish (Intermediate)",
    "Typing speed of 70 WPM",
    "Problem solving",
    "Team leadership",
];

/* ---------------------------------------------
   Component
   --------------------------------------------- */

export default function Template04({
    data,
    onUpdate = () => { },
    onAdd,
    onRemove,
    previewMode = false,
}: TemplateProps) {
    // Personal info: use actual values if present; otherwise empty so placeholders display
    const personalInfo = (data?.personalInfo || {}) as ResumeData["personalInfo"];
    const nameValue: string = (personalInfo?.fullName as string) || "";
    const titleValue: string = (personalInfo?.jobTitle as string) || "";
    const phoneValue: string = (personalInfo?.phone as string) || "";
    const emailValue: string = (personalInfo?.email as string) || "";
    const addressValue: string = (personalInfo?.address as string) || "";

    // Collections: arrays from data if present; otherwise empty arrays to show placeholders
    const experience = Array.isArray(data?.experience) ? data!.experience! : [];
    const education = Array.isArray(data?.education) ? data!.education! : [];
    const skills = Array.isArray(data?.skills) ? data!.skills! : [];
    const languages = Array.isArray((data as any)?.languages) ? (data as any).languages : [];
    const hobbies = Array.isArray((data as any)?.hobbies) ? (data as any).hobbies : [];

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    /* ----------- safety wrappers to call parent handlers ----------- */
    const safeUpdate = (section: keyof ResumeData, field: string, value: any, index?: number) => {
        try {
            // For array sections with no field and no index, we're trying to replace the entire array
            // This is a special case that needs different handling
            if (field === "" && index === undefined && Array.isArray((data as any)?.[section])) {
                // We can't directly replace arrays through onUpdate, so we need to handle this differently
                // For now, we'll just call onUpdate and let the parent handle it
                // The parent should be updated to handle this case
                onUpdate(section, null, value, index);
            } else {
                onUpdate(section, field, value, index);
            }
        } catch (err) {
            console.warn("update failed:", err);
        }
    };

    const safeAdd = (section: string) => {
        if (onAdd) {
            try {
                onAdd(section);
                return;
            } catch (err) {
                console.warn("onAdd failed:", err);
            }
        }
        // fallback add behavior for local editing (caller expects onUpdate)
        switch (section) {
            case "experience": {
                const arr = getExperienceArray();
                arr.push({
                    company: "",
                    position: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                    bullets: [""],
                });
                safeUpdate("experience", "", arr);
                break;
            }
            case "education": {
                const arr = Array.isArray(education) ? [...education] : [];
                arr.push({
                    institution: "",
                    degree: "",
                    field: "",
                    startDate: "",
                    endDate: "",
                    gpa: "",
                });
                safeUpdate("education", "", arr);
                break;
            }
            case "skills": {
                const arr = Array.isArray(skills) ? [...skills] : [];
                arr.push("");
                safeUpdate("skills", "", arr);
                break;
            }
            case "languages": {
                const arr = Array.isArray(languages) ? [...languages] : [];
                arr.push("");
                safeUpdate("languages", "", arr);
                break;
            }
            case "hobbies": {
                const arr = Array.isArray(hobbies) ? [...hobbies] : [];
                arr.push("");
                safeUpdate("hobbies", "", arr);
                break;
            }
            default:
                break;
        }
    };

    const safeRemove = (section: string, index: number) => {
        if (onRemove) {
            try {
                onRemove(section, index);
                return;
            } catch (err) {
                console.warn("onRemove failed:", err);
            }
        }

        switch (section) {
            case "experience": {
                const arr = getExperienceArray();
                arr.splice(index, 1);
                safeUpdate("experience", "", arr);
                break;
            }
            case "education": {
                const arr = Array.isArray(education) ? [...education] : [];
                arr.splice(index, 1);
                safeUpdate("education", "", arr);
                break;
            }
            case "skills": {
                const arr = Array.isArray(skills) ? [...skills] : [];
                arr.splice(index, 1);
                safeUpdate("skills", "", arr);
                break;
            }
            case "languages": {
                const arr = Array.isArray(languages) ? [...languages] : [];
                arr.splice(index, 1);
                safeUpdate("languages", "", arr);
                break;
            }
            case "hobbies": {
                const arr = Array.isArray(hobbies) ? [...hobbies] : [];
                arr.splice(index, 1);
                safeUpdate("hobbies", "", arr);
                break;
            }
            default:
                break;
        }
    };

    /* --------------- file select (photo) --------------- */
    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
            const url = reader.result as string;
            safeUpdate("personalInfo", "photo", url);
        };
        reader.readAsDataURL(f);
    };

    /* --------------- helpers for editing --------------- */
    const handleBlur = (section: keyof ResumeData, field: string, index?: number) => (e: React.FocusEvent<HTMLElement>) => {
        // Clean and trim whitespace-only content; treat as empty string if only whitespace
        const raw = (e.target as HTMLElement).innerText;
        const cleaned = raw.replace(/\u00A0/g, " ").trim();
        if (index !== undefined) safeUpdate(section, field, cleaned, index);
        else safeUpdate(section, field, cleaned);
    };

    const getExperienceArray = () => {
        return Array.isArray(data?.experience) ? (data!.experience!.map((x: any) => ({ ...(x || {}) })) as any[]) : [];
    };

    const updateExperienceArray = (arr: any[]) => {
        safeUpdate("experience", "", arr);
    };

    const updateArrayField = (section: keyof ResumeData, index: number, field: string, value: any) => {
        if (section !== "experience") {
            // For other array sections we assume parent's onUpdate handles (or safeUpdate with full array)
            const arr = Array.isArray((data as any)[section]) ? [...(data as any)[section]] : [];
            arr[index] = { ...(arr[index] || {}), [field || ""]: value };
            safeUpdate(section, "", arr);
            return;
        }

        // experience-specific: update arr[index][field] or entire field (like bullets)
        const arr = getExperienceArray();
        if (!arr[index]) {
            // if missing create a new one at index
            ensureExperienceItemExistsAt(index);
            return;
        }
        arr[index] = { ...(arr[index] || {}), [field]: value };
        updateExperienceArray(arr);
    };

    /* --------------- placeholder -> real conversion (Option B) --------------- */
    // Ensure a real experience item exists at exactly this index; other placeholders remain placeholders.
    const ensureExperienceItemExistsAt = (index: number) => {
        const arr = getExperienceArray();
        if (arr[index]) return; // already exists

        // If array shorter than index, push empty items until index
        while (arr.length < index) {
            arr.push({
                company: "",
                position: "",
                startDate: "",
                endDate: "",
                description: "",
                bullets: [""],
            });
        }

        // insert a new real item at index (either replace undefined or push)
        arr.splice(index, 0, {
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
            bullets: [""],
        });

        updateExperienceArray(arr);
    };

    /* --------------- bullet helpers (textarea per bullet) --------------- */
    const addBulletPoint = (expIndex: number) => {
        ensureExperienceItemExistsAt(expIndex);

        const arr = getExperienceArray();
        const item = arr[expIndex] || { bullets: [] };
        const bullets = Array.isArray(item.bullets) ? [...item.bullets] : [];
        bullets.push("");
        arr[expIndex] = { ...(arr[expIndex] || {}), bullets };
        updateExperienceArray(arr);
    };

    const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
        const arr = getExperienceArray();
        if (!arr[expIndex]) return;
        const bullets = Array.isArray(arr[expIndex].bullets) ? [...arr[expIndex].bullets] : [];
        if (bulletIndex < 0 || bulletIndex >= bullets.length) return;
        bullets.splice(bulletIndex, 1);
        arr[expIndex] = { ...(arr[expIndex] || {}), bullets };
        updateExperienceArray(arr);
    };

    const updateBulletPoint = (expIndex: number, bulletIndex: number, text: string) => {
        ensureExperienceItemExistsAt(expIndex);

        const arr = getExperienceArray();
        // Safety check: ensure the experience item exists before accessing bullets
        if (!arr[expIndex]) {
            console.warn(`Experience item at index ${expIndex} does not exist`);
            return;
        }
        const bullets = Array.isArray(arr[expIndex].bullets) ? [...arr[expIndex].bullets] : [];
        bullets[bulletIndex] = text;
        arr[expIndex] = { ...(arr[expIndex] || {}), bullets };
        updateExperienceArray(arr);
    };

    /* --------------- small utility to decide whether to render placeholders from screenshot --------------- */
    const shouldRenderPlaceholderExperienceList = (Array.isArray(experience) ? experience.length === 0 : true);
    const shouldRenderPlaceholderEducation = education.length === 0;
    const shouldRenderPlaceholderSkills = skills.length === 0;
    const shouldRenderPlaceholderContacts = !phoneValue && !emailValue && !addressValue;
    const shouldRenderPlaceholderSummary = !data?.summary || (typeof data?.summary === "string" && data!.summary!.trim() === "");

    /* --------------- CSS for contentEditable placeholders (uses data-placeholder) --------------- */
    const placeholderCSS = `
    .editable-placeholder:empty:before {
      content: attr(data-placeholder);
      color: #9ca3af;
      white-space: pre-wrap;
      pointer-events: none;
    }
    .single-line:empty:before { white-space: pre; }
    textarea:focus { outline: none; box-shadow: none; }
  `;

    /* ---------------------------------------------
       Render
       --------------------------------------------- */

    return (
        <div className="min-h-screen flex justify-center bg-gray-100 py-8">
            <style>{placeholderCSS}</style>

            <div id="resume-content" className="w-[210mm] min-h-[297mm] mx-auto shadow-lg bg-white overflow-hidden">
                {/* Print-friendly */}
                <style>
                    {`@page { size: A4; margin: 0 } @media print { body { -webkit-print-color-adjust: exact } .no-print { display:none !important } }`}
                </style>

                {/* Header (blue) */}
                <header className="bg-[#2D5E98] text-white text-center py-6 px-6">
                    <div
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        onFocus={() => { /* no-op */ }}
                        onBlur={handleBlur("personalInfo", "fullName")}
                        className={`text-4xl md:text-5xl font-bold tracking-wide single-line editable-placeholder`}
                        data-placeholder="DAVID PÉREZ"
                        dangerouslySetInnerHTML={{ __html: nameValue ? escapeHtml(nameValue) : "" }}
                    />

                    <div
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        onBlur={handleBlur("personalInfo", "jobTitle")}
                        className="text-lg tracking-wider mt-1 single-line editable-placeholder"
                        data-placeholder="ADMINISTRATIVE ASSISTANT"
                        dangerouslySetInnerHTML={{ __html: titleValue ? escapeHtml(titleValue) : "" }}
                    />
                </header>

                <div className="flex">
                    {/* LEFT COLUMN */}
                    <main className="w-2/3 bg-white p-8">
                        {/* PROFESSIONAL EXPERIENCE header */}
                        <div className="mb-6 flex justify-between items-center">
                            <h2 className="text-[#2D5E98] text-lg font-semibold">PROFESSIONAL EXPERIENCE</h2>
                            {!previewMode && (
                                <button onClick={() => safeAdd("experience")} className="no-print bg-[#2D5E98] text-white px-3 py-1.5 rounded-md text-sm hover:bg-[#1e4a7a]">
                                    + Add
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* If no real experience data, render the screenshot-example blocks as placeholders (under the hood empty) */}
                            {shouldRenderPlaceholderExperienceList
                                ? EXP_PLACEHOLDERS.map((ph, idx) => (
                                    <section key={`ph-${idx}`} className="pb-4 border-b border-gray-200 last:border-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <div
                                                    // When user focuses/edits this placeholder block, convert only this block to a real experience item (Option B)
                                                    contentEditable={!previewMode}
                                                    suppressContentEditableWarning
                                                    onFocus={() => {
                                                        if (!previewMode) ensureExperienceItemExistsAt(idx);
                                                    }}
                                                    onBlur={(e) => {
                                                        // if user entered text, commit to newly created experience item
                                                        const txt = (e.target as HTMLElement).innerText.replace(/\u00A0/g, " ").trim();
                                                        if (txt.length > 0) {
                                                            // make sure real item exists then update position field
                                                            ensureExperienceItemExistsAt(idx);
                                                            // update the position of the newly created item
                                                            const arr = getExperienceArray();
                                                            arr[idx] = { ...(arr[idx] || {}), position: txt };
                                                            updateExperienceArray(arr);
                                                        }
                                                    }}
                                                    className="font-semibold text-[15px] single-line editable-placeholder"
                                                    data-placeholder={ph.position}
                                                >
                                                    {/* empty so placeholder shows */}
                                                </div>

                                                <div
                                                    contentEditable={!previewMode}
                                                    suppressContentEditableWarning
                                                    onFocus={() => {
                                                        if (!previewMode) ensureExperienceItemExistsAt(idx);
                                                    }}
                                                    onBlur={(e) => {
                                                        const txt = (e.target as HTMLElement).innerText.replace(/\u00A0/g, " ").trim();
                                                        if (txt.length > 0) {
                                                            ensureExperienceItemExistsAt(idx);
                                                            const arr = getExperienceArray();
                                                            arr[idx] = { ...(arr[idx] || {}), company: txt };
                                                            updateExperienceArray(arr);
                                                        }
                                                    }}
                                                    className="text-sm text-gray-600 editable-placeholder"
                                                    data-placeholder={ph.company}
                                                >
                                                    {/* empty so placeholder shows */}
                                                </div>
                                            </div>

                                            {!previewMode && (
                                                <button
                                                    onClick={() => safeRemove("experience", idx)}
                                                    className="ml-2 text-xs text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600 no-print"
                                                    title="Remove section"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>

                                        {/* Bullets (placeholder bullets) */}
                                        <div className="mt-2 space-y-2">
                                            <ul className="list-none p-0 m-0 space-y-2">
                                                {ph.bullets.map((bph, bIdx) => (
                                                    <li key={bIdx} className="flex items-start gap-3">
                                                        <div className="pt-2 text-sm text-[#2D5E98]">•</div>
                                                        <div className="flex-1 flex items-start justify-between gap-3">
                                                            <textarea
                                                                placeholder={bph}
                                                                onFocus={() => {
                                                                    if (!previewMode) ensureExperienceItemExistsAt(idx);
                                                                }}
                                                                onChange={(e) => {
                                                                    // Convert this specific placeholder to a real item and update bullet text
                                                                    if (!previewMode) {
                                                                        ensureExperienceItemExistsAt(idx);
                                                                        updateBulletPoint(idx, bIdx, e.target.value);
                                                                    }
                                                                }}
                                                                className="w-full resize-none text-sm leading-relaxed outline-none bg-transparent"
                                                                rows={Math.max(1, (bph.match(/\n/g) || []).length + 1)}
                                                                defaultValue={""}
                                                            />
                                                            {!previewMode && (
                                                                <button
                                                                    onClick={() => {
                                                                        // Removing a placeholder bullet should convert the block to a real one first (so remove is deterministic)
                                                                        ensureExperienceItemExistsAt(idx);
                                                                        removeBulletPoint(idx, bIdx);
                                                                    }}
                                                                    className="text-xs bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600 no-print whitespace-nowrap"
                                                                    title="Remove bullet"
                                                                >
                                                                    ×
                                                                </button>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                            {!previewMode && (
                                                <div>
                                                    <button onClick={() => addBulletPoint(idx)} className="text-sm text-[#2D5E98] hover:underline no-print">
                                                        + Add Bullet
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                ))
                                : // If real experience data exists, render actual items (but each field shows placeholders if that specific field is empty)
                                experience.map((exp: any, idx: number) => (
                                    <section key={`exp-${idx}`} className="pb-4 border-b border-gray-200 last:border-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1">
                                                <div
                                                    contentEditable={!previewMode}
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => {
                                                        const txt = (e.target as HTMLElement).innerText.replace(/\u00A0/g, " ").trim();
                                                        const arr = getExperienceArray();
                                                        arr[idx] = { ...(arr[idx] || {}), position: txt };
                                                        updateExperienceArray(arr);
                                                    }}
                                                    className="font-semibold text-[15px] single-line editable-placeholder"
                                                    data-placeholder={EXP_PLACEHOLDERS[0]?.position || "Position Title"}
                                                >
                                                    {exp.position || ""}
                                                </div>

                                                <div
                                                    contentEditable={!previewMode}
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => {
                                                        const txt = (e.target as HTMLElement).innerText.replace(/\u00A0/g, " ").trim();
                                                        const arr = getExperienceArray();
                                                        arr[idx] = { ...(arr[idx] || {}), company: txt };
                                                        updateExperienceArray(arr);
                                                    }}
                                                    className="text-sm text-gray-600 editable-placeholder"
                                                    data-placeholder={EXP_PLACEHOLDERS[0]?.company || "Time Period | Company"}
                                                >
                                                    {exp.company || ""}
                                                </div>
                                            </div>

                                            {!previewMode && (
                                                <button
                                                    onClick={() => safeRemove("experience", idx)}
                                                    className="ml-2 text-xs text-white bg-red-500 px-2 py-1 rounded hover:bg-red-600 no-print"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>

                                        {/* Bullets (existing bullets or placeholder if empty) */}
                                        <div className="mt-2 space-y-2">
                                            <ul className="list-none p-0 m-0 space-y-2">
                                                {(Array.isArray(exp.bullets) && exp.bullets.length > 0 ? exp.bullets : EXP_PLACEHOLDERS[0].bullets).map(
                                                    (bullet: string, bIdx: number) => (
                                                        <li key={bIdx} className="flex items-start gap-3">
                                                            <div className="pt-2 text-sm text-[#2D5E98]">•</div>
                                                            <div className="flex-1 flex items-start justify-between gap-3">
                                                                <textarea
                                                                    value={Array.isArray(exp.bullets) && exp.bullets[bIdx] !== undefined ? exp.bullets[bIdx] : ""}
                                                                    onChange={(e) => updateBulletPoint(idx, bIdx, e.target.value)}
                                                                    rows={Math.max(1, (bullet?.match(/\n/g) || []).length + 1)}
                                                                    className="w-full resize-none text-sm leading-relaxed outline-none bg-transparent"
                                                                    placeholder={bullet}
                                                                />
                                                                {!previewMode && (
                                                                    <button
                                                                        onClick={() => removeBulletPoint(idx, bIdx)}
                                                                        className="text-xs bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600 no-print whitespace-nowrap"
                                                                        title="Remove bullet"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </li>
                                                    )
                                                )}
                                            </ul>

                                            {!previewMode && (
                                                <div>
                                                    <button onClick={() => addBulletPoint(idx)} className="text-sm text-[#2D5E98] hover:underline no-print">
                                                        + Add Bullet
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </section>
                                ))}
                        </div>

                        {/* EDUCATION */}
                        <div className="mt-8">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-[#2D5E98] text-lg font-semibold">EDUCATION</h2>
                                {!previewMode && (
                                    <button onClick={() => safeAdd("education")} className="no-print bg-[#2D5E98] text-white px-3 py-1.5 rounded-md text-sm hover:bg-[#1e4a7a]">
                                        + Add
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {shouldRenderPlaceholderEducation ? (
                                    <div className="pb-3 border-b border-gray-200 last:border-0">
                                        <div
                                            contentEditable={!previewMode}
                                            suppressContentEditableWarning
                                            onFocus={() => {
                                                if (!previewMode) safeAdd("education");
                                            }}
                                            onBlur={(e) => {
                                                const txt = (e.target as HTMLElement).innerText.replace(/\u00A0/g, " ").trim();
                                                if (txt.length > 0) {
                                                    // create and set
                                                    const arr = Array.isArray(education) ? [...education] : [];
                                                    if (arr.length === 0) {
                                                        arr.push({
                                                            institution: "",
                                                            degree: txt,
                                                            field: "",
                                                            startDate: "",
                                                            endDate: "",
                                                            gpa: ""
                                                        });
                                                    } else {
                                                        arr[0] = { ...(arr[0] || {}), degree: txt };
                                                    }
                                                    safeUpdate("education", "", arr);
                                                }
                                            }}
                                            className="font-semibold text-sm single-line editable-placeholder"
                                            data-placeholder={EDUCATION_PLACEHOLDER.degree}
                                        />
                                        <textarea
                                            placeholder={EDUCATION_PLACEHOLDER.details}
                                            rows={3}
                                            className="w-full text-sm resize-none outline-none bg-transparent editable-placeholder"
                                            onFocus={() => {
                                                if (!previewMode) safeAdd("education");
                                            }}
                                            onChange={(e) => {
                                                const arr = Array.isArray(education) ? [...education] : [];
                                                if (arr.length === 0) {
                                                    arr.push({
                                                        institution: e.target.value,
                                                        degree: "",
                                                        field: "",
                                                        startDate: "",
                                                        endDate: "",
                                                        gpa: ""
                                                    });
                                                } else {
                                                    arr[0] = { ...(arr[0] || {}), institution: e.target.value };
                                                }
                                                safeUpdate("education", "", arr);
                                            }}
                                            defaultValue={""}
                                        />
                                    </div>
                                ) : (
                                    education.map((edu: any, idx: number) => (
                                        <div key={idx} className="pb-3 border-b border-gray-200 last:border-0">
                                            <div
                                                contentEditable={!previewMode}
                                                suppressContentEditableWarning
                                                onBlur={(e) => {
                                                    const txt = (e.target as HTMLElement).innerText.replace(/\u00A0/g, " ").trim();
                                                    const arr = Array.isArray(education) ? [...education] : [];
                                                    arr[idx] = { ...(arr[idx] || {}), degree: txt };
                                                    safeUpdate("education", "", arr);
                                                }}
                                                className="font-semibold text-sm single-line editable-placeholder"
                                                data-placeholder={EDUCATION_PLACEHOLDER.degree}
                                            >
                                                {edu.degree || ""}
                                            </div>
                                            <textarea
                                                value={edu.institution || ""}
                                                onChange={(e) => {
                                                    const arr = Array.isArray(education) ? [...education] : [];
                                                    arr[idx] = { ...(arr[idx] || {}), institution: e.target.value };
                                                    safeUpdate("education", "", arr);
                                                }}
                                                rows={3}
                                                className="w-full text-sm resize-none outline-none bg-transparent"
                                                placeholder={EDUCATION_PLACEHOLDER.details}
                                            />
                                            {!previewMode && (
                                                <div className="mt-2">
                                                    <button onClick={() => safeRemove("education", idx)} className="text-xs text-white bg-red-500 px-2 py-0.5 rounded hover:bg-red-600 no-print">
                                                        × Remove education
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </main>

                    {/* RIGHT COLUMN (SIDEBAR) */}
                    <aside className="w-1/3 bg-gray-50 p-6">
                        {/* CONTACT */}
                        <div className="mb-6">
                            <h3 className="text-[#2D5E98] text-lg font-semibold mb-3">CONTACT</h3>
                            <div className="space-y-3 text-sm">
                                <div
                                    contentEditable={!previewMode}
                                    suppressContentEditableWarning
                                    onBlur={handleBlur("personalInfo", "phone")}
                                    className="editable-placeholder single-line"
                                    data-placeholder={CONTACT_PLACEHOLDERS.phone}
                                    dangerouslySetInnerHTML={{ __html: phoneValue ? escapeHtml(phoneValue) : "" }}
                                />
                                <div
                                    contentEditable={!previewMode}
                                    suppressContentEditableWarning
                                    onBlur={handleBlur("personalInfo", "email")}
                                    className="editable-placeholder single-line"
                                    data-placeholder={CONTACT_PLACEHOLDERS.email}
                                    dangerouslySetInnerHTML={{ __html: emailValue ? escapeHtml(emailValue) : "" }}
                                />
                                <div
                                    contentEditable={!previewMode}
                                    suppressContentEditableWarning
                                    onBlur={handleBlur("personalInfo", "address")}
                                    className="editable-placeholder"
                                    data-placeholder={CONTACT_PLACEHOLDERS.address}
                                    dangerouslySetInnerHTML={{ __html: addressValue ? escapeHtml(addressValue).replace(/\n/g, "<br/>") : "" }}
                                />
                            </div>
                        </div>

                        {/* SUMMARY */}
                        <div className="mb-6">
                            <h3 className="text-[#2D5E98] text-lg font-semibold mb-3">SUMMARY</h3>
                            <div
                                contentEditable={!previewMode}
                                suppressContentEditableWarning
                                onBlur={handleBlur("summary", "summary")}
                                className="text-sm leading-relaxed editable-placeholder"
                                data-placeholder={SUMMARY_PLACEHOLDER}
                                dangerouslySetInnerHTML={{ __html: (data?.summary as string) ? escapeHtml(data!.summary as string) : "" }}
                            />
                        </div>

                        {/* KEY SKILLS */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-[#2D5E98] text-lg font-semibold">KEY SKILLS</h3>
                                {!previewMode && (
                                    <button onClick={() => safeAdd("skills")} className="no-print text-sm bg-[#2D5E98] text-white px-2 py-1 rounded hover:bg-[#1e4a7a]">
                                        Add
                                    </button>
                                )}
                            </div>

                            <ul className="list-disc pl-5 text-sm space-y-2">
                                {(skills.length === 0 ? SKILLS_PLACEHOLDERS : skills).map((s: string, i: number) => (
                                    <li key={i} className="flex items-start justify-between gap-3">
                                        <div
                                            contentEditable={!previewMode}
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const text = (e.target as HTMLElement).innerText.trim();
                                                const arr = Array.isArray(skills) ? [...skills] : [];
                                                arr[i] = text;
                                                safeUpdate("skills", "", arr);
                                            }}
                                            className="flex-1 editable-placeholder"
                                            data-placeholder={SKILLS_PLACEHOLDERS[i] || "Skill name"}
                                        >
                                            {Array.isArray(skills) && skills[i] ? escapeHtml(skills[i]) : ""}
                                        </div>

                                        {!previewMode && (
                                            <button onClick={() => safeRemove("skills", i)} className="ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded hover:bg-red-600 no-print">
                                                ×
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ADDITIONAL SKILLS (Languages + Other) */}
                        <div className="mb-6">
                            <h3 className="text-[#2D5E98] text-lg font-semibold mb-3">ADDITIONAL SKILLS</h3>

                            <div className="mb-3">
                                <h4 className="text-sm font-semibold mb-1">Languages</h4>
                                <ul className="list-disc pl-5 text-sm space-y-2">
                                    {(languages.length === 0 ? ADDITIONAL_PLACEHOLDERS.slice(0, 1) : languages).map((l: string, i: number) => (
                                        <li key={`lang-${i}`} className="flex items-start justify-between gap-3">
                                            <div
                                                contentEditable={!previewMode}
                                                suppressContentEditableWarning
                                                onBlur={(e) => {
                                                    const text = (e.target as HTMLElement).innerText.trim();
                                                    const arr = Array.isArray(languages) ? [...languages] : [];
                                                    arr[i] = text;
                                                    safeUpdate("languages", "", arr);
                                                }}
                                                className="flex-1 editable-placeholder"
                                                data-placeholder={ADDITIONAL_PLACEHOLDERS[i] || "Language"}
                                            >
                                                {Array.isArray(languages) && languages[i] ? escapeHtml(languages[i]) : ""}
                                            </div>

                                            {!previewMode && (
                                                <button onClick={() => safeRemove("languages", i)} className="ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded hover:bg-red-600 no-print">
                                                    ×
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="text-sm font-semibold mb-1">Other</h4>
                                <ul className="list-disc pl-5 text-sm space-y-2">
                                    {(hobbies.length === 0 ? ADDITIONAL_PLACEHOLDERS.slice(1) : hobbies).map((h: string, i: number) => (
                                        <li key={`hob-${i}`} className="flex items-start justify-between gap-3">
                                            <div
                                                contentEditable={!previewMode}
                                                suppressContentEditableWarning
                                                onBlur={(e) => {
                                                    const text = (e.target as HTMLElement).innerText.trim();
                                                    const arr = Array.isArray(hobbies) ? [...hobbies] : [];
                                                    arr[i] = text;
                                                    safeUpdate("hobbies", "", arr);
                                                }}
                                                className="flex-1 editable-placeholder"
                                                data-placeholder={ADDITIONAL_PLACEHOLDERS[i + 1] || "Additional skill"}
                                            >
                                                {Array.isArray(hobbies) && hobbies[i] ? escapeHtml(hobbies[i]) : ""}
                                            </div>

                                            {!previewMode && (
                                                <button onClick={() => safeRemove("hobbies", i)} className="ml-2 text-xs text-white bg-red-500 px-2 py-0.5 rounded hover:bg-red-600 no-print">
                                                    ×
                                                </button>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {!previewMode && (
                                <div className="mt-3 space-y-2 no-print">
                                    <button onClick={() => safeAdd("languages")} className="text-sm bg-[#2D5E98] text-white px-3 py-1 rounded w-full hover:bg-[#1e4a7a]">
                                        + Add Language
                                    </button>
                                    <button onClick={() => safeAdd("hobbies")} className="text-sm bg-[#2D5E98] text-white px-3 py-1 rounded w-full hover:bg-[#1e4a7a]">
                                        + Add Skill
                                    </button>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}

/* ---------------------------------------------
   Helper: escape HTML for dangerouslySetInnerHTML safe insertion of user text
   (keeps newlines for address)
   --------------------------------------------- */
function escapeHtml(str: string) {
    if (!str) return "";
    return (str as string)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br/>");
}
