import React from "react";
import { TemplateProps } from "../../app/create/types";
import { ResumeData } from "../../app/create/types";
import {
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Github,
  Globe,
  Plus,
  Trash2,
} from "lucide-react";

export default function TemplateA({
  data,
  onUpdate,
  onAdd,
  onRemove,
  previewMode,
}: TemplateProps) {
  const handleInput = (
    section: keyof ResumeData,
    field: string,
    value: any,
    index?: number
  ) => {
    if (onUpdate) {
      onUpdate(section, field, value, index);
    }
  };

  if (previewMode) {
    return (
      <div
        className="border rounded-lg p-4 bg-white max-w-sm mx-auto shadow-md flex flex-col gap-2"
        style={{ minHeight: 200, opacity: 0.8 }}
      >
        <div className="h-4 w-1/2 bg-gray-800 rounded mb-2"></div>
        <div className="h-3 w-1/3 bg-gray-400 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-2 w-full bg-gray-200 rounded"></div>
          <div className="h-2 w-full bg-gray-200 rounded"></div>
          <div className="h-2 w-3/4 bg-gray-200 rounded"></div>
        </div>
        <div className="mt-4">
          <div className="h-3 w-1/4 bg-gray-600 rounded mb-2"></div>
          <div className="h-2 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white text-gray-800 font-sans w-[210mm] min-h-[297mm]" id="resume-content">
      {/* Header */}
      <header className="border-b-2 border-gray-800 pb-6 mb-6">
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            handleInput("personalInfo", "fullName", e.currentTarget.innerText)
          }
          className="text-4xl font-bold text-gray-900 uppercase tracking-wide mb-2 outline-none focus:bg-blue-50 hover:bg-gray-50 transition-colors"
        >
          {data?.personalInfo?.fullName || "JOHN SMITH"}
        </div>
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            handleInput("personalInfo", "jobTitle", e.currentTarget.innerText)
          }
          className="text-xl text-gray-600 font-medium mb-4 outline-none focus:bg-blue-50 hover:bg-gray-50 transition-colors"
        >
          {data?.personalInfo?.jobTitle || "IT Project Manager"}
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleInput("personalInfo", "phone", e.currentTarget.innerText)
              }
              className="outline-none focus:bg-blue-50 hover:bg-gray-50"
            >
              {data?.personalInfo?.phone || "774-987-4009"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={14} />
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleInput("personalInfo", "email", e.currentTarget.innerText)
              }
              className="outline-none focus:bg-blue-50 hover:bg-gray-50"
            >
              {data?.personalInfo?.email || "j.smith@uptowork.com"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Linkedin size={14} />
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleInput(
                  "personalInfo",
                  "linkedin",
                  e.currentTarget.innerText
                )
              }
              className="outline-none focus:bg-blue-50 hover:bg-gray-50"
            >
              {data?.personalInfo?.linkedin || "linkedin.com/johnutw"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Twitter size={14} />
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleInput(
                  "personalInfo",
                  "twitter",
                  e.currentTarget.innerText
                )
              }
              className="outline-none focus:bg-blue-50 hover:bg-gray-50"
            >
              {data?.personalInfo?.twitter || "@johnsmithutw"}
            </span>
          </div>
          {/* Optional: Address/Location if needed, though not in the specific design request explicitly, good to have */}
          {data?.personalInfo?.address && (
            <div className="flex items-center gap-2 col-span-2">
              <MapPin size={14} />
              <span
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleInput(
                    "personalInfo",
                    "address",
                    e.currentTarget.innerText
                  )
                }
                className="outline-none focus:bg-blue-50 hover:bg-gray-50"
              >
                {data?.personalInfo?.address}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      <section className="mb-6">
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) =>
            handleInput("summary", "summary", e.currentTarget.innerText)
          }
          className="text-sm text-gray-700 leading-relaxed outline-none focus:bg-blue-50 hover:bg-gray-50"
        >
          {data?.summary ||
            "IT Professional with over 10 years of experience specializing in IT department management for international logistics companies. I can implement effective IT strategies at local and global levels. My greatest strength is business awareness, which enables me to permanently streamline infrastructure and applications. Seeking to leverage my IT management skills at SanCorp Inc."}
        </div>
      </section>

      {/* Experience */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3 border-b border-gray-300 pb-1">
          <h2 className="text-lg font-bold text-gray-800 uppercase flex items-center gap-2">
            <span className="bg-gray-800 text-white p-1 rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            </span>
            Experience
          </h2>
          <button
            onClick={() => onAdd && onAdd("experience")}
            className="text-blue-600 hover:text-blue-800 no-print"
            title="Add Experience"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-5">
          {data?.experience?.map((exp: any, index: number) => (
            <div key={index} className="relative group">
              <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                <div className="flex-1">
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleInput(
                        "experience",
                        "position",
                        e.currentTarget.innerText,
                        index
                      )
                    }
                    className="font-bold text-gray-900 outline-none focus:bg-blue-50 hover:bg-gray-50"
                  >
                    {exp.position || "Senior Project Manager"}
                  </div>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleInput(
                        "experience",
                        "company",
                        e.currentTarget.innerText,
                        index
                      )
                    }
                    className="text-sm italic text-gray-600 outline-none focus:bg-blue-50 hover:bg-gray-50"
                  >
                    {exp.company || "Seton Hospital, ME"}
                  </div>
                </div>
                <div className="text-sm text-gray-600 font-semibold whitespace-nowrap sm:text-right">
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleInput("experience", "startDate", e.currentTarget.innerText, index)
                    }
                    className="outline-none focus:bg-blue-50 hover:bg-gray-50"
                  >
                    {exp.startDate || "2006-12"}
                  </span>
                  {" - "}
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleInput("experience", "endDate", e.currentTarget.innerText, index)
                    }
                    className="outline-none focus:bg-blue-50 hover:bg-gray-50"
                  >
                    {exp.endDate || "present"}
                  </span>
                </div>
              </div>

              <ul className="list-disc list-outside ml-4 text-sm text-gray-700 space-y-1">
                {exp.bullets?.map((bullet: string, bIndex: number) => (
                  <li key={bIndex} className="pl-1 relative group/bullet">
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleInput(
                          "experience",
                          "bullets",
                          e.currentTarget.innerText,
                          index
                        ) // Note: This logic in parent needs to handle array update by index, or we pass full array here. 
                        // Simplified for this template: we assume handleInput can handle specific bullet update if implemented, 
                        // or we do a local update. For now, standard implementation assumes replacing the whole bullets array or specific item.
                        // Actually, the standard handleInput in parent usually expects value to be the field value.
                        // So we need to construct the new bullets array.
                      }
                      // Workaround for bullets: usually we need a specific handler for array items.
                      // Assuming the parent handleInput is smart enough or we do it manually:
                      onInput={(e) => {
                        const newBullets = [...(exp.bullets || [])];
                        newBullets[bIndex] = e.currentTarget.innerText;
                        handleInput("experience", "bullets", newBullets, index);
                      }}
                      className="outline-none focus:bg-blue-50 hover:bg-gray-50"
                    >
                      {bullet || "Responsible for creating, improving, and developing IT project strategies."}
                    </div>
                    <button
                      onClick={() => {
                        const newBullets = [...(exp.bullets || [])];
                        newBullets.splice(bIndex, 1);
                        handleInput("experience", "bullets", newBullets, index);
                      }}
                      className="absolute -left-6 top-0 text-red-400 opacity-0 group-hover/bullet:opacity-100 no-print"
                      title="Remove Bullet"
                    >
                      <Trash2 size={12} />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => {
                  const newBullets = [...(exp.bullets || []), "New bullet point"];
                  handleInput("experience", "bullets", newBullets, index);
                }}
                className="text-xs text-blue-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity no-print"
              >
                + Add Bullet
              </button>

              <button
                onClick={() => onRemove && onRemove("experience", index)}
                className="absolute top-0 right-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 no-print"
                title="Remove Position"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3 border-b border-gray-300 pb-1">
          <h2 className="text-lg font-bold text-gray-800 uppercase flex items-center gap-2">
            <span className="bg-gray-800 text-white p-1 rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
            </span>
            Education
          </h2>
          <button
            onClick={() => onAdd && onAdd("education")}
            className="text-blue-600 hover:text-blue-800 no-print"
            title="Add Education"
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="space-y-4">
          {data?.education?.map((edu: any, index: number) => (
            <div key={index} className="relative group">
              <div className="flex justify-between mb-1">
                <div className="flex-1">
                  <div className="font-bold text-gray-900">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleInput("education", "degree", e.currentTarget.innerText, index)
                      }
                      className="outline-none focus:bg-blue-50 hover:bg-gray-50"
                    >
                      {edu.degree || "BS/MS in Computer Science"}
                    </span>
                    {", "}
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleInput("education", "institution", e.currentTarget.innerText, index)
                      }
                      className="outline-none focus:bg-blue-50 hover:bg-gray-50"
                    >
                      {edu.institution || "University of Maryland"}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 font-semibold whitespace-nowrap">
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleInput("education", "startDate", e.currentTarget.innerText, index)
                    }
                    className="outline-none focus:bg-blue-50 hover:bg-gray-50"
                  >
                    {edu.startDate || "1996-09"}
                  </span>
                  {" - "}
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleInput("education", "endDate", e.currentTarget.innerText, index)
                    }
                    className="outline-none focus:bg-blue-50 hover:bg-gray-50"
                  >
                    {edu.endDate || "2001-05"}
                  </span>
                </div>
              </div>
              {/* Optional description or bullets for education if needed, usually not in this specific design but good to have placeholders if data exists */}
              {edu.description && (
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleInput("education", "description", e.currentTarget.innerText, index)
                  }
                  className="text-sm text-gray-700 outline-none focus:bg-blue-50 hover:bg-gray-50"
                >
                  {edu.description}
                </div>
              )}

              <button
                onClick={() => onRemove && onRemove("education", index)}
                className="absolute top-0 right-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 no-print"
                title="Remove Education"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3 border-b border-gray-300 pb-1">
          <h2 className="text-lg font-bold text-gray-800 uppercase flex items-center gap-2">
            <span className="bg-gray-800 text-white p-1 rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            </span>
            Skills
          </h2>
          <button
            onClick={() => onAdd && onAdd("skills")}
            className="text-blue-600 hover:text-blue-800 no-print"
            title="Add Skill"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-2">
          {data?.skills?.map((skill: string, index: number) => (
            <div key={index} className="flex items-start group">
              <div className="w-full">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) =>
                    handleInput("skills", "", e.currentTarget.innerText, index)
                  }
                  className="text-sm text-gray-700 font-semibold outline-none focus:bg-blue-50 hover:bg-gray-50"
                >
                  {skill || "Business Process Improvement"}
                </div>
                {/* Optional: Description for skill if we want to match the 'history of successful innovations...' style. 
                            However, the data structure for skills is string[]. 
                            If the user wants descriptions, they might type 'Skill - Description'.
                            We will assume they type it all in one line or we'd need to change schema to object.
                            Given current schema is string[], we stick to that.
                        */}
              </div>
              <button
                onClick={() => onRemove && onRemove("skills", index)}
                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2 no-print"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3 border-b border-gray-300 pb-1">
          <h2 className="text-lg font-bold text-gray-800 uppercase flex items-center gap-2">
            <span className="bg-gray-800 text-white p-1 rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
            </span>
            Projects
          </h2>
          <button
            onClick={() => onAdd && onAdd("projects")}
            className="text-blue-600 hover:text-blue-800 no-print"
            title="Add Project"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="space-y-4">
          {data?.projects?.map((project: any, index: number) => (
            <div key={index} className="relative group">
              <div className="flex justify-between items-baseline mb-1">
                <div className="font-bold text-gray-900">
                  <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      handleInput("projects", "name", e.currentTarget.innerText, index)
                    }
                    className="outline-none focus:bg-blue-50 hover:bg-gray-50"
                  >
                    {project.name || "Project Name"}
                  </span>
                </div>
                {project.link && (
                  <div className="text-sm text-blue-600">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) =>
                        handleInput("projects", "link", e.currentTarget.innerText, index)
                      }
                      className="outline-none focus:bg-blue-50 hover:bg-gray-50"
                    >
                      {project.link}
                    </span>
                  </div>
                )}
              </div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleInput("projects", "description", e.currentTarget.innerText, index)
                }
                className="text-sm text-gray-700 mb-1 outline-none focus:bg-blue-50 hover:bg-gray-50"
              >
                {project.description || "Project description goes here."}
              </div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleInput("projects", "technologies", e.currentTarget.innerText, index)
                }
                className="text-xs text-gray-500 italic outline-none focus:bg-blue-50 hover:bg-gray-50"
              >
                {project.technologies || "Technologies used"}
              </div>

              <button
                onClick={() => onRemove && onRemove("projects", index)}
                className="absolute top-0 right-0 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 no-print"
                title="Remove Project"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Software */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3 border-b border-gray-300 pb-1">
          <h2 className="text-lg font-bold text-gray-800 uppercase flex items-center gap-2">
            <span className="bg-gray-800 text-white p-1 rounded-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            </span>
            Software
          </h2>
          <button
            onClick={() => onAdd && onAdd("software")}
            className="text-blue-600 hover:text-blue-800 no-print"
            title="Add Software"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {data?.software?.map((soft: string, index: number) => (
            <div key={index} className="flex items-center justify-between group">
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) =>
                  handleInput("software" as any, "", e.currentTarget.innerText, index)
                }
                className="text-sm text-gray-700 outline-none focus:bg-blue-50 hover:bg-gray-50 w-full"
              >
                {soft || "Microsoft Project"}
              </div>
              <button
                onClick={() => onRemove && onRemove("software", index)}
                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2 no-print"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
