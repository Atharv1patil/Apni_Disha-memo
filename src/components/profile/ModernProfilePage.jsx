// src/components/profile/ModernProfilePage.jsx

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Globe,
  Medal,
  Dumbbell,
  Pencil,
  BookOpen,
  TrendingUp,
  Bookmark,
  Flame,
  Puzzle,
  Award,
  MessageSquare,
  Trophy,
  Sparkles,
  User,
  X,
  Camera,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// ⭐ Clerk imports
import { useUser, useClerk } from "@clerk/clerk-react";

const fallbackUser = {
  summary:
    "Enthusiastic learner exploring coding, quizzes, and new challenges.",
  tags: ["Learning", "Coding"],
  beyondAcademics: {
    hobbies: ["Reading", "Music"],
    extracurriculars: ["Community Group"],
    certifications: ["Cybersecurity Basics"],
    sports: ["Badminton"],
  },
  metrics: [
    {
      label: "Quizzes",
      value: 22,
      icon: BookOpen,
      color: "from-sky-400 to-blue-500",
    },
    {
      label: "Avg Score",
      value: "86%",
      icon: TrendingUp,
      color: "from-emerald-400 to-green-500",
    },
    {
      label: "Bookmarks",
      value: 15,
      icon: Bookmark,
      color: "from-fuchsia-400 to-purple-500",
    },
    {
      label: "Streak",
      value: "11d",
      icon: Flame,
      color: "from-amber-400 to-orange-500",
    },
  ],
};

// Sample feed data
const feed = [
  {
    id: 1,
    icon: Puzzle,
    title: "Solved 10 new DSA problems",
    time: "2h ago",
    note: "Focus: stacks, queues, sliding window",
  },
  {
    id: 2,
    icon: Award,
    title: "Ranked top 5% in Logic Quiz",
    time: "1d ago",
    note: "Score 92% • 30 questions",
  },
  {
    id: 3,
    icon: MessageSquare,
    title: "Posted a guide on Git basics",
    time: "3d ago",
    note: "Got 24 upvotes from peers",
  },
];

