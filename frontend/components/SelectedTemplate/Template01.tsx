import React, { useRef } from "react";
import { TemplateProps, ResumeData } from "../../app/create/types";

/* --------------------------------------------- */
/*                DEFAULT VALUES                 */
/* --------------------------------------------- */

const emptyPersonal = {
  fullName: "Max Johnson",
  title: "UX Designer",
  email: "max.johnson@email.com",
  phone: "+1 2345 6789",
  address: "New York, USA",
  linkedin: "your LinkedIn",
  github: "Github profile",
  website: "your site",
  photo: "",
};

export default function Template01({
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
      : `Experienced UX Designer specializing in user research, interaction design, and prototyping.`; // fallback text

  const experience = Array.isArray(data?.experience) ? data.experience : [];

  const education = Array.isArray(data?.education) ? data.education : [];

  const skills = Array.isArray(data?.skills)
    ? data.skills
    : ["Figma", "Adobe XD", "Sketch", "InVision", "Photoshop"];

  const languages = Array.isArray((data as any)?.languages)
    ? (data as any).languages
    : ["English", "French", "Russian"];

  const hobbies = Array.isArray((data as any)?.hobbies)
    ? (data as any).hobbies
    : ["Photography", "Football", "Cooking"];

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ADD a bullet point
  const addBulletPoint = (expIndex: number) => {
    // Explicitly type arr as any[] to avoid TS inference issues
    const arr = [...experience] as any[];

    // Ensure bullets array exists and is a string array
    if (!Array.isArray(arr[expIndex].bullets)) {
      arr[expIndex].bullets = [] as string[];
    }

    // Push new bullet
    (arr[expIndex].bullets as string[]).push("");

    // Update field correctly using safeUpdate to allow non-string values
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
      // swallow - parent's handler might not exist or be strict
      console.warn("update failed:", err);
    }
  };

  // If parent provides add/remove hooks use them; otherwise update arrays locally by creating new array and emitting via onUpdate (field === "" means set full array)
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
    // If parent CreatePage provided custom handler → use that
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

  // when contentEditable loses focus call update
  const handleBlur =
    (section: keyof ResumeData, field: string, index?: number) =>
      (e: React.FocusEvent<HTMLElement>) => {
        const text = (e.target as HTMLElement).innerText;
        if (index !== undefined) safeUpdate(section, field, text, index);
        else safeUpdate(section, field, text);
      };

  // small onInput handler so edits (not only blur) can reflect to parent if desired
  const handleInput =
    (section: string, field: string, index?: number) =>
      (e: React.FormEvent<HTMLElement>) => {
        // don't spam updates on every keystroke — you can enable if needed
      };

  // helper to update array items using onUpdate(section, field, value, index)
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
      <div className="flex">
        {/* LEFT SIDEBAR */}
        <aside className="w-1/3 bg-gray-800 text-white p-8 flex flex-col items-center gap-6">
          <div className="w-36 h-36 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {personal.photo ? (
              <img
                src={personal.photo}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gray-700">No Photo</div>
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
                className="bg-white text-gray-800 px-3 py-1 rounded"
              >
                Upload Photo
              </button>
            </div>
          )}

          <div className="w-full">
            <div className="text-sm text-gray-300 uppercase tracking-wider mb-2">
              Contact
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-400">Address</div>
                <div
                  contentEditable={!previewMode}
                  suppressContentEditableWarning
                  onBlur={handleBlur("personalInfo", "address")}
                  data-placeholder="your address"
                  className="text-sm editable-placeholder "
                >
                  {personal.address}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Phone</div>
                <div
                  contentEditable={!previewMode}
                  suppressContentEditableWarning
                  onBlur={handleBlur("personalInfo", "phone")}
                  data-placeholder="Enter phone number"
                  className="text-sm editable-placeholder"
                >
                  {personal.phone}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400">Email</div>
                <div
                  contentEditable={!previewMode}
                  suppressContentEditableWarning
                  onBlur={handleBlur("personalInfo", "email")}
                  data-placeholder="Enter email"
                  className="text-sm editable-placeholder"
                >
                  {personal.email}
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-400">LinkedIn</div>

                <div
                  contentEditable={!previewMode}
                  suppressContentEditableWarning
                  onBlur={handleBlur("personalInfo", "linkedin")}
                  data-placeholder="Enter LinkedIn profile"
                  className="text-sm editable-placeholder"
                >
                  {personal.linkedin || ""}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full mt-6">
            <div className="text-sm text-gray-300 uppercase tracking-wider mb-2">
              Skills
            </div>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              {skills.map((s, i) => (
                <li key={i} className="flex items-center justify-between">
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
                  >
                    {s}
                  </div>
                  {!previewMode && (
                    <button
                      onClick={() => handleRemove("skills", i)}
                      className="ml-2 text-xs text-red-300"
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {!previewMode && (
              <button
                onClick={() => handleAdd("skills")}
                className="mt-3 text-sm bg-white text-gray-800 px-3 py-1 rounded"
              >
                + Add Skill
              </button>
            )}
          </div>

          <div className="w-full mt-6">
            <div className="text-sm text-gray-300 uppercase tracking-wider mb-2">
              Languages
            </div>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              {languages.map((l: string, i: number) => (
                <li key={i} className="flex items-center justify-between">
                  <div
                    contentEditable={!previewMode}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const text = (e.target as HTMLElement).innerText;
                      const arr = [...languages];
                      arr[i] = text;
                      safeUpdate("languages", "", arr);
                    }}
                  >
                    {l}
                  </div>
                  {!previewMode && (
                    <button
                      onClick={() => handleRemove("languages", i)}
                      className="ml-2 text-xs text-red-300"
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {!previewMode && (
              <button
                onClick={() => handleAdd("languages")}
                className="mt-3 text-sm bg-white text-gray-800 px-3 py-1 rounded"
              >
                + Add Language
              </button>
            )}
          </div>

          <div className="w-full mt-6">
            <div className="text-sm text-gray-300 uppercase tracking-wider mb-2">
              Hobbies
            </div>
            <ul className="list-disc ml-5 space-y-1 text-sm">
              {hobbies.map((h: string, i: number) => (
                <li key={i} className="flex items-center justify-between">
                  <div
                    contentEditable={!previewMode}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const text = (e.target as HTMLElement).innerText;
                      const arr = [...hobbies];
                      arr[i] = text;
                      safeUpdate("hobbies", "", arr);
                    }}
                  >
                    {h}
                  </div>
                  {!previewMode && (
                    <button
                      onClick={() => handleRemove("hobbies", i)}
                      className="ml-2 text-xs text-red-300"
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {!previewMode && (
              <button
                onClick={() => handleAdd("hobbies")}
                className="mt-3 text-sm bg-white text-gray-800 px-3 py-1 rounded"
              >
                + Add Hobby
              </button>
            )}
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <section className="w-2/3 bg-white p-10">
          {/* Header: Name + Title */}
          <div className="mb-6">
            <h1
              className="text-3xl text-black font-bold"
              contentEditable={!previewMode}
              suppressContentEditableWarning
              onBlur={handleBlur("personalInfo", "fullName")}
            >
              {personal.fullName || "Your Name "}
            </h1>
            <div
              className="text-lg text-gray-600"
              contentEditable={!previewMode}
              suppressContentEditableWarning
              onBlur={handleBlur("personalInfo", "title")}
            >
              {personal.title}
            </div>
            <div className="h-1 bg-gray-200 mt-4" />
          </div>

          {/* Profile Summary */}
          <div className="mb-6 text-black">
            <h3 className="text-xl font-semibold mb-2">
              Profile
              <div className="h-[2px] w-16 bg-gray-600 font-bold mt-1"></div>
            </h3>
            <div
              className="text-gray-700 leading-relaxed"
              contentEditable={!previewMode}
              suppressContentEditableWarning
              onBlur={handleBlur("summary", "summary")}
            >
              {summary}
            </div>
          </div>

          {/* Experience */}
          <div className="mb-10">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Experience
                <div className="h-[2px] w-16 bg-gray-600 font-bold mt-1"></div>
              </h3>

              {!previewMode && (
                <button
                  onClick={() => handleAdd("experience")}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
                >
                  + Add Experience
                </button>
              )}
            </div>

            <div className="mt-4 space-y-6">
              {experience.length === 0 && (
                <div className="text-sm text-gray-400 italic">
                  No experience added yet. Click “Add Experience” to begin.
                </div>
              )}

              {experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-md p-5 border border-gray-200 shadow-sm"
                >
                  {/* GRID: Left Content + Dates */}
                  <div className="grid grid-cols-[minmax(0,1fr)_140px] gap-4">
                    {/* LEFT SIDE */}
                    <div className="flex flex-col gap-2 min-w-0">
                      {/* Company */}
                      <div
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        className="editable-placeholder font-semibold text-lg break-words text-black whitespace-pre-wrap overflow-hidden max-w-full block"
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

                      {/* Job Title */}
                      <div
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        className="editable-placeholder text-gray-600 text-sm break-words whitespace-pre-wrap overflow-hidden max-w-full block"
                        data-placeholder="Job Title"
                        onBlur={(e) =>
                          updateArrayField(
                            "experience",
                            idx,
                            "position",
                            (e.target as HTMLElement).innerText
                          )
                        }
                      >
                        {exp.position}
                      </div>

                      {/* LOCATION */}
                      <div
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        className="editable-placeholder text-gray-500 text-sm break-words whitespace-pre-wrap overflow-hidden max-w-full block"
                        data-placeholder="Location (e.g., Chicago, IL)"
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

                    {/* RIGHT DATE SIDE */}
                    <div className="w-[140px] flex flex-col items-end">
                      <label className="text-gray-500 text-xs">Start</label>
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
                        className="mt-1 border rounded px-2 py-1 w-full text-gray-700"
                      />

                      <label className="text-gray-500 text-xs mt-3">End</label>
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
                        className="mt-1 border rounded px-2 py-1 w-full text-gray-700"
                      />
                    </div>
                  </div>

                  {/* BULLET POINTS */}
                  <div className="mt-4">
                    {exp.bullets?.map((bullet: string, bIdx: number) => (
                      <div key={bIdx} className="flex items-start gap-2 mb-2">
                        {/* BULLET DOT */}
                        <span
                          className="mt-1 inline-block w-3 text-black select-none"
                          style={{ fontSize: "18px", lineHeight: "18px" }}
                        >
                          •
                        </span>

                        {/* BULLET TEXT AREA */}
                        <div
                          contentEditable={!previewMode}
                          suppressContentEditableWarning
                          className="editable-placeholder flex-1 text-gray-700 min-h-[20px] whitespace-pre-wrap break-words"
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
                        className="text-sm text-blue-600 hover:underline mt-1"
                      >
                        + Add Bullet Point
                      </button>
                    )}
                  </div>

                  {/* REMOVE EXPERIENCE BUTTON */}
                  {!previewMode && (
                    <div className="mt-4 text-right">
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
          <div className="mb-10">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Projects
                <div className="h-[2px] w-16 bg-gray-600 font-bold mt-1"></div>
              </h3>

              {!previewMode && (
                <button
                  onClick={() => handleAdd("projects")}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
                >
                  + Add Project
                </button>
              )}
            </div>

            <div className="mt-4 space-y-6">
              {data?.projects?.length === 0 && (
                <div className="text-sm text-gray-400 italic">
                  No projects added yet. Click “Add Project” to begin.
                </div>
              )}

              {data?.projects?.map((proj: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-white rounded-md p-5 border border-gray-200 shadow-sm"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-baseline">
                      <div
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        className="editable-placeholder font-semibold text-lg break-words text-black whitespace-pre-wrap overflow-hidden max-w-full block"
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
                          className="text-sm text-blue-600 underline"
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
                      className="editable-placeholder text-gray-700 text-sm break-words whitespace-pre-wrap overflow-hidden max-w-full block"
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
                      className="editable-placeholder text-gray-500 text-xs italic break-words whitespace-pre-wrap overflow-hidden max-w-full block"
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
                    <div className="mt-4 text-right">
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
          <div className="mb-10">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-gray-800">
                Education
                <div className="h-[2px] w-16 bg-gray-600 font-bold mt-1"></div>
              </h3>

              {!previewMode && (
                <button
                  onClick={() => handleAdd("education")}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200"
                >
                  + Add Education
                </button>
              )}
            </div>

            <div className="mt-4 space-y-6">
              {education.length === 0 && (
                <div className="text-sm text-gray-400 italic">
                  No education added yet. Click “Add Education” to begin.
                </div>
              )}

              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-md p-5 border border-gray-200 shadow-sm"
                >
                  {/* GRID: Left Content + Dates */}
                  <div className="grid grid-cols-[minmax(0,1fr)_140px] gap-4">
                    {/* LEFT SIDE */}
                    <div className="flex flex-col gap-2 min-w-0">
                      {/* Institution */}
                      <div
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        className="editable-placeholder font-semibold text-lg break-words text-black whitespace-pre-wrap overflow-hidden max-w-full block"
                        data-placeholder="Institution Name"
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

                      {/* Degree */}
                      <div
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        className="editable-placeholder text-gray-600 text-sm break-words whitespace-pre-wrap overflow-hidden max-w-full block"
                        data-placeholder="Degree (e.g., B.Tech)"
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

                      {/* Field of Study */}
                      <div
                        contentEditable={!previewMode}
                        suppressContentEditableWarning
                        className="editable-placeholder text-gray-500 text-sm break-words whitespace-pre-wrap overflow-hidden max-w-full block"
                        data-placeholder="Field of Study (e.g., Computer Science)"
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

                    {/* RIGHT SIDE — DATES */}
                    <div className="w-[140px] flex flex-col items-end">
                      <label className="text-gray-500 text-xs">Start</label>
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
                        className="mt-1 border rounded px-2 py-1 w-full text-gray-700"
                      />

                      <label className="text-gray-500 text-xs mt-3">End</label>
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
                        className="mt-1 border rounded px-2 py-1 w-full text-gray-700"
                      />
                    </div>
                  </div>

                  {/* REMOVE BUTTON */}
                  {!previewMode && (
                    <div className="mt-4 text-right">
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
function handleContentUpdate(
  section: string,
  _arg1: string,
  arr: {
    location: React.ReactNode;
    tasks: string[];
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    bullets: [""];
  }[]
): void {
  // Safe no-op implementation: if a global handler is registered, call it.
  // This avoids runtime errors if the function is invoked but no parent updater is available.
  const globalHandler = (window as any).__handleContentUpdate;
  if (typeof globalHandler === "function") {
    try {
      globalHandler(section, arr);
    } catch (err) {
      // swallow to avoid breaking the UI
      // eslint-disable-next-line no-console
      console.warn("handleContentUpdate: global handler threw", err);
    }
  } else {
    // eslint-disable-next-line no-console
    console.warn(
      "handleContentUpdate called but no handler registered",
      section,
      arr
    );
  }
}
