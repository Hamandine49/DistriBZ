import { Platform, Share } from 'react-native';
import { VendingMachine } from '@/types/vendingMachine';

export interface ShareOptions {
  includeImage?: boolean;
  customMessage?: string;
  trackSharing?: boolean;
}

export const generateShareContent = (machine: VendingMachine, options: ShareOptions = {}) => {
  const { customMessage } = options;
  
  if (customMessage) {
    return customMessage;
  }

  const categoryEmoji = getCategoryEmoji(machine.category);
  const ratingStars = '⭐'.repeat(Math.floor(machine.rating));
  
  return `${categoryEmoji} ${machine.name}

📍 ${machine.address}

${ratingStars} ${machine.rating.toFixed(1)}/5 (${machine.reviewCount} avis)
💰 Prix moyen: ${machine.averagePrice}€
🏷️ Catégorie: ${machine.category}

🔗 Découvrez ce distributeur sur VendingFinder !`;
};

export const getCategoryEmoji = (category: string): string => {
  const categoryEmojis: Record<string, string> = {
    'Pain': '🍞',
    'Pizza': '🍕',
    'Fleurs': '💐',
    'Lait': '🥛',
    'Oeufs': '🥚',
    'Produits locaux': '🧺',
    'Autre': '🏪',
  };
  
  return categoryEmojis[category] || '🏪';
};

export const generateDeepLink = (machineId: string): string => {
  // You can customize this based on your app's URL scheme
  const baseUrl = Platform.select({
    web: 'https://vendingfinder.app',
    default: 'vendingfinder://app'
  });
  
  return `${baseUrl}/details/${machineId}`;
};

export const shareVendingMachine = async (
  machine: VendingMachine, 
  options: ShareOptions = {}
): Promise<boolean> => {
  try {
    const shareMessage = generateShareContent(machine, options);
    const appUrl = generateDeepLink(machine.id);
    
    const shareOptions = {
      title: `${machine.name} - VendingFinder`,
      message: Platform.OS === 'ios' ? shareMessage : `${shareMessage}\n\n${appUrl}`,
      url: Platform.OS === 'ios' ? appUrl : undefined,
    };

    const result = await Share.share(shareOptions, {
      dialogTitle: 'Partager ce distributeur',
      excludedActivityTypes: Platform.OS === 'ios' ? [
        'com.apple.UIKit.activity.PostToWeibo',
        'com.apple.UIKit.activity.Print',
        'com.apple.UIKit.activity.AssignToContact',
        'com.apple.UIKit.activity.SaveToCameraRoll',
        'com.apple.UIKit.activity.AddToReadingList',
        'com.apple.UIKit.activity.PostToFlickr',
        'com.apple.UIKit.activity.PostToVimeo',
        'com.apple.UIKit.activity.PostToTencentWeibo'
      ] : undefined,
    });

    // Track sharing analytics if enabled
    if (options.trackSharing && result.action === Share.sharedAction) {
      // You can add analytics tracking here
      console.log('Share tracked:', machine.id);
    }

    return result.action === Share.sharedAction;
  } catch (error) {
    console.error('Error sharing vending machine:', error);
    return false;
  }
};