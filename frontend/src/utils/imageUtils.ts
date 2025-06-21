/**
 * Ürün resim URL'sini düzenler
 * @param imageUrl - Veritabanından gelen resim URL'si
 * @returns Düzenlenmiş resim URL'si
 */
export const getImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) {
    return '/product-image-placeholder.jpg';
  }
  
  // Eğer URL http/https ile başlıyorsa, direkt kullan
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Eğer placeholder resim ise, public klasöründen al
  if (imageUrl === 'product-image-placeholder.jpg') {
    return '/product-image-placeholder.jpg';
  }
  
  // Diğer durumlar için varsayılan (public klasöründen)
  return `/${imageUrl}`;
};

/**
 * Ürün için ana resim URL'sini getirir
 * @param productImages - Ürün resimleri array'i (string[] veya { imageUrl: string; isMain?: boolean }[])
 * @returns Ana resim URL'si
 */
export const getMainProductImage = (productImages?: string[] | { imageUrl: string; isMain?: boolean }[]): string => {
  if (!productImages || productImages.length === 0) {
    return '/product-image-placeholder.jpg';
  }
  
  // Eğer string array ise
  if (typeof productImages[0] === 'string') {
    return getImageUrl(productImages[0] as string);
  }
  
  // Eğer object array ise
  const imageObjects = productImages as { imageUrl: string; isMain?: boolean }[];
  const mainImage = imageObjects.find(img => img.isMain);
  const imageUrl = mainImage?.imageUrl || imageObjects[0]?.imageUrl;
  
  return getImageUrl(imageUrl);
}; 