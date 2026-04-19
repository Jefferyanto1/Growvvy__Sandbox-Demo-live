"use client";

import { useState, useEffect, useRef } from "react";

/* ---------------- TYPES ---------------- */

type Lead = {
  id: number;
  name: string;
  profileImage: string;
  source: string;
  status: string;
  campaign: string;
  dateAdded: string;
  lastInteraction: string;
  role: string;
  notes: {
  id: string;
  content: string;
  timestamp: string;
}[];
  activityLog: {
    id: string;
    message: string;
    timestamp: string;
  }[];
};

type LeadList = {
  id: string;
  name: string;
  leadIds: number[];
  createdAt: string;
};

/* ---------------- CONSTANTS ---------------- */

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Follow-Up", value: "follow_up" },
  { label: "Converted", value: "converted" },
  { label: "Archived", value: "archived" },
];

/* ---------------- FAKE DATA: LEADS ---------------- */

const DEFAULT_LEADS: Lead[] = [
  {
    id: 101,
    name: "Alex Carter",
    profileImage: "https://i.pravatar.cc/40?img=11",
    source: "Comment",
    status: "new",
    campaign: "Facebook Lead Engine Test",
    dateAdded: "12-Apr-2026",
    lastInteraction: "1h ago",
    role: "Fitness Coach",
    notes: [],
    activityLog: [
      { id: "log-1", message: "Commented on post", timestamp: "2h ago" },
      { id: "log-2", message: "Auto DM sent", timestamp: "1h ago" },
    ],
  },
  {
    id: 102,
    name: "Ryan Mitchell",
    profileImage: "https://i.pravatar.cc/40?img=12",
    source: "Comment",
    status: "new",
    campaign: "Facebook Lead Engine Test",
    dateAdded: "12-Apr-2026",
    lastInteraction: "2h ago",
    role: "Agency Owner",
    notes: [],
    activityLog: [
      { id: "log-1", message: "Commented on post", timestamp: "3h ago" },
      { id: "log-2", message: "Auto DM sent", timestamp: "2h ago" },
    ],
  },
  {
    id: 103,
    name: "Daniel Brooks",
    profileImage: "https://i.pravatar.cc/40?img=13",
    source: "DM",
    status: "contacted",
    campaign: "Facebook Lead Engine Test",
    dateAdded: "11-Apr-2026",
    lastInteraction: "5h ago",
    role: "Course Creator",
    notes: [],
    activityLog: [
      { id: "log-1", message: "Commented on post", timestamp: "1d ago" },
      { id: "log-2", message: "DM sent", timestamp: "1d ago" },
    ],
  },
  {
    id: 104,
    name: "Chris Walker",
    profileImage: "https://i.pravatar.cc/40?img=14",
    source: "DM",
    status: "contacted",
    campaign: "Facebook Lead Engine Test",
    dateAdded: "11-Apr-2026",
    lastInteraction: "6h ago",
    role: "Copywriter",
    notes: [],
    activityLog: [
      { id: "log-1", message: "Commented on post", timestamp: "1d ago" },
      { id: "log-2", message: "DM sent", timestamp: "1d ago" },
    ],
  },
  {
    id: 105,
    name: "Ethan Collins",
    profileImage: "https://i.pravatar.cc/40?img=15",
    source: "DM",
    status: "contacted",
    campaign: "Facebook Lead Engine Test",
    dateAdded: "11-Apr-2026",
    lastInteraction: "8h ago",
    role: "Affiliate Marketer",
    notes: [],
    activityLog: [
      { id: "log-1", message: "Commented on post", timestamp: "1d ago" },
      { id: "log-2", message: "DM sent", timestamp: "1d ago" },
    ],
  },
  {
    id: 106,
    name: "Jake Thompson",
    profileImage: "https://i.pravatar.cc/40?img=16",
    source: "DM",
    status: "follow_up",
    campaign: "Facebook Lead Engine Test",
    dateAdded: "11-Apr-2026",
    lastInteraction: "1d ago",
    role: "SaaS Founder",
    notes: [],
    activityLog: [
      { id: "log-1", message: "DM conversation started", timestamp: "2d ago" },
      { id: "log-2", message: "Replied to message", timestamp: "1d ago" },
    ],
  },
  {
    id: 107,
    name: "Mark Reynolds",
    profileImage: "https://i.pravatar.cc/40?img=17",
    source: "DM",
    status: "follow_up",
    campaign: "Facebook Lead Engine Test",
    dateAdded: "11-Apr-2026",
    lastInteraction: "1d ago",
    role: "Business Mentor",
    notes: [],
    activityLog: [
      { id: "log-1", message: "DM conversation started", timestamp: "2d ago" },
      { id: "log-2", message: "Replied to message", timestamp: "1d ago" },
    ],
  },
  {
    id: 108,
    name: "Sarah Johnson",
    profileImage: "https://i.pravatar.cc/40?img=18",
    source: "DM",
    status: "follow_up",
    campaign: "Facebook Lead Engine Test",
    dateAdded: "11-Apr-2026",
    lastInteraction: "2d ago",
    role: "Dating Coach",
    notes: [],
    activityLog: [
      { id: "log-1", message: "DM conversation started", timestamp: "3d ago" },
      { id: "log-2", message: "Replied to message", timestamp: "2d ago" },
    ],
  },
  {
    id: 109,
    name: "Emily Carter",
    profileImage: "https://i.pravatar.cc/40?img=19",
    source: "Live",
    status: "converted",
    campaign: "Facebook Lead Engine Test",
    dateAdded: "10-Apr-2026",
    lastInteraction: "3d ago",
    role: "Nutritionist",
    notes: [],
    activityLog: [
      { id: "log-1", message: "Commented during live", timestamp: "4d ago" },
      { id: "log-2", message: "Replied to message", timestamp: "3d ago" },
    ],
  },
  {
    id: 110,
    name: "Jessica Moore",
    profileImage: "https://i.pravatar.cc/40?img=20",
    source: "Live",
    status: "converted",
    campaign: "Facebook Lead Engine Test",
    dateAdded: "10-Apr-2026",
    lastInteraction: "3d ago",
    role: "Financial Planner",
    notes: [],
    activityLog: [
      { id: "log-1", message: "Commented during live", timestamp: "4d ago" },
      { id: "log-2", message: "Replied to message", timestamp: "3d ago" },
    ],
  },
  {
    id: 111,
    name: "Kevin Scott",
    profileImage: "https://i.pravatar.cc/40?img=21",
    source: "Comment",
    status: "new",
    campaign: "Facebook Lead Engine Test",
    dateAdded: "12-Apr-2026",
    lastInteraction: "30m ago",
    role: "Freelancer",
    notes: [],
    activityLog: [
      { id: "log-1", message: "Commented on post", timestamp: "1h ago" },
      { id: "log-2", message: "Auto DM sent", timestamp: "30m ago" },
    ],
  },
  {
    id: 112,
    name: "Laura Davis",
    profileImage: "https://i.pravatar.cc/40?img=22",
    source: "Comment",
    status: "new",
    campaign: "Facebook Lead Engine Test",
    dateAdded: "12-Apr-2026",
    lastInteraction: "45m ago",
    role: "Online Coach",
    notes: [],
    activityLog: [
      { id: "log-1", message: "Commented on post", timestamp: "1h ago" },
      { id: "log-2", message: "Auto DM sent", timestamp: "45m ago" },
    ],
  },
]

