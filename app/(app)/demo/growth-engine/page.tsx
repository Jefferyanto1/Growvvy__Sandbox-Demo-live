"use client";

import { useState, useRef, useEffect } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GrowthEnginePage() {


/* ---------------- CREATE AUTOMATION STATE ---------------- */
const [isCreateOpen, setIsCreateOpen] = useState(false);

/* ---------------- AUTOMATION SELECT STATE ---------------- */
const [isAutomationListOpen, setIsAutomationListOpen] = useState(false);

/* ---------- START_FROM_SCRATCH_RULE_BUILDER_STATE ---------- */
const [isScratchBuilderOpen, setIsScratchBuilderOpen] = useState(false);

/* ---------- RULE_NAME_STATE ---------- */
const [ruleName, setRuleName] = useState("");

/* ---------- AUTOMATION_ACTIVITY_STATE ---------- */
const [automations, setAutomations] = useState<any[]>([])
const [selectedAutomationId, setSelectedAutomationId] = useState<string | null>(null)
const [automationTab, setAutomationTab] = useState<"active" | "paused">("active")
const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

/* ---------- TRIGGER_STATE ---------- */
const [triggerType, setTriggerType] = useState("");

/* ---------- SCOPE_STATE ---------- */
const [scopeType, setScopeType] = useState("");

/* ---------- SPECIFIC_POST_URL_STATE ---------- */
const [postUrl, setPostUrl] = useState("");

/* ---------- SPECIFIC_LIVE_URL_STATE ---------- */
const [liveUrl, setLiveUrl] = useState("");

/* ---------- SELECTED_GROUP_STATE ---------- */
const [selectedGroupId, setSelectedGroupId] = useState("")

/* ---------- SELECTED_LEAD_LIST_STATE ---------- */
const [selectedLeadListId, setSelectedLeadListId] = useState("")

/* ---------- STEPS_STATE ---------- */
const [steps, setSteps] = useState([
  {
    id: Date.now(),
    type: "",
    waitMinutes: "",
    waitHours: "",
    templateId: ""
  }
  
])

/* ---------- TEMPLATE_DROPDOWN_STATE ---------- */
const [openTemplateDropdownId, setOpenTemplateDropdownId] = useState<number | null>(null)

/* ---------- TEMPLATES_STATE ---------- */
const [templates, setTemplates] = useState([
  { id: "template-1", name: "Intro DM" },
  { id: "template-2", name: "Follow-up 24hr" },
  { id: "template-3", name: "Follow-up 48hr" },
  { id: "template-4", name: "Soft Pitch" },
  { id: "template-5", name: "Hard Pitch" },
  { id: "template-6", name: "Re-engagement" },
  { id: "template-7", name: "Closing Message" },
  { id: "template-8", name: "Reminder Message" }
])

/* ---------- USER_GROUPS_STATE ---------- */
const [userGroups, setUserGroups] = useState([
  { id: "group-1", name: "Growvvy Community" },
  { id: "group-2", name: "Fitness Mastery Group" },
  { id: "group-3", name: "Startup Founders Hub" },
  { id: "group-4", name: "Marketing Secrets Lab" },
  { id: "group-5", name: "AI Builders Circle" },
  { id: "group-6", name: "Freelancers Network" },
  { id: "group-7", name: "Ecom Growth Hacks" },
  { id: "group-8", name: "Content Creators Club" }
])

/* ---------- USER_LEAD_LISTS_STATE ---------- */
const [leadLists, setLeadLists] = useState([
  { id: "list-1", name: "Hot Leads" },
  { id: "list-2", name: "Interested" },
  { id: "list-3", name: "Buyers" }
])

/* ---------- ADD_STEP_STATE ---------- */
const [isAddStepOpen, setIsAddStepOpen] = useState(false)


/* ---------- SCRATCH_MODE_STATE ---------- */
const [builderMode, setBuilderMode] = useState<"scratch" | null>(null)

/* ---------- PRESET_SELECTION_STATE ---------- */
const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

/* ---------- PRESET_LABEL_MAP ---------- */
const PRESET_LABELS: Record<string, string> = {
  comment_dm_followup: "Comment → DM → Follow-up",
  friend_request_nurture_offer: "Friend Request → Nurture → Offer",
  reengagement_followup: "Re-engagement → Follow-up",
  new_friend_welcome_followup: "New Friend → Welcome DM → Follow-up",
  group_join_welcome_followup: "Group Join → Welcome DM → Follow-up",
};

/* ---------- TRIGGER_DROPDOWN_STATE ---------- */
const [isTriggerDropdownOpen, setIsTriggerDropdownOpen] = useState(false)

/* ---------- SCOPE_DROPDOWN_STATE ---------- */
const [isScopeDropdownOpen, setIsScopeDropdownOpen] = useState(false)

/* ---------- TOAST_STATE ---------- */
const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null)

/* ---------- GROUP_DROPDOWN_STATE ---------- */
const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false)

/* ---------- STEPS_DROPDOWN_OPEN_STATE ---------- */
const [openStepDropdownId, setOpenStepDropdownId] = useState<number | null>(null);



/* ---------- SELECT AUTOMATION DROPDOWN REF ---------- */
const selectAutomationRef = useRef<HTMLDivElement | null>(null);

/* ---------- TRIGGER_DROPDOWN_REF ---------- */
const triggerDropdownRef = useRef<HTMLDivElement | null>(null)

/* ---------- SCOPE_DROPDOWN_REF ---------- */
const scopeDropdownRef = useRef<HTMLDivElement | null>(null)

/* ---------- GROUP_DROPDOWN_REF ---------- */
const groupDropdownRef = useRef<HTMLDivElement | null>(null)

/* ---------- STEP_DROPDOWN_REF ---------- */
const stepDropdownRef = useRef<HTMLDivElement | null>(null)

/* ---------- AUTOMATION_ACTIVITY_REF ---------- */
const automationActivityRef = useRef<HTMLDivElement | null>(null)

