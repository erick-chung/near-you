import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./db";

export async function getOrCreateUser() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const existingUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (existingUser) {
    return existingUser;
  }

  return await prisma.user.create({
    data: {
      clerkId: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
    },
  });
}
