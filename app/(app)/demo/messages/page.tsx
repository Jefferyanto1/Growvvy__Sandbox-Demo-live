"use client";

import { useState, useEffect, useRef } from "react";

/* ---------------- TEMPLATE TYPE ---------------- */
type Template = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function MessagesPage() {

  /* ---------------- TEMPLATE STATE ---------------- */
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "template-1",
      name: "Intro DM",
      content: "Hey {first_name}, saw your comment on my post — what are you currently working on?",
      createdAt: "",
      updatedAt: "",
    },
    {
      id: "template-2",
      name: "Follow-up 24hr",
      content: "Hey {first_name}, just checking — did you get a chance to see my message?",
      createdAt: "",
      updatedAt: "",
    },
    {
      id: "template-3",
      name: "Soft Pitch",
      content: "Got it — makes sense. What are you currently focused on improving right now?",
      createdAt: "",
      updatedAt: "",
    },
]);


 /* ---------------- NEW TEMPLATE STATE ---------------- */
const [newTemplate, setNewTemplate] = useState({
  name: "",
  content: "",
});

/* ---------------- TEMPLATE EXPANSION STATE ---------------- */
const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(null);

/* TAG: TEMPLATE_EXPANDED_PANEL_REF */
const expandedTemplateRef = useRef<HTMLDivElement | null>(null);

/* TAG: TEMPLATE_EDITING_STATE */
const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

/* TAG: TEMPLATE_LIST_REF */
const templateListRef = useRef<HTMLDivElement | null>(null);

/* ---------------- CREATE TEMPLATE STATE ---------------- */
const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

/* ---------------- EDIT TEMPLATE STATE ---------------- */
const [editTemplate, setEditTemplate] = useState({
  name: "",
  content: "",
});



/* ---------------- CREATE TEMPLATE ---------------- */
function handleCreateTemplate() {
  if (!newTemplate.name.trim()) return;

  const template: Template = {
    id: `template-${Date.now()}`,
    name: newTemplate.name,
    content: newTemplate.content,
    createdAt: "",
    updatedAt: "",
  };

  setTemplates((prev) => [...prev, template]);

  setNewTemplate({
    name: "",
    content: "",
  });
}

/* ---------------- DELETE TEMPLATE ---------------- */
function handleDeleteTemplate(id: string) {
  setTemplates((prev) => prev.filter((t) => t.id !== id));
  
}

/* ---------------- TEMPLATE_OUTSIDE_CLICK_HANDLER ---------------- */
useEffect(() => {

  function handleOutsideClick(event: MouseEvent) {

    if (
      templateListRef.current &&
      !templateListRef.current.contains(event.target as Node)
    ) {
      setExpandedTemplateId(null);
      setEditingTemplateId(null);
    }

  }

  document.addEventListener("click", handleOutsideClick);

  return () => {
    document.removeEventListener("click", handleOutsideClick);
  };

}, []);

/* ---------------- TEMPLATE_AUTO_SCROLL ---------------- */
useEffect(() => {

  if (!expandedTemplateRef.current || !templateListRef.current) return;

  const panel = expandedTemplateRef.current;
  const container = templateListRef.current;

  const panelRect = panel.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  const offset = 12;

  // Only scroll if panel bottom is outside the container
  if (panelRect.bottom > containerRect.bottom) {

    const scrollAmount =
      panelRect.bottom - containerRect.bottom + container.scrollTop + offset;

    container.scrollTo({
      top: scrollAmount,
      behavior: "smooth",
    });

  }

}, [expandedTemplateId]);





