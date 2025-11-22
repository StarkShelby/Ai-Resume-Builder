import React from "react";
import { TemplateProps } from "../../app/create/types";
import { ResumeData } from "../../app/create/types";

export default function TemplateB({
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
    onUpdate && onUpdate(section, field, value, index);
  };

  // -----------------------------
  // FIXED BULLET HELPERS
  // -----------------------------

  const addBulletPoint = (expIndex: number) => {
    const bullets = Array.isArray(data?.experience?.[expIndex]?.bullets)
      ? [...(data?.experience?.[expIndex]?.bullets ?? [])]
      : [];

    bullets.push(""); // add empty bullet row

    onUpdate && onUpdate("experience", "bullets", bullets as any, expIndex);
  };

  const updateBulletPoint = (
    expIndex: number,
    bulletIndex: number,
    text: string
  ) => {
    const bullets = Array.isArray(data?.experience?.[expIndex]?.bullets)
      ? [...(data?.experience?.[expIndex]?.bullets ?? [])]
      : [];

    bullets[bulletIndex] = text; // update specific bullet

    onUpdate && onUpdate("experience", "bullets", bullets as any, expIndex);
  };

  const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
    const bullets = Array.isArray(data?.experience?.[expIndex]?.bullets)
      ? [...(data?.experience?.[expIndex]?.bullets ?? [])]
      : [];

    bullets.splice(bulletIndex, 1);

    onUpdate && onUpdate("experience", "bullets", bullets as any, expIndex);
  };

  // -----------------------------
  // PREVIEW
  // -----------------------------

  if (previewMode) {
    return (
      <div className="border-2 border-blue-400 rounded-lg p-4 bg-blue-50 max-w-sm mx-auto shadow">
        <h3 className="text-lg font-bold text-blue-900 mb-2">
          Modern Colorful
        </h3>
        <div className="text-blue-400 text-sm">
          Vibrant and modern design, stand out with color.
        </div>
      </div>
    );
  }

  // -----------------------------
  // MAIN TEMPLATE
  // -----------------------------

  return (
    <div className="p-8 bg-white shadow-lg w-[210mm] min-h-[297mm]" id="resume-content">
      {/* NAME */}
      <div
        contentEditable
        suppressContentEditableWarning
        className="text-3xl font-bold text-blue-800 mb-2"
        onBlur={(e) =>
          handleInput("personalInfo", "fullName", e.currentTarget.innerText)
        }
      >
        {data?.personalInfo?.fullName || "Your Name"}
      </div>

      {/* EMAIL */}
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) =>
          handleInput("personalInfo", "email", e.currentTarget.innerText)
        }
        className="text-md text-blue-600"
      >
        {data?.personalInfo?.email || "your.email@example.com"}
      </div>

      {/* PHONE */}
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) =>
          handleInput("personalInfo", "phone", e.currentTarget.innerText)
        }
        className="text-md text-blue-600"
      >
        {data?.personalInfo?.phone || "123-456-7890"}
      </div>

      <hr className="my-4 border-blue-200" />

      {/* SUMMARY */}
      <h2 className="text-xl font-semibold text-blue-900 mb-2">
        Professional Summary
      </h2>
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => handleInput("summary", "", e.currentTarget.innerText)}
      >
        {data?.summary || "Your professional summary here."}
      </div>

      {/* EXPERIENCE HEADER */}
      <div className="flex justify-between items-center mt-4 mb-2">
        <h2 className="text-xl font-semibold text-blue-900">Work Experience</h2>
        <button
          onClick={() => onAdd && onAdd("experience")}
          className="bg-blue-500 text-white px-2 py-1 rounded no-print"
        >
          +
        </button>
      </div>

      {/* EXPERIENCE LIST */}
      {data?.experience?.map((exp: any, index: number) => (
        <div key={index} className="mb-4 relative">
          {/* POSITION */}
          <div
            contentEditable
            suppressContentEditableWarning
            className="font-bold text-blue-700"
            onBlur={(e) =>
              handleInput(
                "experience",
                "position",
                e.currentTarget.innerText,
                index
              )
            }
          >
            {exp.position || "Position"}
          </div>

          {/* COMPANY */}
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
          >
            {exp.company || "Company Name"}
          </div>

          {/* BULLETS */}
          <ul className="list-disc list-inside">
            {Array.isArray(exp.bullets) &&
              exp.bullets.map((bullet: string, bIndex: number) => (
                <li key={bIndex} className="text-sm flex gap-2">
                  <span>•</span>
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateBulletPoint(
                        index,
                        bIndex,
                        e.currentTarget.innerText
                      )
                    }
                    className="flex-1"
                  >
                    {bullet || "Bullet point"}
                  </div>

                  {/* Remove bullet */}
                  <button
                    onClick={() => removeBulletPoint(index, bIndex)}
                    className="text-red-500 text-xs ml-2 no-print"
                  >
                    Remove
                  </button>
                </li>
              ))}
          </ul>

          {/* ADD BULLET BUTTON */}
          <button
            onClick={() => addBulletPoint(index)}
            className="text-sm text-blue-500 no-print"
          >
            + Add Bullet
          </button>

          {/* REMOVE EXPERIENCE */}
          <button
            onClick={() => onRemove && onRemove("experience", index)}
            className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded no-print"
          >
            -
          </button>
        </div>
      ))}

      {/* PROJECTS SECTION */}
      <div className="flex justify-between items-center mt-4 mb-2">
        <h2 className="text-xl font-semibold text-blue-900">Projects</h2>
        <button
          onClick={() => onAdd && onAdd("projects")}
          className="bg-blue-500 text-white px-2 py-1 rounded no-print"
        >
          +
        </button>
      </div>

      {data?.projects?.map((proj: any, index: number) => (
        <div key={index} className="mb-4 relative">
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              handleInput(
                "projects",
                "name",
                e.currentTarget.innerText,
                index
              )
            }
            className="font-bold text-blue-700"
          >
            {proj.name || "Project Name"}
          </div>

          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              handleInput(
                "projects",
                "description",
                e.currentTarget.innerText,
                index
              )
            }
            className="text-sm text-gray-700"
          >
            {proj.description || "Project Description"}
          </div>

          {proj.link && (
            <div
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) =>
                handleInput(
                  "projects",
                  "link",
                  e.currentTarget.innerText,
                  index
                )
              }
              className="text-xs text-blue-500 underline"
            >
              {proj.link}
            </div>
          )}

          <button
            onClick={() => onRemove && onRemove("projects", index)}
            className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded no-print"
          >
            -
          </button>
        </div>
      ))}

      {/* EDUCATION SECTION */}
      <div className="flex justify-between items-center mt-4 mb-2">
        <h2 className="text-xl font-semibold text-blue-900">Education</h2>
        <button
          onClick={() => onAdd && onAdd("education")}
          className="bg-blue-500 text-white px-2 py-1 rounded no-print"
        >
          +
        </button>
      </div>

      {data?.education?.map((edu: any, index: number) => (
        <div key={index} className="mb-4 relative">
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              handleInput(
                "education",
                "degree",
                e.currentTarget.innerText,
                index
              )
            }
            className="font-bold text-blue-700"
          >
            {edu.degree || "Degree"}
          </div>

          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) =>
              handleInput(
                "education",
                "institution",
                e.currentTarget.innerText,
                index
              )
            }
          >
            {edu.institution || "Institution Name"}
          </div>

          <button
            onClick={() => onRemove && onRemove("education", index)}
            className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded no-print"
          >
            -
          </button>
        </div>
      ))}
    </div>
  );
}
