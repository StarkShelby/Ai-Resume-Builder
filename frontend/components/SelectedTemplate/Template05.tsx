import React, { useRef } from "react";
import { TemplateProps, ResumeData } from "../../app/create/types";

/* --------------------------------------------- */
/*                DEFAULT VALUES                 */
/* --------------------------------------------- */

const emptyPersonal = {
    fullName: "Emily Rodriguez",
    title: "Product Manager",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 345-6789",
    address: "Austin, TX",
    linkedin: "linkedin.com/in/emilyrodriguez",
    github: "github.com/emilyrodriguez",
    website: "emilyrodriguez.com",
    photo: "",
};

export default function Template05({
    data,
    onUpdate = () => { },
    onAdd,
    onRemove,
    previewMode = false,
}: TemplateProps) {
    const personal = {
        ...emptyPersonal,
        ...(data?.personalInfo || {}),
    };

    const summary =
        typeof data?.summary === "string" && data.summary.trim() !== ""
            ? data.summary
            : `Strategic product manager with 6+ years of experience leading cross-functional teams to deliver innovative solutions. Expertise in product strategy, roadmap planning, and user-centric design.`;

    const experience = Array.isArray(data?.experience) ? data.experience : [];
    const education = Array.isArray(data?.education) ? data.education : [];
    const skills = Array.isArray(data?.skills)
        ? data.skills
        : ["Product Strategy", "Agile/Scrum", "User Research", "Data Analysis", "Roadmapping", "Stakeholder Management"];
    const languages = Array.isArray((data as any)?.languages)
        ? (data as any).languages
        : ["English", "Spanish", "Portuguese"];
    const hobbies = Array.isArray((data as any)?.hobbies)
        ? (data as any).hobbies
        : ["Podcasting", "Cycling", "Volunteering"];

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const addBulletPoint = (expIndex: number) => {
        const arr = [...experience] as any[];
        if (!Array.isArray(arr[expIndex].bullets)) {
            arr[expIndex].bullets = [] as string[];
        }
        (arr[expIndex].bullets as string[]).push("");
        safeUpdate("experience", "bullets", arr[expIndex].bullets, expIndex);
    };

    const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
        const arr = [...experience] as any[];
        if (!Array.isArray(arr[expIndex].bullets)) arr[expIndex].bullets = [];
        arr[expIndex].bullets.splice(bulletIndex, 1);
        safeUpdate("experience", "bullets", arr[expIndex].bullets, expIndex);
    };

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
            className="max-w-4xl mx-auto shadow-lg bg-white overflow-hidden"
            style={{ minHeight: 800 }}
        >
            <div className="flex">
                {/* LEFT SIDEBAR - Purple/Violet */}
                <aside className="w-1/3 bg-gradient-to-b from-[#6a4c93] to-[#8b5fbf] text-white p-8 flex flex-col gap-6">
                    {/* Photo */}
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-white mx-auto flex items-center justify-center border-4 border-white/30 shadow-xl">
                        {personal.photo ? (
                            <img
                                src={personal.photo}
                                alt="profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="text-gray-400 text-xs text-center">Photo</div>
                        )}
                    </div>

                    {!previewMode && (
                        <div className="w-full text-center">
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
                                className="bg-white text-[#6a4c93] px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
                            >
                                Upload Photo
                            </button>
                        </div>
                    )}

                    {/* Contact Section */}
                    <div className="w-full">
                        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">
                            Contact
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div>
                                <div className="text-xs text-white/70 mb-1">Email</div>
                                <div
                                    contentEditable={!previewMode}
                                    suppressContentEditableWarning
                                    onBlur={handleBlur("personalInfo", "email")}
                                    data-placeholder="email@example.com"
                                    className="editable-placeholder break-words"
                                >
                                    {personal.email}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-white/70 mb-1">Phone</div>
                                <div
                                    contentEditable={!previewMode}
                                    suppressContentEditableWarning
                                    onBlur={handleBlur("personalInfo", "phone")}
                                    data-placeholder="Phone"
                                    className="editable-placeholder"
                                >
                                    {personal.phone}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-white/70 mb-1">Location</div>
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

                            <div>
                                <div className="text-xs text-white/70 mb-1">LinkedIn</div>
                                <div
                                    contentEditable={!previewMode}
                                    suppressContentEditableWarning
                                    onBlur={handleBlur("personalInfo", "linkedin")}
                                    data-placeholder="LinkedIn"
                                    className="editable-placeholder break-words"
                                >
                                    {personal.linkedin || ""}
                                </div>
                            </div>

                            <div>
                                <div className="text-xs text-white/70 mb-1">Website</div>
                                <div
                                    contentEditable={!previewMode}
                                    suppressContentEditableWarning
                                    onBlur={handleBlur("personalInfo", "website")}
                                    data-placeholder="Website"
                                    className="editable-placeholder break-words"
                                >
                                    {personal.website || ""}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="w-full">
                        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">
                            Skills
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
                                        className="text-sm flex-1 bg-white/10 px-3 py-1.5 rounded-md"
                                    >
                                        {s}
                                    </div>
                                    {!previewMode && (
                                        <button
                                            onClick={() => handleRemove("skills", i)}
                                            className="ml-2 text-xs text-white/70 hover:text-white"
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
                                className="mt-3 text-sm bg-white/20 text-white px-3 py-1.5 rounded-md hover:bg-white/30 w-full"
                            >
                                + Add Skill
                            </button>
                        )}
                    </div>

                    {/* Languages Section */}
                    <div className="w-full">
                        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">
                            Languages
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
                                        className="text-sm flex-1"
                                    >
                                        • {l}
                                    </div>
                                    {!previewMode && (
                                        <button
                                            onClick={() => handleRemove("languages", i)}
                                            className="ml-2 text-xs text-white/70 hover:text-white"
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
                                className="mt-3 text-sm bg-white/20 text-white px-3 py-1.5 rounded-md hover:bg-white/30 w-full"
                            >
                                + Add Language
                            </button>
                        )}
                    </div>

                    {/* Hobbies Section */}
                    <div className="w-full">
                        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">
                            Interests
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
                                        className="text-sm flex-1"
                                    >
                                        • {h}
                                    </div>
                                    {!previewMode && (
                                        <button
                                            onClick={() => handleRemove("hobbies", i)}
                                            className="ml-2 text-xs text-white/70 hover:text-white"
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
                                className="mt-3 text-sm bg-white/20 text-white px-3 py-1.5 rounded-md hover:bg-white/30 w-full"
                            >
                                + Add Interest
                            </button>
                        )}
                    </div>
                </aside>

                {/* RIGHT CONTENT */}
                <section className="w-2/3 bg-white p-10">
                    {/* Header: Name + Title */}
                    <div className="mb-8">
                        <h1
                            className="text-4xl font-bold text-[#6a4c93]"
                            contentEditable={!previewMode}
                            suppressContentEditableWarning
                            onBlur={handleBlur("personalInfo", "fullName")}
                            data-placeholder="Your Name"
                        >
                            {personal.fullName || ""}
                        </h1>
                        <div
                            className="text-xl text-gray-700 mt-2 font-medium"
                            contentEditable={!previewMode}
                            suppressContentEditableWarning
                            onBlur={handleBlur("personalInfo", "title")}
                            data-placeholder="Your Title"
                        >
                            {personal.title}
                        </div>
                        <div className="h-1 bg-gradient-to-r from-[#6a4c93] to-[#8b5fbf] mt-4 w-32" />
                    </div>

                    {/* Profile Summary */}
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-[#6a4c93] mb-3 uppercase tracking-wide">
                            About Me
                        </h3>
                        <div
                            className="text-gray-700 leading-relaxed text-sm"
                            contentEditable={!previewMode}
                            suppressContentEditableWarning
                            onBlur={handleBlur("summary", "summary")}
                            data-placeholder="Professional summary..."
                        >
                            {summary}
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#6a4c93] uppercase tracking-wide">
                                Experience
                            </h3>
                            {!previewMode && (
                                <button
                                    onClick={() => handleAdd("experience")}
                                    className="text-sm bg-[#6a4c93] text-white px-3 py-1.5 rounded-md hover:bg-[#8b5fbf]"
                                >
                                    + Add
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {experience.length === 0 && (
                                <div className="text-sm text-gray-400 italic">
                                    No experience added yet.
                                </div>
                            )}

                            {experience.map((exp, idx) => (
                                <div key={idx} className="border-l-4 border-[#6a4c93] pl-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <div
                                                contentEditable={!previewMode}
                                                suppressContentEditableWarning
                                                className="editable-placeholder font-bold text-lg text-gray-800"
                                                data-placeholder="Position"
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
                                                className="editable-placeholder text-[#6a4c93] font-medium"
                                                data-placeholder="Company"
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
                                                className="editable-placeholder text-gray-500 text-sm"
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

                                        <div className="text-sm text-gray-600 ml-4">
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
                                                className="border rounded px-2 py-1 text-xs"
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
                                                className="border rounded px-2 py-1 text-xs"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3 space-y-1">
                                        {exp.bullets?.map((bullet: string, bIdx: number) => (
                                            <div key={bIdx} className="flex items-start gap-2">
                                                <span className="mt-1 text-[#6a4c93] select-none">
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
                                                className="text-sm text-[#6a4c93] hover:underline mt-1"
                                            >
                                                + Add Bullet
                                            </button>
                                        )}
                                    </div>

                                    {!previewMode && (
                                        <div className="mt-3 text-right">
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
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#6a4c93] uppercase tracking-wide">
                                Projects
                            </h3>
                            {!previewMode && (
                                <button
                                    onClick={() => handleAdd("projects")}
                                    className="text-sm bg-[#6a4c93] text-white px-3 py-1.5 rounded-md hover:bg-[#8b5fbf]"
                                >
                                    + Add
                                </button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {data?.projects?.length === 0 && (
                                <div className="text-sm text-gray-400 italic">
                                    No projects added yet.
                                </div>
                            )}

                            {data?.projects?.map((proj: any, idx: number) => (
                                <div key={idx} className="border-l-4 border-[#6a4c93] pl-4">
                                    <div className="flex flex-col gap-1 mb-2">
                                        <div className="flex justify-between items-baseline">
                                            <div
                                                contentEditable={!previewMode}
                                                suppressContentEditableWarning
                                                className="editable-placeholder font-bold text-lg text-gray-800"
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
                                                    className="text-sm text-[#6a4c93] underline"
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
                                        <div className="mt-3 text-right">
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
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-[#6a4c93] uppercase tracking-wide">
                                Education
                            </h3>
                            {!previewMode && (
                                <button
                                    onClick={() => handleAdd("education")}
                                    className="text-sm bg-[#6a4c93] text-white px-3 py-1.5 rounded-md hover:bg-[#8b5fbf]"
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
                                <div key={idx} className="border-l-4 border-[#6a4c93] pl-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div
                                                contentEditable={!previewMode}
                                                suppressContentEditableWarning
                                                className="editable-placeholder font-bold text-lg text-gray-800"
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
                                                className="editable-placeholder text-[#6a4c93] font-medium"
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
                                                className="editable-placeholder text-gray-500 text-sm"
                                                data-placeholder="Field"
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
                                                className="editable-placeholder text-gray-500 text-sm"
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

                                        <div className="text-sm text-gray-600 ml-4">
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
                                                className="border rounded px-2 py-1 text-xs"
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
                                                className="border rounded px-2 py-1 text-xs"
                                            />
                                        </div>
                                    </div>

                                    {!previewMode && (
                                        <div className="mt-3 text-right">
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