return (
    <div className="space-y-6 min-h-full">

      {/* ---------------- MAIN CARD ---------------- */}
      <div className="rounded-md border border-[#E5E7EB] bg-white pt-6 px-6 pb-6 space-y-6 min-h-[calc(100vh-160px)]">

        {/* ---------------- HEADER SECTION ---------------- */}
        <div className="flex items-center justify-between">

          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-[#1A202C]">
              Message Library
            </h2>
            <p className="font-jakarta text-[13px] text-[#596780]">
              Manage and reuse your message templates in one place
            </p>
          </div>

          <button
            className="bg-[#1A73E8] hover:bg-[#1558C0] text-white px-4 py-2 rounded-md text-sm"
          > 
            Open Facebook Messenger
          </button>

        </div>


        {/* ---------------- ACTION ROW ---------------- */}
        <div className="flex items-center justify-between pt-4">

          <button
            onClick={() => setIsCreatingTemplate(true)}
            className="bg-[#1A73E8] hover:bg-[#1558C0] text-white px-4 py-2 rounded-md text-sm"
          >
            + New Template
          </button>

        </div>

        {/* ---------------- CREATE TEMPLATE PANEL ---------------- */}
        {isCreatingTemplate && (

          <div className="rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-4">

            <div className="grid grid-cols-[7fr_3fr] gap-6">

              {/* LEFT SIDE — TEMPLATE EDITOR */}
              <div className="space-y-4">

                {/* TEMPLATE NAME */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-[#1A202C]">
                    Template Name
                  </label>

                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) =>
                      setNewTemplate((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
                  />
                </div>

                {/* MESSAGE */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#1A202C]">
                    Message
                  </label>

                  <textarea
                    rows={6}
                    value={newTemplate.content}
                    onChange={(e) =>
                      setNewTemplate((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
                  />

                  {/* MESSAGE TIP */}
                  <div className="flex items-center gap-2 text-xs text-[#596780]">

                    <div className="flex items-center justify-center w-[16px] h-[16px] rounded-full border border-[#C3D4E9] text-[11px] font-medium">
                      i
                    </div>

                    <span>
                      Press Enter twice to create a new message bubble
                    </span>

                  </div>
                </div>

                {/* VARIABLES */}
                <div className="space-y-2">

                  <p className="text-sm font-medium text-[#1A202C]">
                    Insert Variables
                  </p>

                  <div className="flex gap-2 flex-wrap text-xs">

                    <button
                      onClick={() =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          content: prev.content + " {first_name}",
                        }))
                      }
                      className="px-2 py-1 border border-[#E5E7EB] rounded-md hover:bg-white"
                    >
                      first_name
                    </button>

                    <button
                      onClick={() =>
                        setNewTemplate((prev) => ({
                          ...prev,
                          content: prev.content + " {last_name}",
                        }))
                      }
                      className="px-2 py-1 border border-[#E5E7EB] rounded-md hover:bg-white"
                    >
                      last_name
                    </button>

                  </div>

                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-4 pt-2">

                  <button
                    onClick={() => {
                      setIsCreatingTemplate(false);
                      setNewTemplate({ name: "", content: "" });
                    }}
                    className="text-sm text-[#596780] hover:underline hover:text-[#1A202C]"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => {
                      handleCreateTemplate();
                      setIsCreatingTemplate(false);
                    }}
                    className="h-7 rounded-md bg-[#1A73E8] px-3 text-xs font-medium text-white hover:bg-[#1558C0]"
                  >
                    Save Template
                  </button>

                </div>

              </div>

              {/* PREVIEW PANEL */}
              <div className="space-y-3">
                
                {/* PREVIEW_LABEL */}
                <p className="text-xs text-[#596780]">
                  Preview
                </p>
                
                {/* PREVIEW_CONTAINER */}
                <div className="rounded-md border border-[#E5E7EB] bg-white p-3 max-h-[360px] overflow-y-auto space-y-2">

                  {(newTemplate.content || "")
                    .replace("{first_name}", "Arjun")
                    .replace("{last_name}", "Kumar")
                    .split(/\n{2,}/)
                    .map((msg, index) => (
                      <div
                        key={index}
                        className="max-w-[280px] bg-[#E4E6EB] rounded-tr-2xl rounded-br-2xl rounded-tl-xl rounded-bl-sm px-3 py-2 text-sm text-[#050505] break-words"
                      >
                        {msg.trim()}
                      </div>
                  ))}

                </div>

              </div>

            </div>

          </div>

        )}


        {/* ---------------- TEMPLATES SECTION ---------------- */}
        <div className="space-y-2 pt-4">

          <h3 className="text-sm font-semibold text-[#1A202C]">
            Templates
          </h3>
          <p className="mt-1 font-jakarta text-[13px] text-[#596780]">
            View, edit, and manage your saved templates
          </p>

          {/* ---------------- TEMPLATE LIST ---------------- */}
          {/* TAG: TEMPLATE_LIST_CONTAINER */}
          <div
            ref={templateListRef}
            className={`space-y-2 pt-2 pb-8 ${
              editingTemplateId ? "" : "max-h-[320px] overflow-y-auto"
            }`}
          >

            {templates.length === 0 ? (
              <div className="text-sm text-[#596780]">
                No templates created yet.
              </div>
            ) : (
              templates.map((template) => {

                const isExpanded = expandedTemplateId === template.id;

                return (
                  <div key={template.id}>

                    {/* TAG: TEMPLATE_ROW */}
                    <div
                      onClick={() => {
                      if (isExpanded) {
                        setExpandedTemplateId(null);
                        setEditingTemplateId(null);
                      } else {
                        setExpandedTemplateId(template.id);
                        setEditingTemplateId(null);
                      }

                    }}
                    
                      className="flex items-center justify-between rounded-md border border-[#F3F5F7] px-4 py-3 hover:bg-[#F9FAFB] cursor-pointer"
                    >

                      {/* TAG: TEMPLATE_NAME */}
                      <span className="text-sm text-[#1A202C]">
                        {template.name}
                      </span>

                      {/* TAG: TEMPLATE_ACTIONS */}
                      <div
                        className="flex items-center gap-4"
                        onClick={(e) => e.stopPropagation()}
                      >

                        {/* TAG: TEMPLATE_EDIT_BUTTON */}
                        <button
                          onClick={() => {
                            setExpandedTemplateId(template.id);
                            setEditingTemplateId(template.id);

                            setEditTemplate({
                            name: template.name,
                            content: template.content,
                          });
                          }}
                          className="text-sm text-[#1A73E8] hover:underline"
                        >
                          Edit
                        </button>

                        {/* TAG: TEMPLATE_DELETE_BUTTON */}
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Delete
                        </button>

                      </div>

                    </div>


                    {/* TAG: TEMPLATE_EXPANDED_PANEL */}
                    {isExpanded && (

                      <div
                        ref={expandedTemplateRef}
                        onClick={(e) => e.stopPropagation()}
                        className="ml-4 mr-4 mb-2 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-3"
                      >

                        {/* READ MODE */}
                        {editingTemplateId !== template.id && (
                          <div className="text-sm text-[#1A202C] whitespace-pre-line">
                            {template.content}
                          </div>
                        )}


                        {/* EDIT MODE */}
                        {editingTemplateId === template.id && (

                          <div className="space-y-4">

                            {/* TAG: EDIT_TEMPLATE_GRID */}
                            <div className="grid grid-cols-[7fr_3fr] gap-6">

                              {/* ---------------- LEFT SIDE — EDITOR ---------------- */}
                              {/* TAG: EDIT_TEMPLATE_EDITOR */}
                              <div className="space-y-4">

                                {/* TAG: EDIT_TEMPLATE_HEADER */}
                                <p className="text-sm font-medium text-[#1A202C]">
                                  Editing Template: {template.name}
                                </p>

                                {/* TAG: EDIT_TEMPLATE_NAME */}
                                <input
                                  type="text"
                                  value={editTemplate.name}
                                  onChange={(e) =>
                                    setEditTemplate((prev) => ({
                                      ...prev,
                                      name: e.target.value,
                                    }))
                                  }
                                  className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
                                />

                                {/* TAG: EDIT_TEMPLATE_MESSAGE */}
                                <div>

                                  <textarea
                                    rows={6}
                                    value={editTemplate.content}
                                    onChange={(e) =>
                                      setEditTemplate((prev) => ({
                                        ...prev,
                                        content: e.target.value,
                                      }))
                                    }
                                    className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
                                  />

                                {/* TAG: EDIT_TEMPLATE_MESSAGE_TIP */}
                                <div className="flex items-center gap-2 text-xs text-[#596780] mt-2">

                                  <div className="flex items-center justify-center w-[16px] h-[16px] rounded-full border border-[#C3D4E9] text-[11px] font-medium">
                                    i
                                  </div>

                                  <span>
                                    Press Enter twice to create a new message bubble
                                  </span>

                                </div>

                              </div>

                                {/* TAG: EDIT_TEMPLATE_VARIABLES */}
                                <div className="space-y-2">

                                  <p className="text-sm font-medium text-[#1A202C]">
                                    Insert Variables
                                  </p>

                                  <div className="flex gap-2 flex-wrap text-xs">

                                    {/* VARIABLE: FIRST NAME */}
                                    <button
                                      onClick={() =>
                                        setEditTemplate((prev) => ({
                                          ...prev,
                                          content: prev.content + " {first_name}",
                                        }))
                                      }
                                      className="px-2 py-1 border border-[#E5E7EB] rounded-md hover:bg-white"
                                    >
                                      first_name
                                    </button>

                                    {/* VARIABLE: LAST NAME */}
                                    <button
                                      onClick={() =>
                                        setEditTemplate((prev) => ({
                                          ...prev,
                                          content: prev.content + " {last_name}",
                                        }))
                                      }
                                      className="px-2 py-1 border border-[#E5E7EB] rounded-md hover:bg-white"
                                    >
                                      last_name
                                    </button>

                                  </div>

                                </div>

                                {/* TAG: EDIT_TEMPLATE_ACTIONS */}
                                <div className="flex items-center gap-4">

                                  <button
                                    onClick={() => {
                                      setEditingTemplateId(null);
                                      setExpandedTemplateId(null);
                                    }}
                                    className="text-sm text-[#596780] hover:underline hover:text-[#1A202C]"
                                  >
                                    Cancel
                                  </button>

                                  <button
                                    onClick={() => {

                                      setTemplates((prev) =>
                                        prev.map((t) =>
                                          t.id === template.id
                                            ? {
                                                ...t,
                                                name: editTemplate.name,
                                                content: editTemplate.content,
                                              }
                                            : t
                                        )
                                      );

                                      setEditingTemplateId(null);
                                      setExpandedTemplateId(null);

                                    }}
                                    className="h-7 rounded-md bg-[#1A73E8] px-3 text-xs font-medium text-white hover:bg-[#1558C0]"
                                  >
                                    Update Template
                                  </button>

                                </div>

                              </div>


                              {/* ---------------- RIGHT SIDE — PREVIEW ---------------- */}
                              {/* TAG: EDIT_TEMPLATE_PREVIEW */}
                              <div className="space-y-2">

                                {/* TAG: EDIT_TEMPLATE_PREVIEW_LABEL */}
                                <div className="h-[28px] flex items-end text-xs text-[#596780]">
                                  Preview
                                </div>

                                {/* TAG: EDIT_TEMPLATE_PREVIEW_CONTAINER */}
                                <div className="rounded-md border border-[#E5E7EB] bg-white p-3 max-h-[240px] overflow-y-auto space-y-2">

                                  {(editTemplate.content || "")
                                    .replace("{first_name}", "Arjun")
                                    .replace("{last_name}", "Kumar")
                                    .split(/\n{2,}/)
                                    .map((msg, index) => (
                                      <div
                                        key={index}
                                        className="max-w-[280px] bg-[#E4E6EB] rounded-tr-2xl rounded-br-2xl rounded-tl-xl rounded-bl-sm px-3 py-2 text-sm text-[#050505] break-words"
                                      >
                                        {msg.trim()}
                                      </div>
                                  ))}

                                </div>

                              </div>

                            </div>

                          </div>
                        )}

                      </div>

                    )}

                  </div>
                );

              })
            )}
     </div>

      </div>

    </div>

  </div>

);
}