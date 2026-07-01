"use client";

import { useState, useEffect } from "react";
import { User, Save, Lock, Eye, EyeOff, Check } from "lucide-react";
import PageHeader from "@/components/admin/PageHeader";

type Profile = {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  website: string | null;
  role: string;
  createdAt: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetch("/api/auth/profile")
      .then((r) => r.ok && r.json())
      .then((data) => {
        if (data) {
          setProfile(data);
          setUsername(data.username);
          setBio(data.bio || "");
          setWebsite(data.website || "");
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, bio, website }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setSaving(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordSaved(false);
    setPasswordError("");
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to change password");
      }
      setPasswordSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : "Something went wrong");
    } finally { setPasswordSaving(false); }
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Profile" subtitle="Loading..." />
        <div className="admin-card p-12 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-theme-primary border-t-transparent rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Profile" subtitle={profile?.email || ""} />

      <div className="space-y-6">
        <form onSubmit={handleSaveProfile} className="admin-card p-6 space-y-5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User size={18} /> Profile Information
          </h2>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-4 py-3">{error}</div>
          )}
          {saved && (
            <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg px-4 py-3 flex items-center gap-2">
              <Check size={14} /> Profile updated successfully.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="admin-input" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email</label>
            <input type="email" value={profile?.email || ""} className="admin-input" disabled />
            <p className="text-xs text-zinc-400 mt-1">Email cannot be changed.</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} className="admin-input" placeholder="Tell us about yourself..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Website</label>
            <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="admin-input" placeholder="https://yoursite.com" />
          </div>

          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2"><Save size={16} /> Save Changes</div>
            )}
          </button>
        </form>

        <form onSubmit={handleChangePassword} className="admin-card p-6 space-y-5">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Lock size={18} /> Change Password
          </h2>

          {passwordError && (
            <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg px-4 py-3">{passwordError}</div>
          )}
          {passwordSaved && (
            <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg px-4 py-3 flex items-center gap-2">
              <Check size={14} /> Password changed successfully.
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1.5">Current Password</label>
            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="admin-input" required autoComplete="current-password" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">New Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="admin-input pr-10" required autoComplete="new-password" placeholder="At least 8 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={passwordSaving} className="admin-btn admin-btn-primary">
            {passwordSaving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                Changing...
              </div>
            ) : (
              <div className="flex items-center gap-2"><Lock size={16} /> Change Password</div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
