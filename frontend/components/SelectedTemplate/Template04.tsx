import React, { useRef } from "react";
import { TemplateProps, ResumeData } from "../../app/create/types";

/* --------------------------------------------- */
/*                DEFAULT VALUES                 */
/* --------------------------------------------- */

const emptyPersonal = {
    fullName: "Michael Chen",
    title: "Data Scientist",
    email: "michael.chen@email.com",
    phone: "+1 (555) 234-5678",
    address: "Seattle, WA",
    linkedin: "linkedin.com/in/michaelchen",
    github: "github.com/michaelchen",
    website: "michaelchen.io",
    photo: "",
};

export default function Template04({
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
            : `Data scientist with expertise in machine learning, statistical analysis, and data visualization. Passionate about turning data into actionable insights.`;

    const experience = Array.isArray(data?.experience) ? data.experience : [];
    const education = Array.isArray(data?.education) ? data.education : [];
    const skills = Array.isArray(data?.skills)
        ? data.skills
        : ["Python", "R", "SQL", "TensorFlow", "Tableau", "Statistics"];
    const languages = Array.isArray((data as any)?.languages)
        ? (data as any).languages
        : ["English", "Mandarin"];
    const hobbies = Array.isArray((data as any)?.hobbies)
        ? (data as any).hobbies
        : ["Chess", "Reading", "Running"];

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
            {/* Simple Clean Header */}
            <header className="bg-white border-b-4 border-[#e74c3c] p-8">
                <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
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

                    <div className="flex-1">
                        <h1
                            className="text-3xl font-bold text-gray-900"
                            contentEditable={!previewMode}
                            suppressContentEditableWarning
                            onBlur={handleBlur("personalInfo", "fullName")}
                            data-placeholder="Your Name"
                        >
                            {personal.fullName || ""}
                        </h1>
                        <div
                            className="text-lg text-[#e74c3c] font-medium mt-1"
                            contentEditable={!previewMode}
                            suppressContentEditableWarning
                            onBlur={handleBlur("personalInfo", "title")}
                            data-placeholder="Your Title"
                        >
                            {personal.title}
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>
                                📧{" "}
                                <span
                                    contentEditable={!previewMode}
                                    suppressContentEditableWarning
                                    onBlur={handleBlur("personalInfo", "email")}
                                    className="editable-placeholder"
                                >
                                    {personal.email}
                                </span>
                            </div>
                            <div>
                                📱{" "}
                                <span
                                    contentEditable={!previewMode}
                                    suppressContentEditableWarning
                                    onBlur={handleBlur("personalInfo", "phone")}
                                    className="editable-placeholder"
                                >
                                    {personal.phone}
                                </span>
                            </div>
                            <div>
                                📍{" "}
                                <span
                                    contentEditable={!previewMode}
                                    suppressContentEditableWarning
                                    onBlur={handleBlur("personalInfo", "address")}
                                    className="editable-placeholder"
                                >
                                    {personal.address}
                                </span>
                            </div>
                            <div>
                                🔗{" "}
                                <span
                                    contentEditable={!previewMode}
                                    suppressContentEditableWarning
                                    onBlur={handleBlur("personalInfo", "linkedin")}
                                    className="editable-placeholder"
                                >
                                    {personal.linkedin || ""}
                                </span>
                            </div>
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
                            className="bg-[#e74c3c] text-white px-4 py-2 rounded-md text-sm hover:bg-[#c0392b]"
                        >
                            Upload Photo
                        </button>
                    </div>
                )}
            </header>

            <div className="p-8">
                {/* Summary */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b-2 border-[#e74c3c] inline-block">
                        SUMMARY
                    </h3>
                    <div
                        className="text-gray-700 leading-relaxed mt-3 text-sm"
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        onBlur={handleBlur("summary", "summary")}
                        data-placeholder="Professional summary..."
                    >
                        {summary}
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-3 gap-8">
                    {/* Left Column - 2/3 width */}
                    <div className="col-span-2">
                        {/* Experience */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-bold text-gray-900 pb-1 border-b-2 border-[#e74c3c] inline-block">
                                    EXPERIENCE
                                </h3>
                                {!previewMode && (
                                    <button
                                        onClick={() => handleAdd("experience")}
                                        className="text-xs bg-[#e74c3c] text-white px-2 py-1 rounded"
                                    >
                                        + Add
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4 mt-3">
                                {experience.length === 0 && (
                                    <div className="text-sm text-gray-400 italic">
                                        No experience added yet.
                                    </div>
                                )}

                                {experience.map((exp, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div
                                                    contentEditable={!previewMode}
                                                    suppressContentEditableWarning
                                                    className="editable-placeholder font-bold text-gray-800"
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
                                                    className="editable-placeholder text-gray-600 text-sm"
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

                                            <div className="text-xs text-gray-500">
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
                                                    className="border rounded px-1 py-0.5 text-xs"
                                                />
                                                {" - "}
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
                                                    className="border rounded px-1 py-0.5 text-xs"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-2 space-y-1">
                                            {exp.bullets?.map((bullet: string, bIdx: number) => (
                                                <div key={bIdx} className="flex items-start gap-2">
                                                    <span className="text-[#e74c3c] select-none">•</span>
                                                    <div
                                                        contentEditable={!previewMode}
                                                        suppressContentEditableWarning
                                                        className="editable-placeholder flex-1 text-gray-700 text-sm"
                                                        data-placeholder="Bullet..."
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
                                                            className="text-xs text-red-500"
                                                        >
                                                            ×
                                                        </button>
                                                    )}
                                                </div>
                                            ))}

                                            {!previewMode && (
                                                <button
                                                    onClick={() => addBulletPoint(idx)}
                                                    className="text-xs text-[#e74c3c] hover:underline"
                                                >
                                                    + Bullet
                                                </button>
                                            )}
                                        </div>

                                        {!previewMode && (
                                            <button
                                                onClick={() => handleRemove("experience", idx)}
                                                className="text-xs text-red-500 hover:underline mt-2"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Projects */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-bold text-gray-900 pb-1 border-b-2 border-[#e74c3c] inline-block">
                                    PROJECTS
                                </h3>
                                {!previewMode && (
                                    <button
                                        onClick={() => handleAdd("projects")}
                                        className="text-xs bg-[#e74c3c] text-white px-2 py-1 rounded"
                                    >
                                        + Add
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4 mt-3">
                                {data?.projects?.length === 0 && (
                                    <div className="text-sm text-gray-400 italic">
                                        No projects added yet.
                                    </div>
                                )}

                                {data?.projects?.map((proj: any, idx: number) => (
                                    <div key={idx}>
                                        <div className="flex flex-col gap-1">
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
                                                        className="text-sm text-[#e74c3c] underline"
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
                                            <button
                                                onClick={() => handleRemove("projects", idx)}
                                                className="text-xs text-red-500 hover:underline mt-2"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Education */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-bold text-gray-900 pb-1 border-b-2 border-[#e74c3c] inline-block">
                                    EDUCATION
                                </h3>
                                {!previewMode && (
                                    <button
                                        onClick={() => handleAdd("education")}
                                        className="text-xs bg-[#e74c3c] text-white px-2 py-1 rounded"
                                    >
                                        + Add
                                    </button>
                                )}
                            </div>

                            <div className="space-y-3 mt-3">
                                {education.length === 0 && (
                                    <div className="text-sm text-gray-400 italic">
                                        No education added yet.
                                    </div>
                                )}

                                {education.map((edu, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-start">
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
                                                    className="editable-placeholder text-gray-600 text-sm"
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
                                            </div>

                                            <div className="text-xs text-gray-500">
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
                                                    className="border rounded px-1 py-0.5 text-xs"
                                                />
                                                {" - "}
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
                                                    className="border rounded px-1 py-0.5 text-xs"
                                                />
                                            </div>
                                        </div>

                                        {!previewMode && (
                                            <button
                                                onClick={() => handleRemove("education", idx)}
                                                className="text-xs text-red-500 hover:underline mt-1"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - 1/3 width */}
                    <div className="col-span-1">
                        {/* Skills */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b-2 border-[#e74c3c] inline-block">
                                SKILLS
                            </h3>
                            <div className="space-y-1 mt-3">
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
                                                className="ml-2 text-xs text-red-500"
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
                                    className="mt-2 text-xs bg-[#e74c3c] text-white px-2 py-1 rounded w-full"
                                >
                                    + Add
                                </button>
                            )}
                        </div>

                        {/* Languages */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b-2 border-[#e74c3c] inline-block">
                                LANGUAGES
                            </h3>
                            <div className="space-y-1 mt-3">
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
                                                className="ml-2 text-xs text-red-500"
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
                                    className="mt-2 text-xs bg-[#e74c3c] text-white px-2 py-1 rounded w-full"
                                >
                                    + Add
                                </button>
                            )}
                        </div>

                        {/* Hobbies */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 pb-1 border-b-2 border-[#e74c3c] inline-block">
                                HOBBIES
                            </h3>
                            <div className="space-y-1 mt-3">
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
                                                className="ml-2 text-xs text-red-500"
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
                                    className="mt-2 text-xs bg-[#e74c3c] text-white px-2 py-1 rounded w-full"
                                >
                                    + Add
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
