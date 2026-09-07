"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Camera, Trash2, User } from "lucide-react";
import { Controller } from "react-hook-form";
import { 
  useGetProfileQuery, 
  useUpdateProfileImageMutation, 
  useDeleteProfileImageMutation 
} from "../hooks/use-profile-api";
import { useProfileForm } from "../hooks/use-profile-form";
import { Button } from "@/shared/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/shared/ui/field";
import { useSpecialties } from "@/features/auth/register/hooks/use-specialties";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export default function ProfilePage() {
  const t = useTranslations("Profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading, isError } = useGetProfileQuery();
  const updateImageMutation = useUpdateProfileImageMutation();
  const deleteImageMutation = useDeleteProfileImageMutation();

  const { form, onSubmit, isSubmitting } = useProfileForm();
  const { errors } = form.formState;

  const { data: specialties, isLoading: isLoadingSpecialties } = useSpecialties();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateImageMutation.mutate(file);
    }
  };

  const handleDeleteImage = () => {
    deleteImageMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blueNormal"></div>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="p-8 text-center text-red-500 font-cairo-medium-lg">
        {t("error", { defaultValue: "Failed to load profile details." })}
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-8 sm:p-10">
        <h2 className="lg:font-cairo-bold-3xl font-cairo-bold-lg text-greyDarker mb-8 border-b pb-4">
          {t("title", { defaultValue: "My Profile" })}
        </h2>

        {/* Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-10">
          <div className="relative group">
            <div className="size-32 rounded-full border border-black/10 overflow-hidden bg-gray-50 flex items-center justify-center">
              {profile.profileImageUrl ? (
                <img
                  src={profile.profileImageUrl}
                  alt="Profile Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="size-12 text-gray-400" />
              )}
              
              <div 
                className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={handleImageClick}
              >
                <Camera className="size-6 text-white mb-1" />
                <span className="text-white text-xs font-cairo-medium-sm">
                  {t("uploadImage", { defaultValue: "Upload" })}
                </span>
              </div>
            </div>

            {profile.profileImageUrl && (
              <button
                type="button"
                onClick={handleDeleteImage}
                disabled={deleteImageMutation.isPending}
                className="absolute bottom-0 right-0 p-2 bg-white text-red-500 rounded-full shadow-md border border-black/5 hover:bg-red-50 transition-colors disabled:opacity-50"
                title={t("deleteImage", { defaultValue: "Delete" })}
              >
                <Trash2 className="size-4" />
              </button>
            )}
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleImageChange}
            />
          </div>

          <div className="text-center sm:text-start">
            <h3 className="font-cairo-bold-xl text-greyDarker">
              {profile.firstName} {profile.lastName}
            </h3>
            <p className="text-greyNormal font-cairo-medium-sm">{profile.email}</p>
            <div className="mt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
              {profile.roles?.map((role) => (
                <span key={role} className="bg-blueNormal/10 text-blueNormal px-3 py-1 rounded-md text-xs font-cairo-bold-sm">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={onSubmit} noValidate>
          <FieldGroup>
            {errors.root && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-center mb-4 flex flex-col items-center gap-2">
                <FieldError className="font-cairo-medium-sm">
                  {errors.root.message}
                </FieldError>
              </div>
            )}
            


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <Controller
                name="firstName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                      {t("firstName", { defaultValue: "First Name" })}
                      <span className="text-red-500 ms-1">*</span>
                    </FieldLabel>
                    <input
                      {...field}
                      value={field.value ?? ""}
                      type="text"
                      aria-invalid={!!fieldState.error}
                      className={`
                        w-full h-12 px-4 rounded-lg border bg-white
                        font-cairo-regular-base text-greyDarker
                        placeholder:text-greyLightActive
                        outline-none transition-colors duration-200
                        ${fieldState.error
                          ? "border-red-400 focus:border-red-500"
                          : "border-greyLightActive focus:border-orangeNormal"
                        }
                      `}
                    />
                    {fieldState.error && (
                      <FieldError>
                        {t(`errors.${fieldState.error.message || "unknown"}`, { defaultValue: fieldState.error.message || "" })}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Last Name */}
              <Controller
                name="lastName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                      {t("lastName", { defaultValue: "Last Name" })}
                      <span className="text-red-500 ms-1">*</span>
                    </FieldLabel>
                    <input
                      {...field}
                      value={field.value ?? ""}
                      type="text"
                      aria-invalid={!!fieldState.error}
                      className={`
                        w-full h-12 px-4 rounded-lg border bg-white
                        font-cairo-regular-base text-greyDarker
                        placeholder:text-greyLightActive
                        outline-none transition-colors duration-200
                        ${fieldState.error
                          ? "border-red-400 focus:border-red-500"
                          : "border-greyLightActive focus:border-orangeNormal"
                        }
                      `}
                    />
                    {fieldState.error && (
                      <FieldError>
                        {t(`errors.${fieldState.error.message || "unknown"}`, { defaultValue: fieldState.error.message || "" })}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Country Code */}
              <Controller
                name="countryCode"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                      {t("countryCode", { defaultValue: "Country Code" })}
                      <span className="text-red-500 ms-1">*</span>
                    </FieldLabel>
                    <input
                      {...field}
                      value={field.value ?? ""}
                      type="text"
                      aria-invalid={!!fieldState.error}
                      className={`
                        w-full h-12 px-4 rounded-lg border bg-white
                        font-cairo-regular-base text-greyDarker
                        placeholder:text-greyLightActive
                        outline-none transition-colors duration-200
                        ${fieldState.error
                          ? "border-red-400 focus:border-red-500"
                          : "border-greyLightActive focus:border-orangeNormal"
                        }
                      `}
                    />
                    {fieldState.error && (
                      <FieldError>
                        {t(`errors.${fieldState.error.message || "unknown"}`, { defaultValue: fieldState.error.message || "" })}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Phone Number */}
              <Controller
                name="phoneNumber"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                      {t("phoneNumber", { defaultValue: "Phone Number" })}
                      <span className="text-red-500 ms-1">*</span>
                    </FieldLabel>
                    <input
                      {...field}
                      value={field.value ?? ""}
                      type="text"
                      aria-invalid={!!fieldState.error}
                      className={`
                        w-full h-12 px-4 rounded-lg border bg-white
                        font-cairo-regular-base text-greyDarker
                        placeholder:text-greyLightActive
                        outline-none transition-colors duration-200
                        ${fieldState.error
                          ? "border-red-400 focus:border-red-500"
                          : "border-greyLightActive focus:border-orangeNormal"
                        }
                      `}
                    />
                    {fieldState.error && (
                      <FieldError>
                        {t(`errors.${fieldState.error.message || "unknown"}`, { defaultValue: fieldState.error.message || "" })}
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              {/* Specialty ID */}
              <Controller
                name="specialtyId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel className="font-cairo-semibold-base text-greyDarker">
                      {t("specialty", { defaultValue: "Specialty" })}
                    </FieldLabel>
                    <Select value={field.value || undefined} onValueChange={field.onChange}>
                      <SelectTrigger
                        aria-invalid={!!fieldState.error}
                        className={`
                          w-full h-12 px-4 rounded-lg border bg-white
                          font-cairo-regular-base text-greyDarker
                          outline-none transition-colors duration-200
                          ${fieldState.error
                            ? "border-red-400 focus:border-red-500"
                            : "border-greyLightActive focus:border-orangeNormal"
                          }
                        `}
                      >
                        <SelectValue placeholder={t("specialtyPlaceholder", { defaultValue: "Select Specialty" })}>
                          {field.value ? (specialties?.find((s) => s.id === field.value)?.name || profile?.specialtyName) : undefined}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingSpecialties ? (
                          <SelectItem value="loading" disabled>
                            {t("loading", { defaultValue: "Loading..." })}
                          </SelectItem>
                        ) : (
                          specialties?.map((specialty) => (
                            <SelectItem key={specialty.id} value={specialty.id}>
                              {specialty.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {fieldState.error && (
                      <FieldError>
                        {t(`errors.${fieldState.error.message || "unknown"}`, { defaultValue: fieldState.error.message || "" })}
                      </FieldError>
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="flex justify-end mt-8 border-t pt-6">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                className="w-full sm:w-auto px-10 h-12 font-cairo-bold-lg text-white rounded-lg cursor-pointer"
              >
                {t("saveChanges", { defaultValue: "Save Changes" })}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </div>
    </div>
  );
}
