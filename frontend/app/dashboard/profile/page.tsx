// app/dashboard/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Globe,
  Plus,
  Trash2,
  Loader2,
  Check,
  Pencil,
  X,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";

type Theme = "LIGHT" | "DARK";

type Profile = {
  id?: string;
  bio: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  avatar: string | null;
  resumeUrl: string | null;
  location: string | null;
  emailPublic: boolean;
  showResume: boolean;
  theme: Theme;
};

type SocialPlatform =
  | "GITHUB"
  | "LINKEDIN"
  | "TWITTER"
  | "YOUTUBE"
  | "INSTAGRAM"
  | "PORTFOLIO";

type SocialLink = {
  id: string;
  platform: SocialPlatform;
  url: string;
};

type Technology = { id: string; name: string };
type ProjectTechnologyLink = { technology: Technology };

type Project = {
  id: string;
  title: string;
  description: string;
  githubUrl: string | null;
  liveUrl: string | null;
  imageUrl: string | null;
  featured: boolean;
  technologies: ProjectTechnologyLink[];
};

type ProjectFormState = {
  title: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  imageUrl: string;
  featured: boolean;
  techs: string[];
};

const EMPTY_PROFILE: Profile = {
  bio: "",
  heroTitle: "",
  heroSubtitle: "",
  avatar: "",
  resumeUrl: "",
  location: "",
  emailPublic: false,
  showResume: true,
  theme: "LIGHT",
};

const EMPTY_PROJECT_FORM: ProjectFormState = {
  title: "",
  description: "",
  githubUrl: "",
  liveUrl: "",
  imageUrl: "",
  featured: false,
  techs: [],
};

const PLATFORM_META: Record<
  SocialPlatform,
  { label: string; icon: React.ElementType }
> = {
  GITHUB: { label: "GitHub", icon: FaGithub },
  LINKEDIN: { label: "LinkedIn", icon: FaLinkedin },
  TWITTER: { label: "Twitter / X", icon: FaTwitter },
  YOUTUBE: { label: "YouTube", icon: FaYoutube },
  INSTAGRAM: { label: "Instagram", icon: FaInstagram },
  PORTFOLIO: { label: "Portfolio", icon: Globe },
};

const ALL_PLATFORMS = Object.keys(PLATFORM_META) as SocialPlatform[];