export default function ModernProfilePage() {
  const { user: clerkUser } = useUser();
  const { client } = useClerk();

  const mappedUser = {
    name: clerkUser?.fullName || "Unnamed User",
    email: clerkUser?.primaryEmailAddress?.emailAddress || "",
    avatar: clerkUser?.imageUrl || "",
    location: clerkUser?.unsafeMetadata?.location || "Not set",
    summary: clerkUser?.unsafeMetadata?.summary || fallbackUser.summary,
    tags: clerkUser?.unsafeMetadata?.tags || fallbackUser.tags,
    beyondAcademics:
      clerkUser?.unsafeMetadata?.beyondAcademics ||
      fallbackUser.beyondAcademics,
    metrics: fallbackUser.metrics,
  };

  const [userState, setUserState] = useState(mappedUser);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(mappedUser);
  const [showAll, setShowAll] = useState(false);

  const [showMore, setShowMore] = useState({
    hobbies: false,
    extracurriculars: false,
    certifications: false,
    sports: false,
  });

  useEffect(() => {
    setUserState(mappedUser);
    setForm(mappedUser);
  }, [clerkUser]);

  const toggleShow = (section) => {
    setShowMore((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const cleanTags =
      typeof form.tags === "string"
        ? form.tags.split(",").map((t) => t.trim())
        : form.tags;

    const cleanBeyond = {};
    for (let key in form.beyondAcademics) {
      const val = form.beyondAcademics[key];
      cleanBeyond[key] =
        typeof val === "string"
          ? val.split("\n").map((s) => s.trim()).filter(Boolean)
          : val;
    }

    // ⭐ Save to Clerk unsafeMetadata
    await clerkUser.update({
      unsafeMetadata: {
        location: form.location,
        summary: form.summary,
        tags: cleanTags,
        beyondAcademics: cleanBeyond,
      },
    });

    setUserState({
      ...form,
      tags: cleanTags,
      beyondAcademics: cleanBeyond,
    });

    setEditing(false);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ---------------- UI ------------------

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">

      {/* HEADER */}
      <section className="bg-gradient-to-r from-[#DEF6CA] via-[#F8BDC4] to-[#F65BE3] text-gray-800 shadow-md rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
              {userState.avatar ? (
                <img
                  src={userState.avatar}
                  alt={userState.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-pink-600 mx-auto mt-6" />
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold">{userState.name}</h1>
              <p className="text-sm text-gray-700 mt-1">
                {userState.email} • {userState.location}
              </p>
              <p className="mt-2 text-gray-700">{userState.summary}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                {userState.tags.map((t, i) => (
                  <Badge
                    key={i}
                    className="bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-full text-xs px-3 py-1"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={() => setEditing(true)}
            className="bg-white text-pink-600 hover:bg-pink-50 shadow px-5 py-2 rounded-xl"
          >
            Edit Profile
          </Button>
        </div>
      </section>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {userState.metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <Card key={i} className="shadow-md rounded-2xl">
                <CardContent className="p-6 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{m.value}</div>
                    <p className="text-sm text-gray-500">{m.label}</p>
                  </div>
                  <div
                    className={`p-3 rounded-xl text-white bg-gradient-to-r ${m.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ACTIVITY + ACHIEVEMENTS */}
        <div className="grid lg:grid-cols-3 gap-6 mt-10">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(showAll ? feed : feed.slice(0, 2)).map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.id}
                    className="flex items-start gap-3 p-4 rounded-xl border hover:bg-gray-50"
                  >
                    <div className="h-10 w-10 rounded-full bg-pink-50 grid place-items-center">
                      <Icon className="h-5 w-5 text-pink-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{f.title}</div>
                      <div className="text-sm text-gray-600">{f.note}</div>
                    </div>
                    <span className="text-xs text-gray-500">{f.time}</span>
                  </div>
                );
              })}

              {feed.length > 2 && (
                <Button
                  variant="outline"
                  onClick={() => setShowAll((s) => !s)}
                  className="w-full rounded-xl"
                >
                  {showAll ? "Show Less" : "Show More"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[ 
                {
                  icon: Trophy,
                  title: "Quiz Master",
                  desc: "5 scores above 90%",
                  points: 100,
                },
                {
                  icon: Sparkles,
                  title: "Consistency",
                  desc: "10-day learning streak",
                  points: 60,
                },
                {
                  icon: Award,
                  title: "Community Helper",
                  desc: "Helped 10 peers",
                  points: 40,
                },
              ].map((a, i) => {
                const Icon = a.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 rounded-xl border hover:bg-gray-50"
                  >
                    <div className="h-12 w-12 rounded-full bg-yellow-100 grid place-items-center">
                      <Icon className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{a.title}</div>
                      <div className="text-sm text-gray-600">{a.desc}</div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      +{a.points}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* BEYOND ACADEMICS */}
        <div className="mt-10">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="text-xl">Beyond Academics</CardTitle>
              <p className="text-sm text-gray-500">
                Your hobbies, extracurriculars & certifications.
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.keys(userState.beyondAcademics).map((key, idx) => {
                  const items = userState.beyondAcademics[key] || [];
                  const isExpanded = showMore[key];
                  const itemsToShow = isExpanded ? items : items.slice(0, 3);

                  const iconMap = {
                    hobbies: Heart,
                    extracurriculars: Globe,
                    certifications: Medal,
                    sports: Dumbbell,
                  };
                  const colorMap = {
                    hobbies: "from-pink-400 to-rose-500",
                    extracurriculars: "from-indigo-400 to-purple-500",
                    certifications: "from-emerald-400 to-green-500",
                    sports: "from-amber-400 to-orange-500",
                  };

                  const Icon = iconMap[key];

                  return (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl shadow bg-white hover:shadow-lg transition flex flex-col"
                    >
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorMap[key]} text-white grid place-items-center`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold capitalize">
                        {key}
                      </h3>

                      <ul className="mt-3 space-y-2 list-disc list-inside flex-1 text-sm text-gray-700">
                        {items.length > 0 ? (
                          itemsToShow.map((item, i) => <li key={i}>{item}</li>)
                        ) : (
                          <li className="italic text-gray-400 list-none">
                            No {key} added
                          </li>
                        )}
                      </ul>

                      {items.length > 3 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 text-blue-600 hover:text-blue-800"
                          onClick={() => toggleShow(key)}
                        >
                          {isExpanded ? "Show Less" : "Show More"}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl overflow-hidden">
            <div className="bg-pink-500 text-white px-6 py-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Edit Profile</h2>
              <button onClick={() => setEditing(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* Avatar */}
              <div className="flex justify-center">
                <label className="relative cursor-pointer">
                  <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-pink-300 shadow">
                    {form.avatar ? (
                      <img
                        src={form.avatar}
                        alt="avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-pink-500 m-auto mt-6" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-pink-600 text-white p-2 rounded-full shadow">
                    <Camera className="h-4 w-4" />
                  </div>
                </label>
              </div>

              {/* Name + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label>Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-1 px-3 py-2 w-full border rounded-lg"
                  />
                </div>

                <div>
                  <label>Email</label>
                  <input
                    name="email"
                    value={form.email}
                    disabled
                    className="mt-1 px-3 py-2 w-full border rounded-lg bg-gray-100"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label>Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  className="mt-1 px-3 py-2 w-full border rounded-lg"
                />
              </div>

              {/* Summary */}
              <div>
                <label>Summary</label>
                <textarea
                  name="summary"
                  value={form.summary}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1 px-3 py-2 w-full border rounded-lg"
                />
              </div>

              {/* Tags */}
              <div>
                <label>Tags (comma separated)</label>
                <input
                  name="tags"
                  value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags}
                  onChange={handleChange}
                  className="mt-1 px-3 py-2 w-full border rounded-lg"
                />
              </div>

              {/* Beyond Academics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(form.beyondAcademics).map((key) => (
                  <div key={key}>
                    <label className="capitalize">{key}</label>
                    <textarea
                      rows={3}
                      value={(form.beyondAcademics[key] || []).join("\n")}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          beyondAcademics: {
                            ...prev.beyondAcademics,
                            [key]: e.target.value.split("\n"),
                          },
                        }))
                      }
                      className="mt-1 px-3 py-2 w-full border rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button className="bg-pink-600 text-white" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
