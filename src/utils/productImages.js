// Default cartoon-style images for products when farmer doesn't upload a photo
const DEFAULT_IMAGES = {
  vegetables: 'https://img.icons8.com/color/240/000000/tomato.png',
  fruits: 'https://img.icons8.com/color/240/000000/mango.png',
  grains: 'https://img.icons8.com/color/240/000000/wheat.png',
  dairy: 'https://img.icons8.com/color/240/000000/milk-bottle.png',
  poultry: 'https://img.icons8.com/color/240/000000/eggs.png',
  spices: 'https://img.icons8.com/color/240/000000/chili-pepper.png',
  other: 'https://img.icons8.com/color/240/000000/vegetables.png'
};

// Fallback emoji per category for lightweight display
const DEFAULT_EMOJI = {
  vegetables: '🍅',
  fruits: '🥭',
  grains: '🌾',
  dairy: '🥛',
  poultry: '🥚',
  spices: '🌶️',
  other: '🌿'
};

export const getDefaultImage = (category) => {
  return DEFAULT_IMAGES[category] || DEFAULT_IMAGES.other;
};

export const getDefaultEmoji = (category) => {
  return DEFAULT_EMOJI[category] || DEFAULT_EMOJI.other;
};

// Returns the image to display: uploaded image if present, else default cartoon
export const getProductImage = (product) => {
  if (product?.image && typeof product.image === 'string' && product.image.startsWith('http')) {
    return product.image;
  }
  if (product?.images && product.images.length > 0 && typeof product.images[0] === 'string') {
    return product.images[0];
  }
  return getDefaultImage(product?.category);
};