/* ---------- FILTERED_TRIGGERS ---------- */
const getFilteredTriggers = () => {

  if (selectedPreset === "comment_dm_followup") {
    return ["Comment on Post", "Comment on Live"];
  }

  if (selectedPreset === "new_friend_welcome_followup") {
    return ["Friend Request Accepted"];
  }

  if (selectedPreset === "group_join_welcome_followup") {
    return ["Group Join"];
  }

  return [
    "Comment on Post",
    "Comment on Live",
    "Group Join",
    "Friend Request Accepted",
    "New DM Received",
    "Lead Added",
    "Lead Stage Changed",
    "No Reply X Hours",
    "No Reply X Days"
  ];
};

/* ---------- FILTERED_SCOPES ---------- */
const getFilteredScopes = (trigger: string) => {

  /* COMMENT ON POST */
   if (trigger === "Comment on Post") {
    return [
      "All Profile Posts",
      "All Group Posts",
      "Specific Post"
    ];
  }

  /* COMMENT ON LIVE */
  if (trigger === "Comment on Live") {
    return [
      "All Lives (applies to future lives)",
      "Specific Live"
    ];
  }

  /* GROUP JOIN */
  if (trigger === "Group Join") {
    return [
      "All Groups (You Own or Manage)",
      "Specific Group"
    ];
  }

  /* DEFAULT */
  return [
    "All Posts",
    "Specific Post",
    "Campaign",
    "Specific Lead List"
  ];
};

/* ---------- START_FROM_SCRATCH_ROW_REF ---------- */
const startFromScratchRowRef = useRef<HTMLDivElement | null>(null)




/* ---------------- EFFECT: OUTSIDE CLICK ---------------- */

/* ---------- HANDLE_PRESET_SELECT ---------- */
const handlePresetSelect = (preset: string) => {

  setSelectedPreset(preset)
  setBuilderMode(null)

  setRuleName(
  preset === "comment_dm_followup"
    ? "Comment → DM → Follow-up"
    : preset === "friend_request_nurture_offer"
    ? "Friend Request → Nurture → Offer"
    : preset === "reengagement_followup"
    ? "Re-engagement → Follow-up"
    : preset === "new_friend_welcome_followup"
    ? "New Friend → Welcome DM → Follow-up"
    : preset === "group_join_welcome_followup"
    ? "Group Join → Welcome DM → Follow-up"
    : ""
)

  // CLOSE DROPDOWN
  setIsAutomationListOpen(false)

  // OPEN BUILDER
  setIsScratchBuilderOpen(true)

  // COMMENT → DM → FOLLOW-UP
  if (preset === "comment_dm_followup") {

    setTriggerType("Comment on Post")
    const scopes = getFilteredScopes("Comment on Post")
    setScopeType(scopes[0] || "")

    setSteps([
      { id: 1, type: "Send DM", waitMinutes: "", waitHours: "", templateId: "" },
      { id: 2, type: "Wait", waitMinutes: "", waitHours: "", templateId: "" },
      { id: 3, type: "Send DM", waitMinutes: "", waitHours: "", templateId: "" }
    ])

  }

  // NEW FRIEND → WELCOME DM → FOLLOW-UP
  if (preset === "new_friend_welcome_followup") {

    setTriggerType("Friend Request Accepted")

    // 🚫 NO SCOPE → CLEAR IT
    setScopeType("")

    setSteps([
      { id: 1, type: "Send DM", waitMinutes: "", waitHours: "", templateId: "" },
      { id: 2, type: "Wait", waitMinutes: "", waitHours: "", templateId: "" },
      { id: 3, type: "Send DM", waitMinutes: "", waitHours: "", templateId: "" }
    ])

  }

  // GROUP JOIN → WELCOME DM → FOLLOW-UP
  if (preset === "group_join_welcome_followup") {

    setTriggerType("Group Join")

    const scopes = ["All Groups (You Own or Manage)", "Specific Group"]
    setScopeType(scopes[0])

    setSteps([
      { id: 1, type: "Send DM", waitMinutes: "", waitHours: "", templateId: "" },
      { id: 2, type: "Wait", waitMinutes: "", waitHours: "", templateId: "" },
      { id: 3, type: "Send DM", waitMinutes: "", waitHours: "", templateId: "" }
    ])

  }

}

/* ---------- DELETE_AUTOMATION_FUNCTION ---------- */
const handleDeleteAutomation = (id: string) => {
  setAutomations(prev => prev.filter(a => a.id !== id))
}

/* ---------- VALIDATION_FUNCTION ---------- */
const validateSteps = () => {

  for (let step of steps) {

    // MUST HAVE RULE NAME
    if (!ruleName.trim()) {
      setToast({ message: "Please enter a rule name", type: "error" })
      return false
    }

    // MUST HAVE TRIGGER
    if (!triggerType) {
      setToast({ message: "Please select a trigger", type: "error" })
      return false
    }

    // MUST HAVE SCOPE (except new friend preset)
    if (selectedPreset !== "new_friend_welcome_followup" && !scopeType) {
      setToast({ message: "Please select a scope", type: "error" })
      return false
    }

    // SPECIFIC POST → MUST HAVE URL
    if (scopeType === "Specific Post" && !postUrl.trim()) {
      setToast({ message: "Please enter Post URL", type: "error" })
      return false
    }

    // SPECIFIC LIVE → MUST HAVE URL
    if (scopeType === "Specific Live" && !liveUrl.trim()) {
      setToast({ message: "Please enter Live URL", type: "error" })
      return false
    }

    // SPECIFIC GROUP → MUST SELECT GROUP
    if (scopeType === "Specific Group" && !selectedGroupId) {
      setToast({ message: "Please select a group", type: "error" })
      return false
    }

    // SPECIFIC LEAD LIST → MUST SELECT LIST
    if (scopeType === "Specific Lead List" && !selectedLeadListId) {
      setToast({ message: "Please select a lead list", type: "error" })
      return false
    }

    // MUST HAVE AT LEAST ONE STEP
    if (!steps.length || !steps[0].type) {
      setToast({ message: "Please add at least one step", type: "error" })
      return false
    }

    // SEND DM → MUST HAVE TEMPLATE
    if (step.type === "Send DM" && !step.templateId) {
      setToast({ message: "Please select a template for all Send DM steps", type: "error" })
      return false
    }

    // WAIT → MUST HAVE TIME
    if (step.type === "Wait") {

      const mins = Number(step.waitMinutes || 0)
      const hrs = Number(step.waitHours || 0)

      if (mins === 0 && hrs === 0) {
        setToast({ message: "Wait step must have minutes or hours", type: "error" })
        return false
      }

    }

  }

  return true
}


