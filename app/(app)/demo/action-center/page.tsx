"use client";

import { useEffect, useRef } from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type TaskStatus = "pending" | "running" | "paused" | "completed";

type TaskLog = {
  id: string;
  message: string;
  timestamp: string;
};
type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  errorReason?: string;
  origin?: "ai";
  logs?: TaskLog[];
};

type AIInsight = {
  key: "insight-1" | "insight-2" | "insight-3";
  title: string;
  description: string;
  taskTitle: string;
};

type InactiveProfile = {
  id: string;
  name: string;
  avatar: string;
  dateAdded: string;
  engagements: number;
  mutualFriends: number;
  lastInteraction: string;
};

type SendDMInputs = {
  target: string;
  timeFrame: string;
  customValue: string;
  customUnit: string;
  includeExistingConversations: string;
  messageMode: string;
  messageText: string;
  templateId: string;
  personalization: string;
  selectedList: string;
  batchSize: string;
  delayBetweenDMs: string;
  maxPerDay: string;
};

const TASK_TYPES = [
  {
    id: "send_friend_requests",
    label: "Send friend requests",
    description: "AI sends friend requests to people matching your ICP",
  },
  {
    id: "follow_up_replies",
    label: "Follow up replies",
    description: "AI follows up with people who replied",
  },
  {
    id: "clean_inactive",
    label: "Clean inactive connections",
    description: "AI removes inactive or unresponsive connections",
  },
  {
    id: "engage_posts",
    label: "Engage with ICP posts",
    description: "AI engages with your posts using likes, comments, or tags",
  },
  {
    id: "send_dms",
    label: "Send DMs to leads",
    description: "AI sends messages to your leads",
  },
];

const MESSAGE_TEMPLATES = [
  { id: "t1", name: "Gentle follow-up" },
  { id: "t2", name: "Quick reminder" },
  { id: "t3", name: "Value-based nudge" },
  { id: "t4", name: "Casual ping" },
  { id: "t5", name: "Last follow-up" },
];

const INACTIVE_PROFILES: InactiveProfile[] = (() => {
  const profiles: InactiveProfile[] = [];
  for (let i = 1; i <= 10; i++) {
    profiles.push({
      id: `p${i}`,
      name: `Inactive User ${i}`,
      avatar: `https://i.pravatar.cc/40?img=${i + 10}`,
      dateAdded: "2023",
      engagements: i % 2 === 0 ? 0 : 1,
      mutualFriends: Math.floor(Math.random() * 20),
      lastInteraction: "Never",
    });
  }
  return profiles;
})();

