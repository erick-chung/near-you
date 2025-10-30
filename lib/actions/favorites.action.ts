'use server';

import { revalidatePath } from 'next/cache';
import { getOrCreateUser } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function getFavorites() {
  try {
    const user = await getOrCreateUser();
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return { success: true, data: favorites };
  } catch (err) {
    console.error('Failed to fetch favorites:', err);
    return { success: false, error: 'Failed to fetch favorites' };
  }
}

export async function addFavorite(restaurantData: {
  restaurantId: string;
  name: string;
  address: string;
  rating?: number;
  priceLevel?: string;
  cuisineType: string[];
  photoUrl?: string;
}) {
  try {
    const user = await getOrCreateUser();
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        restaurantId: restaurantData.restaurantId,
        name: restaurantData.name,
        address: restaurantData.address,
        rating: restaurantData.rating,
        priceLevel: restaurantData.priceLevel,
        cuisineType: restaurantData.cuisineType,
        photoUrl: restaurantData.photoUrl,
      }
    });

    revalidatePath('/favorites');
    return { success: true, data: favorite };
  } catch (err) {
    console.error('Failed to add favorite:', err);
    return { success: false, error: 'Failed to add favorite' };
  }
}

export async function removeFavorite(restaurantId: string) {
  try {
    const user = await getOrCreateUser();
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    await prisma.favorite.delete({
      where: {
        userId_restaurantId: {
          userId: user.id,
          restaurantId
        }
      }
    });

    revalidatePath('/favorites');
    return { success: true };
  } catch (err) {
    console.error('Failed to remove favorite:', err);
    return { success: false, error: 'Failed to remove favorite' };
  }
}