/* ---------------- FAKE DATA: LISTS ---------------- */

const DEFAULT_LISTS: LeadList[] = [];

/* ---------------- COMPONENTS ---------------- */

export default function LeadsPage() {


/* ---------------- STATES ---------------- */

/* ---------- LEADS STATE ---------- */
const [leads, setLeads] = useState<Lead[]>(DEFAULT_LEADS);

/* ---------- LISTS STATE ---------- */
const [lists, setLists] = useState<LeadList[]>(DEFAULT_LISTS);

/* ---------- CREATE LIST STATE ---------- */
const [isCreatingList, setIsCreatingList] = useState(false);
const [newListName, setNewListName] = useState("");

/* ---------- TAB STATE ---------- */
const [activeTab, setActiveTab] = useState("all");

/* ---------- SELECTION STATE ---------- */
const [selectedLeadIds, setSelectedLeadIds] = useState<number[]>([]);

/* ---------- EXPANDED ROW STATE ---------- */
const [expandedLeadId, setExpandedLeadId] = useState<number | null>(null);

/* ---------- DROPDOWN STATES ---------- */
const [openStatusDropdownId, setOpenStatusDropdownId] = useState<number | null>(null);

/* ---------- LIST ACTION MENU STATE ---------- */
const [openListActionId, setOpenListActionId] = useState<string | null>(null);

/* ---------- ACTION MENU STATE ---------- */
const [openActionLeadId, setOpenActionLeadId] = useState<number | null>(null);

/* ---------- ADD LEAD MODAL STATE ---------- */
const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);

/* ---------- ADD LEAD FORM STATE ---------- */
const [newLead, setNewLead] = useState({
  name: "",
  source: "",
  campaign: "",
  role: "",
  status: "new",
});

/* ---------- NOTES DRAFT STATE ---------- */
const [draftNotes, setDraftNotes] = useState<Record<number, string>>({});

/* ---------------- FILTER STATE ---------------- */
/* ---------- LEADS FILTER STATE ---------- */
const [filters, setFilters] = useState({
  source: "",
  status: "",
  campaign: "",
  role: "",
  listId: "",
  dateAdded: "",
  customDays: "",
  customMonths: "",
  lastInteraction: "",
  interactionDays: "",
  interactionMonths: "",
});

/* ---------------- HEADER FILTER STATE ---------------- */
const [openFilterKey, setOpenFilterKey] = useState<string | null>(null);



/* ---------------- REFS ---------------- */

/* ---------- ACTION MENU REF ---------- */
const actionMenuRef = useRef<HTMLDivElement | null>(null);

/* ---------- ADD LEAD MODAL REF ---------- */
const addLeadModalRef = useRef<HTMLDivElement | null>(null);

/* ---------- ADD LEAD NAME INPUT REF ---------- */
const addLeadNameRef = useRef<HTMLInputElement | null>(null);

/* ---------- CREATE LIST REF ---------- */
const createListRef = useRef<HTMLDivElement | null>(null);

/* ---------- LEADS CARD REF ---------- */
const leadsCardRef = useRef<HTMLDivElement | null>(null);

/* ---------- LEADS TABLE REF ---------- */
const leadsTableRef = useRef<HTMLDivElement | null>(null);

/* ---------- EXPANDED PANEL REF ---------- */
const expandedPanelRef = useRef<HTMLDivElement | null>(null);

/* ---------------- HEADER FILTER REF ---------------- */
const headerFilterRef = useRef<HTMLDivElement | null>(null);





/* ---------------- DERIVED STATE ---------------- */

/* ---------- DATE FILTER UTILITY ---------- */

const isWithinDays = (dateString: string, days: number) => {
  const today = new Date();
  const targetDate = new Date(dateString);

  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  return diffDays <= days;
};

/* ---------- LAST INTERACTION PARSER ---------- */

const getInteractionDays = (value: string) => {
  if (value.includes("h")) return 0;
  if (value.includes("d")) return Number(value.replace("d ago", ""));
  return 999;
};

/* ---------- FILTER OPTIONS DERIVED ---------- */
const uniqueSources = Array.from(new Set(leads.map(l => l.source)));
const uniqueCampaigns = Array.from(new Set(leads.map(l => l.campaign)));
const uniqueRoles = Array.from(new Set(leads.map(l => l.role)));