function StatusBadge({ status }: { status: TaskStatus }) {
  const styles: Record<TaskStatus, string> = {
    pending: "bg-[#FFF7E6] text-[#B54708]",
    running: "bg-[#E6F4FF] text-[#1A73E8]",
    paused: "bg-[#FEE4E2] text-[#B42318]",
    completed: "bg-[#ECFDF3] text-[#027A48]",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

/* ---------------- DEFAULT TASK STATES ---------------- */
const DEFAULT_FRIEND_REQUEST_INPUTS = {
  source: "",
  icpKeywords: "",
  avoidKeywords: "",
  maxRequests: "",
  minMutualFriends: "",
  delayBetweenRequests: "",
  commonInterestOnly: "no",
  selectedGroups: [] as string[],
  postUrl: "",
  lookbackDays: "",
  location: "",
};

const DEFAULT_FOLLOW_UP_INPUTS = {
  timing: "24",
  customValue: "",
  customUnit: "days",
  scope: "replied_only",
  templateReplied: "",
  templateNoReply: "",
  reactToMessage: "no",
  maxFollowUpsPerConvo: "1",
  maxPerDay: "",
  delayBetweenFollowUps: "",
};

const DEFAULT_CLEAN_INACTIVE_INPUTS = {
  inactiveDays: "",
  customValue: "",
  customUnit: "days",
  selectedProfiles: [] as string[],
};

const DEFAULT_ENGAGE_POSTS_INPUTS = {
  mode: "",
  source: "",
  tagTemplate: "",
  tagPlacement: "after",
  peopleToTag: "",
  timeBetweenTagComments: "",
  commentTemplate: "",
  reactionType: "none",
  tagCommenter: "no",
  sendDM: "no",
  dmTemplate: "",
  maxEngagementsPerDay: "",
  timeBetweenEngagements: "",
  postUrl: "",
  selectedGroups: [] as string[],
};

const DEFAULT_SEND_DM_INPUTS = {
  target: "" as string,
  timeFrame: "24" as string,
  customValue: "" as string,
  customUnit: "hours" as string,
  includeExistingConversations: "no" as string,
  messageMode: "template" as string,
  messageText: "" as string,
  templateId: "" as string,
  personalization: "none" as string,
  selectedList: "" as string,
  batchSize: "" as string,
  delayBetweenDMs: "" as string,
  maxPerDay: "" as string,
};

export default function TasksPage() {
  /* ---------------- STATE ---------------- */

  const [tasks, setTasks] = useState<Task[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);

  const [templateRepliedOpen, setTemplateRepliedOpen] = useState(false);
  const [templateNotRepliedOpen, setTemplateNotRepliedOpen] = useState(false);
  const [jobDropdownOpen, setJobDropdownOpen] = useState(false);
  const [taskDropdownOpen, setTaskDropdownOpen] = useState(false);
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [selectedTaskType, setSelectedTaskType] = useState<string | null>(null);
  const [saveAsTemplate, setSaveAsTemplate] = useState(false);
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const [engageSourceOpen, setEngageSourceOpen] = useState(false);
  const [tagTemplateOpen, setTagTemplateOpen] = useState(false);
  const [commentTemplateOpen, setCommentTemplateOpen] = useState(false);
  const [dmTemplateOpen, setDmTemplateOpen] = useState(false);
  const [sendDMTemplateOpen, setSendDMTemplateOpen] = useState(false);
  const [contactListOpen, setContactListOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);


  const [friendRequestInputs, setFriendRequestInputs] =
  useState(DEFAULT_FRIEND_REQUEST_INPUTS);

  const [followUpInputs, setFollowUpInputs] =
  useState(DEFAULT_FOLLOW_UP_INPUTS);

  const [cleanInactiveInputs, setCleanInactiveInputs] =
  useState(DEFAULT_CLEAN_INACTIVE_INPUTS);

  const [engagePostsInputs, setEngagePostsInputs] =
  useState(DEFAULT_ENGAGE_POSTS_INPUTS);

  const [sendDMInputs, setSendDMInputs] =
  useState<typeof DEFAULT_SEND_DM_INPUTS>(DEFAULT_SEND_DM_INPUTS);



  /* ---------------- REFS ---------------- */

  const templateRepliedRef = useRef<HTMLDivElement | null>(null);
  const templateNotRepliedRef = useRef<HTMLDivElement | null>(null);
  const jobDropdownWrapperRef = useRef<HTMLDivElement | null>(null);
  const sourceDropdownRef = useRef<HTMLDivElement | null>(null);
  const tagTemplateRef = useRef<HTMLDivElement | null>(null);
  const dmTemplateRef = useRef<HTMLDivElement | null>(null);
  const commentTemplateRef = useRef<HTMLDivElement | null>(null);
  const engageSourceRef = useRef<HTMLDivElement | null>(null);
  const engageSourceDropdownRef = useRef<HTMLDivElement | null>(null);
  const sendDMTemplateRef = useRef<HTMLDivElement | null>(null);
  const contactListRef = useRef<HTMLDivElement | null>(null);
  const taskActivityRef = useRef<HTMLDivElement | null>(null);
  

  /* ---------------- DERIVED ---------------- */

  const activeTasks = tasks.filter(t => t.status === "pending" || t.status === "running");
  const attentionTasks = tasks.filter(t => t.status === "paused");
  const completedTasks = tasks.filter(t => t.status === "completed");

  const [activeTab, setActiveTab] = useState<"active" | "attention" | "completed">(
    attentionTasks.length > 0 ? "attention" : "active"
  );


  /* ---------------- EFFECTS ---------------- */

  // Tag template dropdown
  useEffect(() => {
    function handleTagTemplateClick(event: MouseEvent) {
      if (!tagTemplateOpen) return;
      const target = event.target as Node;
      if (tagTemplateRef.current && !tagTemplateRef.current.contains(target)) {
        setTagTemplateOpen(false);
      }
    }

    document.addEventListener("mousedown", handleTagTemplateClick);
    return () => {
      document.removeEventListener("mousedown", handleTagTemplateClick);
    };
  }, [tagTemplateOpen]);

  // Task activity tab close on outside click
  useEffect(() => {
  function closeTaskLogOnClick() {
    if (selectedTaskId) {
      setSelectedTaskId(null);
    }
  }

  document.addEventListener("click", closeTaskLogOnClick);

  return () => {
    document.removeEventListener("click", closeTaskLogOnClick);
  };
}, [selectedTaskId]);

  // Fake Action insights
  useEffect(() => {
    setAiInsights([
    {
      key: "insight-1",
      title: "3 conversations need a follow-up",
      description:
        "These leads replied but haven’t received a follow-up in the last 24 hours.",
      taskTitle: "Follow up replies",
    },
    {
      key: "insight-2",
      title: "18 new commenters ready to message",
      description:
        "People commented on your recent post but haven’t been contacted yet.",
      taskTitle: "Send DMs to leads",
    },
    {
      key: "insight-3",
      title: "12 warm leads ready for outreach",
      description:
        "These leads engaged with your content and are likely to respond.",
      taskTitle: "Send DMs to leads",
    },
  ]);
  }, []);

  // Fake tasks
  useEffect(() => {
  setTasks([
    {
      id: "1",
      title: "Send DMs to leads",
      status: "completed",
      logs: [
        {
          id: "l1",
          message: "Detected 18 commenters from recent post",
          timestamp: "Yesterday, 6:45 PM",
        },
        {
          id: "l2",
          message: "Sent messages to 18 people",
          timestamp: "Yesterday, 7:10 PM",
        },
        {
          id: "l3",
          message: "DM batch completed successfully",
          timestamp: "Yesterday, 7:18 PM",
        },
      ],
    },
    {
      id: "2",
      title: "Follow up replies",
      status: "paused",
      errorReason: "Daily limit reached",
      logs: [
        {
          id: "l1",
          message: "Identified 3 conversations needing follow-up",
          timestamp: "Today, 9:05 AM",
        },
        {
          id: "l2",
          message: "Follow-up sent to 2 people",
          timestamp: "Today, 9:12 AM",
        },
        {
          id: "l3",
          message: "1 remaining (daily limit reached)",
          timestamp: "Today, 9:18 AM",
        },
      ],
    },
    {
      id: "3",
      title: "Send DMs to leads",
      status: "running",
      logs: [
        {
          id: "l1",
          message: "Processing new commenters from recent post",
          timestamp: "2:32 PM",
        },
        {
          id: "l2",
          message: "Preparing messages for next batch",
          timestamp: "2:34 PM",
        },
        {
          id: "l3",
          message: "Sending messages...",
          timestamp: "2:36 PM",
        },
      ],
    },
]);
}, []);

  // Global outside click handler
useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node;

    if (
      jobDropdownOpen &&
      jobDropdownWrapperRef.current &&
      !jobDropdownWrapperRef.current.contains(target)
    ) {
      setJobDropdownOpen(false);
    }

    if (
      sourceDropdownOpen &&
      sourceDropdownRef.current &&
      !sourceDropdownRef.current.contains(target)
    ) {
      setSourceDropdownOpen(false);
    }

    if (
      engageSourceOpen &&
      engageSourceDropdownRef.current &&
      !engageSourceDropdownRef.current.contains(target)
    ) {
      setEngageSourceOpen(false);
    }

    if (
      templateRepliedOpen &&
      templateRepliedRef.current &&
      !templateRepliedRef.current.contains(target)
    ) {
      setTemplateRepliedOpen(false);
    }

    if (
      templateNotRepliedOpen &&
      templateNotRepliedRef.current &&
      !templateNotRepliedRef.current.contains(target)
    ) {
      setTemplateNotRepliedOpen(false);
    }

    if (
    commentTemplateOpen &&
    commentTemplateRef.current &&
    !commentTemplateRef.current.contains(target)
    ) {
    setCommentTemplateOpen(false);
    }

    if (
      dmTemplateOpen &&
      dmTemplateRef.current &&
      !dmTemplateRef.current.contains(target)
    ) {
      setDmTemplateOpen(false);
    }

    if (
      sendDMTemplateOpen &&
      sendDMTemplateRef.current &&
      !sendDMTemplateRef.current.contains(target)
    ) {
      setSendDMTemplateOpen(false);
    }

    if (
      contactListOpen &&
      contactListRef.current &&
      !contactListRef.current.contains(target)
    ) {
      setContactListOpen(false);
    }

    if (
      selectedTaskId &&
      taskActivityRef.current &&
      !taskActivityRef.current.contains(target)
    ) {
      setSelectedTaskId(null);
    }
}

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [
  jobDropdownOpen,
  sourceDropdownOpen,
  engageSourceOpen,
  templateRepliedOpen,
  templateNotRepliedOpen,
  commentTemplateOpen,
  dmTemplateOpen,
  sendDMTemplateOpen,
  contactListOpen,
  selectedTaskId,
]);

  /* ---------------- HANDLERS ---------------- */
  const updateTaskStatus = (id: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => (task.id === id ? { ...task, status: newStatus } : task)));
  };

  const handleStartTask = () => {
    if (!selectedTaskType) return;

    const newTask: Task = {
    id: Date.now().toString(),
    title: TASK_TYPES.find(t => t.id === selectedTaskType)?.label || "New Task",
    status: "running",
    logs: [
      {
        id: "log-1",
        message: "Task started",
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: "log-2",
        message: "Processing...",
        timestamp: new Date().toLocaleTimeString(),
      },
    ],
  };

    setTasks([...tasks, newTask]);
    setSelectedTaskType(null);
    setJobDropdownOpen(false);
    setSourceDropdownOpen(false);
    setSaveAsTemplate(false);
  };


const handleStartAIInsight = (
  insightKey: "insight-1" | "insight-2" | "insight-3",
  taskTitle: string
) => {
  let logs: TaskLog[] = [];

  if (insightKey === "insight-1") {
    logs = [
      {
        id: "l1",
        message: "Detected 3 stalled conversations",
        timestamp: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
      },
      {
        id: "l2",
        message: "Preparing follow-up templates",
        timestamp: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
      },
      {
        id: "l3",
        message: "Follow-up messages queued",
        timestamp: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
      },
    ];
  }

  if (insightKey === "insight-2") {
    logs = [
      {
        id: "l1",
        message: "Analyzing high-performing question posts",
        timestamp: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
      },
      {
        id: "l2",
        message: "Selecting relevant ICP posts",
        timestamp: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
      },
      {
        id: "l3",
        message: "Engagement actions scheduled",
        timestamp: new Date().toLocaleTimeString(),
      },
    ];
  }

  if (insightKey === "insight-3") {
    logs = [
      {
        id: "l1",
        message: "Identified 12 warm leads",
        timestamp: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
      },
      {
        id: "l2",
        message: "Generating personalized messages",
        timestamp: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
      },
      {
        id: "l3",
        message: "DM batch scheduled",
        timestamp: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
      },
    ];
  }

  const newTask: Task = {
    id: Date.now().toString(),
    title: taskTitle,
    status: "running",
    origin: "ai",
    logs,
  };

  setTasks(prev => [...prev, newTask]);
  setAiInsights(prev => prev.filter(insight => insight.key !== insightKey));
};
  const handleIgnoreAIInsight = (
    insightKey: "insight-1" | "insight-2" | "insight-3"
  ) => {
    setAiInsights(prev => prev.filter(insight => insight.key !== insightKey));
  };

  const handleResetCurrentTask = () => {
  if (!selectedTaskType) return;

  switch (selectedTaskType) {
    case "send_friend_requests":
      setFriendRequestInputs(DEFAULT_FRIEND_REQUEST_INPUTS);
      break;

    case "follow_up_replies":
      setFollowUpInputs(DEFAULT_FOLLOW_UP_INPUTS);
      break;

    case "clean_inactive":
      setCleanInactiveInputs(DEFAULT_CLEAN_INACTIVE_INPUTS);
      break;

    case "engage_posts":
      setEngagePostsInputs(DEFAULT_ENGAGE_POSTS_INPUTS);
      break;

    case "send_dms":
      setSendDMInputs(DEFAULT_SEND_DM_INPUTS);
      break;
  }
};