/* ---------- EFFECT_SELECT_AUTOMATION_OUTSIDE_CLICK (DROPDOWN CLOSE) ---------- */
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {

    if (
      selectAutomationRef.current &&
      !selectAutomationRef.current.contains(event.target as Node) &&
      startFromScratchRowRef.current &&
      !startFromScratchRowRef.current.contains(event.target as Node)
    ) {
      setIsAutomationListOpen(false);
    }

  };

  if (isAutomationListOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };

}, [isAutomationListOpen])


/* ---------- EFFECT: CLOSE TRIGGER DROPDOWN ON OUTSIDE CLICK ---------- */
useEffect(() => {
  function handleOutsideClick(event: MouseEvent) {

    if (
      triggerDropdownRef.current &&
      !triggerDropdownRef.current.contains(event.target as Node)
    ) {
      setIsTriggerDropdownOpen(false)
    }

  }

  if (isTriggerDropdownOpen) {
    document.addEventListener("mousedown", handleOutsideClick)
  }

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick)
  }

}, [isTriggerDropdownOpen])


/* ---------- EFFECT: CLOSE SCOPE DROPDOWN ON OUTSIDE CLICK ---------- */
useEffect(() => {

  function handleOutsideClick(event: MouseEvent) {

    const target = event.target as Node

    // CLOSE SCOPE DROPDOWN
    if (
      scopeDropdownRef.current &&
      !scopeDropdownRef.current.contains(target)
    ) {
      setIsScopeDropdownOpen(false)
    }

    // CLOSE GROUP DROPDOWN
    if (
      groupDropdownRef.current &&
      !groupDropdownRef.current.contains(target)
    ) {
      setIsGroupDropdownOpen(false)
    }

  }

  if (isScopeDropdownOpen || isGroupDropdownOpen) {
    document.addEventListener("mousedown", handleOutsideClick)
  }

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick)
  }

}, [isScopeDropdownOpen, isGroupDropdownOpen])


/* ---------- EFFECT: AUTO HIDE TOAST ---------- */
useEffect(() => {
  if (toast) {
    const timer = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(timer)
  }
}, [toast])


/* ---------- EFFECT: CLOSE STEP DROPDOWN ON OUTSIDE CLICK ---------- */
useEffect(() => {

  function handleOutsideClick(event: MouseEvent) {

    const target = event.target as HTMLElement

    if (
      !target.closest("[data-step-dropdown]") &&
      !target.closest("[data-template-dropdown]")
    ) {
      setOpenStepDropdownId(null)
      setOpenTemplateDropdownId(null)
    }

  }

  if (openStepDropdownId !== null || openTemplateDropdownId !== null) {
    document.addEventListener("click", handleOutsideClick)
  }

  return () => {
    document.removeEventListener("click", handleOutsideClick)
  }

}, [openStepDropdownId, openTemplateDropdownId])