const filteredLeads = leads
  // TAB FILTER
  .filter((lead) =>
    activeTab === "all" ? true : lead.status === activeTab
  )

  // FILTER: SOURCE
  .filter((lead) =>
    filters.source ? lead.source === filters.source : true
  )

  // FILTER: STATUS (dropdown filter)
  .filter((lead) =>
    filters.status ? lead.status === filters.status : true
  )

  // FILTER: CAMPAIGN
  .filter((lead) =>
    filters.campaign ? lead.campaign === filters.campaign : true
  )

  // FILTER: ROLE
  .filter((lead) =>
    filters.role ? lead.role === filters.role : true
  )

  // FILTER: DATE ADDED
  .filter((lead) => {
    if (!filters.dateAdded) return true;

    if (filters.dateAdded === "today") {
      const today = new Date().toDateString();
      return new Date(lead.dateAdded).toDateString() === today;
    }

    if (filters.dateAdded === "7days") {
      return isWithinDays(lead.dateAdded, 7);
    }

    if (filters.dateAdded === "30days") {
      return isWithinDays(lead.dateAdded, 30);
    }

    if (filters.dateAdded === "custom") {

    if (filters.customDays) {
      return isWithinDays(lead.dateAdded, Number(filters.customDays));
    }

    if (filters.customMonths) {
      const days = Number(filters.customMonths) * 30;
      return isWithinDays(lead.dateAdded, days);
    }

    return true;
}
  return true;
})

  // FILTER: LAST INTERACTION
  .filter((lead) => {
    if (!filters.lastInteraction) return true;

    const interactionDays = getInteractionDays(lead.lastInteraction);

    if (filters.lastInteraction === "today") {
      return interactionDays === 0;
    }

    if (filters.lastInteraction === "7days") {
      return interactionDays <= 7;
    }

    if (filters.lastInteraction === "30days") {
      return interactionDays <= 30;
    }

    if (filters.lastInteraction === "custom") {

      if (filters.interactionDays) {
        return interactionDays <= Number(filters.interactionDays);
      }

      if (filters.interactionMonths) {
        return interactionDays <= Number(filters.interactionMonths) * 30;
      }

      return true;
    }

  return true;
})

  // FILTER: LIST
  .filter((lead) =>
    filters.listId
      ? lists
          .find((list) => list.id === filters.listId)
          ?.leadIds.includes(lead.id)
      : true
  );

  /* ---------- ACTIVE FILTER COUNT ---------- */

const activeFilterCount = [
  filters.source,
  filters.status,
  filters.campaign,
  filters.role,
  filters.listId,
  filters.dateAdded,
  filters.lastInteraction
].filter(Boolean).length;

/* ---------- SELECTION DERIVED STATE ---------- */

const allVisibleSelected =
  filteredLeads.length > 0 &&
  filteredLeads.every((lead) =>
    selectedLeadIds.includes(lead.id)
  );

/* ---------------- EFFECTS ---------------- */

/* ---------------- EFFECT: CLOSE LEAD LIST ACTION MENU ON OUTSIDE CLICK ---------------- */
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      actionMenuRef.current &&
      !actionMenuRef.current.contains(event.target as Node)
    ) {
      setOpenListActionId(null);
    }
  };

  if (openListActionId !== null) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [openListActionId]);

/* ---------------- EFFECT: CLOSE ACTION MENU ON OUTSIDE CLICK ---------------- */
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      actionMenuRef.current &&
      !actionMenuRef.current.contains(event.target as Node)
    ) {
      setOpenActionLeadId(null);
    }
  };

  if (openActionLeadId !== null) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [openActionLeadId]);

/* ---------------- EFFECT: AUTO FOCUS NAME INPUT ---------------- */
useEffect(() => {
  if (isAddLeadOpen) {
    setTimeout(() => {
      addLeadNameRef.current?.focus();
    }, 0);
  }
}, [isAddLeadOpen]);

/* ---------------- EFFECT: CLOSE ADD LEAD MODAL ON OUTSIDE CLICK ---------------- */
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      addLeadModalRef.current &&
      !addLeadModalRef.current.contains(event.target as Node)
    ) {
      setIsAddLeadOpen(false);

      setNewLead({
        name: "",
        source: "",
        campaign: "",
        role: "",
        status: "new",
      });
    }
  };

  if (isAddLeadOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isAddLeadOpen]);

/* ---------------- EFFECT: CLOSE CREATE LIST ON OUTSIDE CLICK ---------------- */
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      leadsCardRef.current &&
      !leadsCardRef.current.contains(event.target as Node)
    ) {
      setIsCreatingList(false);
    }
  };

  if (isCreatingList) {
    document.addEventListener("click", handleClickOutside);
  }

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, [isCreatingList]);