export default function ProfileSettingsPage() {
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [links, setLinks] = useState<SocialLink[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  const [newPlatform, setNewPlatform] = useState<SocialPlatform>("GITHUB");
  const [newUrl, setNewUrl] = useState("");
  const [addingLink, setAddingLink] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [skills, setSkills] = useState<{ id: string; name: string }[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [addingSkill, setAddingSkill] = useState(false);
  const [skillError, setSkillError] = useState<string | null>(null);
  const [deletingSkillId, setDeletingSkillId] = useState<string | null>(null);

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [newCategory, setNewCategory] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectForm, setProjectForm] =
    useState<ProjectFormState>(EMPTY_PROJECT_FORM);
  const [techInput, setTechInput] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [savingProject, setSavingProject] = useState(false);
  const [projectError, setProjectError] = useState<string | null>(null);
  const [deletingProjectId, setDeletingProjectId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    async function load() {
      try {
        const [profileRes, linksRes, skillsRes, projectsRes] =
          await Promise.all([
            fetch("/api/profile", { cache: "no-store" }),
            fetch("/api/social-links", { cache: "no-store" }),
            fetch("/api/skills", { cache: "no-store" }),
            fetch("/api/categories", { cache: "no-store" }),
            fetch("/api/projects", { cache: "no-store" }),
          ]);

        if (
          !profileRes.ok ||
          !linksRes.ok ||
          !skillsRes.ok ||
          !projectsRes.ok
        ) {
          throw new Error("Failed to load profile data");
        }

        const profileData = await profileRes.json();
        const linksData = await linksRes.json();
        const skillsData = await skillsRes.json();
        const projectsData = await projectsRes.json();

        if (profileData) {
          setProfile({ ...EMPTY_PROFILE, ...profileData });
        }
        setLinks(linksData);
        setSkills(skillsData);
        setProjects(projectsData);
      } catch (err) {
        setLoadError(
          "Couldn't load your profile. Please refresh and try again.",
        );
      } finally {
        setLoading(false);
      }
    }

    load();
    function handleFocus() {
      fetch("/api/social-links")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setLinks(data);
        });

      fetch("/api/skills")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setSkills(data);
        });

      fetch("/api/projects")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data) setProjects(data);
        });
    }

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  useEffect(() => {
    const availablePlatforms = ALL_PLATFORMS.filter(
      (p) => !links.some((l) => l.platform === p),
    );

    if (availablePlatforms.length > 0) {
      if (!availablePlatforms.includes(newPlatform)) {
        setNewPlatform(availablePlatforms[0]);
      }
    }
  }, [links]);

  async function handleSaveProfile() {
    setSavingProfile(true);
    setProfileError(null);
    setProfileSaved(false);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to save profile");
      }

      const updated = await res.json();
      setProfile({ ...EMPTY_PROFILE, ...updated });
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      setProfileError(
        err instanceof Error ? err.message : "Failed to save profile",
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleAddLink() {
    if (!newUrl.trim()) {
      setLinkError("URL is required");
      return;
    }

    setAddingLink(true);
    setLinkError(null);

    try {
      const res = await fetch("/api/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform: newPlatform, url: newUrl.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to add link");
      }

      setLinks((prev) => [...prev, data]);
      setNewUrl("");
    } catch (err) {
      setLinkError(err instanceof Error ? err.message : "Failed to add link");
    } finally {
      setAddingLink(false);
    }
  }

  async function handleDeleteLink(id: string) {
    const previous = links;
    setDeletingId(id);
    setLinks((prev) => prev.filter((l) => l.id !== id));

    try {
      const res = await fetch(`/api/social-links/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete link");
    } catch (err) {
      setLinks(previous);
      setLinkError("Failed to delete link. Please try again.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleAddSkill() {
    if (!newSkill.trim()) {
      setSkillError("Skill name is required");
      return;
    }

    setAddingSkill(true);
    setSkillError(null);

    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSkill.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to add skill");
      }

      setSkills((prev) => [...prev, data]);
      setNewSkill("");
    } catch (err) {
      setSkillError(err instanceof Error ? err.message : "Failed to add skill");
    } finally {
      setAddingSkill(false);
    }
  }

  async function handleDeleteSkill(id: string) {
    const previous = skills;
    setDeletingSkillId(id);
    setSkills((prev) => prev.filter((s) => s.id !== id));

    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete skill");
    } catch (err) {
      setSkills(previous);
      setSkillError("Failed to delete skill. Please try again.");
    } finally {
      setDeletingSkillId(null);
    }
  }

  async function handleAddCategory() {
    if (!newCategory.trim()) {
      setCategoryError("Category name is required");
      return;
    }
    setAddingCategory(true);
    setCategoryError(null);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to add category");
      setCategories((prev) => [...prev, data]);
      setNewCategory("");
    } catch (err) {
      setCategoryError(
        err instanceof Error ? err.message : "Failed to add category",
      );
    } finally {
      setAddingCategory(false);
    }
  }

  async function handleDeleteCategory(id: string) {
    const previous = categories;
    setDeletingCategoryId(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
    } catch (err) {
      setCategories(previous);
      setCategoryError("Failed to delete category. Please try again.");
    } finally {
      setDeletingCategoryId(null);
    }
  }

  function startEditCategory(cat: { id: string; name: string }) {
    setEditingCategoryId(cat.id);
    setEditingCategoryName(cat.name);
  }

  async function handleSaveCategoryRename() {
    if (!editingCategoryId || !editingCategoryName.trim()) return;
    const id = editingCategoryId;
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingCategoryName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to rename category");
      setCategories((prev) => prev.map((c) => (c.id === id ? data : c)));
      setEditingCategoryId(null);
    } catch (err) {
      setCategoryError(
        err instanceof Error ? err.message : "Failed to rename category",
      );
    }
  }
  function handleAddTechChip() {
    const name = techInput.trim();
    if (!name) return;

    setProjectForm((f) => {
      const alreadyThere = f.techs.some(
        (t) => t.toLowerCase() === name.toLowerCase(),
      );
      if (alreadyThere) return f;
      return { ...f, techs: [...f.techs, name] };
    });
    setTechInput("");
  }

  function handleRemoveTechChip(name: string) {
    setProjectForm((f) => ({
      ...f,
      techs: f.techs.filter((t) => t !== name),
    }));
  }

  function startEditProject(project: Project) {
    setEditingProjectId(project.id);
    setProjectError(null);
    setProjectForm({
      title: project.title,
      description: project.description,
      githubUrl: project.githubUrl ?? "",
      liveUrl: project.liveUrl ?? "",
      imageUrl: project.imageUrl ?? "",
      featured: project.featured,
      techs: project.technologies.map((pt) => pt.technology.name),
    });
    setTechInput("");
  }

  function cancelEditProject() {
    setEditingProjectId(null);
    setProjectForm(EMPTY_PROJECT_FORM);
    setTechInput("");
    setProjectError(null);
  }

  async function handleSubmitProject() {
    if (!projectForm.title.trim()) {
      setProjectError("Title is required");
      return;
    }
    if (!projectForm.description.trim()) {
      setProjectError("Description is required");
      return;
    }

    setSavingProject(true);
    setProjectError(null);

    const payload = {
      title: projectForm.title.trim(),
      description: projectForm.description.trim(),
      githubUrl: projectForm.githubUrl.trim() || null,
      liveUrl: projectForm.liveUrl.trim() || null,
      imageUrl: projectForm.imageUrl.trim() || null,
      featured: projectForm.featured,
      technologies: projectForm.techs,
    };

    try {
      const res = await fetch(
        editingProjectId
          ? `/api/projects/${editingProjectId}`
          : "/api/projects",
        {
          method: editingProjectId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to save project");
      }

      if (editingProjectId) {
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProjectId ? data : p)),
        );
      } else {
        setProjects((prev) => [data, ...prev]);
      }

      cancelEditProject();
    } catch (err) {
      setProjectError(
        err instanceof Error ? err.message : "Failed to save project",
      );
    } finally {
      setSavingProject(false);
    }
  }

  async function handleDeleteProject(id: string) {
    const previous = projects;
    setDeletingProjectId(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete project");
    } catch (err) {
      setProjects(previous);
      setProjectError("Failed to delete project. Please try again.");
      if (editingProjectId === id) cancelEditProject();
    } finally {
      setDeletingProjectId(null);
    }
  }

  const availablePlatforms = ALL_PLATFORMS.filter(
    (p) => !links.some((l) => l.platform === p),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-cream/30 p-6 md:p-10 flex items-center justify-center">
        <Loader2 className="animate-spin text-sage" size={28} />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-cream/30 p-6 md:p-10 flex items-center justify-center">
        <p className="text-sm text-red-500">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/30 p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-light hover:text-text transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <div className="border-b border-text/5 pb-6 mb-8">
          <h1 className="text-2xl font-extrabold text-text tracking-tight">
            Edit Profile Sections
          </h1>
          <p className="text-sm text-text-light mt-1">
            Update how your public page introduces you, and manage where people
            can find you elsewhere.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-card border border-text/5 bg-white shadow-xl shadow-sage-soft/5 p-6 mb-8">
          <h3 className="font-bold text-text mb-4">Profile</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                Hero Title
              </label>
              <input
                type="text"
                value={profile.heroTitle ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, heroTitle: e.target.value }))
                }
                className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
                placeholder="Hi, I'm Alex"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                Hero Subtitle
              </label>
              <input
                type="text"
                value={profile.heroSubtitle ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, heroSubtitle: e.target.value }))
                }
                className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
                placeholder="Backend engineer & occasional writer"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                Bio
              </label>
              <textarea
                value={profile.bio ?? ""}
                onChange={(e) =>
                  setProfile((p) => ({ ...p, bio: e.target.value }))
                }
                rows={4}
                className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                  Location
                </label>
                <input
                  type="text"
                  value={profile.location ?? ""}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, location: e.target.value }))
                  }
                  className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                  Resume URL
                </label>
                <input
                  type="text"
                  value={profile.resumeUrl ?? ""}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, resumeUrl: e.target.value }))
                  }
                  className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 text-sm text-text">
                <input
                  type="checkbox"
                  checked={profile.emailPublic}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, emailPublic: e.target.checked }))
                  }
                  className="accent-sage"
                />
                Show email publicly
              </label>

              <label className="flex items-center gap-2 text-sm text-text">
                <input
                  type="checkbox"
                  checked={profile.showResume}
                  onChange={(e) =>
                    setProfile((p) => ({ ...p, showResume: e.target.checked }))
                  }
                  className="accent-sage"
                />
                Show resume link
              </label>

              <label className="flex items-center gap-2 text-sm text-text">
                <span>Theme</span>
                <select
                  value={profile.theme}
                  onChange={(e) =>
                    setProfile((p) => ({
                      ...p,
                      theme: e.target.value as Theme,
                    }))
                  }
                  className="rounded-button border border-text/10 px-2 py-1 text-sm"
                >
                  <option value="LIGHT">Light</option>
                  <option value="DARK">Dark</option>
                </select>
              </label>
            </div>

            {profileError && (
              <p className="text-sm text-red-500">{profileError}</p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="inline-flex items-center justify-center gap-2 rounded-button bg-sage px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition-all duration-200 hover:bg-sage-light hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {savingProfile && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                Save Profile
              </button>

              {profileSaved && (
                <span className="inline-flex items-center gap-1 text-sm text-sage font-medium">
                  <Check size={16} /> Saved
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Social Links Card */}
        <div className="rounded-card border border-text/5 bg-white shadow-xl shadow-sage-soft/5 overflow-hidden">
          <div className="px-6 py-5 border-b border-text/5">
            <h3 className="font-bold text-text">Social Links</h3>
          </div>

          <div className="divide-y divide-text/5">
            {links.length === 0 && (
              <p className="px-6 py-6 text-sm text-text-light/60">
                No social links yet. Add one below.
              </p>
            )}

            {links.map((link) => {
              const Icon = PLATFORM_META[link.platform].icon;
              return (
                <div
                  key={link.id}
                  className="p-4 px-6 flex items-center justify-between hover:bg-cream/10 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-sage-soft/40 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-text" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text">
                        {PLATFORM_META[link.platform].label}
                      </p>
                      <p className="text-xs text-text-light/60 truncate">
                        {link.url}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    disabled={deletingId === link.id}
                    className="p-2 rounded-button text-text-light/50 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    aria-label="Remove link"
                  >
                    {deletingId === link.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add link form */}
          <div className="p-6 border-t border-text/5 bg-cream/10">
            {availablePlatforms.length === 0 ? (
              <p className="text-sm text-text-light/60">
                All platforms have a link. Remove one to add a different
                platform.
              </p>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={newPlatform}
                  onChange={(e) =>
                    setNewPlatform(e.target.value as SocialPlatform)
                  }
                  className="rounded-button border border-text/10 px-3 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
                >
                  {availablePlatforms.map((p) => (
                    <option key={p} value={p}>
                      {PLATFORM_META[p].label}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
                />

                <button
                  onClick={handleAddLink}
                  disabled={addingLink}
                  className="inline-flex items-center justify-center gap-2 rounded-button bg-sage px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition-all duration-200 hover:bg-sage-light hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {addingLink ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Plus size={16} />
                  )}
                  Add
                </button>
              </div>
            )}

            {linkError && (
              <p className="text-sm text-red-500 mt-3">{linkError}</p>
            )}
          </div>
        </div>

        {/* Skills Card */}
        <div className="rounded-card border border-text/5 bg-white shadow-xl shadow-sage-soft/5 p-6 mt-8">
          <h3 className="font-bold text-text mb-4">Skills</h3>

          <div className="flex flex-wrap gap-2 mb-4">
            {skills.length === 0 && (
              <p className="text-sm text-text-light/60">No skills added yet.</p>
            )}

            {skills.map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-2 rounded-full bg-sage-soft/40 px-3 py-1.5 text-xs font-semibold text-text"
              >
                {skill.name}
                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  disabled={deletingSkillId === skill.id}
                  className="text-text-light/50 hover:text-red-500 transition-colors disabled:opacity-50"
                  aria-label={`Remove ${skill.name}`}
                >
                  {deletingSkillId === skill.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    "×"
                  )}
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              placeholder="e.g. TypeScript"
              className="flex-1 rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
            />
            <button
              onClick={handleAddSkill}
              disabled={addingSkill}
              className="inline-flex items-center justify-center gap-2 rounded-button bg-sage px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition-all duration-200 hover:bg-sage-light hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {addingSkill ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Add
            </button>
          </div>

          {skillError && (
            <p className="text-sm text-red-500 mt-3">{skillError}</p>
          )}
        </div>

        {/* Categories Card */}
        <div className="rounded-card border border-text/5 bg-white shadow-xl shadow-sage-soft/5 p-6 mt-8">
          <h3 className="font-bold text-text mb-4">Blog Categories</h3>

          <div className="space-y-2 mb-4">
            {categories.length === 0 && (
              <p className="text-sm text-text-light/60">No categories yet.</p>
            )}
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between rounded-button border border-text/5 px-4 py-2.5"
              >
                {editingCategoryId === cat.id ? (
                  <input
                    autoFocus
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveCategoryRename();
                      if (e.key === "Escape") setEditingCategoryId(null);
                    }}
                    onBlur={handleSaveCategoryRename}
                    className="flex-1 text-sm text-text border-b border-sage/40 focus:outline-none"
                  />
                ) : (
                  <span
                    onClick={() => startEditCategory(cat)}
                    className="text-sm text-text cursor-pointer"
                  >
                    {cat.name}
                  </span>
                )}
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  disabled={deletingCategoryId === cat.id}
                  className="p-1.5 rounded-button text-text-light/50 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {deletingCategoryId === cat.id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
              placeholder="e.g. Engineering"
              className="flex-1 rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
            />
            <button
              onClick={handleAddCategory}
              disabled={addingCategory}
              className="inline-flex items-center justify-center gap-2 rounded-button bg-sage px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition-all duration-200 hover:bg-sage-light disabled:opacity-60"
            >
              {addingCategory ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Plus size={16} />
              )}
              Add
            </button>
          </div>

          {categoryError && (
            <p className="text-sm text-red-500 mt-3">{categoryError}</p>
          )}
        </div>
        {/* Projects Card */}
        <div className="rounded-card border border-text/5 bg-white shadow-xl shadow-sage-soft/5 overflow-hidden mt-8">
          <div className="px-6 py-5 border-b border-text/5">
            <h3 className="font-bold text-text">Projects</h3>
          </div>

          <div className="divide-y divide-text/5">
            {projects.length === 0 && (
              <p className="px-6 py-6 text-sm text-text-light/60">
                No projects yet. Add one below.
              </p>
            )}

            {projects.map((project) => (
              <div
                key={project.id}
                className="p-6 hover:bg-cream/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-text">
                        {project.title}
                      </p>
                      {project.featured && (
                        <span className="rounded-full bg-sage/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sage">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-light/70 mt-1 line-clamp-2">
                      {project.description}
                    </p>

                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {project.technologies.map((pt) => (
                          <span
                            key={pt.technology.id}
                            className="rounded-full bg-sage-soft/40 px-2 py-0.5 text-[11px] font-medium text-text"
                          >
                            {pt.technology.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-2">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-text-light/60 hover:text-text transition-colors"
                        >
                          <FaGithub size={12} /> Code
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-text-light/60 hover:text-text transition-colors"
                        >
                          <ExternalLink size={12} /> Live
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEditProject(project)}
                      className="p-2 rounded-button text-text-light/50 hover:text-text hover:bg-cream/40 transition-colors"
                      aria-label="Edit project"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      disabled={deletingProjectId === project.id}
                      className="p-2 rounded-button text-text-light/50 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                      aria-label="Delete project"
                    >
                      {deletingProjectId === project.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add / Edit project form */}
          <div className="p-6 border-t border-text/5 bg-cream/10 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-text">
                {editingProjectId ? "Edit Project" : "Add a Project"}
              </h4>
              {editingProjectId && (
                <button
                  onClick={cancelEditProject}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-text-light/60 hover:text-text transition-colors"
                >
                  <X size={14} /> Cancel
                </button>
              )}
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                Title
              </label>
              <input
                type="text"
                value={projectForm.title}
                onChange={(e) =>
                  setProjectForm((f) => ({ ...f, title: e.target.value }))
                }
                className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
                placeholder="Portfolio Site"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                Description
              </label>
              <textarea
                value={projectForm.description}
                onChange={(e) =>
                  setProjectForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
                placeholder="Brief summary of your project..."
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                  GitHub URL
                </label>
                <input
                  type="text"
                  value={projectForm.githubUrl}
                  onChange={(e) =>
                    setProjectForm((f) => ({ ...f, githubUrl: e.target.value }))
                  }
                  className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
                  placeholder="https://github.com/..."
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                  Live Demo URL
                </label>
                <input
                  type="text"
                  value={projectForm.liveUrl}
                  onChange={(e) =>
                    setProjectForm((f) => ({ ...f, liveUrl: e.target.value }))
                  }
                  className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                Image URL
              </label>
              <input
                type="text"
                value={projectForm.imageUrl}
                onChange={(e) =>
                  setProjectForm((f) => ({ ...f, imageUrl: e.target.value }))
                }
                className="mt-1 w-full rounded-button border border-text/10 px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-text-light/60">
                Technologies
              </label>
              <div className="flex flex-wrap gap-1.5 my-2">
                {projectForm.techs.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 rounded-full bg-sage-soft/40 px-2.5 py-1 text-xs font-semibold text-text"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechChip(tech)}
                      className="text-text-light/50 hover:text-red-500 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTechChip();
                    }
                  }}
                  placeholder="e.g. Next.js"
                  className="flex-1 rounded-button border border-text/10 px-3 py-1.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-sage/40"
                />
                <button
                  type="button"
                  onClick={handleAddTechChip}
                  className="rounded-button border border-text/10 bg-white px-3 py-1.5 text-xs font-bold text-text hover:bg-cream/20 transition-colors"
                >
                  Add Tech
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-text pt-1">
              <input
                type="checkbox"
                checked={projectForm.featured}
                onChange={(e) =>
                  setProjectForm((f) => ({ ...f, featured: e.target.checked }))
                }
                className="accent-sage"
              />
              Mark as Featured Project
            </label>

            {projectError && (
              <p className="text-sm text-red-500">{projectError}</p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleSubmitProject}
                disabled={savingProject}
                className="inline-flex items-center justify-center gap-2 rounded-button bg-sage px-5 py-2.5 text-sm font-semibold text-cream shadow-sm transition-all duration-200 hover:bg-sage-light hover:shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {savingProject ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Plus size={16} />
                )}
                {editingProjectId ? "Update Project" : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
