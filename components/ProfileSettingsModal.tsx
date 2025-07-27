"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileSettingsModal = ({ isOpen, onClose }: ProfileSettingsModalProps) => {
  const [currentUsername, setCurrentUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (isOpen) {
      if (session?.user?.name) {
        setCurrentUsername(session.user.name);
      } else {
        setCurrentUsername("N/A");
      }
    }
  }, [isOpen, session]);

  const handleProfileUpdate = async () => {
    setMessage("");
    setIsLoading(true);

    const formData = new FormData();

    // Append password change data if fields are filled
    if (oldPassword || newPassword || confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        setMessage("New passwords do not match.");
        setIsLoading(false);
        return;
      }
      if (!oldPassword) {
          setMessage("Please enter your old password to change it.");
          setIsLoading(false);
          return;
      }
      // Add more validation for password strength if needed
      formData.append('oldPassword', oldPassword);
      formData.append('newPassword', newPassword);
    }

    // Append profile image file if selected
    if (profileImageFile) {
      formData.append('profileImage', profileImageFile);
    }

    // If no password fields filled and no image selected, do nothing
    if (!oldPassword && !newPassword && !confirmNewPassword && !profileImageFile) {
        setMessage("No changes to save.");
        setIsLoading(false);
        return;
    }

    // Call API to update profile (password and/or image)
    // Replace with your actual API endpoint
    // try {
    //   const response = await fetch("/api/profile/update", {
    //     method: "POST",
    //     body: formData, // Use formData for file uploads
    //   });
    //   const data = await response.json();
    //   if (data.success) {
    //     setMessage("Profile updated successfully!");
    //     // Clear form fields if successful
    //     setOldPassword("");
    //     setNewPassword("");
    //     setConfirmNewPassword("");
    //     setProfileImageFile(null); // Clear selected file
    //     // Optionally refresh session or close modal
    //     // onClose();
    //   } else {
    //     setMessage(data.message || "Failed to update profile.");
    //   }
    // } catch (error: any) {
    //   console.error("Profile update error:", error);
    //   setMessage("An error occurred during profile update.");
    // } finally {
    //   setIsLoading(false);
    // }

    // Placeholder for demonstration
    setTimeout(() => {
      setIsLoading(false);
      setMessage("Profile update logic not yet implemented. Data to be sent:");
      for (let pair of formData.entries()) {
          console.log(pair[0]+ ', ' + pair[1]);
      }
    }, 1000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfileImageFile(event.target.files[0]);
      // Optionally add file type/size validation here
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
          <DialogDescription>
            View your profile and change your password.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" value={currentUsername} readOnly className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="profile-image" className="text-right">
              Profile Image
            </Label>
            <Input id="profile-image" type="file" onChange={handleFileChange} className="col-span-3" accept="image/*" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="old-password" className="text-right">
              Old Password
            </Label>
            <Input id="old-password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-password" className="text-right">
              New Password
            </Label>
            <Input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm-password" className="text-right">
              Confirm Password
            </Label>
            <Input id="confirm-password" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="col-span-3" />
          </div>
        </div>
        {message && <p className="text-center text-sm text-red-500">{message}</p>}
        <Button onClick={handleProfileUpdate} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogContent>
    </Dialog>
  )
} 