/* ---------------- EFFECT: CLOSE HEADER FILTER ON OUTSIDE CLICK ---------------- */
useEffect(() => {
  function handleOutsideClick(event: MouseEvent) {
    if (
      headerFilterRef.current &&
      !headerFilterRef.current.contains(event.target as Node)
    ) {
      setOpenFilterKey(null);
    }
  }

  if (openFilterKey) {
    document.addEventListener("mousedown", handleOutsideClick);
  }

  return () => {
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, [openFilterKey]);

/* ---------------- EFFECT: CLOSE EXPANDED PANEL (SMART CLOSE) ---------------- */
useEffect(() => {
  const handleClick = (event: MouseEvent) => {
    const target = event.target as Node;

    if (!expandedPanelRef.current) return;

    // If click inside expanded panel → keep open
    if (expandedPanelRef.current.contains(target)) return;

    // If click inside action menu → keep open
    if ((target as HTMLElement).closest(".lead-action-menu")) return;

    // If click inside leads table → keep open
    if (leadsTableRef.current?.contains(target)) return;

    // Otherwise close
    setExpandedLeadId(null);
  };

  if (expandedLeadId !== null) {
    document.addEventListener("click", handleClick);
  }

  return () => {
    document.removeEventListener("click", handleClick);
  };
}, [expandedLeadId]);



/* ---------------- GLOBAL HANDLERS ---------------- */


/* ---------------- FEATURE-SPECIFIC HANDLERS ---------------- */

/* ---------------- HANDLER: DELETE LEAD LIST ---------------- */
const handleDeleteList = (listId: string) => {
  setLists((prev) =>
    prev.filter((list) => list.id !== listId)
  );

  setOpenListActionId(null);

  setFilters((prev) => ({
    ...prev,
    listId: "",
  }));
};

/* ---------------- HANDLER: DELETE LEAD ---------------- */
const handleDeleteLead = (leadId: number) => {
  setLeads((prev) => prev.filter((lead) => lead.id !== leadId));

  setOpenActionLeadId(null);

  setSelectedLeadIds((prev) =>
    prev.filter((id) => id !== leadId)
  );
};

/* ---------------- HANDLER: ADD LEAD ---------------- */
const handleAddLead = () => {
  if (!newLead.name.trim()) return;

  const lead: Lead = {
    id: Date.now(),
    name: newLead.name,
    profileImage: `https://i.pravatar.cc/40?u=${Date.now()}`,
    source: newLead.source || "Manual",
    status: newLead.status,
    campaign: newLead.campaign || "-",
    role: newLead.role || "-",
    dateAdded: new Date().toLocaleDateString(),
    lastInteraction: "Just now",
    notes: [],
    activityLog: [
      {
        id: `log-${Date.now()}`,
        message: "Lead manually added",
        timestamp: "Just now",
      },
    ],
  };

  setLeads((prev) => [lead, ...prev]);

  setNewLead({
    name: "",
    source: "",
    campaign: "",
    role: "",
    status: "new",
  });

  setIsAddLeadOpen(false);
};

/* ---------------- CLEAR FILTERS ---------------- */
const handleClearFilters = () => {
  setFilters({
    source: "",
    status: "",
    campaign: "",
    role: "",
    listId: "",
    dateAdded: "",
    customDays: "",
    customMonths: "",
    lastInteraction: "",
    interactionDays: "",
    interactionMonths: "",
  });
  
    // clear selected leads (checkbox)
  setSelectedLeadIds([]);

  // close any open header dropdown
  setOpenFilterKey(null);

};

/* ---------------- HANDLER: CREATE LIST ---------------- */

const handleCreateList = () => {
  if (!newListName.trim() || selectedLeadIds.length === 0) return;

  const newList: LeadList = {
    id: `list-${Date.now()}`,
    name: newListName.trim(),
    leadIds: selectedLeadIds,
    createdAt: new Date().toISOString(),
  };

  setLists((prevLists) => [...prevLists, newList]);

  setSelectedLeadIds([]);
  setNewListName("");
  setIsCreatingList(false);
};

/* ---------------- HANDLER: TOGGLE SELECT ALL ---------------- */

const handleToggleSelectAll = () => {
  if (allVisibleSelected) {
    setSelectedLeadIds(
      selectedLeadIds.filter(
        (id) => !filteredLeads.some((lead) => lead.id === id)
      )
    );
  } else {
    const visibleIds = filteredLeads.map((lead) => lead.id);
    setSelectedLeadIds(
      Array.from(new Set<number>([...selectedLeadIds, ...visibleIds]))
    );
  }
};






return (
  <div className="space-y-6">

  {/* ---------------- MAIN CARD ---------------- */}
  <div
    ref={leadsCardRef}
    className="rounded-md border border-[#E5E7EB] bg-white pt-6 px-6 space-y-6"
  >
    
      {/* ---------------- HEADER SECTION ---------------- */}
      <div className="flex items-center justify-between">

        <div className="space-y-1">
          <h2 className="text-sm font-semibold text-[#1A202C]">
            Leads
          </h2>
          <p className="font-jakarta text-[13px] text-[#596780]">
            Manage, track, and organize all your leads in one place
          </p>
        </div>

        <div className="flex items-center gap-3">

          {/* BUTTON: ADD LEAD */}
          <button
            onClick={() => setIsAddLeadOpen(true)}
            className="h-7 rounded-md bg-[#1A73E8] px-3 text-xs font-medium text-white hover:bg-[#1558C0]"
            >
            Add Lead
          </button>
          
          {/* BUTTON: IMPORT */}
          <button
            className="h-7 px-2 text-xs font-medium text-[#1A73E8] hover:underline"
          >
            Import
          </button>

        </div>
      </div>


      {/* ---------------- CREATE LIST ROW ---------------- */}
      <div
        ref={createListRef}
        className="flex items-center justify-between pt-4"
      >

        {/* CONDITIONAL: SHOW INPUT MODE */}
        {isCreatingList && (
          <div className="flex items-center gap-4 flex-1 mr-6">

            {/* LABEL: CREATE LIST */}
            <label className="text-xs text-[#596780] whitespace-nowrap">
              Create New List • {selectedLeadIds.length} leads selected
            </label>

            {/* INPUT: LIST NAME */}
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Enter list name"
              className="flex-1 rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
            />

            {/* BUTTON: SAVE LIST */}
            <button
              onClick={handleCreateList}
              className="bg-[#1A73E8] hover:bg-[#1A73E8]/95 text-white px-4 py-2 rounded-md text-sm"
            >
              Save
            </button>

            {/* BUTTON: CANCEL CREATE LIST */}
            <button
              onClick={() => {
                setIsCreatingList(false);
                setNewListName("");
              }}
              className="text-sm text-[#596780] hover:text-[#1A202C]"
            >
              Cancel
            </button>

          </div>
        )}

        {/* CONDITIONAL: SHOW CREATE BUTTON */}
        {!isCreatingList && (
          <button
            onClick={() => setIsCreatingList(true)}
            className="bg-[#1A73E8] hover:bg-[#1A73E8]/95 text-white px-4 py-2 rounded-md text-sm"
          >
            Create List
          </button>
        )}

      </div>


      {/* ---------------- TAB SYSTEM ---------------- */}
      <div className="flex gap-6 border-b border-[#E5E7EB] text-sm">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`pb-2 ${
              activeTab === tab.value
                ? "border-b-2 border-[#1A73E8] text-[#1A73E8]"
                : "text-[#596780]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>


    {/* ---------------- LEADS TABLE ---------------- */} 

    {/* TABLE HEADER */}
    <div
      ref={headerFilterRef}
      className="grid grid-cols-[40px_2fr_1fr_1fr_1.5fr_1fr_1fr_90px] items-center text-xs text-[#596780] border-b border-[#E5E7EB] py-3 px-[16px]"
    >
        <div>
        <input
          type="checkbox"
          checked={allVisibleSelected}
          onChange={handleToggleSelectAll}
        />
        </div>
        <div className="flex items-center justify-start h-full">Profile</div>


        {/* ---------------- HEADER: SOURCE ---------------- */}
        <div className="relative flex flex-col items-start -ml-3">

          {/* CLICKABLE LABEL */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpenFilterKey((prev) =>
                prev === "source" ? null : "source"
              );
            }}
            className="flex items-center gap-1 cursor-pointer"
          >
            <div>Source</div>
          
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 text-[#596780]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* SELECTED FILTER DISPLAY */}
          {filters.source && (
            <div className="text-[11px] text-[#1A73E8] leading-tight mt-0">
              {filters.source}
            </div>
          )}

          {/* DROPDOWN */}
          {openFilterKey === "source" && (
            <div 
              className="absolute left-0 top-full mt-2 min-w-full bg-white border border-[#E5E7EB] rounded-md shadow-md z-50"
            >

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters((prev) => ({ ...prev, source: "" }));
                  setOpenFilterKey(null);
                }}
                className="px-4 py-2 text-sm text-[#1A202C] hover:bg-[#E8F0FE] cursor-pointer rounded-t-md"
              >
                All
              </div>

              {uniqueSources.map((src, index) => (
                <div
                  key={src}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilters((prev) => ({ ...prev, source: src }));
                    setOpenFilterKey(null);
                  }}
                  className={`px-4 py-2 text-sm hover:bg-[#E8F0FE] cursor-pointer ${
                    filters.source === src
                      ? "bg-[#E8F0FE] text-[#1A73E8]"
                      : "text-[#1A202C]"
                  } ${
                    index === uniqueSources.length - 1 ? "rounded-b-md" : ""
                  }`}
                >
                  {src}
                </div>
              ))}

            </div>
          )}
        </div>


        {/* ---------------- HEADER: STATUS ---------------- */}
        <div className="relative flex flex-col items-start -ml-3">

          {/* CLICKABLE LABEL */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpenFilterKey((prev) =>
                prev === "status" ? null : "status"
              );
            }}
            className="flex items-center gap-1 cursor-pointer"
          >
            <div>Status</div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 text-[#596780]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* SELECTED FILTER DISPLAY */}
          {filters.status && (
            <div className="text-[11px] text-[#1A73E8] leading-tight mt-0">
              {filters.status.replace("_", " ")}
            </div>
          )}

          {/* DROPDOWN */}
          {openFilterKey === "status" && (
            <div
              className="absolute left-0 top-full mt-2 min-w-full bg-white border border-[#E5E7EB] rounded-md shadow-md z-50"
              >

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters((prev) => ({ ...prev, status: "" }));
                  setOpenFilterKey(null);
                }}
                className="px-4 py-2 text-sm text-[#1A202C] hover:bg-[#E8F0FE] cursor-pointer rounded-t-md"
              >
                All
              </div>

              {STATUS_TABS
                .filter((tab) => tab.value !== "all")
                .map((tab, index, arr) => (
                  <div
                    key={tab.value}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters((prev) => ({ ...prev, status: tab.value }));
                      setOpenFilterKey(null);
                    }}
                    className={`px-4 py-2 text-sm hover:bg-[#E8F0FE] cursor-pointer ${
                      filters.status === tab.value
                        ? "bg-[#E8F0FE] text-[#1A73E8]"
                        : "text-[#1A202C]"
                    } ${
                      index === arr.length - 1 ? "rounded-b-md" : ""
                    }`}
                  >
                    {tab.label}
                  </div>
                ))}

            </div>
          )}
        </div>


        {/* ---------------- HEADER: CAMPAIGN ---------------- */}
        <div className="relative flex flex-col items-start -ml-2">

          {/* CLICKABLE LABEL */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpenFilterKey((prev) =>
                prev === "campaign" ? null : "campaign"
              );
            }}
            className="flex items-center gap-1 cursor-pointer"
          >
            <div>Campaign</div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 text-[#596780]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* SELECTED FILTER DISPLAY */}
          {filters.campaign && (
            <div className="text-[11px] text-[#1A73E8] leading-tight mt-0">
              {filters.campaign}
            </div>
          )}

          {/* DROPDOWN */}
          {openFilterKey === "campaign" && (
            <div
              className="absolute left-0 top-full mt-2 min-w-full bg-white border border-[#E5E7EB] rounded-md shadow-md z-50"
            >

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters((prev) => ({ ...prev, campaign: "" }));
                  setOpenFilterKey(null);
                }}
                className="px-4 py-2 text-sm text-[#1A202C] hover:bg-[#E8F0FE] cursor-pointer rounded-t-md"
              >
                All
              </div>

              {uniqueCampaigns.map((campaign, index) => (
                <div
                  key={campaign}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilters((prev) => ({ ...prev, campaign }));
                    setOpenFilterKey(null);
                  }}
                  className={`px-4 py-2 text-sm hover:bg-[#E8F0FE] cursor-pointer ${
                    filters.campaign === campaign
                      ? "bg-[#E8F0FE] text-[#1A73E8]"
                      : "text-[#1A202C]"
                  } ${
                    index === uniqueCampaigns.length - 1 ? "rounded-b-md" : ""
                  }`}
                >
                  {campaign}
                </div>
              ))}

            </div>
          )}
        </div>


        {/* ---------------- HEADER: DATE ADDED ---------------- */}
        <div className="relative flex flex-col items-start -ml-1">

          {/* CLICKABLE LABEL */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpenFilterKey((prev) =>
                prev === "dateAdded" ? null : "dateAdded"
              );
            }}
            className="flex items-center gap-1 cursor-pointer"
          >
            <div>Date Added</div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 text-[#596780]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* SELECTED FILTER DISPLAY */}
          {filters.dateAdded && (
            <div className="text-[11px] text-[#1A73E8] leading-tight mt-0">
              {filters.dateAdded === "today" && "Today"}
              {filters.dateAdded === "7days" && "Last 7 Days"}
              {filters.dateAdded === "30days" && "Last 30 Days"}
              {filters.dateAdded === "custom" && filters.customDays && `${filters.customDays} Days`}
              {filters.dateAdded === "custom" && filters.customMonths && `${filters.customMonths} Months`}
            </div>
          )}

          {/* DROPDOWN */}
          {openFilterKey === "dateAdded" && (
            <div
              className="absolute left-0 top-full mt-2 min-w-[180px] bg-white border border-[#E5E7EB] rounded-md shadow-md z-50"
            >

              {/* ALL */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters((prev) => ({
                    ...prev,
                    dateAdded: "",
                    customDays: "",
                  }));
                  setOpenFilterKey(null);
                }}
                className="px-4 py-2 text-sm text-[#1A202C] hover:bg-[#E8F0FE] cursor-pointer rounded-t-md"
              >
                All
              </div>

              {/* TODAY */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters((prev) => ({
                    ...prev,
                    dateAdded: "today",
                    customDays: "",
                  }));
                  setOpenFilterKey(null);
                }}
                className="px-4 py-2 text-sm hover:bg-[#E8F0FE] cursor-pointer"
              >
                Today
              </div>

              {/* LAST 7 DAYS */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters((prev) => ({
                    ...prev,
                    dateAdded: "7days",
                    customDays: "",
                  }));
                  setOpenFilterKey(null);
                }}
                className="px-4 py-2 text-sm hover:bg-[#E8F0FE] cursor-pointer"
              >
                Last 7 Days
              </div>

              {/* LAST 30 DAYS */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters((prev) => ({
                    ...prev,
                    dateAdded: "30days",
                    customDays: "",
                  }));
                  setOpenFilterKey(null);
                }}
                className="px-4 py-2 text-sm hover:bg-[#E8F0FE] cursor-pointer"
              >
                Last 30 Days
              </div>

              {/* CUSTOM DAYS */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 border-t border-[#E5E7EB] space-y-2"
              >

                {/* CUSTOM DAYS */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.customDays}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateAdded: "custom",
                        customDays: e.target.value,
                        customMonths: "",
                      }))
                    }
                    className="w-16 rounded-md border border-[#E5E7EB] px-2 py-1 text-sm"
                  />
                  <span className="text-sm text-[#596780]">Days</span>
                </div>

                {/* CUSTOM MONTHS */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.customMonths}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateAdded: "custom",
                        customMonths: e.target.value,
                        customDays: "",
                      }))
                    }
                    className="w-16 rounded-md border border-[#E5E7EB] px-2 py-1 text-sm"
                  />
                  <span className="text-sm text-[#596780]">Months</span>
                </div>

              </div>

            </div>
          )}
        </div>


        {/* ---------------- HEADER: LAST INTERACTION ---------------- */}
        <div className="relative flex flex-col items-start -ml-1">

           {/* ---------- LAST INTERACTION LABEL ---------- */}
          <div
            onClick={(e) => {
              e.stopPropagation();
              setOpenFilterKey((prev) =>
                prev === "interaction" ? null : "interaction"
              );
            }}
            className="flex items-center gap-1 cursor-pointer"
          >
            <div>Last Interaction</div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 text-[#596780]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        
          {/* ---------- SELECTED INTERACTION FILTER DISPLAY ---------- */}
          {filters.lastInteraction && (
            <div className="text-[11px] text-[#1A73E8] leading-tight mt-0">
              {filters.lastInteraction === "today" && "Today"}
              {filters.lastInteraction === "7days" && "Last 7 Days"}
              {filters.lastInteraction === "30days" && "Last 30 Days"}

              {filters.lastInteraction === "custom" && filters.interactionDays && `${filters.interactionDays} Days`}
              {filters.lastInteraction === "custom" && filters.interactionMonths && `${filters.interactionMonths} Months`}
            </div>
          )}

          {/* ---------- DROPDOWN ---------- */}
          {openFilterKey === "interaction" && (
            <div
              className="absolute left-0 top-full mt-2 min-w-[180px] bg-white border border-[#E5E7EB] rounded-md shadow-md z-50"
            >
              
              {/* ---------- OPTION: ALL ---------- */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters((prev) => ({
                    ...prev,
                    lastInteraction: "",
                    interactionDays: "",
                    interactionMonths: "",
                  }));
                  setOpenFilterKey(null);
                }}
                className="px-4 py-2 text-sm hover:bg-[#E8F0FE] cursor-pointer rounded-t-md"
              >
                All
              </div>
              
              {/* ---------- OPTION: TODAY ---------- */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters((prev) => ({
                    ...prev,
                    lastInteraction: "today",
                  }));
                  setOpenFilterKey(null);
                }}
                className="px-4 py-2 text-sm hover:bg-[#E8F0FE] cursor-pointer"
              >
                Today
              </div>
              
              {/* ---------- OPTION: LAST 7 DAYS ---------- */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters((prev) => ({
                    ...prev,
                    lastInteraction: "7days",
                  }));
                  setOpenFilterKey(null);
                }}
                className="px-4 py-2 text-sm hover:bg-[#E8F0FE] cursor-pointer"
              >
                Last 7 Days
              </div>
              
              {/* ---------- OPTION: LAST 30 DAYS ---------- */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setFilters((prev) => ({
                    ...prev,
                    lastInteraction: "30days",
                  }));
                  setOpenFilterKey(null);
                }}
                className="px-4 py-2 text-sm hover:bg-[#E8F0FE] cursor-pointer"
              >
                Last 30 Days
              </div>
              
              {/* ---------- CUSTOM INTERACTION RANGE ---------- */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 border-t border-[#E5E7EB] space-y-2"
              >

                {/* ---------- CUSTOM DAYS INPUT ---------- */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filters.interactionDays}
                    placeholder="0"
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        lastInteraction: "custom",
                        interactionDays: e.target.value,
                        interactionMonths: "",
                      }))
                    }
                    className="w-16 rounded-md border border-[#E5E7EB] px-2 py-1 text-sm"
                  />
                  <span className="text-sm text-[#596780]">Days</span>
                </div>
                
                {/* ---------- CUSTOM MONTHS INPUT ---------- */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filters.interactionMonths}
                    placeholder="0"
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        lastInteraction: "custom",
                        interactionMonths: e.target.value,
                        interactionDays: "",
                      }))
                    }
                    className="w-16 rounded-md border border-[#E5E7EB] px-2 py-1 text-sm"
                  />
                  <span className="text-sm text-[#596780]">Months</span>
                </div>

              </div>

            </div>
          )}
        </div>

        {/* ---------- CLEAR FILTERS HEADER ACTION ---------- */}
        <div className="flex items-center justify-end">

          {/* TAG: CLEAR_BUTTON_ALWAYS_VISIBLE */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearFilters();
                setOpenFilterKey(null);
              }}
              className="text-xs font-medium text-[#1A73E8] hover:underline"
            >
              Clear ({activeFilterCount + selectedLeadIds.length})
            </button>

        </div>
        
        </div>



      {/* TABLE BODY */}
      {/* SCROLL CONTAINER */}
      <div
        ref={actionMenuRef}
        className="max-h-[380px] overflow-y-auto space-y-2 pt-4"
      >

        {filteredLeads.map((lead) => {
          const isExpanded = expandedLeadId === lead.id;

          return (
            <div key={lead.id}>

              {/* ROW */}
              <div
                onClick={() =>
                  setExpandedLeadId(isExpanded ? null : lead.id)
                }
                className="grid grid-cols-[40px_2fr_1fr_1fr_1.5fr_1fr_1fr_90px] items-center rounded-md border border-[#F3F5F7] py-3 hover:bg-[#F9FAFB] cursor-pointer"
              >

                {/* CHECKBOX */}
                <div className="flex items-center pl-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedLeadIds.includes(lead.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      if (e.target.checked) {
                        setSelectedLeadIds([...selectedLeadIds, lead.id]);
                      } else {
                        setSelectedLeadIds(
                          selectedLeadIds.filter((id) => id !== lead.id)
                        );
                      }
                    }}
                  />
                </div>

                {/* PROFILE */}
                <div className="flex items-center gap-3 pl-4">
                  <img
                    src={lead.profileImage}
                    alt={lead.name}
                    className="w-8 h-8 rounded-md"
                  />
                  <span className="text-sm text-[#1A202C]">
                    {lead.name}
                  </span>
                </div>

                {/* SOURCE */}
                <div className="flex items-center text-sm text-[#596780]">
                  {lead.source}
                </div>

                {/* STATUS */}
                <div className="flex items-center text-sm capitalize text-[#596780]">
                  {lead.status.replace("_", " ")}
                </div>

                {/* CAMPAIGN */}
                <div className="flex items-center text-sm text-[#1A202C]">
                  {lead.campaign}
                </div>

                {/* DATE ADDED */}
                <div className="flex items-center text-sm text-[#596780]">
                  {lead.dateAdded}
                </div>

                {/* LAST INTERACTION */}
                <div className="flex items-center text-sm text-[#596780]">
                  {lead.lastInteraction}
                </div>

                {/* ACTION PLACEHOLDER */}
               <div
                  className="relative text-right pl-4 lead-action-menu"
                  onClick={(e) => e.stopPropagation()}
                >

                  {/* ACTION BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenActionLeadId((prev) =>
                        prev === lead.id ? null : lead.id
                      );
                    }}
                    className="text-sm text-[#596780] hover:text-[#1A202C] mr-4"
                  >
                    ⋯
                  </button>

                  {/* ACTION DROPDOWN */}
                  {openActionLeadId === lead.id && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2 w-[80px] bg-white border border-[#E5E7EB] rounded-md shadow-md z-50">

                      <div
                        onClick={() => handleDeleteLead(lead.id)}
                        className="w-full px-3 py-2 text-sm text-red-600 hover:bg-[#F9FAFB] cursor-pointer rounded-md text-center"
                      >
                        Delete
                      </div>

                    </div>
                  )}

                </div>

              </div>

          {/* EXPANDED LEAD PANEL */}
          {isExpanded && (
            <div
              ref={expandedPanelRef}
              className="ml-4 mr-4 mb-3 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-3 space-y-4"
            >

              {/* NOTES SECTION */}
              <div className="space-y-2 text-sm">
                <p className="text-[#1A202C] font-medium">Notes</p>

                <textarea
                  value={draftNotes[lead.id] ?? ""}
                  onChange={(e) => {
                    setDraftNotes((prev) => ({
                      ...prev,
                      [lead.id]: e.target.value,
                    }));
                  }}
                  className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
                  placeholder="Write notes..."
                />

                {/* ---------------- SAVED NOTES DISPLAY ---------------- */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      const updatedNote = draftNotes[lead.id];
                      if (!updatedNote?.trim()) return;

                      setLeads((prev) =>
                        prev.map((l) =>
                          l.id === lead.id
                            ? {
                                ...l,
                                notes: [
                                  ...l.notes,
                                  {
                                    id: `note-${Date.now()}`,
                                    content: updatedNote,
                                    timestamp: "Just now",
                                  },
                                ],
                              }
                            : l
                        )
                      );

                      setDraftNotes((prev) => ({
                        ...prev,
                        [lead.id]: "",
                      }));
                    }}
                    className="text-xs font-medium text-[#1A73E8] hover:underline"
                  >
                    Save
                  </button>

                  <button
                  onClick={(e) => {
                    e.stopPropagation();

                    setDraftNotes((prev) => ({
                      ...prev,
                      [lead.id]: "",
                    }));
                  }}
                  className="text-xs font-medium text-[#596780] hover:underline"
                >
                  Cancel
                </button>
                </div>
              </div>

              {/* SAVED NOTE PREVIEW */}
              {lead.notes.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-[#1A202C]">
                    Saved Notes
                  </p>

                  {lead.notes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="text-[#1A202C]">
                      {note.content}
                    </span>

                    <span className="text-xs text-[#596780]">
                      {note.timestamp}
                    </span>
                  </div>
                ))}
                </div>
              )}

              {/* ACTIVITY SECTION */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#1A202C]">
                  Activity
                </p>

                {/* SCROLL CONTAINER */}
                <div className="max-h-[100px] overflow-y-auto pr-1 space-y-2">
                  {lead.activityLog.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span className="text-[#1A202C]">
                        {log.message}
                      </span>

                      <span className="text-xs text-[#596780]">
                        {log.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
            </div>
          );
        })}

      </div>
    </div>

  {/* ---------------- LISTS SECTION ---------------- */}
    <div className="rounded-md border border-[#E5E7EB] bg-white px-6 py-6 space-y-4">
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-[#1A202C]">
            Lead Lists
          </h3>
          <p className="mt-1 font-jakarta text-[13px] text-[#596780]">
            View your saved lead lists
          </p>
        </div>
      </div>
    
  
        {/* ---------------- LISTS RENDER ---------------- */}
        {lists.length === 0 ? (
          <div className="text-sm text-[#596780]">
            No lists created yet.
          </div>
        ) : (
            <div className="max-h-[200px] overflow-y-auto pr-1 space-y-2 relative">

            {/* TAG: LEAD_LIST_ITEMS */}
            {lists.map((list) => (
              <div
               key={list.id}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest(".list-action-menu")) return;
                }}

                className="flex items-center justify-between rounded-md border border-[#F3F5F7] px-4 py-3 hover:bg-[#F9FAFB] cursor-pointer"
              >

                {/* LIST NAME */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#1A202C]">
                    {list.name}
                  </span>

                  <span className="text-xs text-[#596780]">
                    ({list.leadIds.length})
                  </span>
                </div>

                <div className="flex items-center gap-4">

                  {/* ---------------- LIST ACTION MENU ---------------- */}
                  <div
                    className="relative list-action-menu"
                    onClick={(e) => e.stopPropagation()}
                  >

                    <button
                      onClick={() =>
                        setOpenListActionId((prev) =>
                          prev === list.id ? null : list.id
                        )
                      }
                      className="text-sm text-[#596780] hover:text-[#1A202C]"
                    >
                      ⋯
                    </button>

                    {openListActionId === list.id && (
                      <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 w-[80px] bg-white border border-[#E5E7EB] rounded-md shadow-md z-50">
                        <button
                          onMouseDown={(e) => {
                          e.stopPropagation();
                          handleDeleteList(list.id);
                        }}
                          className="w-full px-3 py-2 text-sm text-red-600 hover:bg-[#F9FAFB] cursor-pointer rounded-md text-center"
                        >
                          Delete
                        </button>

                      </div>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </div>
          )}
    </div> 


    {/* ---------------- ADD LEAD MODAL ---------------- */}
    {isAddLeadOpen && (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">

        <div
          ref={addLeadModalRef}
          className="w-[420px] bg-white rounded-md border border-[#E5E7EB] p-6 space-y-4"
        >

          <h3 className="text-sm font-semibold text-[#1A202C]">
            Add Lead
          </h3>

          {/* NAME */}
          <input
            ref={addLeadNameRef}
            type="text"
            placeholder="Name"
            value={newLead.name}
            onChange={(e) =>
              setNewLead((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full border border-[#E5E7EB] rounded-md px-3 py-2 text-sm"
          />

          {/* SOURCE INPUT */}
          <input
            list="lead-source-options"
            placeholder="Source"
            value={newLead.source}
            onChange={(e) =>
              setNewLead((prev) => ({ ...prev, source: e.target.value }))
            }
            className="w-full border border-[#E5E7EB] rounded-md px-3 py-2 text-sm"
          />

          {/* SOURCE OPTIONS */}
          <datalist id="lead-source-options">
          {!uniqueSources.includes("Manual") && (
            <option value="Manual" />
          )}

          {uniqueSources.map((src) => (
            <option key={src} value={src} />
          ))}
        </datalist>

          {/* CAMPAIGN */}
          <input
            type="text"
            placeholder="Campaign"
            value={newLead.campaign}
            onChange={(e) =>
              setNewLead((prev) => ({ ...prev, campaign: e.target.value }))
            }
            className="w-full border border-[#E5E7EB] rounded-md px-3 py-2 text-sm"
          />

          {/* ROLE */}
          <input
            type="text"
            placeholder="Role"
            value={newLead.role}
            onChange={(e) =>
              setNewLead((prev) => ({ ...prev, role: e.target.value }))
            }
            className="w-full border border-[#E5E7EB] rounded-md px-3 py-2 text-sm"
          />

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">

            {/* ACTION BUTTON: CANCEL*/}
            <button
              onClick={() => {
                setIsAddLeadOpen(false);

                setNewLead({
                  name: "",
                  source: "",
                  campaign: "",
                  role: "",
                  status: "new",
                });
              }}
              className="text-sm text-[#596780] hover:underline"
            >
            Cancel
            </button>

            <button
              onClick={handleAddLead}
              className="bg-[#1A73E8] hover:bg-[#1558C0] text-white px-4 py-2 rounded-md text-sm"
            >
              Add Lead
            </button>

          </div>

        </div>

      </div>
    )}
 
</div>
)
}