/* ---------- EFFECT: CLOSE AUTOMATION EXPAND ON OUTSIDE CLICK ---------- */
useEffect(() => {

  function handleOutsideClick(event: MouseEvent) {

    const target = event.target as HTMLElement

    if (
      !target.closest("[data-automation-row]") &&
      !target.closest("[data-automation-expand]") &&
      !target.closest("[data-automation-container]") &&
      !target.closest("[data-automation-tabs]")
    ) {
      setSelectedAutomationId(null)
    }

  }

  if (selectedAutomationId !== null) {
    document.addEventListener("mousedown", handleOutsideClick)
  }

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick)
  }

}, [selectedAutomationId])






  return (
    <div className="space-y-6">

      {/* CREATE_AUTOMATION_CARD */}
      <Card>
        <CardContent className="pt-6 space-y-6">

          {/* HEADER_SECTION */}
          <div className="flex items-center justify-between">
           <div className="flex flex-col">
              <h2 className="text-sm font-semibold text-[#1A202C]">
                Growth Engine
              </h2>
              <p className="mt-1 font-jakarta text-[13px] text-[#596780]">
                Create and manage automations for your workflows
              </p>
            </div>
          </div>


            {/* ---------------- CREATE_AUTOMATION_ROW ---------------- */}
            <div className="pt-4 space-y-4">

              {/* BUTTON: CREATE_AUTOMATION */}
              <button
                onClick={() => setIsCreateOpen((prev) => !prev)}
                className="bg-[#1A73E8] hover:bg-[#1A73E8]/95 text-white px-4 py-2 rounded-md text-sm"
              >
                Create Automation
              </button>

              {/* CREATE_AUTOMATION_OPTIONS */}
              {isCreateOpen && (

                <div className="space-y-4">

                 {/* SELECT_AUTOMATION_TRIGGER */}
                  <div
                    ref={selectAutomationRef}
                    className="rounded-md border border-[#E5E7EB] overflow-hidden"
                  >

                    <div className="flex items-center justify-between px-4 py-3 bg-white">
                      <button
                        type="button"
                        onClick={() => {

                          /* TOGGLE_AUTOMATION_LIST */
                          setIsAutomationListOpen(prev => !prev)

                          /* CLOSE_START_FROM_SCRATCH_BUILDER */
                          setIsScratchBuilderOpen(false)

                        }}
                        className="w-full text-left focus:outline-none"
                      >
                        <p className="text-sm font-medium text-[#1A202C]">
                          {selectedPreset ? PRESET_LABELS[selectedPreset] : "Select Automation"}
                        </p>
                      </button>
                    </div>


                    {/* AUTOMATION_LIST */}
                    {isAutomationListOpen && (
                      <div className="bg-[#F9FAFB]">

                        {/* COMMENT_DM_FOLLOWUP */}
                        <button
                          onClick={() => handlePresetSelect("comment_dm_followup")}
                          className="w-full text-left px-4 py-3 hover:bg-[#E8F0FE]"
                        >
                          <p className="text-sm font-medium text-[#1A202C]">
                            Comment → DM → Follow-up
                          </p>
                          <p className="mt-1 text-xs text-[#596780]">
                            Auto DM users who comment and follow up if no reply
                          </p>
                        </button>

                        {/* NEW_FRIEND_WELCOME_FOLLOWUP */}
                        <button
                          onClick={() => handlePresetSelect("new_friend_welcome_followup")}
                          className="w-full text-left px-4 py-3 hover:bg-[#E8F0FE]"
                        >
                          <p className="text-sm font-medium text-[#1A202C]">
                            New Friend → Welcome DM → Follow-up
                          </p>
                          <p className="mt-1 text-xs text-[#596780]">
                            Send welcome message when a new friend is accepted and follow up
                          </p>
                        </button>

                        {/* GROUP_JOIN_WELCOME_FOLLOWUP */}
                        <button
                          onClick={() => handlePresetSelect("group_join_welcome_followup")}
                          className="w-full text-left px-4 py-3 hover:bg-[#E8F0FE]"
                        >
                          <p className="text-sm font-medium text-[#1A202C]">
                            Group Join → Welcome DM → Follow-up
                          </p>
                          <p className="mt-1 text-xs text-[#596780]">
                            Automatically reply to new messages and follow up
                          </p>
                        </button>
                      </div>
                    )}

                  </div>

                  {/* START_FROM_SCRATCH_ROW */}
                  <div ref={startFromScratchRowRef} className="flex items-center justify-between pt-4">

                    {/* LEFT_SIDE_ACTIONS */}
                    <div className="flex items-center gap-2">

                      {/* START_FROM_SCRATCH_BUTTON */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPreset(null)
                          setBuilderMode("scratch")
                          setIsAutomationListOpen(false)
                          setIsScratchBuilderOpen(true)

                          // RESET BUILDER STATE
                          setRuleName("")
                          setTriggerType("")
                          setScopeType("")
                          setPostUrl("")
                          setLiveUrl("")
                          setSelectedGroupId("")
                          setSteps([
                            {
                              id: Date.now(),
                              type: "",
                              waitMinutes: "",
                              waitHours: "",
                              templateId: ""
                            }
                          ])

                        }}
                        className={`px-3 py-1 rounded-md border text-sm transition-colors
                          ${
                            builderMode === "scratch"
                              ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                              : "border-[#E5E7EB] text-[#596780] hover:bg-[#E8F0FE] hover:border-[#1A73E8] hover:text-[#1A73E8]"
                          }
                        `}
                      >
                        Start From Scratch
                      </button>

                    </div>

                    {/* RESET_BUILDER */}
                    <button
                      type="button"
                      onClick={() => {

                      // RESET BUILDER
                      setRuleName("")
                      setTriggerType("")
                      setScopeType("")
                      setPostUrl("")
                      setLiveUrl("")
                      setSelectedGroupId("")
                      setSteps([
                        { id: Date.now(), type: "", waitMinutes: "", waitHours: "", templateId: "" }
                      ])

                      // RESET PRESET SELECTION
                      setSelectedPreset(null)

                      // OPTIONAL: RESET MODE
                      setBuilderMode(null)

                    }}
                      className="text-xs font-medium text-[#1A73E8] hover:underline"
                    >
                      Reset
                    </button>

                  </div>

                  {/* SCRATCH_RULE_BUILDER */}
                  {isScratchBuilderOpen && (

                    <div className="rounded-md border border-[#E5E7EB] p-4 space-y-4 overflow-visible">

                      {/* RULE_NAME_INPUT_BLOCK */}
                      <div className="space-y-1">

                        {/* RULE_NAME_LABEL */}
                        <label className="text-xs text-[#596780]">
                          Rule Name
                        </label>

                        {/* RULE_NAME_INPUT */}
                        <input
                          value={ruleName}
                          onChange={(e) => setRuleName(e.target.value)}
                          placeholder="Enter rule name"
                          className="w-full border border-[#E5E7EB] rounded-md px-3 py-2 text-sm"
                        />

                      </div>


                      {/* TRIGGER_SELECT_BLOCK */}
                      <div className="space-y-1">

                        {/* TRIGGER_LABEL */}
                        <label className="text-xs text-[#596780]">
                          Trigger
                        </label>

                          {/* TRIGGER_DROPDOWN_WRAPPER */}
                          <div ref={triggerDropdownRef} className="relative">

                            {/* TRIGGER_DROPDOWN_TRIGGER */}
                            <button
                              type="button"
                              onClick={() => setIsTriggerDropdownOpen(prev => !prev)}
                              className="w-full border border-[#E5E7EB] rounded-md px-3 py-2 text-sm text-left bg-white"
                            >
                              {triggerType || "Select Trigger"}
                            </button>

                            {/* TRIGGER_DROPDOWN_LIST */}
                            {isTriggerDropdownOpen && (

                              <div className="absolute left-0 top-full mt-1 w-full bg-white border border-[#E5E7EB] rounded-md shadow-sm z-50 max-h-40 overflow-y-auto">

                                {getFilteredTriggers().map((trigger) => (

                                  <button
                                    key={trigger}
                                    onClick={() => {

                                      setTriggerType(trigger)

                                      const scopes = getFilteredScopes(trigger)
                                      setScopeType(scopes[0] || "")

                                      setIsTriggerDropdownOpen(false)

                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#E8F0FE]"
                                  >
                                    {trigger}
                                  </button>

                                ))}

                              </div>

                            )}

                          </div>

                        </div>
                        


                      {/* SCOPE_SELECT_BLOCK */}
                      {selectedPreset !== "new_friend_welcome_followup" && (

                      <div className="space-y-4">

                        {/* SCOPE_LABEL */}
                        <label className="text-xs text-[#596780]">
                          Scope
                        </label>

                        {/* SCOPE_DROPDOWN_WRAPPER */}
                        <div ref={scopeDropdownRef} className="relative">

                          {/* SCOPE_DROPDOWN_TRIGGER */}
                          <button
                            type="button"
                            onClick={() => setIsScopeDropdownOpen(prev => !prev)}
                            className="w-full border border-[#E5E7EB] rounded-md px-3 py-2 text-sm text-left bg-white hover:bg-[#F9FAFB]"
                          >
                            {scopeType || "Select Scope"}
                          </button>

                          {/* SCOPE_DROPDOWN_LIST */}
                          {isScopeDropdownOpen && (

                            <div className="absolute left-0 top-full mt-1 w-full bg-white border border-[#E5E7EB] rounded-md shadow-sm z-50 max-h-40 overflow-y-auto">

                              {/* SCOPE_OPTION_LIST */}
                              {getFilteredScopes(triggerType).map((scope) => (

                                <button
                                  key={scope}
                                  onClick={() => {
                                    setScopeType(scope)
                                    setIsScopeDropdownOpen(false)
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-[#E8F0FE]"
                                >

                                  {/* SCOPE_OPTION_LABEL */}
                                  {scope}

                                </button>

                              ))}

                            </div>

                          )}

                        </div>

                        {/* SCOPE_POST_URL_OPTION_LIST */}
                        {scopeType === "Specific Post" && (
                          <div className="mt-3">
                            <label className="text-xs text-[#596780]">
                              Post URL
                            </label>
                            <input
                              value={postUrl}
                              onChange={(e) => setPostUrl(e.target.value)}
                              placeholder="https://facebook.com/..."
                              className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
                            />
                          </div>
                        )}
                        
                        {/* SCOPE_LIVE_URL_OPTION_LIST */}
                        {scopeType === "Specific Live" && (
                          <div className="mt-3">
                            <label className="text-xs text-[#596780]">
                              Live URL
                            </label>
                            <input
                              value={liveUrl}
                              onChange={(e) => setLiveUrl(e.target.value)}
                              placeholder="https://facebook.com/live/..."
                              className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
                            />
                          </div>
                        )}

                        {/* SCOPE_GROUP_SELECT_OPTION */}
                        {scopeType === "Specific Group" && (
                        <div className="mt-3 space-y-1">

                          <label className="text-xs text-[#596780]">
                            Select Group
                          </label>

                          <div ref={groupDropdownRef} className="relative isolate z-[9999]">

                            {/* DROPDOWN_TRIGGER */}
                            <button
                              type="button"
                              onClick={() => setIsGroupDropdownOpen(prev => !prev)}
                              className="w-full border border-[#E5E7EB] rounded-md px-3 py-2 pr-8 text-sm text-left bg-white hover:bg-[#F9FAFB]"
                            >
                              {selectedGroupId
                                ? userGroups.find(g => g.id === selectedGroupId)?.name
                                : "Select Group"}

                              {/* GROUP_DROPDOWN_ARROW */}
                              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                                <svg className="h-4 w-4 text-[#596780]" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </button>

                            {/* DROPDOWN_LIST */}
                            {isGroupDropdownOpen && (
                              <div className="absolute left-0 top-full translate-y-[4px] w-full bg-white border border-[#E5E7EB] rounded-md shadow-sm z-[9999] max-h-40 overflow-y-auto">

                                {userGroups.map((group) => (
                                  <button
                                    key={group.id}
                                    onClick={() => {
                                      setSelectedGroupId(group.id)
                                      setIsGroupDropdownOpen(false)
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#E8F0FE]"
                                  >
                                    {group.name}
                                  </button>
                                ))}

                              </div>
                            )}

                          </div>

                        </div>
                      )}

                      {/* SCOPE_LEAD_LIST_SELECT_OPTION */}
                      {scopeType === "Specific Lead List" && (
                        <div className="mt-3 space-y-1">

                          <label className="text-xs text-[#596780]">
                            Select Lead List
                          </label>

                          <div ref={groupDropdownRef} className="relative">

                            {/* DROPDOWN_TRIGGER */}
                            <button
                              type="button"
                              onClick={() => setIsGroupDropdownOpen(prev => !prev)}
                              className="w-full border border-[#E5E7EB] rounded-md px-3 py-2 pr-8 text-sm text-left bg-white hover:bg-[#F9FAFB]"
                            >
                              {selectedLeadListId
                                ? leadLists.find(l => l.id === selectedLeadListId)?.name
                                : "Select Lead List"}

                              {/* ARROW */}
                              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                                <svg className="h-4 w-4 text-[#596780]" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                                </svg>
                              </div>

                            </button>

                            {/* DROPDOWN_LIST */}
                            {isGroupDropdownOpen && (
                              <div className="absolute left-0 top-full mt-1 w-full bg-white border border-[#E5E7EB] rounded-md shadow-sm z-[9999] max-h-40 overflow-y-auto">

                                {leadLists.map((list) => (
                                  <button
                                    key={list.id}
                                    onClick={() => {
                                      setSelectedLeadListId(list.id)
                                      setIsGroupDropdownOpen(false)
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#E8F0FE]"
                                  >
                                    {list.name}
                                  </button>
                                ))}

                              </div>
                            )}

                          </div>

                        </div>
                      )}

                      </div>
                      )}

                      {/* STEPS_SECTION */}
                      <div className="space-y-3">

                        {/* STEPS_LABEL */}
                        <label className="text-xs text-[#596780]">
                          Steps
                        </label>

                        {/* STEP_ROWS */}
                        <div className="space-y-3">

                          {steps.map((step, index) => (

                            <div 
                              className="flex items-start gap-3"
                            >

                              {/* STEP_INDEX */}
                              <span className="text-sm text-[#596780] w-[32px] flex items-center h-[40px]">
                                {index + 1}
                              </span>

                              {/* STEP_TYPE_SELECT */}
                              {/* STEP_DROPDOWN_WRAPPER */}
                              <div data-step-dropdown className="relative w-1/2">

                                {/* STEP_DROPDOWN_TRIGGER */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenStepDropdownId(prev =>
                                      prev === step.id ? null : step.id
                                    )
                                  }
                                  className="w-full border border-[#E5E7EB] rounded-md px-3 py-2 text-sm text-left bg-white hover:bg-[#F9FAFB]"
                                >
                                  {step.type || "Select Step"}
                                </button>

                                {/* STEP_DROPDOWN_LIST */}
                                {openStepDropdownId === step.id && (

                                  <div className="absolute left-0 top-full mt-1 w-full bg-white border border-[#E5E7EB] rounded-md shadow-sm z-50 max-h-40 overflow-y-auto">

                                    {/* STEP_OPTION_LIST */}
                                    {[
                                      "Send DM",
                                      "Wait",
                                      "Add Tag",
                                      "Remove Tag",
                                      "Like Post",
                                      "React to Post",
                                      "Comment on Post",
                                      "Like Comment",
                                      "Reply to Comment"
                                    ].map((option) => (

                                      <button
                                        key={option}
                                        onClick={() => {

                                        const updated = steps.map(s =>
                                          s.id === step.id
                                            ? { ...s, type: option }
                                            : s
                                        )

                                        setSteps(updated)
                                        setOpenStepDropdownId(null)

                                      }}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#E8F0FE]"
                                      >

                                        {/* STEP_OPTION_LABEL */}
                                        {option}

                                      </button>

                                    ))}

                                  </div>

                                )}

                              </div>
                              
                              {/* WAIT_STEP_INPUTS */}
                              {step.type === "Wait" && (
                              <div className="flex gap-2 items-center w-1/2">

                                {/* WAIT_MINUTES_INPUT */}
                                <input
                                  type="number"
                                  min="0"
                                  max="60"
                                  placeholder="0 mins"
                                  value={step.waitMinutes || ""}
                                  onChange={(e) => {
                                    const updated = [...steps]
                                    updated[index].waitMinutes = e.target.value
                                    setSteps(updated)
                                  }}
                                  className="w-24 rounded-md border border-[#E5E7EB] px-2 py-1 text-sm"
                                />

                                {/* WAIT_HOURS_INPUT */}
                                <input
                                  type="number"
                                  min="0"
                                  max="24"
                                  placeholder="0 hrs"
                                  value={step.waitHours || ""}
                                  onChange={(e) => {
                                    const updated = [...steps]
                                    updated[index].waitHours = e.target.value
                                    setSteps(updated)
                                  }}
                                  className="w-24 rounded-md border border-[#E5E7EB] px-2 py-1 text-sm"
                                />

                              </div>
                            )}

                            {/* STEP_ACTION_RIGHT_AREA */}
                            {step.type !== "Wait" && (
                              <div className="flex items-center gap-2 w-1/2">
                                
                                {/* TEMPLATE_PLACEHOLDER */}
                                <div data-template-dropdown className="relative w-full">

                                {/* TEMPLATE_TRIGGER */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenTemplateDropdownId(prev =>
                                      prev === step.id ? null : step.id
                                    )
                                  }
                                  className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-left bg-white hover:bg-[#F9FAFB]"
                                >
                                  {step.templateId
                                    ? templates.find(t => t.id === step.templateId)?.name
                                    : "Select template"}
                                </button>

                                {/* TEMPLATE_DROPDOWN_LIST */}
                                {openTemplateDropdownId === step.id && (
                                  <div className="absolute left-0 top-full mt-1 w-full bg-white border border-[#E5E7EB] rounded-md shadow-sm z-50 max-h-40 overflow-y-auto">

                                    {templates.map((tpl) => (
                                      <button
                                        key={tpl.id}
                                        onClick={() => {

                                          const updated = steps.map(s =>
                                            s.id === step.id
                                              ? { ...s, templateId: tpl.id }
                                              : s
                                          )

                                          setSteps(updated)
                                          setOpenTemplateDropdownId(null)

                                        }}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#E8F0FE]"
                                      >
                                        {tpl.name}
                                      </button>
                                    ))}

                                  </div>
                                )}

                              </div>

                              </div>
                            )}

                            </div>
                          ))}
                        </div> 


                        {/* ADD_STEP_BUTTON */}
                        <div className="mt-4">

                      {/* ADD_STEP_TRIGGER */}
                      {!isAddStepOpen && (
                        <button
                          onClick={() => setIsAddStepOpen(true)}
                          className="text-sm text-[#1A73E8] hover:underline"
                        >
                          + Add Step
                        </button>
                      )}

                      {/* ADD_STEP_OPTIONS */}
                      {isAddStepOpen && (
                        <div className="flex gap-3">

                          {/* ADD_WAIT_BUTTON */}
                          <button
                            onClick={() => {
                              setSteps([
                                ...steps,
                                {
                                  id: Date.now(),
                                  type: "Wait",
                                  waitMinutes: "",
                                  waitHours: "",
                                  templateId: ""
                                }
                              ])
                              setIsAddStepOpen(false)
                            }}
                            className={`px-3 py-1 rounded-md border text-sm
                              border-[#E5E7EB] text-[#596780]
                              hover:bg-[#E8F0FE] hover:border-[#1A73E8] hover:text-[#1A73E8]
                            `}
                          >
                            Wait
                          </button>

                          {/* ADD_ACTION_BUTTON */}
                          <button
                            onClick={() => {
                              setSteps([
                                ...steps,
                                {
                                  id: Date.now(),
                                  type: "",
                                  waitMinutes: "",
                                  waitHours: "",
                                  templateId: ""
                              
                                }
                              ])
                              setIsAddStepOpen(false)
                            }}
                            className={`px-3 py-1 rounded-md border text-sm
                              border-[#E5E7EB] text-[#596780]
                              hover:bg-[#E8F0FE] hover:border-[#1A73E8] hover:text-[#1A73E8]
                            `}
                          >
                            Action
                          </button>
                        </div>
                      )}

                    </div>

                  </div>


                      {/* BUILDER_ACTION_ROW */}
                      <div className="flex items-center gap-3 pt-4">

                        {/* SAVE_RULE */}
                        <button
                          onClick={() => {

                            const isValid = validateSteps()

                            if (!isValid) return

                            /* ---------- ADD_AUTOMATION ---------- */
                            const newAutomation = {
                              id: Date.now().toString(),
                              name: ruleName,
                              status: "running",
                              trigger: triggerType,
                              scope: scopeType,
                              specific:
                                scopeType === "Specific Post"
                                  ? postUrl
                                  : scopeType === "Specific Live"
                                  ? liveUrl
                                  : scopeType === "Specific Group"
                                  ? selectedGroupId
                                  : scopeType === "Specific Lead List"
                                  ? selectedLeadListId
                                  : "",
                              steps: steps.map((s: any) => s.type),
                              createdAt: new Date().toLocaleString([], {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              }),
                              pausedAt: "",
                              stoppedAt: "",
                              resumedAt: "",
                              timeline: []
                            }

                            setAutomations(prev => [newAutomation, ...prev])

                            setToast({ message: "Automation saved successfully", type: "success" })

                          }}
                          className="bg-[#1A73E8] hover:bg-[#1558C0] text-white px-4 py-2 rounded-md text-sm"
                        >
                          Save Rule
                        </button>

                        {/* CANCEL_RULE */}
                        <button
                          onClick={() => setIsScratchBuilderOpen(false)}
                          className="text-sm text-[#596780] hover:underline hover:text-[#1A202C]"
                        >
                          Cancel
                        </button>

                      </div>

                    </div>

                  )}

                </div>
              

              )}

            </div>

            {/* ---------- TOAST_UI ---------- */}
            {toast && (
              <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999]">
                <div
                  className={`px-4 py-2 rounded-md text-sm shadow-sm ${
                    toast.type === "error"
                      ? "bg-[#FEE2E2] text-[#B91C1C]"
                      : "bg-[#DCFCE7] text-[#15803D]"
                  }`}
                >
                  {toast.message}
                </div>
              </div>
            )}

        </CardContent>
      </Card>


      {/* AUTOMATIONS_ACTIVITY_CARD */}
      <div>
       <Card>
        <CardContent className="pt-6 px-6 space-y-4 overflow-visible relative">

            {/* HEADER_SECTION */}
            <div className="flex flex-col">
              <h3 className="text-sm font-semibold text-[#1A202C]">
                Automation Activity
              </h3>
              <p className="mt-1 font-jakarta text-[13px] text-[#596780]">
                Track, monitor, and manage all your automations
              </p>
            </div>

            {/* TABS */}
            <div data-automation-tabs className="flex gap-6 border-b border-[#E5E7EB]">

            <button
              onClick={() => setAutomationTab("active")}
             className={`pb-2 text-sm font-medium border-b-2 ${
              automationTab === "active"
                ? "border-[#027A48]"
                : "border-transparent"
              } text-[#027A48]`}
            >
              Active ({automations.filter(a => a.status === "running").length})
            </button>

            <button
              onClick={() => setAutomationTab("paused")}
              className={`pb-2 text-sm font-medium border-b-2 ${
              automationTab === "paused"
                ? "border-[#B54708]"
                : "border-transparent"
              } text-[#B54708]`}
            >
              Paused ({automations.filter(a => a.status === "paused").length}) • Stopped ({automations.filter(a => a.status === "stopped").length})
            </button>

            </div>

            {/* Automation_Activity_CONTENT */}
            <div className="space-y-4 relative">

            {/* ACTIVE TAB */}
            {automationTab === "active" && (
            <div className="space-y-3 max-h-[360px] overflow-y-auto overflow-x-visible">
                {automations.filter(a => a.status === "running").map(a => (

                  <div key={a.id} className="space-y-2 relative overflow-visible">

                    {/* ROW */}
                    <div
                      data-automation-row
                      onClick={(e) => {
                        const target = e.target as HTMLElement

                          if (target.closest("button")) {
                            e.stopPropagation()
                            return
                          }

                          setSelectedAutomationId(prev => prev === a.id ? null : a.id)
                        }}
                      style={{ borderWidth: "2.8px" }}
                      className="flex items-center justify-between px-4 py-3 border border-[#F3F5F7] rounded-md cursor-pointer hover:bg-[#F9FAFB]"
                    >
                      <p className="text-sm font-medium">{a.name}</p>

                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#E7F6EC] text-[#1E7A46]">
                          Running
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedAutomationId(null)
                            setAutomations(prev =>
                              prev.map(x =>
                                x.id === a.id ? {
                                  ...x,
                                  status: "paused",
                                  pausedAt: new Date().toLocaleString([], {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  }),
                                  timeline: [
                                    ...(x.timeline || []),
                                    {
                                      label: "Paused",
                                      time: new Date().toLocaleString([], {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                      })
                                    }
                                  ]
                                } : x
                              )
                            )
                          }}
                          className="text-xs text-[#B54708] hover:underline"
                        >
                          Pause
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedAutomationId(null) 
                            setAutomations(prev =>
                              prev.map(x =>
                              x.id === a.id ? {
                                ...x,
                                status: "stopped",
                                stoppedAt: new Date().toLocaleString([], {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                }),
                                timeline: [
                                  ...(x.timeline || []),
                                  {
                                    label: "Stopped",
                                    time: new Date().toLocaleString([], {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit"
                                    })
                                  }
                                ]
                              } : x
                              )
                            )
                          }}
                          className="text-xs text-[#B42318] hover:underline"
                        >
                          Stop
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation()

                            if (confirmDeleteId === a.id) {
                              handleDeleteAutomation(a.id)
                            } else {
                              setConfirmDeleteId(a.id)

                              setTimeout(() => {
                                setConfirmDeleteId(null)
                              }, 2000)
                            }
                          }}
                          className={`text-xs ${
                            confirmDeleteId === a.id
                              ? "text-[#B42318] font-semibold"
                              : "text-[#596780]"
                          } hover:underline`}
                        >
                          {confirmDeleteId === a.id ? "Confirm" : "Delete"}
                        </button>

                      </div>
                    </div>


                    {/* EXPAND */}
                    {selectedAutomationId === a.id && (
                      <div data-automation-expand className="mx-4 p-3 border rounded-md bg-[#F9FAFB] text-sm space-y-2 flex flex-col relative">
                        <p>Trigger: {a.trigger}</p>
                        <p>Scope: {a.scope}</p>
                        {a.specific && <p>Details: {a.specific}</p>}
                        <p>Steps: {a.steps.join(" → ")}</p>

                        {/* RESULTS_BLOCK */}
                        <div className="pt-2 space-y-1">
                          <p className="font-medium">Results (Today)</p>
                          <p>{a.results?.messagesSent} Conversations Started (18)</p>
                          <p>{a.results?.leadsGenerated} Leads Generated (12)</p>
                          <p>{a.results?.replies} Replies Received (5)</p>
                        </div>
                        <div className="h-[140px] overflow-y-auto border-t pt-2 mt-2 space-y-1">
                          {(() => {
                            const events = [
                              { label: "Created", time: a.createdAt },
                              ...(a.timeline || [])
                            ]

                            return events.map((e, i) => (
                              <p key={i} className="text-sm">
                                <span className="text-[#1A202C]">{e.label}:</span>{" "}
                                <span className="text-[#596780]">
                                  {e.time?.replace(/,([^,]*)$/, " |$1")}
                                </span>
                              </p>
                            ))
                          })()}
                        </div>
                      </div>
                    )}

                  </div>

                ))}

              </div>
            )}

            {/* PAUSED TAB */}
            {automationTab === "paused" && (
            <div className="space-y-3 max-h-[360px] overflow-y-auto overflow-x-visible">

                {automations.filter(a => a.status !== "running").map(a => (

                  <div key={a.id} className="space-y-2 relative overflow-visible">

                  {/* ROW */}
                  <div
                    data-automation-row
                    onClick={(e) => {
                      const target = e.target as HTMLElement

                        if (target.closest("button")) {
                          e.stopPropagation()
                          return
                        }

                        setSelectedAutomationId(prev => prev === a.id ? null : a.id)
                      }}
                    style={{ borderWidth: "2.8px" }}
                    className="flex items-center justify-between px-4 py-3 border border-[#F3F5F7] rounded-md cursor-pointer hover:bg-[#F9FAFB]"
                  >

                    <p className="text-sm font-medium">{a.name}</p>

                    <div className="flex gap-3 items-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          a.status === "paused"
                            ? "bg-[#FFF4E5] text-[#B54708]"
                            : "bg-[#F3F4F6] text-[#344054]"
                        }`}
                      >
                        {a.status === "paused" ? "Paused" : "Stopped"}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedAutomationId(null)
                          setAutomations(prev =>
                            prev.map(x =>
                            x.id === a.id ? {
                              ...x,
                              status: "running",
                              resumedAt: new Date().toLocaleString([], {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              }),
                              timeline: [
                                ...(x.timeline || []),
                                {
                                  label: "Resumed",
                                  time: new Date().toLocaleString([], {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                  })
                                }
                              ]
                            } : x
                            )
                          )
                        }}
                        className="text-xs text-[#1A73E8] hover:underline"
                      >
                        Resume
                      </button>

                      {a.status !== "stopped" && (
                      <button
                        onClick={(e) => {
                        e.stopPropagation()

                        setAutomations(prev =>
                            prev.map(x =>
                              x.id === a.id ? {
                                ...x,
                                status: "stopped",
                                stoppedAt: new Date().toLocaleString([], {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                }),
                                timeline: [
                                  ...(x.timeline || []),
                                  {
                                    label: "Stopped",
                                    time: new Date().toLocaleString([], {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit"
                                    })
                                  }
                                ]
                              } : x
                            )
                          )
                        }}
                        className="text-xs text-[#B42318] hover:underline"
                      >
                        Stop
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation()

                        if (confirmDeleteId === a.id) {
                          handleDeleteAutomation(a.id)
                        } else {
                          setConfirmDeleteId(a.id)

                          setTimeout(() => {
                            setConfirmDeleteId(null)
                          }, 2000)
                        }
                      }}
                      className={`text-xs ${
                        confirmDeleteId === a.id
                          ? "text-[#B42318] font-semibold"
                          : "text-[#596780]"
                      } hover:underline`}
                    >
                      {confirmDeleteId === a.id ? "Confirm" : "Delete"}
                    </button>

                    </div>
                  </div>

                  {/* EXPAND */}
                  {selectedAutomationId === a.id && (
                    <div data-automation-expand className="mx-4 p-3 border rounded-md bg-[#F9FAFB] text-sm space-y-2 flex flex-col relative">
                      <p>Trigger: {a.trigger}</p>
                      <p>Scope: {a.scope}</p>
                      {a.specific && <p>Details: {a.specific}</p>}
                      <p>Steps: {a.steps.join(" → ")}</p>

                      {/* RESULTS_BLOCK */}
                      <div className="pt-2 space-y-1">
                        <p className="font-medium">Results (Today)</p>
                          <p>{a.results?.messagesSent} Conversations Started (18)</p>
                          <p>{a.results?.leadsGenerated} Leads Generated (12)</p>
                          <p>{a.results?.replies} Replies Received (5)</p>
                      </div>
                      <div className="h-[140px] overflow-y-auto border-t pt-2 mt-2 space-y-1">
                        {(() => {
                          const events = [
                            { label: "Created", time: a.createdAt },
                            ...(a.timeline || [])
                          ]

                          return events.map((e, i) => (
                            <p key={i} className="text-sm">
                              <span className="text-[#1A202C]">{e.label}:</span>{" "}
                              <span className="text-[#596780]">
                                {e.time?.replace(/,([^,]*)$/, " |$1")}
                              </span>
                            </p>
                          ))
                        })()}
                      </div>
                    </div>
                  )}

                </div>

                ))}

              </div>
            )}

            </div>

        </CardContent>
        </Card>
        </div>

    </div>
  );
}