return (
    <div className="space-y-6">
      
      {/* MAIN CARD */}
      <Card>
        <CardContent className="pt-6 space-y-6">

          {/* HEADER ROW & RESET BUTTON*/}
          <div className="flex items-center justify-between">
           <div className="flex flex-col">
              <p className="text-sm font-semibold text-[#1A202C]">
                Create Action
              </p>
              <p className="mt-1 font-jakarta text-[13px] text-[#596780]">
                Set up and run a one-time action
              </p>
            </div>

            {selectedTaskType && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleResetCurrentTask}
                className="h-8 px-3 text-sm 
                          font-medium text-[#596780] border border-transparent hover:text-[#1A73E8] hover:bg-[#E8F0FE] hover:border-[#1A73E8] 
                          transition-colors"
              >
                Reset
              </Button>
            )}
          </div>

          {/* CREATE AI JOB BLOCK */}
          <div className="rounded-md border border-[#E5E7EB] p-4 space-y-4">

            {/* SELECT Task */}
            <div
              ref={jobDropdownWrapperRef}
              className="rounded-md border border-[#E5E7EB] overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 bg-white">
                <button
                  type="button"
                  onClick={() => setJobDropdownOpen(prev => !prev)}
                  className="w-full text-left focus:outline-none"
                >
                  <p className="text-sm font-medium text-[#1A202C]">
                    {selectedTaskType
                      ? TASK_TYPES.find(t => t.id === selectedTaskType)?.label
                      : "Select task"}
                  </p>
                </button>
              </div>

              {jobDropdownOpen && (
                <div className="bg-[#F9FAFB]">
                  {TASK_TYPES.map(task => (
                    <button
                      key={task.id}
                      onClick={() => {
                        setSelectedTaskType(task.id);
                        setJobDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-[#E8F0FE]"
                    >
                      <p className="text-sm font-medium text-[#1A202C]">
                        {task.label}
                      </p>
                      <p className="mt-1 text-xs text-[#596780]">
                        {task.description}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

       
        {/* TASK-SPECIFIC INPUTS */}
        {selectedTaskType === "send_friend_requests" && (
          <div className="space-y-4 px-4">

          {/* Source */}
          <div className="relative">

            <label className="text-xs text-[#596780]">
              Source
            </label>

            <div
            ref={sourceDropdownRef}
            className="mt-1 rounded-md border border-[#E5E7EB] overflow-hidden">

              {/* Closed / selected state */}
              <button
                type="button"
                onClick={() => setSourceDropdownOpen(prev => !prev)}
                className={`w-full text-left px-3 py-2 text-sm bg-white hover:bg-[#F9FAFB]
                  focus:outline-none
                  ${sourceDropdownOpen ? "" : "border-b border-[#E5E7EB]"}
                `}
              >
                {friendRequestInputs.source
                  ? {
                      groups: "Facebook Groups",
                      post_engagers: "Post engagers",
                      people_search: "People search",
                      suggestions: "Friend suggestions",
                    }[friendRequestInputs.source]
                  : "Select source"}
              </button>

              {/* Inline dropdown (same container) */}
              {sourceDropdownOpen && (
                <div className="bg-white">
                  {[
                    { id: "groups", label: "Facebook Groups" },
                    { id: "post_engagers", label: "Post engagers" },
                    { id: "people_search", label: "People search" },
                    { id: "suggestions", label: "Friend suggestions" },
                  ].map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setFriendRequestInputs(prev => ({
                          ...prev,
                          source: option.id,
                          selectedGroups: [],
                          postUrl: "",
                          lookbackDays: "",
                          location: "",
                        }));
                        setSourceDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#E8F0FE]"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>


          {/* TASK SOURCE-SPECIFIC INPUTS */}


          {/* Send friend requests-SPECIFIC INPUTS */}
          {friendRequestInputs.source === "groups" && (
          <div>
            <label className="text-xs text-[#596780]">
              Facebook Groups
            </label>
            <div className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-[#9CA3AF]">
              Select groups you are part of
            </div>
          </div>
        )}

          {friendRequestInputs.source === "post_engagers" && (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-[#596780]">
                Post URL
              </label>
              <input
                value={friendRequestInputs.postUrl}
                onChange={e =>
                  setFriendRequestInputs(prev => ({
                    ...prev,
                    postUrl: e.target.value,
                  }))
                }
                placeholder="https://facebook.com/..."
                className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-[#596780]">
                Lookback period (days)
              </label>
              <input
                type="number"
                value={friendRequestInputs.lookbackDays}
                onChange={e =>
                  setFriendRequestInputs(prev => ({
                    ...prev,
                    lookbackDays: e.target.value,
                  }))
                }
                placeholder="e.g. 7"
                className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

          {friendRequestInputs.source === "people_search" && (
          <div>
            <label className="text-xs text-[#596780]">
              Location
            </label>
            <input
              value={friendRequestInputs.location}
              onChange={e =>
                setFriendRequestInputs(prev => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              placeholder="e.g. India, United States"
              className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
            />
          </div>
        )}


            {/* ICP Keywords */}
            <div>
              <label className="text-xs text-[#596780]">
                ICP (Specific keywords)
              </label>
              <input
                value={friendRequestInputs.icpKeywords}
                onChange={e =>
                  setFriendRequestInputs(prev => ({
                    ...prev,
                    icpKeywords: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
                placeholder="e.g. fitness coach, personal trainer"
              />
            </div>

            {/* Avoid Keywords */}
            <div>
              <label className="text-xs text-[#596780]">
                Avoid specific keywords
              </label>
              <input
                value={friendRequestInputs.avoidKeywords}
                onChange={e =>
                  setFriendRequestInputs(prev => ({
                    ...prev,
                    avoidKeywords: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
                placeholder="e.g. crypto, forex"
              />
            </div>

           
            {/* Maximum number of friend requests */}
            <div>
              <label className="text-xs text-[#596780]">
                Maximum number of friend requests
              </label>
              <input
                type="number"
                value={friendRequestInputs.maxRequests}
                placeholder="0"
                onChange={(e) => {
                  const value = e.target.value;
                  setFriendRequestInputs((prev) => ({
                    ...prev,
                    maxRequests: value,
                  }));
                }}
                className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
              />
            </div>


            {/* Minimum mutual friends */}
            <div>
              <label className="text-xs text-[#596780]">
                Minimum mutual friends
              </label>
              <input
                type="number"
                value={friendRequestInputs.minMutualFriends}
                placeholder="0"
                onChange={(e) => {
                  const value = e.target.value;
                  setFriendRequestInputs((prev) => ({
                    ...prev,
                    minMutualFriends: value,
                  }));
                }}
                className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
              />
            </div>
            
            {/* Common Interest */}
           <div className="space-y-1">
            <p className="text-xs text-[#596780]">
              Send friend requests to people with things in common
            </p>
            <div className="flex gap-2">
              {["yes", "no"].map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setFriendRequestInputs(prev => ({
                      ...prev,
                      commonInterestOnly: option,
                    }))
                  }
                  className={`px-3 py-1 rounded-md border text-sm
                    ${
                      friendRequestInputs.commonInterestOnly === option
                        ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                        : "border-[#E5E7EB] text-[#596780]"
                    }
                  `}
                >
                  {option === "yes" ? "Yes" : "No"}
                </button>
              ))}
            </div>
          </div>


            {/* Time between friend requests (minutes) */}
            <div>
              <label className="text-xs text-[#596780]">
                Time between friend requests (minutes)
              </label>
              <input
                type="number"
                value={friendRequestInputs.delayBetweenRequests}
                placeholder="0 mins"
                onChange={(e) => {
                  const value = e.target.value;
                  setFriendRequestInputs((prev) => ({
                    ...prev,
                    delayBetweenRequests: value,
                  }));
                }}
                className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
              />
            </div>
          </div>
        )}

        {/* Follow up replies-SPECIFIC INPUTS */}
        {selectedTaskType === "follow_up_replies" && (
        <div className="space-y-4 px-4">

          {/* TIMING */}
          <div>
            <label className="text-xs text-[#596780]">
              Follow up after
            </label>

            <div className="mt-1 flex flex-wrap gap-2">
              {[
                { id: "24", label: "24h" },
                { id: "48", label: "48h" },
                { id: "advanced", label: "Advanced" },
              ].map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setFollowUpInputs(prev => ({
                      ...prev,
                      timing: option.id,
                    }))
                  }
                  className={`px-3 py-1 rounded-md border text-sm ${
                    followUpInputs.timing === option.id
                      ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                      : "border-[#E5E7EB] text-[#596780]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {followUpInputs.timing === "advanced" && (
              <div className="mt-2 flex gap-2">
                <input
                  type="number"
                  placeholder="Value"
                  value={followUpInputs.customValue}
                  onChange={e =>
                    setFollowUpInputs(prev => ({
                      ...prev,
                      customValue: e.target.value,
                    }))
                  }
                  className="w-24 rounded-md border border-[#E5E7EB] px-2 py-1 text-sm"
                />

                <select
                  value={followUpInputs.customUnit}
                  onChange={e =>
                    setFollowUpInputs(prev => ({
                      ...prev,
                      customUnit: e.target.value as "days" | "weeks",
                    }))
                  }
                  className="rounded-md border border-[#E5E7EB] px-2 py-1 text-sm"
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                </select>
              </div>
            )}
          </div>
        

          {/* MESSAGE TEMPLATES */}
          <div>
            <label className="text-xs text-[#596780]">
              Template (if they replied)
            </label>
            <div ref={templateRepliedRef} className="relative">
            <button
              type="button"
              onClick={() => setTemplateRepliedOpen(prev => !prev)}
              className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-left bg-white hover:bg-[#F9FAFB]"
            >
              {followUpInputs.templateReplied
                ? MESSAGE_TEMPLATES.find(t => t.id === followUpInputs.templateReplied)?.name
                : "Select template"}
            </button>

            {templateRepliedOpen && (
              <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-md border border-[#E5E7EB] bg-white">
                {MESSAGE_TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => {
                      setFollowUpInputs(prev => ({
                        ...prev,
                        templateReplied: tpl.id,
                      }));
                      setTemplateRepliedOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-[#E8F0FE]"
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>

          <div>
            <label className="text-xs text-[#596780]">
              Template (you haven’t replied)
            </label>
            <div ref={templateNotRepliedRef} className="relative">
            <button
              type="button"
              onClick={() => setTemplateNotRepliedOpen(prev => !prev)}
              className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-left bg-white hover:bg-[#F9FAFB]"
            >
              {followUpInputs.templateNoReply
                ? MESSAGE_TEMPLATES.find(t => t.id === followUpInputs.templateNoReply)?.name
                : "Select template"}
            </button>

            {templateNotRepliedOpen && (
              <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-md border border-[#E5E7EB] bg-white">
                {MESSAGE_TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => {
                      setFollowUpInputs(prev => ({
                        ...prev,
                        templateNoReply: tpl.id,
                      }));
                      setTemplateNotRepliedOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-[#E8F0FE]"
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          </div>

        
          {/* ENGAGEMENT NUDGE */}
          <div className="space-y-1">
            <p className="text-xs text-[#596780]">
              React to last message when following up
            </p>

            <div className="flex gap-2">
              {[
                { id: "none", label: "None" },
                { id: "like", label: "Like" },
                { id: "heart", label: "Heart" },
              ].map(option => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() =>
                    setFollowUpInputs(prev => ({
                      ...prev,
                      reactToMessage: option.id,
                    }))
                  }
                  className={`px-3 py-1 rounded-md border text-sm ${
                    followUpInputs.reactToMessage === option.id
                      ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                      : "border-[#E5E7EB] text-[#596780]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* LIMITS */}
          <div>
            <label className="text-xs text-[#596780]">
              Max follow ups per conversation
            </label>
            <div className="mt-1 flex gap-2">
              {["1", "2"].map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    setFollowUpInputs(prev => ({
                      ...prev,
                      maxFollowUpsPerConvo: option,
                    }))
                  }
                  className={`px-3 py-1 rounded-md border text-sm ${
                    followUpInputs.maxFollowUpsPerConvo === option
                      ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                      : "border-[#E5E7EB] text-[#596780]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          
          {/* Max follow ups per day */}
          <div>
            <label className="text-xs text-[#596780]">
              Max follow ups per day
            </label>
            <input
              type="number"
              placeholder="0"
              value={followUpInputs.maxPerDay}
              onChange={e =>
                setFollowUpInputs(prev => ({
                  ...prev,
                  maxPerDay: e.target.value,
                }))
              }
              className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
            />
          </div>

          {/* Time between follow ups */}
          <div>
            <label className="text-xs text-[#596780]">
              Time between follow ups (minutes)
            </label>
            <input
              type="number"
              placeholder="0 mins"
              value={followUpInputs.delayBetweenFollowUps}
              onChange={e =>
                setFollowUpInputs(prev => ({
                  ...prev,
                  delayBetweenFollowUps: e.target.value,
                }))
              }
              className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
            />
          </div>

        </div>
      )}

        {/* clean inactive connections -SPECIFIC INPUTS */}
        {selectedTaskType === "clean_inactive" && (
        <div className="space-y-4 px-4">

          {/* INACTIVITY FILTER */}
          <div>
          <label className="text-xs text-[#596780]">
            No engagement for
          </label>

          <div className="mt-1 flex gap-2">
            {["30", "custom"].map(option => (
              <button
                key={option}
                type="button"
                onClick={() =>
                  setCleanInactiveInputs(prev => ({
                    ...prev,
                    inactiveDays: option,
                  }))
                }
                className={`px-3 py-1 rounded-md border text-sm ${
                  cleanInactiveInputs.inactiveDays === option
                    ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                    : "border-[#E5E7EB] text-[#596780]"
                }`}
              >
                {option === "custom" ? "Custom" : "30 days"}
              </button>
            ))}
          </div>

          {cleanInactiveInputs.inactiveDays === "custom" && (
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                placeholder="Value"
                value={cleanInactiveInputs.customValue}
                onChange={e =>
                  setCleanInactiveInputs(prev => ({
                    ...prev,
                    customValue: e.target.value,
                  }))
                }
                className="w-24 rounded-md border border-[#E5E7EB] px-2 py-1 text-sm"
              />

              <select
                value={cleanInactiveInputs.customUnit}
                onChange={e =>
                  setCleanInactiveInputs(prev => ({
                    ...prev,
                    customUnit: e.target.value as "days" | "months",
                  }))
                }
                className="rounded-md border border-[#E5E7EB] px-2 py-1 text-sm"
              >
                <option value="days">Days</option>
                <option value="months">Months</option>
              </select>
            </div>
          )}
          </div>

          {/* REVIEW BLOCK */}
          {(() => {
          const canShowProfiles =
            cleanInactiveInputs.inactiveDays === "30" ||
            (cleanInactiveInputs.inactiveDays === "custom" &&
              cleanInactiveInputs.customValue.trim() !== "");

          if (!canShowProfiles) {
            return (
              <div className="rounded-md border border-dashed border-[#E5E7EB] px-4 py-8 text-center text-sm text-[#596780]">
                Select an inactivity period to review inactive connections
              </div>
            );
          }

          return (
            <div className="rounded-md border border-[#E5E7EB]">

              {/* HEADER (STAYS FIXED) */}
              <div className="grid grid-cols-[40px_1fr_100px_120px_140px_120px] gap-3 px-4 py-2 text-xs font-medium text-[#596780] border-b bg-white sticky top-0 z-10">
                <input
                  type="checkbox"
                  checked={
                    cleanInactiveInputs.selectedProfiles.length === INACTIVE_PROFILES.length
                  }
                  onChange={() =>
                    setCleanInactiveInputs(prev => ({
                      ...prev,
                      selectedProfiles:
                        prev.selectedProfiles.length === INACTIVE_PROFILES.length
                          ? []
                          : INACTIVE_PROFILES.map(p => p.id),
                    }))
                  }
                />
                <span>Profile</span>
                <span>Date added</span>
                <span>Mutual friends</span>
                <span>Last interaction</span>
                <span>Engagements</span>
              </div>

              {/* SCROLLABLE BODY */}
              <div className="max-h-[280px] overflow-y-auto">
                {INACTIVE_PROFILES.map(profile => {
                  const isSelected = cleanInactiveInputs.selectedProfiles.includes(profile.id);

                  return (
                    <div
                      key={profile.id}
                      className="grid grid-cols-[40px_1fr_100px_120px_140px_120px] gap-3 items-center px-4 py-3 border-b last:border-b-0"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() =>
                          setCleanInactiveInputs(prev => ({
                            ...prev,
                            selectedProfiles: isSelected
                              ? prev.selectedProfiles.filter(id => id !== profile.id)
                              : [...prev.selectedProfiles, profile.id],
                          }))
                        }
                      />

                      <div className="flex items-center gap-2">
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <span className="text-sm font-medium text-[#1A202C]">
                          {profile.name}
                        </span>
                      </div>

                      <span className="text-sm text-[#596780]">
                        {profile.dateAdded}
                      </span>

                      <span className="text-sm text-[#596780]">
                        {profile.mutualFriends}
                      </span>

                      <span className="text-sm text-[#596780]">
                        {profile.lastInteraction}
                      </span>

                      <span className="text-sm text-[#596780]">
                        {profile.engagements}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
         })()}
        </div>
      )}


        {/* TASK: ENGAGE WITH ICP POSTS */}
        {selectedTaskType === "engage_posts" && (
          <div className="space-y-4 px-4">

            {/* ENGAGEMENT MODE */}
            <div data-section="engagement-mode">
              <label className="text-xs text-[#596780]">
                Engagement mode
              </label>

              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  data-mode="tag"
                  onClick={() =>
                    setEngagePostsInputs(prev => ({
                      ...prev,
                      mode: "tag",
                    }))
                  }
                  className={`px-3 py-1 rounded-md border text-sm ${
                    engagePostsInputs.mode === "tag"
                      ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                      : "border-[#E5E7EB] text-[#596780]"
                  }`}
                >
                  Tag people on posts
                </button>

                <button
                  type="button"
                  data-mode="comment_react"
                  onClick={() =>
                    setEngagePostsInputs(prev => ({
                      ...prev,
                      mode: "comment_react",
                    }))
                  }
                  className={`px-3 py-1 rounded-md border text-sm ${
                    engagePostsInputs.mode === "comment_react"
                      ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                      : "border-[#E5E7EB] text-[#596780]"
                  }`}
                >
                  Comment & react to posts
                </button>
              </div>
            </div>

            {/* ================= TAG MODE ================= */}
            {engagePostsInputs.mode === "tag" && (
              <div data-mode-block="tag" className="space-y-4">

                <div data-input="post-url">
                  <label className="text-xs text-[#596780]">Post URL</label>
                  <input
                    value={engagePostsInputs.postUrl}
                    onChange={e =>
                      setEngagePostsInputs(prev => ({
                        ...prev,
                        postUrl: e.target.value,
                      }))
                    }
                    placeholder="https://facebook.com/..."
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
                
                {/* Tag template */}
                <div data-input="tag-template">
                <label className="text-xs text-[#596780]">
                  Tag comment template
                </label>

                <div ref={tagTemplateRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setTagTemplateOpen(prev => !prev)}
                    className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-left bg-white hover:bg-[#F9FAFB]"
                  >
                    {engagePostsInputs.tagTemplate
                      ? MESSAGE_TEMPLATES.find(
                          t => t.id === engagePostsInputs.tagTemplate
                        )?.name
                      : "Select template"}
                  </button>

                  {tagTemplateOpen && (
                    <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-md border border-[#E5E7EB] bg-white">
                      {MESSAGE_TEMPLATES.map(tpl => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => {
                            setEngagePostsInputs(prev => ({
                              ...prev,
                              tagTemplate: tpl.id,
                            }));
                            setTagTemplateOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-[#E8F0FE]"
                        >
                          {tpl.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
                
                {/* Tag placement */}
                <div data-input="tag-placement">
                  <label className="text-xs text-[#596780]">Tag placement</label>
                  <div className="mt-1 flex gap-2">
                    {["before", "after"].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() =>
                          setEngagePostsInputs(prev => ({
                            ...prev,
                            tagPlacement: p,
                          }))
                        }
                        className={`px-3 py-1 rounded-md border text-sm ${
                          engagePostsInputs.tagPlacement === p
                            ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                            : "border-[#E5E7EB] text-[#596780]"
                        }`}
                      >
                        {p === "before" ? "Before name" : "After name"}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* People to tag per post */}
                <div data-input="people-to-tag">
                  <label className="text-xs text-[#596780]">
                    People to tag per post
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={engagePostsInputs.peopleToTag}
                    onChange={e =>
                      setEngagePostsInputs(prev => ({
                        ...prev,
                        peopleToTag: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
                
                {/* Time between tag comments */}
                <div data-input="tag-delay">
                  <label className="text-xs text-[#596780]">
                    Time between tag comments (minutes)
                  </label>
                  <input
                    type="number"
                    placeholder="0 mins"
                    value={engagePostsInputs.timeBetweenTagComments}
                    onChange={e =>
                      setEngagePostsInputs(prev => ({
                        ...prev,
                        timeBetweenTagComments: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                  />
                </div>
              </div>
            )}

            {/* ============ COMMENT & REACT MODE ============ */}
            {engagePostsInputs.mode === "comment_react" && (
              <div className="space-y-4">

                {/* SOURCE (COMMENT & REACT) */}
                <div ref={engageSourceDropdownRef} className="relative">
                  <label className="text-xs text-[#596780]">
                    Source
                  </label>

                  <div className="mt-1 rounded-md border border-[#E5E7EB] overflow-hidden bg-white">
                    {/* Trigger */}
                    <button
                      type="button"
                      onClick={() => setEngageSourceOpen(prev => !prev)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[#F9FAFB]"
                    >
                      {engagePostsInputs.source
                        ? engagePostsInputs.source === "groups"
                          ? "Facebook Groups"
                          : "Post URL"
                        : "Select source"}
                    </button>

                    {/* Dropdown */}
                    {engageSourceOpen && (
                      <div className="border-t border-[#E5E7EB]">
                        {[
                          { id: "groups", label: "Facebook Groups" },
                          { id: "post_url", label: "Post URL" },
                        ].map(option => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => {
                              setEngagePostsInputs(prev => ({
                                ...prev,
                                source: option.id,
                              }));
                              setEngageSourceOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 text-sm hover:bg-[#E8F0FE]"
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* SOURCE-SPECIFIC INPUTS */}
                {engagePostsInputs.source === "groups" && (
                  <div>
                    <label className="text-xs text-[#596780]">Facebook Groups</label>
                    <div className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-[#9CA3AF]">
                      Select groups you are part of
                    </div>
                  </div>
                )}

                {engagePostsInputs.source === "post_url" && (
                  <div>
                    <label className="text-xs text-[#596780]">Post URL</label>
                    <input
                      value={engagePostsInputs.postUrl}
                      onChange={e =>
                        setEngagePostsInputs(prev => ({
                          ...prev,
                          postUrl: e.target.value,
                        }))
                      }
                      placeholder="https://facebook.com/..."
                      className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
                    />
                  </div>
                )}

                {/* COMMENT TEMPLATE */}
                <div>
                  <label className="text-xs text-[#596780]">Comment template</label>

                  <div ref={commentTemplateRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setCommentTemplateOpen(prev => !prev)}
                      className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-left bg-white hover:bg-[#F9FAFB]"
                    >
                      {engagePostsInputs.commentTemplate
                        ? MESSAGE_TEMPLATES.find(
                            t => t.id === engagePostsInputs.commentTemplate
                          )?.name
                        : "Select template"}
                    </button>

                    {commentTemplateOpen && (
                      <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-md border border-[#E5E7EB] bg-white">
                        {MESSAGE_TEMPLATES.map(tpl => (
                          <button
                            key={tpl.id}
                            type="button"
                            onClick={() => {
                              setEngagePostsInputs(prev => ({
                                ...prev,
                                commentTemplate: tpl.id,
                              }));
                              setCommentTemplateOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-[#E8F0FE]"
                          >
                            {tpl.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* REACTION TYPE */}
                <div>
                  <label className="text-xs text-[#596780]">
                    Want to react with comment
                  </label>

                  <div className="mt-1 flex gap-2">
                    {["none", "like", "love"].map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setEngagePostsInputs(prev => ({
                            ...prev,
                            reactionType: option,
                          }))
                        }
                        className={`px-3 py-1 rounded-md border text-sm ${
                          engagePostsInputs.reactionType === option
                            ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                            : "border-[#E5E7EB] text-[#596780]"
                        }`}
                      >
                        {option === "none" ? "None" : option}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TAG COMMENTER */}
                <div>
                  <label className="text-xs text-[#596780]">
                    Tag the commenter when replying
                  </label>

                  <div className="mt-1 flex gap-2">
                    {["yes", "no"].map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setEngagePostsInputs(prev => ({
                            ...prev,
                            tagCommenter: option,
                          }))
                        }
                        className={`px-3 py-1 rounded-md border text-sm ${
                          engagePostsInputs.tagCommenter === option
                            ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                            : "border-[#E5E7EB] text-[#596780]"
                        }`}
                      >
                        {option === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SEND DM */}
                <div>
                  <label className="text-xs text-[#596780]">
                    Send private DM to the commenter
                  </label>

                  <div className="mt-1 flex gap-2">
                    {["yes", "no"].map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setEngagePostsInputs(prev => ({
                            ...prev,
                            sendDM: option,
                          }))
                        }
                        className={`px-3 py-1 rounded-md border text-sm ${
                          engagePostsInputs.sendDM === option
                            ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                            : "border-[#E5E7EB] text-[#596780]"
                        }`}
                      >
                        {option === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* DM TEMPLATE */}
                {engagePostsInputs.sendDM === "yes" && (
                  <div>
                    <label className="text-xs text-[#596780]">
                      DM message template
                    </label>

                    <div ref={dmTemplateRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setDmTemplateOpen(prev => !prev)}
                        className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-left bg-white hover:bg-[#F9FAFB]"
                      >
                        {engagePostsInputs.dmTemplate
                          ? MESSAGE_TEMPLATES.find(
                              t => t.id === engagePostsInputs.dmTemplate
                            )?.name
                          : "Select template"}
                      </button>

                      {dmTemplateOpen && (
                        <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-md border border-[#E5E7EB] bg-white">
                          {MESSAGE_TEMPLATES.map(tpl => (
                            <button
                              key={tpl.id}
                              type="button"
                              onClick={() => {
                                setEngagePostsInputs(prev => ({
                                  ...prev,
                                  dmTemplate: tpl.id,
                                }));
                                setDmTemplateOpen(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-[#E8F0FE]"
                            >
                              {tpl.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TIME BETWEEN REACTIONS */}
                <div>
                  <label className="text-xs text-[#596780]">
                    Time between reactions (minutes)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={engagePostsInputs.timeBetweenEngagements}
                    onChange={e =>
                      setEngagePostsInputs(prev => ({
                        ...prev,
                        timeBetweenEngagements: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
                  />
                </div>

                {/* LIMITS */}
                <div>
                  <label className="text-xs text-[#596780]">
                    Max engagements per day
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={engagePostsInputs.maxEngagementsPerDay}
                    onChange={e =>
                      setEngagePostsInputs(prev => ({
                        ...prev,
                        maxEngagementsPerDay: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
                  />
                </div>

                {/* TIME BETWEEN ENGAGEMENTS */}
                <div>
                  <label className="text-xs text-[#596780]">
                    Time between engagements (minutes)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={engagePostsInputs.timeBetweenEngagements}
                    onChange={e =>
                      setEngagePostsInputs(prev => ({
                        ...prev,
                        timeBetweenEngagements: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
                  />
                </div>

              </div>
              )}
          </div>
        )}
    
        {/* SEND DMS TO LEADS */}
        {selectedTaskType === "send_dms" && (
          <div className="space-y-4 px-4">

            {/* TARGET */}
            <div>
              <label className="text-xs text-[#596780]">
                Who do you want to message?
              </label>

              <div className="mt-1 flex gap-2">
                {[
                  { id: "recent", label: "Recently added connections" },
                  { id: "list", label: "Contact list" },
                ].map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setSendDMInputs(prev => ({
                        ...prev,
                        target: option.id,
                      }))
                    }
                    className={`px-3 py-1 rounded-md border text-sm ${
                      sendDMInputs.target === option.id
                        ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                        : "border-[#E5E7EB] text-[#596780]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* RECENTLY ADDED */}
            {sendDMInputs.target === "recent" && (
              <>
                {/* TIME FRAME */}
                <div>
                  <label className="text-xs text-[#596780]">
                    Send to connections added within
                  </label>

                  <div className="mt-1 flex gap-2">
                    {["24", "custom"].map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setSendDMInputs(prev => ({
                            ...prev,
                            timeFrame: option,
                          }))
                        }
                        className={`px-3 py-1 rounded-md border text-sm ${
                          sendDMInputs.timeFrame === option
                            ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                            : "border-[#E5E7EB] text-[#596780]"
                        }`}
                      >
                        {option === "24" ? "Last 24hrs" : "Custom"}
                      </button>
                    ))}
                  </div>

                  {sendDMInputs.timeFrame === "custom" && (
                    <div className="mt-2 flex gap-2">
                      <input
                        type="number"
                        placeholder="Value"
                        value={sendDMInputs.customValue}
                        onChange={e =>
                          setSendDMInputs(prev => ({
                            ...prev,
                            customValue: e.target.value,
                          }))
                        }
                        className="w-24 rounded-md border border-[#E5E7EB] px-2 py-1 text-sm"
                      />
                      <select
                        value={sendDMInputs.customUnit}
                        onChange={e =>
                          setSendDMInputs(prev => ({
                            ...prev,
                            customUnit: e.target.value,
                          }))
                        }
                        className="rounded-md border border-[#E5E7EB] px-2 py-1 text-sm"
                      >
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* INCLUDE EXISTING */}
                <div>
                  <label className="text-xs text-[#596780]">
                    Send to people already in conversation?
                  </label>

                  <div className="mt-1 flex gap-2">
                    {["yes", "no"].map(option => (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          setSendDMInputs(prev => ({
                            ...prev,
                            includeExistingConversations: option,
                          }))
                        }
                        className={`px-3 py-1 rounded-md border text-sm ${
                          sendDMInputs.includeExistingConversations === option
                            ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                            : "border-[#E5E7EB] text-[#596780]"
                        }`}
                      >
                        {option === "yes" ? "Yes" : "No"}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* CONTACT LIST */}
            {sendDMInputs.target === "list" && (
              <div ref={contactListRef} className="relative">
                <label className="text-xs text-[#596780]">
                  Choose contact list
                </label>

                <div className="mt-1 rounded-md border border-[#E5E7EB] overflow-hidden bg-white">
                  {/* Trigger */}
                  <button
                    type="button"
                    onClick={() => setContactListOpen(prev => !prev)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-[#F9FAFB]"
                  >
                    {sendDMInputs.selectedList
                      ? sendDMInputs.selectedList
                      : "Select saved contact list"}
                  </button>

                  {/* Dropdown */}
                  {contactListOpen && (
                    <div className="border-t border-[#E5E7EB] max-h-40 overflow-y-auto">
                      {["List A", "List B", "List C", "List D", "List E"].map(list => (
                        <button
                          key={list}
                          type="button"
                          onClick={() => {
                            setSendDMInputs(prev => ({
                              ...prev,
                              selectedList: list,
                            }));
                            setContactListOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-[#E8F0FE]"
                        >
                          {list}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* MESSAGE MODE */}
            <div>
              <label className="text-xs text-[#596780]">
                Message
              </label>

              <div className="mt-1 flex gap-2">
                {[
                  { id: "template", label: "Choose template" },
                  { id: "new", label: "Write new message" },
                ].map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setSendDMInputs(prev => ({
                        ...prev,
                        messageMode: option.id,
                      }))
                    }
                    className={`px-3 py-1 rounded-md border text-sm ${
                      sendDMInputs.messageMode === option.id
                        ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                        : "border-[#E5E7EB] text-[#596780]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* TEMPLATE DROPDOWN */}
              {sendDMInputs.messageMode === "template" && (
                <div ref={sendDMTemplateRef} className="relative mt-2">
                  <button
                    type="button"
                    onClick={() => setSendDMTemplateOpen(prev => !prev)}
                    className="w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm text-left bg-white hover:bg-[#F9FAFB]"
                  >
                    {sendDMInputs.templateId
                      ? MESSAGE_TEMPLATES.find(
                          t => t.id === sendDMInputs.templateId
                        )?.name
                      : "Select template"}
                  </button>

                  {sendDMTemplateOpen && (
                    <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto rounded-md border border-[#E5E7EB] bg-white">
                      {MESSAGE_TEMPLATES.map(tpl => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => {
                            setSendDMInputs(prev => ({
                              ...prev,
                              templateId: tpl.id,
                            }));
                            setSendDMTemplateOpen(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-[#E8F0FE]"
                        >
                          {tpl.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* NEW MESSAGE */}
              {sendDMInputs.messageMode === "new" && (
                <textarea
                  value={sendDMInputs.messageText}
                  onChange={e =>
                    setSendDMInputs(prev => ({
                      ...prev,
                      messageText: e.target.value,
                    }))
                  }
                  placeholder="Write your message..."
                  className="mt-2 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
                />
              )}
            </div>

            {/* PERSONALIZATION */}
            <div>
              <label className="text-xs text-[#596780]">
                Personalization
              </label>

              <div className="mt-1 flex gap-2">
                {[
                  { id: "none", label: "None" },
                  { id: "first_name", label: "Use first name" },
                ].map(option => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setSendDMInputs(prev => ({
                        ...prev,
                        personalization: option.id,
                      }))
                    }
                    className={`px-3 py-1 rounded-md border text-sm ${
                      sendDMInputs.personalization === option.id
                        ? "bg-[#E8F0FE] border-[#1A73E8] text-[#1A73E8]"
                        : "border-[#E5E7EB] text-[#596780]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* LIMITS */}
            {/* Messages per batch */}
            <div>
              <label className="text-xs text-[#596780]">
                Messages per batch
              </label>
              <input
                type="number"
                placeholder="0"
                value={sendDMInputs.batchSize}
                onChange={e =>
                  setSendDMInputs(prev => ({
                    ...prev,
                    batchSize: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
              />
            </div>
                
            {/* Time between DMs */}    
            <div>
              <label className="text-xs text-[#596780]">
                Time between DMs (minutes)
              </label>
              <input
                type="number"
                placeholder="0 mins"
                value={sendDMInputs.delayBetweenDMs}
                onChange={e =>
                  setSendDMInputs(prev => ({
                    ...prev,
                    delayBetweenDMs: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
              />
            </div>
            
            {/* Max DMs per day */} 
            <div>
              <label className="text-xs text-[#596780]">
                Max DMs per day
              </label>
              <input
                type="number"
                placeholder="0"
                value={sendDMInputs.maxPerDay}
                onChange={e =>
                  setSendDMInputs(prev => ({
                    ...prev,
                    maxPerDay: e.target.value,
                  }))
                }
                className="mt-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
              />
            </div>

          </div>
        )}

        {/* SAVE AS TEMPLATE */}
        <div className="px-4">
          <label className="flex items-center gap-2 text-sm text-[#596780]">
            <input
              type="checkbox"
              checked={saveAsTemplate}
              onChange={e => setSaveAsTemplate(e.target.checked)}
            />
            Save this task as a template
          </label>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 px-4 pt-4">
          <Button
            onClick={handleStartTask}
            disabled={!selectedTaskType}
            className="bg-[#1A73E8] hover:bg-[#1A73E8]/95 text-white"
          >
            Start Task
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setShowCreatePanel(false);
              setSelectedTaskType(null);
              setSaveAsTemplate(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
      </CardContent>
    </Card>
    
      

      {/* Action INSIGHTS */}
      <Card>
        <CardContent className="pt-6 space-y-4">
         <div className="flex flex-col items-start">
            <span className="inline-block rounded-full bg-[#F2F4F7] px-2.5 py-1 text-sm font-semibold text-[#1A202C]">
              Action Insights
            </span>
            <p className="mt-1 font-jakarta text-[13px] text-[#596780]">
              Get suggested actions to take based on your activity
            </p>
          </div>

          <div className="space-y-3">

            {/* Insight 1 — Follow up replies */}
            {aiInsights.some(i => i.key === "insight-1") && (
            <div className="flex items-center justify-between rounded-md border border-[#E5E7EB] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#1A202C]">
                  3 conversations need a follow-up
                </p>
                <p className="mt-1 text-xs text-[#596780]">
                  These leads replied but haven’t received a follow-up in the last 24 hours.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleStartAIInsight("insight-1", "Follow up replies")
                  }
                  className="h-7 rounded-md bg-[#1A73E8] px-3 text-xs font-medium text-white hover:bg-[#1558C0]"
                >
                  Start
                </button>

                <button className="h-7 rounded-md border border-[#D0D5DD] px-3 text-xs font-medium text-[#344054] hover:bg-[#F9FAFB]">
                  Use template
                </button>

                <button
                  onClick={() => handleIgnoreAIInsight("insight-1")}
                  className="h-7 px-2 text-xs font-medium text-[#B42318] hover:underline"
                >
                  Ignore
                </button>
              </div>
            </div>
            )}

            {/* Insight 2 — Engage with ICP posts */}
            {aiInsights.some(i => i.key === "insight-2") && (
            <div className="flex items-center justify-between rounded-md border border-[#E5E7EB] px-4 py-3">
              <div>
                <p className="text-sm font-medium text-[#1A202C]">
                  18 new commenters ready to message
                </p>
                <p className="mt-1 text-xs text-[#596780]">
                  People commented on your recent post but haven’t been contacted yet.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleStartAIInsight("insight-2", "Engage with ICP posts")
                  }
                  className="h-7 rounded-md bg-[#1A73E8] px-3 text-xs font-medium text-white hover:bg-[#1558C0]"
                >
                  Start
                </button>

                <button
                  onClick={() => handleIgnoreAIInsight("insight-2")}
                  className="h-7 px-2 text-xs font-medium text-[#B42318] hover:underline"
                >
                  Ignore
                </button>
              </div>
            </div>
            )}

            {/* Insight 3 — Send DMs to leads */}
            {aiInsights.some(i => i.key === "insight-3") && (
            <div className="flex items-center justify-between rounded-md border border-[#E5E7EB] px-4 py-3">
              <div>
               <p className="text-sm font-medium text-[#1A202C]">
                  12 warm leads ready for outreach
                </p>
                <p className="mt-1 text-xs text-[#596780]">
                  These leads engaged with your content and are likely to respond.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleStartAIInsight("insight-3", "Send DMs to leads")
                  }
                  className="h-7 rounded-md bg-[#1A73E8] px-3 text-xs font-medium text-white hover:bg-[#1558C0]"
                >
                  Start
                </button>

                <button className="h-7 rounded-md border border-[#D0D5DD] px-3 text-xs font-medium text-[#344054] hover:bg-[#F9FAFB]">
                  Use template
                </button>

                <button
                  onClick={() => handleIgnoreAIInsight("insight-3")}
                  className="h-7 px-2 text-xs font-medium text-[#B42318] hover:underline"
                >
                  Ignore
                </button>
              </div>
            </div>
            )}
          </div>
        </CardContent>
      </Card>

     {/* TASK ACTIVITY */}
      <Card ref={taskActivityRef}>
      <CardContent className="pt-6 space-y-4">
        <div className="flex flex-col">
          <h3 className="text-sm font-semibold text-[#1A202C]">
            Task Activity
          </h3>
          <p className="mt-1 font-jakarta text-[13px] text-[#596780]">
            Track and manage all your actions in one place
          </p>
        </div>

        {/* TABS */}
        <div className="flex gap-6 border-b border-[#E5E7EB]">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-2 text-sm font-medium ${
              activeTab === "active"
                ? "text-[#d1560f] border-b-2 border-[#d1560f]"
                : "text-[#d1560f]"
            }`}
          >
            Active ({activeTasks.length})
          </button>

          <button
            onClick={() => setActiveTab("attention")}
            className={`pb-2 text-sm font-medium ${
              activeTab === "attention"
                ? "text-[#B42318] border-b-2 border-[#B42318]"
                : "text-[#B42318]"
            }`}
          >
            Attention needed ({attentionTasks.length})
          </button>

          <button
            onClick={() => setActiveTab("completed")}
            className={`pb-2 text-sm font-medium ${
              activeTab === "completed"
                ? "text-[#027A48] border-b-2 border-[#027A48]"
                : "text-[#027A48]"
            }`}
          >
            Completed ({completedTasks.length})
          </button>
        </div>


        {/* TAB CONTENT */}
        {/* Active */}
        {activeTab === "active" && activeTasks.length > 0 && (
          <div className="max-h-[260px] overflow-y-auto pr-1 space-y-3">
            {activeTasks.map(task => (
            <div key={task.id} className="space-y-2">
              
              {/* TASK ROW */}
              <div
               onClick={(e) => {
                e.stopPropagation();
                setSelectedTaskId(prev =>
                  prev === task.id ? null : task.id
                );
              }}
                className="flex items-center justify-between rounded-md border border-[#F3F5F7] px-4 py-3 cursor-pointer hover:bg-[#F9FAFB]"
              >
                <div>
                  <p className="text-sm font-medium text-[#1A202C]">
                    {task.title}
                  </p>

                  {task.origin === "ai" && (
                    <span className="inline-flex items-center rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-medium text-[#4F46E5]">
                      AI Insight
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={task.status} />

                  {task.status === "pending" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTaskStatus(task.id, "running");
                      }}
                      className="text-xs font-medium text-[#1A73E8] hover:underline"
                    >
                      Start
                    </button>
                  )}

                  {task.status === "running" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateTaskStatus(task.id, "paused");
                      }}
                      className="text-xs font-medium text-[#B42318] hover:underline"
                    >
                      Pause
                    </button>
                  )}
                </div>
              </div>

              {/* INLINE LOG */}
              {selectedTaskId === task.id && task.logs && (
                <div className="ml-4 mr-4 mb-3 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-3 space-y-2">
                  {task.logs.map(log => (
                  <div key={log.id} className="text-sm">
                    <p className="text-[#1A202C]">{log.message}</p>
                    <p className="text-xs text-[#596780] mt-1">
                      {log.timestamp}
                    </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
           </div>
        )}
        {/* Attention */}
        {activeTab === "attention" && attentionTasks.length > 0 && (
          <div className="max-h-[220px] overflow-y-auto pr-1 space-y-3">
            {attentionTasks.map(task => (
            <div key={task.id} className="space-y-2">

              {/* TASK ROW */}
              <div
               onClick={(e) => {
                e.stopPropagation();
                setSelectedTaskId(prev =>
                  prev === task.id ? null : task.id
                );
              }}
                className="flex items-center justify-between rounded-md border border-[#F3F5F7] px-4 py-3 cursor-pointer hover:bg-[#F9FAFB]"
              >
                <div>
                  <p className="text-sm font-medium text-[#1A202C]">
                    {task.title}
                  </p>

                  {task.errorReason && (
                    <p className="mt-1 text-xs text-[#B42318]">
                      {task.errorReason}
                    </p>
                  )}

                  {task.origin === "ai" && (
                    <span className="mt-1 inline-flex items-center rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-medium text-[#4F46E5]">
                      AI Insight
                    </span>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateTaskStatus(task.id, "running");
                  }}
                  className="text-xs font-medium text-[#1A73E8] hover:underline"
                >
                  Retry
                </button>
              </div>

              {/* INLINE LOG */}
              {selectedTaskId === task.id && task.logs && (
                <div className="ml-4 mr-4 mb-3 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-3 space-y-2">
                  {task.logs.map(log => (
                  <div key={log.id} className="text-sm">
                    <p className="text-[#1A202C]">{log.message}</p>
                    <p className="text-xs text-[#596780] mt-1">
                      {log.timestamp}
                    </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))}
           </div>
        )}
        
      
        {/* Completed */}
        {activeTab === "completed" && completedTasks.length > 0 && (
          <div className="max-h-[220px] overflow-y-auto pr-1 space-y-3">
            {completedTasks.map(task => (
              <div key={task.id} className="space-y-2">

                {/* Task Row */}
                <div
                 onClick={(e) => {
                  e.stopPropagation();
                  setSelectedTaskId(prev =>
                    prev === task.id ? null : task.id
                  );
                }}
                  className="flex items-center justify-between rounded-md border border-[#F3F5F7] px-4 py-3 cursor-pointer hover:bg-[#F9FAFB]"
                >
                  <div>
                    <p className="text-sm text-[#1A202C]">
                      {task.title}
                    </p>

                    {task.origin === "ai" && (
                      <span className="inline-flex items-center rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-medium text-[#4F46E5]">
                        AI Insight
                      </span>
                    )}
                  </div>

                  <StatusBadge status={task.status} />
                </div>

                {/* INLINE LOG */}
                {selectedTaskId === task.id && task.logs && (
                  <div className="ml-4 mr-4 mb-3 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] p-3 space-y-2">
                    {task.logs.map(log => (
                      <div key={log.id} className="text-sm">
                        <p className="text-[#1A202C]">{log.message}</p>
                        <p className="text-xs text-[#596780] mt-1">
                          {log.timestamp}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
        </CardContent>
      </Card>
    </div>
    );
}