import React, { useRef } from "react";
import { TemplateProps, ResumeData } from "../../app/create/types";

/* --------------------------------------------- */
/*                DEFAULT VALUES                 */
/* --------------------------------------------- */

const emptyPersonal = {
    fullName: "Sarah Mitchell",
    title: "Marketing Manager",
    email: "sarah.mitchell@email.com",
    phone: "+1 (555) 987-6543",
    address: "Boston, MA",
    linkedin: "linkedin.com/in/sarahmitchell",
    github: "github.com/sarahmitchell",
    website: "sarahmitchell.com",
    photo: "",
};

export default function Template03({
    data,
    onUpdate = () => { },
    onAdd,
    onRemove,
    previewMode = false,
}: TemplateProps) {
    /* --------------------------------------------- */
    /*      SAFE FALLBACKS (NO MORE UNDEFINED)       */
    /* --------------------------------------------- */

    const personal = {
        ...emptyPersonal,
        ...(data?.personalInfo || {}),
    };

    const summary =
        typeof data?.summary === "string" && data.summary.trim() !== ""
            ? data.summary
            : `Results-driven marketing professional with 8+ years of experience in digital marketing, brand strategy, and campaign management. Proven track record of increasing brand awareness and driving revenue growth.`;

    const experience = Array.isArray(data?.experience) ? data.experience : [];

    const education = Array.isArray(data?.education) ? data.education : [];

    const skills = Array.isArray(data?.skills)
        ? data.skills
        : ["Digital Marketing", "SEO/SEM", "Content Strategy", "Analytics", "Social Media", "Brand Management"];

    const languages = Array.isArray((data as any)?.languages)
        ? (data as any).languages
        : ["English (Native)", "German (Intermediate)"];

    const hobbies = Array.isArray((data as any)?.hobbies)
        ? (data as any).hobbies
        : ["Blogging", "Travel", "Yoga"];

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // ADD a bullet point
    const addBulletPoint = (expIndex: number) => {
        const arr = [...experience] as any[];
        if (!Array.isArray(arr[expIndex].bullets)) {
            arr[expIndex].bullets = [] as string[];
        }
        (arr[expIndex].bullets as string[]).push("");
        safeUpdate("experience", "bullets", arr[expIndex].bullets, expIndex);
    };

    // REMOVE a bullet point
    const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
        const arr = [...experience] as any[];
        if (!Array.isArray(arr[expIndex].bullets)) arr[expIndex].bullets = [];
        arr[expIndex].bullets.splice(bulletIndex, 1);
        safeUpdate("experience", "bullets", arr[expIndex].bullets, expIndex);
    };

    // UPDATE bullet text
    const updateBulletPoint = (
        expIndex: number,
        bulletIndex: number,
        text: string
    ) => {
        const arr = [...experience] as any[];
        if (!Array.isArray(arr[expIndex].bullets)) arr[expIndex].bullets = [];
        arr[expIndex].bullets[bulletIndex] = text;
        safeUpdate("experience", "bullets", arr[expIndex].bullets, expIndex);
    };

    // helpers to call parent update safely
    const safeUpdate = (
        section: keyof ResumeData,
        field: string,
        value: any,
        index?: number
    ) => {
        try {
            onUpdate(section, field, value, index);
        } catch (err) {
            console.warn("update failed:", err);
        }
    };

    const handleAdd = (section: string) => {
        if (onAdd) {
            onAdd(section);
            return;
        }

        const getArray = (arr: any) => (Array.isArray(arr) ? arr : []);

        switch (section) {
            case "experience":
                safeUpdate("experience", "", [
                    ...getArray(experience),
                    {
                        company: "",
                        position: "",
                        startDate: "",
                        endDate: "",
                        description: "",
                        bullets: [""],
                    },
                ]);
                break;

            case "education":
                safeUpdate("education", "", [
                    ...getArray(education),
                    {
                        institution: "",
                        degree: "",
                        field: "",
                        startDate: "",
                        endDate: "",
                        gpa: "",
                    },
                ]);
                break;

            case "skills":
                safeUpdate("skills", "", [...getArray(skills), ""]);
                break;

            case "languages":
                safeUpdate("languages", "", [...getArray(languages), ""]);
                break;

            case "hobbies":
                safeUpdate("hobbies", "", [...getArray(hobbies), ""]);
                break;
        }
    };

    const handleRemove = (section: string, index: number) => {
        if (onRemove) {
            onRemove(section, index);
            return;
        }

        const getArray = (arr: any) => (Array.isArray(arr) ? arr : []);

        switch (section) {
            case "experience":
                safeUpdate(
                    "experience",
                    "",
                    getArray(experience).filter((_, i) => i !== index)
                );
                break;

            case "education":
                safeUpdate(
                    "education",
                    "",
                    getArray(education).filter((_, i) => i !== index)
                );
                break;

            case "skills":
                safeUpdate(
                    "skills",
                    "",
                    getArray(skills).filter((_, i) => i !== index)
                );
                break;

            case "languages":
                safeUpdate(
                    "languages",
                    "",
                    getArray(languages).filter((_, i) => i !== index)
                );
                break;

            case "hobbies":
                safeUpdate(
                    "hobbies",
                    "",
                    getArray(hobbies).filter((_, i) => i !== index)
                );
                break;

            default:
                break;
        }
    };

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

    const handleBlur =
        (section: keyof ResumeData, field: string, index?: number) =>
            (e: React.FocusEvent<HTMLElement>) => {
                const text = (e.target as HTMLElement).innerText;
                if (index !== undefined) safeUpdate(section, field, text, index);
                else safeUpdate(section, field, text);
            };

    const updateArrayField = (
        section: keyof ResumeData,
        index: number,
        field: string,
        value: any
    ) => {
        safeUpdate(section, field, value, index);
    };

    return (
        <div
            id="resume-content"
            className="w-[210mm] min-h-[297mm] mx-auto shadow-lg bg-white overflow-hidden"
        >
            {/* Header Section - Teal/Turquoise */}
            <header className="bg-gradient-to-r from-[#2c7873] to-[#3d9b96] text-white p-8">
                <div className="flex items-center gap-6">
                    {/* Photo */}
                    <div className="w-28 h-28 rounded-full overflow-hidden bg-white flex items-center justify-center border-4 border-white shadow-lg flex-shrink-0">
                        {personal.photo ? (
                            <img
                                src={personal.photo}
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-gray-400 text-xs text-center">No Photo</div>
                        )}
                    </div>

                    <div className="flex-1">
                        <h1
                            className="text-4xl font-bold"
                            contentEditable={!previewMode}
                            suppressContentEditableWarning
                            onBlur={handleBlur("personalInfo", "fullName")}
                            data-placeholder="Your Name"
                        >
                            {personal.fullName || ""}
                        </h1>
                        <div
                            className="text-xl mt-2 text-white/90"
                            contentEditable={!previewMode}
                            suppressContentEditableWarning
                            onBlur={handleBlur("personalInfo", "title")}
                            data-placeholder="Your Title"
                        >
                            {personal.title}
                        </div>
                    </div>
                </div>

                {!previewMode && (
                    <div className="mt-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={onFileSelect}
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white text-[#2c7873] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                        >
                            Upload Photo
                        </button>
                    </div>
                )}

                {/* Contact Info in Header */}
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">📧</span>
                        <div
                            contentEditable={!previewMode}
                            suppressContentEditableWarning
                            onBlur={handleBlur("personalInfo", "email")}
                            data-placeholder="email@example.com"
                            className="editable-placeholder"
                        >
                            {personal.email}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-semibold">📱</span>
                        <div
                            contentEditable={!previewMode}
                            suppressContentEditableWarning
                            onBlur={handleBlur("personalInfo", "phone")}
                            data-placeholder="Phone number"
                            className="editable-placeholder"
                        >
                            {personal.phone}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-semibold">📍</span>
                        <div
                            contentEditable={!previewMode}
                            suppressContentEditableWarning
                            onBlur={handleBlur("personalInfo", "address")}
                            data-placeholder="Address"
                            className="editable-placeholder"
                        >
                            {personal.address}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-semibold">🔗</span>
                        <div
                            contentEditable={!previewMode}
                            suppressContentEditableWarning
                            onBlur={handleBlur("personalInfo", "linkedin")}
                            data-placeholder="LinkedIn"
                            className="editable-placeholder"
                        >
                            {personal.linkedin || ""}
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* LEFT SIDEBAR */}
                <aside className="w-1/3 bg-gray-100 p-6">
                    {/* Skills Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-[#2c7873] mb-3 pb-2 border-b-2 border-[#2c7873]">
                            SKILLS
                        </h3>
                        <div className="space-y-2">
                            {skills.map((s, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div
                                        contentEditable={!previewMode}
                                        suppressContentEditableWarning
                                        onBlur={(e) => {
                                            const text = (e.target as HTMLElement).innerText;
                                            if (onAdd || onRemove)
                                                updateArrayField("skills", i, "", text);
                                            else {
                                                const arr = [...skills];
                                                arr[i] = text;
                                                safeUpdate("skills", "", arr);
                                            }
                                        }}
                                        className="text-sm text-gray-700 flex-1"
                                    >
                                        • {s}
                                    </div>
                                    {!previewMode && (
                                        <button
                                            onClick={() => handleRemove("skills", i)}
                                            className="ml-2 text-xs text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {!previewMode && (
                            <button
                                onClick={() => handleAdd("skills")}
                                className="mt-3 text-sm bg-[#2c7873] text-white px-3 py-1.5 rounded hover:bg-[#3d9b96] w-full"
                            >
                                + Add Skill
                            </button>
                        )}
                    </div>

                    {/* Languages Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-[#2c7873] mb-3 pb-2 border-b-2 border-[#2c7873]">
                            LANGUAGES
                        </h3>
                        <div className="space-y-2">
                            {languages.map((l: string, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div
                                        contentEditable={!previewMode}
                                        suppressContentEditableWarning
                                        onBlur={(e) => {
                                            const text = (e.target as HTMLElement).innerText;
                                            const arr = [...languages];
                                            arr[i] = text;
                                            safeUpdate("languages", "", arr);
                                        }}
                                        className="text-sm text-gray-700 flex-1"
                                    >
                                        • {l}
                                    </div>
                                    {!previewMode && (
                                        <button
                                            onClick={() => handleRemove("languages", i)}
                                            className="ml-2 text-xs text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {!previewMode && (
                            <button
                                onClick={() => handleAdd("languages")}
                                className="mt-3 text-sm bg-[#2c7873] text-white px-3 py-1.5 rounded hover:bg-[#3d9b96] w-full"
                            >
                                + Add Language
                            </button>
                        )}
                    </div>

                    {/* Hobbies Section */}
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-[#2c7873] mb-3 pb-2 border-b-2 border-[#2c7873]">
                            INTERESTS
                        </h3>
                        <div className="space-y-2">
                            {hobbies.map((h: string, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div
                                        contentEditable={!previewMode}
                                        suppressContentEditableWarning
                                        onBlur={(e) => {
                                            const text = (e.target as HTMLElement).innerText;
                                            const arr = [...hobbies];
                                            arr[i] = text;
                                            safeUpdate("hobbies", "", arr);
                                        }}
                                        className="text-sm text-gray-700 flex-1"
                                    >
                                        • {h}
                                    </div>
                                    {!previewMode && (
                                        <button
                                            onClick={() => handleRemove("hobbies", i)}
                                            className="ml-2 text-xs text-red-500 hover:text-red-700"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {!previewMode && (
                            <button
                                onClick={() => handleAdd("hobbies")}
                                className="mt-3 text-sm bg-[#2c7873] text-white px-3 py-1.5 rounded hover:bg-[#3d9b96] w-full"
                            >
                                + Add Interest
                            </button>
                        )}
                    </div>
                </aside>

                {/* RIGHT CONTENT */}
                <section className="w-2/3 bg-white p-8">
                    {/* Profile Summary */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-[#2c7873] mb-3 uppercase">
                            Profile
                        </h3>
                        <div
                            className="text-gray-700 leading-relaxed text-sm"
                            contentEditable={!previewMode}
                            suppressContentEditableWarning
                            onBlur={handleBlur("summary", "summary")}
                            data-placeholder="Enter your professional summary..."
                        >
                            {summary}
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-bold text-[#2c7873] uppercase">
                                Experience
                            </h3>
                            {!previewMode && (
                                <button
                                    onClick={() => handleAdd("experience")}
                                    className="text-sm bg-[#2c7873] text-white px-3 py-1.5 rounded-md hover:bg-[#3d9b96]"
                                >
                                    + Add
                                </button>
                            )}
                        </div>

                        <div className="space-y-5">
                            {experience.length === 0 && (
                                <div className="text-sm text-gray-400 italic">
                                    No experience added yet.
                                </div>
                            )}

                            {experience.map((exp, idx) => (
                                <div key={idx} className="pb-4 border-b border-gray-200 last:border-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <div
                                                contentEditable={!previewMode}
                                                suppressContentEditableWarning
                                                className="editable-placeholder font-bold text-gray-800"
                                                data-placeholder="Position Title"
                                                onBlur={(e) =>
                                                    updateArrayField(
                                                        "experience",
                                                        idx,
                                                        "position",
                                                        (e.target as HTMLElement).innerText
                                                    )
                                                }
                                            >
                                                {exp.position?.trim() || ""}
                                            </div>

                                            <div
                                                contentEditable={!previewMode}
                                                suppressContentEditableWarning
                                                className="editable-placeholder text-[#2c7873] font-medium text-sm"
                                                data-placeholder="Company Name"
                                                onBlur={(e) =>
                                                    updateArrayField(
                                                        "experience",
                                                        idx,
                                                        "company",
                                                        (e.target as HTMLElement).innerText
                                                    )
                                                }
                                            >
                                                {exp.company?.trim() || ""}
                                            </div>

                                            <div
                                                contentEditable={!previewMode}
                                                suppressContentEditableWarning
                                                className="editable-placeholder text-gray-500 text-xs"
                                                data-placeholder="Location"
                                                onBlur={(e) =>
                                                    updateArrayField(
                                                        "experience",
                                                        idx,
                                                        "location",
                                                        (e.target as HTMLElement).innerText
                                                    )
                                                }
                                            >
                                                {exp.location}
                                            </div>
                                        </div>

                                        <div className="text-right ml-4 text-xs text-gray-600">
                                            <input
                                                type="date"
                                                value={exp.startDate || ""}
                                                disabled={previewMode}
                                                onChange={(e) =>
                                                    updateArrayField(
                                                        "experience",
                                                        idx,
                                                        "startDate",
                                                        e.target.value
                                                    )
                                                }
                                                className="border rounded px-2 py-1"
                                            />
                                            <span className="mx-1">-</span>
                                            <input
                                                type="date"
                                                value={exp.endDate || ""}
                                                disabled={previewMode}
                                                onChange={(e) =>
                                                    updateArrayField(
                                                        "experience",
                                                        idx,
                                                        "endDate",
                                                        e.target.value
                                                    )
                                                }
                                                className="border rounded px-2 py-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Bullet Points */}
                                    <div className="mt-2 space-y-1">
                                        {exp.bullets?.map((bullet: string, bIdx: number) => (
                                            <div key={bIdx} className="flex items-start gap-2">
                                                <span className="mt-1 text-[#2c7873] select-none text-xs">
                                                    ▸
                                                </span>
                                                <div
                                                    contentEditable={!previewMode}
                                                    suppressContentEditableWarning
                                                    className="editable-placeholder flex-1 text-gray-700 text-sm"
                                                    data-placeholder="Bullet point..."
                                                    onBlur={(e) =>
                                                        updateBulletPoint(
                                                            idx,
                                                            bIdx,
                                                            (e.target as HTMLElement).innerText
                                                        )
                                                    }
                                                >
                                                    {bullet || ""}
                                                </div>
                                                {!previewMode && (
                                                    <button
                                                        onClick={() => removeBulletPoint(idx, bIdx)}
                                                        className="text-xs text-red-500 hover:underline"
                                                    >
                                                        Remove
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {!previewMode && (
                                            <button
                                                onClick={() => addBulletPoint(idx)}
                                                className="text-sm text-[#2c7873] hover:underline mt-1"
                                            >
                                                + Add Bullet
                                            </button>
                                        )}
                                    </div>

                                    {!previewMode && (
                                        <div className="mt-2 text-right">
                                            <button
                                                onClick={() => handleRemove("experience", idx)}
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                Remove Experience
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Projects */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-bold text-[#2c7873] uppercase">
                                Projects
                            </h3>
                            {!previewMode && (
                                <button
                                    onClick={() => handleAdd("projects")}
                                    className="text-sm bg-[#2c7873] text-white px-3 py-1.5 rounded-md hover:bg-[#3d9b96]"
                                >
                                    + Add
                                </button>
                            )}
                        </div>

                        <div className="space-y-5">
                            {data?.projects?.length === 0 && (
                                <div className="text-sm text-gray-400 italic">
                                    No projects added yet.
                                </div>
                            )}

                            {data?.projects?.map((proj: any, idx: number) => (
                                <div key={idx} className="pb-4 border-b border-gray-200 last:border-0">
                                    <div className="flex flex-col gap-1 mb-2">
                                        <div className="flex justify-between items-baseline">
                                            <div
                                                contentEditable={!previewMode}
                                                suppressContentEditableWarning
                                                className="editable-placeholder font-bold text-gray-800"
                                                data-placeholder="Project Name"
                                                onBlur={(e) =>
                                                    updateArrayField(
                                                        "projects",
                                                        idx,
                                                        "name",
                                                        (e.target as HTMLElement).innerText
                                                    )
                                                }
                                            >
                                                {proj.name || ""}
                                            </div>
                                            {proj.link && (
                                                <div
                                                    contentEditable={!previewMode}
                                                    suppressContentEditableWarning
                                                    className="text-sm text-[#2c7873] underline"
                                                    onBlur={(e) =>
                                                        updateArrayField(
                                                            "projects",
                                                            idx,
                                                            "link",
                                                            (e.target as HTMLElement).innerText
                                                        )
                                                    }
                                                >
                                                    {proj.link}
                                                </div>
                                            )}
                                        </div>

                                        <div
                                            contentEditable={!previewMode}
                                            suppressContentEditableWarning
                                            className="editable-placeholder text-gray-700 text-sm"
                                            data-placeholder="Project Description"
                                            onBlur={(e) =>
                                                updateArrayField(
                                                    "projects",
                                                    idx,
                                                    "description",
                                                    (e.target as HTMLElement).innerText
                                                )
                                            }
                                        >
                                            {proj.description || ""}
                                        </div>

                                        <div
                                            contentEditable={!previewMode}
                                            suppressContentEditableWarning
                                            className="editable-placeholder text-gray-500 text-xs italic"
                                            data-placeholder="Technologies used"
                                            onBlur={(e) =>
                                                updateArrayField(
                                                    "projects",
                                                    idx,
                                                    "technologies",
                                                    (e.target as HTMLElement).innerText
                                                )
                                            }
                                        >
                                            {proj.technologies || ""}
                                        </div>
                                    </div>

                                    {!previewMode && (
                                        <div className="mt-2 text-right">
                                            <button
                                                onClick={() => handleRemove("projects", idx)}
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                Remove Project
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xl font-bold text-[#2c7873] uppercase">
                                Education
                            </h3>
                            {!previewMode && (
                                <button
                                    onClick={() => handleAdd("education")}
                                    className="text-sm bg-[#2c7873] text-white px-3 py-1.5 rounded-md hover:bg-[#3d9b96]"
                                >
                                    + Add
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {education.length === 0 && (
                                <div className="text-sm text-gray-400 italic">
                                    No education added yet.
                                </div>
                            )}

                            {education.map((edu, idx) => (
                                <div key={idx} className="pb-4 border-b border-gray-200 last:border-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <div className="flex-1">
                                            <div
                                                contentEditable={!previewMode}
                                                suppressContentEditableWarning
                                                className="editable-placeholder font-bold text-gray-800"
                                                data-placeholder="Degree"
                                                onBlur={(e) =>
                                                    updateArrayField(
                                                        "education",
                                                        idx,
                                                        "degree",
                                                        (e.target as HTMLElement).innerText
                                                    )
                                                }
                                            >
                                                {edu.degree || ""}
                                            </div>

                                            <div
                                                contentEditable={!previewMode}
                                                suppressContentEditableWarning
                                                className="editable-placeholder text-[#2c7873] font-medium text-sm"
                                                data-placeholder="Institution"
                                                onBlur={(e) =>
                                                    updateArrayField(
                                                        "education",
                                                        idx,
                                                        "institution",
                                                        (e.target as HTMLElement).innerText
                                                    )
                                                }
                                            >
                                                {edu.institution || ""}
                                            </div>

                                            <div
                                                contentEditable={!previewMode}
                                                suppressContentEditableWarning
                                                className="editable-placeholder text-gray-500 text-xs"
                                                data-placeholder="Field of Study"
                                                onBlur={(e) =>
                                                    updateArrayField(
                                                        "education",
                                                        idx,
                                                        "field",
                                                        (e.target as HTMLElement).innerText
                                                    )
                                                }
                                            >
                                                {edu.field || ""}
                                            </div>

                                            <div
                                                contentEditable={!previewMode}
                                                suppressContentEditableWarning
                                                className="editable-placeholder text-gray-500 text-xs"
                                                data-placeholder="GPA"
                                                onBlur={(e) =>
                                                    updateArrayField(
                                                        "education",
                                                        idx,
                                                        "gpa",
                                                        (e.target as HTMLElement).innerText
                                                    )
                                                }
                                            >
                                                {edu.gpa || ""}
                                            </div>
                                        </div>

                                        <div className="text-right ml-4 text-xs text-gray-600">
                                            <input
                                                type="date"
                                                value={edu.startDate || ""}
                                                disabled={previewMode}
                                                onChange={(e) =>
                                                    updateArrayField(
                                                        "education",
                                                        idx,
                                                        "startDate",
                                                        e.target.value
                                                    )
                                                }
                                                className="border rounded px-2 py-1"
                                            />
                                            <span className="mx-1">-</span>
                                            <input
                                                type="date"
                                                value={edu.endDate || ""}
                                                disabled={previewMode}
                                                onChange={(e) =>
                                                    updateArrayField(
                                                        "education",
                                                        idx,
                                                        "endDate",
                                                        e.target.value
                                                    )
                                                }
                                                className="border rounded px-2 py-1"
                                            />
                                        </div>
                                    </div>

                                    {!previewMode && (
                                        <div className="mt-2 text-right">
                                            <button
                                                onClick={() => handleRemove("education", idx)}
                                                className="text-xs text-red-500 hover:underline"
                                            >
                                                Remove Education
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
