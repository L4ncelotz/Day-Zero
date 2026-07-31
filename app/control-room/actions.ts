"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { verifyAdminPassword } from "@/lib/auth/password";
import { createAdminSession, destroyAdminSession, requireAdminSession } from "@/lib/auth/session";
import { headers } from "next/headers";
import { checkLoginRateLimit, recordFailedLogin, resetFailedLogin } from "@/lib/auth/rate-limit";
import { getSchedule, saveSchedule } from "@/lib/schedule/repository";
import { validateOverrideInput } from "@/lib/countdown/validation";
import { ScheduleOverride, Milestone } from "@/lib/countdown/types";

export async function loginAction(prevState: any, formData: FormData) {
  const password = formData.get("password") as string;
  if (!password) {
    return { error: "กรุณากรอกรหัสผ่าน" };
  }

  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || "global";

  const rateLimit = await checkLoginRateLimit(ip);
  if (!rateLimit.allowed) {
    return { error: "พยายามเข้าสู่ระบบมากเกินไป กรุณาลองใหม่ในภายหลัง" };
  }

  const isValid = await verifyAdminPassword(password);
  if (!isValid) {
    await recordFailedLogin(ip);
    return { error: "รหัสผ่านไม่ถูกต้อง" };
  }

  await resetFailedLogin(ip);
  await createAdminSession();
  redirect("/control-room");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/control-room");
}

export async function addOverrideAction(overrideData: Omit<ScheduleOverride, "id">) {
  await requireAdminSession();

  const { data: scheduleData, usingFallback } = await getSchedule();

  if (usingFallback) {
    return {
      success: false,
      error: "ระบบทำงานในโหมด Fallback (ไม่ได้เชื่อมต่อ Upstash Redis) ไม่อนุญาตให้แก้ไขข้อมูล",
    };
  }

  const validation = validateOverrideInput(overrideData, scheduleData);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const newOverride: ScheduleOverride = {
    ...overrideData,
    id: `ovr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
  };

  const updatedSchedule = {
    ...scheduleData,
    overrides: [...scheduleData.overrides, newOverride],
  };

  const saveRes = await saveSchedule(updatedSchedule);
  if (!saveRes.success) {
    return { success: false, error: saveRes.error || "บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง" };
  }

  revalidatePath("/");
  revalidatePath("/control-room");
  revalidateTag("internship-schedule");
  return { success: true };
}

export async function editOverrideAction(override: ScheduleOverride) {
  await requireAdminSession();

  const { data: scheduleData, usingFallback } = await getSchedule();

  if (usingFallback) {
    return {
      success: false,
      error: "ระบบทำงานในโหมด Fallback (ไม่ได้เชื่อมต่อ Upstash Redis) ไม่อนุญาตให้แก้ไขข้อมูล",
    };
  }

  const validation = validateOverrideInput(override, scheduleData);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const updatedOverrides = scheduleData.overrides.map((item) =>
    item.id === override.id ? override : item
  );

  const updatedSchedule = {
    ...scheduleData,
    overrides: updatedOverrides,
  };

  const saveRes = await saveSchedule(updatedSchedule);
  if (!saveRes.success) {
    return { success: false, error: saveRes.error || "บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง" };
  }

  revalidatePath("/");
  revalidatePath("/control-room");
  revalidateTag("internship-schedule");
  return { success: true };
}

export async function deleteOverrideAction(id: string) {
  await requireAdminSession();

  const { data: scheduleData, usingFallback } = await getSchedule();

  if (usingFallback) {
    return {
      success: false,
      error: "ระบบทำงานในโหมด Fallback (ไม่ได้เชื่อมต่อ Upstash Redis) ไม่อนุญาตให้แก้ไขข้อมูล",
    };
  }

  const updatedOverrides = scheduleData.overrides.filter((item) => item.id !== id);

  const updatedSchedule = {
    ...scheduleData,
    overrides: updatedOverrides,
  };

  const saveRes = await saveSchedule(updatedSchedule);
  if (!saveRes.success) {
    return { success: false, error: saveRes.error || "ลบไม่สำเร็จ กรุณาลองอีกครั้ง" };
  }

  revalidatePath("/");
  revalidatePath("/control-room");
  revalidateTag("internship-schedule");
  return { success: true };
}

// Milestone Actions

export async function addMilestoneAction(milestoneData: Omit<Milestone, "id">) {
  await requireAdminSession();

  const { data: scheduleData, usingFallback } = await getSchedule();

  if (usingFallback) {
    return {
      success: false,
      error: "ระบบทำงานในโหมด Fallback (ไม่ได้เชื่อมต่อ Upstash Redis) ไม่อนุญาตให้แก้ไขข้อมูล",
    };
  }

  const newMilestone: Milestone = {
    ...milestoneData,
    id: `m_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
  };

  const currentMilestones = scheduleData.milestones || [];
  
  const updatedSchedule = {
    ...scheduleData,
    milestones: [...currentMilestones, newMilestone],
  };

  const saveRes = await saveSchedule(updatedSchedule);
  if (!saveRes.success) {
    return { success: false, error: saveRes.error || "บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง" };
  }

  revalidatePath("/");
  revalidatePath("/control-room");
  revalidateTag("internship-schedule");
  return { success: true };
}

export async function editMilestoneAction(milestone: Milestone) {
  await requireAdminSession();

  const { data: scheduleData, usingFallback } = await getSchedule();

  if (usingFallback) {
    return {
      success: false,
      error: "ระบบทำงานในโหมด Fallback (ไม่ได้เชื่อมต่อ Upstash Redis) ไม่อนุญาตให้แก้ไขข้อมูล",
    };
  }

  const currentMilestones = scheduleData.milestones || [];
  const updatedMilestones = currentMilestones.map((item) =>
    item.id === milestone.id ? milestone : item
  );

  const updatedSchedule = {
    ...scheduleData,
    milestones: updatedMilestones,
  };

  const saveRes = await saveSchedule(updatedSchedule);
  if (!saveRes.success) {
    return { success: false, error: saveRes.error || "บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง" };
  }

  revalidatePath("/");
  revalidatePath("/control-room");
  revalidateTag("internship-schedule");
  return { success: true };
}

export async function deleteMilestoneAction(id: string) {
  await requireAdminSession();

  const { data: scheduleData, usingFallback } = await getSchedule();

  if (usingFallback) {
    return {
      success: false,
      error: "ระบบทำงานในโหมด Fallback (ไม่ได้เชื่อมต่อ Upstash Redis) ไม่อนุญาตให้แก้ไขข้อมูล",
    };
  }

  const currentMilestones = scheduleData.milestones || [];
  const updatedMilestones = currentMilestones.filter((item) => item.id !== id);

  const updatedSchedule = {
    ...scheduleData,
    milestones: updatedMilestones,
  };

  const saveRes = await saveSchedule(updatedSchedule);
  if (!saveRes.success) {
    return { success: false, error: saveRes.error || "ลบไม่สำเร็จ กรุณาลองอีกครั้ง" };
  }

  revalidatePath("/");
  revalidatePath("/control-room");
  revalidateTag("internship-schedule");
  return { success: true };
}
