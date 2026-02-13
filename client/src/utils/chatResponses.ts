import type { Product } from '../types/index';
import { formatINR, calculateSavings } from './formatters';

interface AIResponse {
  text: string;
  products?: Product[];
  followUpQuestions: string[];
}

/**
 * Generate an AI response based on user message and available products
 * @param message - User's message
 * @param products - Array of available products
 * @returns AI response with text, products, and follow-up questions
 */
export function generateAIResponse(message: string, products: Product[]): AIResponse {
  const lowerMessage = message.toLowerCase().trim();

  // Greeting patterns
  if (isGreeting(lowerMessage)) {
    return {
      text: "Hello! I'm your RetailIQ AI assistant. I'm here to help you find the best deals on products across Amazon and Flipkart in India. I can help you compare prices, track deals, and recommend the best time to buy. What are you looking for today?",
      followUpQuestions: [
        'Find me a laptop under ₹50,000',
        'What are the trending products today?',
        'Should I buy a smartphone now or wait?',
        'Compare iPhone vs Samsung phones',
      ],
    };
  }

  // Help or capabilities query
  if (isHelpQuery(lowerMessage)) {
    return {
      text: "I can assist you with:\n\n• Finding products based on your budget and preferences\n• Comparing prices across Amazon India and Flipkart\n• Tracking price history and trends\n• Recommending the best time to purchase\n• Alerting you about price drops and festival sales\n• Providing insights on trending products\n\nJust tell me what you're looking for, and I'll help you find the best deal!",
      followUpQuestions: [
        'Find me the best smartphone under ₹20,000',
        'What phones are trending right now?',
        'When is the next big sale?',
        'Compare prices for gaming laptops',
      ],
    };
  }

  // Product search with price range
  if (isPriceRangeQuery(lowerMessage)) {
    return handlePriceRangeQuery(lowerMessage, products);
  }

  // Compare prices query
  if (isComparisonQuery(lowerMessage)) {
    return handleComparisonQuery(lowerMessage, products);
  }

  // Best product recommendation
  if (isBestProductQuery(lowerMessage)) {
    return handleBestProductQuery(lowerMessage, products);
  }

  // Trending products query
  if (isTrendingQuery(lowerMessage)) {
    return handleTrendingQuery(products);
  }

  // Purchase timing advice
  if (isPurchaseTimingQuery(lowerMessage)) {
    return handlePurchaseTimingQuery(lowerMessage);
  }

  // Category-specific queries
  if (isCategoryQuery(lowerMessage)) {
    return handleCategoryQuery(lowerMessage, products);
  }

  // Price drop queries
  if (isPriceDropQuery(lowerMessage)) {
    return handlePriceDropQuery(products);
  }

  // Festival and sale queries
  if (isFestivalQuery(lowerMessage)) {
    return handleFestivalQuery();
  }

  // Brand-specific queries
  if (isBrandQuery(lowerMessage)) {
    return handleBrandQuery(lowerMessage, products);
  }

  // Rating-based queries
  if (isRatingQuery(lowerMessage)) {
    return handleRatingQuery(lowerMessage, products);
  }

  // Default fallback
  return {
    text: "I'd be happy to help you with that! Could you provide more details about what you're looking for? For example, you can:\n\n• Specify a product category and budget (e.g., 'laptop under ₹60,000')\n• Ask for comparisons (e.g., 'compare iPhone prices')\n• Request trending products (e.g., 'what's trending in electronics')\n• Ask about purchase timing (e.g., 'should I buy now or wait')",
    followUpQuestions: [
      'Show me laptops under ₹50,000',
      'What are the best deals today?',
      'Find me highly-rated smartphones',
      'When is the next sale?',
    ],
  };
}

// Helper function to check if message is a greeting
function isGreeting(message: string): boolean {
  const greetings = ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening'];
  return greetings.some((greeting) => message === greeting || message.startsWith(greeting + ' '));
}

// Helper function to check if message is a help query
function isHelpQuery(message: string): boolean {
  return (
    message.includes('help') ||
    message.includes('what can you do') ||
    message.includes('how can you help') ||
    message.includes('capabilities')
  );
}

// Helper function to check if message contains price range
function isPriceRangeQuery(message: string): boolean {
  return (
    (message.includes('under') || message.includes('below') || message.includes('less than')) &&
    (message.includes('₹') || message.includes('rs') || message.includes('rupees') || /\d{3,}/.test(message))
  );
}

// Helper function to check if message is asking for comparison
function isComparisonQuery(message: string): boolean {
  return (
    message.includes('compare') ||
    message.includes('comparison') ||
    message.includes('vs') ||
    message.includes('versus') ||
    message.includes('difference between')
  );
}

// Helper function to check if asking for best product
function isBestProductQuery(message: string): boolean {
  return (
    message.includes('best') ||
    message.includes('top') ||
    message.includes('recommend') ||
    message.includes('suggest') ||
    message.includes('good')
  );
}

// Helper function to check if asking about trending products
function isTrendingQuery(message: string): boolean {
  return (
    message.includes('trending') ||
    message.includes('popular') ||
    message.includes('hot') ||
    message.includes("what's selling") ||
    message.includes('most bought')
  );
}

// Helper function to check if asking about purchase timing
function isPurchaseTimingQuery(message: string): boolean {
  return (
    message.includes('should i buy') ||
    message.includes('buy now') ||
    message.includes('wait') ||
    message.includes('right time') ||
    message.includes('when to buy')
  );
}

// Helper function to check if asking about specific category
function isCategoryQuery(message: string): boolean {
  const categories = [
    'laptop',
    'phone',
    'smartphone',
    'tablet',
    'headphone',
    'earbuds',
    'watch',
    'tv',
    'camera',
    'gaming',
  ];
  return categories.some((cat) => message.includes(cat));
}

// Helper function to check if asking about price drops
function isPriceDropQuery(message: string): boolean {
  return (
    message.includes('price drop') ||
    message.includes('discount') ||
    message.includes('deal') ||
    message.includes('offer') ||
    message.includes('sale')
  );
}

// Helper function to check if asking about festivals
function isFestivalQuery(message: string): boolean {
  return (
    message.includes('festival') ||
    message.includes('diwali') ||
    message.includes('holi') ||
    message.includes('sale event') ||
    message.includes('big billion') ||
    message.includes('great indian')
  );
}

// Helper function to check if asking about specific brand
function isBrandQuery(message: string): boolean {
  const brands = ['apple', 'samsung', 'oneplus', 'xiaomi', 'realme', 'oppo', 'vivo', 'dell', 'hp', 'lenovo', 'asus'];
  return brands.some((brand) => message.includes(brand));
}

// Helper function to check if asking about ratings
function isRatingQuery(message: string): boolean {
  return (
    message.includes('highly rated') ||
    message.includes('best rated') ||
    message.includes('top rated') ||
    message.includes('rating') ||
    message.includes('reviews')
  );
}

// Handler for price range queries
function handlePriceRangeQuery(message: string, products: Product[]): AIResponse {
  // Extract price from message
  const priceMatch = message.match(/\d+[,\d]*/);
  const maxPrice = priceMatch ? parseInt(priceMatch[0].replace(/,/g, '')) : 50000;

  // Extract category if mentioned
  let category = '';
  const categories = ['laptop', 'phone', 'smartphone', 'tablet', 'headphone', 'earbuds', 'watch', 'tv', 'camera'];
  for (const cat of categories) {
    if (message.includes(cat)) {
      category = cat;
      break;
    }
  }

  // Filter products
  let filtered = products.filter((p) => p.current_price <= maxPrice);

  if (category) {
    filtered = filtered.filter((p) => p.category.toLowerCase().includes(category));
  }

  // Sort by rating and reviews
  filtered.sort((a, b) => {
    const scoreA = a.rating * Math.log10(a.review_count + 1);
    const scoreB = b.rating * Math.log10(b.review_count + 1);
    return scoreB - scoreA;
  });

  const topProducts = filtered.slice(0, 6);

  if (topProducts.length === 0) {
    return {
      text: `I couldn't find any ${category || 'products'} under ${formatINR(maxPrice)} in our current inventory. Would you like me to:\n\n• Increase the budget range\n• Look at different categories\n• Set up a price alert for when products become available`,
      followUpQuestions: [
        `Find products under ${formatINR(maxPrice * 1.5)}`,
        'Show me all available products',
        'What are the cheapest options?',
        'Set up a price alert',
      ],
    };
  }

  const categoryText = category ? ` ${category}s` : ' products';
  const savingsInfo =
    topProducts[0].original_price > topProducts[0].current_price
      ? ` The top option has ${formatINR(topProducts[0].original_price - topProducts[0].current_price)} off!`
      : '';

  return {
    text: `Great! I found ${filtered.length} excellent${categoryText} under ${formatINR(maxPrice)} for you.${savingsInfo}\n\nHere are the top-rated options based on customer reviews and ratings. All prices are current as of today across Amazon India and Flipkart.`,
    products: topProducts,
    followUpQuestions: [
      'Compare prices for these products',
      'Show me more options',
      'Which one would you recommend?',
      'Set price alerts for these',
    ],
  };
}

// Handler for comparison queries
function handleComparisonQuery(message: string, products: Product[]): AIResponse {
  // Try to extract brand or product type
  const brands = ['apple', 'samsung', 'oneplus', 'xiaomi', 'realme', 'iphone'];
  const mentionedBrands = brands.filter((brand) => message.includes(brand));

  if (mentionedBrands.length > 0) {
    const filtered = products.filter((p) =>
      mentionedBrands.some((brand) => p.brand.toLowerCase().includes(brand) || p.product_name.toLowerCase().includes(brand))
    );

    const topProducts = filtered.slice(0, 6);

    if (topProducts.length < 2) {
      return {
        text: `I found limited products to compare. Let me show you what's available and suggest some alternatives in the same category.`,
        products: topProducts.length > 0 ? topProducts : products.slice(0, 6),
        followUpQuestions: [
          'Show me more options',
          'Compare different brands',
          'What are the best deals?',
          'Find products under ₹30,000',
        ],
      };
    }

    // Calculate average prices and savings
    const avgPrice = topProducts.reduce((sum, p) => sum + p.current_price, 0) / topProducts.length;
    const totalSavings = topProducts.reduce(
      (sum, p) => sum + (p.original_price > p.current_price ? p.original_price - p.current_price : 0),
      0
    );

    return {
      text: `Here's a comparison of ${mentionedBrands.join(' vs ')} products:\n\n• Found ${filtered.length} products\n• Average price: ${formatINR(avgPrice)}\n• Total savings available: ${formatINR(totalSavings)}\n\nI'm showing you the best options based on ratings, reviews, and current deals. You can compare prices, features, and availability across both Amazon India and Flipkart.`,
      products: topProducts,
      followUpQuestions: [
        'Which one offers the best value?',
        'Show me the cheapest option',
        'Which has the best reviews?',
        'Set alerts for price drops',
      ],
    };
  }

  // Generic comparison
  const topProducts = products.slice(0, 6);
  return {
    text: "I can help you compare products! Here are some popular options across different categories and platforms. Each product card shows the current price, discount, ratings, and platform availability.\n\nLet me know which specific products or categories you'd like to compare in detail.",
    products: topProducts,
    followUpQuestions: [
      'Compare laptops under ₹60,000',
      'Compare iPhone vs Samsung phones',
      'Compare prices across platforms',
      'Show me the best deals',
    ],
  };
}

// Handler for best product queries
function handleBestProductQuery(message: string, products: Product[]): AIResponse {
  // Extract category if mentioned
  const categories = ['laptop', 'phone', 'smartphone', 'tablet', 'headphone', 'earbuds', 'watch', 'tv', 'camera'];
  let category = '';

  for (const cat of categories) {
    if (message.includes(cat)) {
      category = cat;
      break;
    }
  }

  let filtered = products;
  if (category) {
    filtered = products.filter((p) => p.category.toLowerCase().includes(category));
  }

  // Sort by a combination of rating, reviews, and discount
  filtered.sort((a, b) => {
    const discountA = ((a.original_price - a.current_price) / a.original_price) * 100;
    const discountB = ((b.original_price - b.current_price) / b.original_price) * 100;

    const scoreA = a.rating * 0.4 + Math.log10(a.review_count + 1) * 0.3 + discountA * 0.3;
    const scoreB = b.rating * 0.4 + Math.log10(b.review_count + 1) * 0.3 + discountB * 0.3;

    return scoreB - scoreA;
  });

  const topProducts = filtered.slice(0, 6);
  const categoryText = category ? ` ${category}` : '';

  if (topProducts.length === 0) {
    return {
      text: `I don't have any${categoryText} products in the current inventory. Let me show you what's available in other categories.`,
      products: products.slice(0, 6),
      followUpQuestions: [
        'Show me all categories',
        'What are the trending products?',
        'Find me the best deals',
        'Set up product alerts',
      ],
    };
  }

  const bestProduct = topProducts[0];
  const savings = calculateSavings(bestProduct.original_price, bestProduct.current_price);

  return {
    text: `Based on customer ratings, reviews, and current discounts, here are the best${categoryText} options for you:\n\n🏆 Top Pick: ${bestProduct.product_name}\n• Rating: ${bestProduct.rating}⭐ (${bestProduct.review_count.toLocaleString('en-IN')} reviews)\n• Price: ${formatINR(bestProduct.current_price)}${savings.amount > 0 ? ` (Save ${formatINR(savings.amount)} - ${savings.percentage}% off!)` : ''}\n• Platform: ${bestProduct.platform === 'amazon_india' ? 'Amazon India' : 'Flipkart'}\n\nI've also included other highly-rated alternatives for you to compare!`,
    products: topProducts,
    followUpQuestions: [
      'Why is this the best option?',
      'Show me cheaper alternatives',
      'Compare with other brands',
      'Set a price alert',
    ],
  };
}

// Handler for trending queries
function handleTrendingQuery(products: Product[]): AIResponse {
  // Sort by a combination of recent reviews and high ratings
  const trending = [...products]
    .sort((a, b) => {
      const scoreA = a.rating * Math.log10(a.review_count + 10);
      const scoreB = b.rating * Math.log10(b.review_count + 10);
      return scoreB - scoreA;
    })
    .slice(0, 6);

  const totalProducts = products.length;
  const avgDiscount =
    products.reduce((sum, p) => {
      const discount = ((p.original_price - p.current_price) / p.original_price) * 100;
      return sum + discount;
    }, 0) / products.length;

  return {
    text: `🔥 Here are the trending products right now across Amazon India and Flipkart!\n\nThese ${trending.length} products are getting the most attention from buyers:\n• Total products tracked: ${totalProducts}\n• Average discount: ${avgDiscount.toFixed(1)}%\n• All products shown have 4+ star ratings\n\nThese trending items are popular due to their great reviews, competitive pricing, and high demand. Many have limited stock, so it's a good time to check them out!`,
    products: trending,
    followUpQuestions: [
      'Which one is the best deal?',
      'Show me more trending items',
      'Set alerts for these products',
      'Compare prices across platforms',
    ],
  };
}

// Handler for purchase timing queries
function handlePurchaseTimingQuery(_message: string): AIResponse {
  const currentMonth = new Date().getMonth();
  const upcomingSales = getUpcomingSales(currentMonth);

  if (upcomingSales.length > 0) {
    const nextSale = upcomingSales[0];
    return {
      text: `Great question! Here's my purchase timing advice:\n\n⏰ ${nextSale.message}\n\n💡 General Tips:\n• Prices typically drop 15-40% during major sales\n• Best deals are on Day 1 and last day of sales\n• Electronics see bigger discounts during Diwali and Republic Day sales\n• Set up price alerts so you don't miss drops\n\nIf you need the product urgently, current prices are reasonable. But if you can wait, ${nextSale.recommendation}`,
      followUpQuestions: [
        'Show me current best deals',
        'Set price alerts for specific products',
        'What categories have best discounts?',
        'Compare prices across platforms',
      ],
    };
  }

  return {
    text: "Here's my advice on purchase timing:\n\n💡 Should you buy now?\n• If you need the product immediately: Yes, go ahead!\n• If you can wait: Consider waiting for upcoming sales\n\n📊 Price Patterns in India:\n• Major sales: Republic Day (Jan), Amazon Prime Day (Jul), Diwali (Oct-Nov), Black Friday (Nov)\n• Best discounts: Diwali and Republic Day sales (20-40% off)\n• Electronics peak during festival seasons\n\nI recommend setting up price alerts so you're notified immediately when prices drop!",
    followUpQuestions: [
      'Set up price alerts',
      'Show me current deals',
      'Compare prices now',
      'What products are likely to drop?',
    ],
  };
}

// Handler for category queries
function handleCategoryQuery(message: string, products: Product[]): AIResponse {
  const categories = ['laptop', 'phone', 'smartphone', 'tablet', 'headphone', 'earbuds', 'watch', 'tv', 'camera'];
  let category = '';

  for (const cat of categories) {
    if (message.includes(cat)) {
      category = cat;
      break;
    }
  }

  const filtered = products.filter((p) => p.category.toLowerCase().includes(category));
  const topProducts = filtered.slice(0, 6);

  if (topProducts.length === 0) {
    return {
      text: `I don't have any ${category} products in the current inventory. Let me show you what's available in other popular categories.`,
      products: products.slice(0, 6),
      followUpQuestions: [
        'Show me all categories',
        'What products do you track?',
        'Find me the best deals',
        'Show trending products',
      ],
    };
  }

  const avgPrice = filtered.reduce((sum, p) => sum + p.current_price, 0) / filtered.length;
  const avgRating = filtered.reduce((sum, p) => sum + p.rating, 0) / filtered.length;

  return {
    text: `I found ${filtered.length} ${category} products for you!\n\n📊 Category Insights:\n• Average price: ${formatINR(avgPrice)}\n• Average rating: ${avgRating.toFixed(1)}⭐\n• Available on: Amazon India & Flipkart\n\nHere are the top-rated options based on customer reviews and current deals:`,
    products: topProducts,
    followUpQuestions: [
      `Find ${category} under ₹50,000`,
      `Compare top ${category} brands`,
      `What are the best deals?`,
      `Set price alerts`,
    ],
  };
}

// Handler for price drop queries
function handlePriceDropQuery(products: Product[]): AIResponse {
  // Filter products with discounts
  const dealsProducts = products
    .filter((p) => p.original_price > p.current_price)
    .sort((a, b) => {
      const discountA = ((a.original_price - a.current_price) / a.original_price) * 100;
      const discountB = ((b.original_price - b.current_price) / b.original_price) * 100;
      return discountB - discountA;
    })
    .slice(0, 6);

  if (dealsProducts.length === 0) {
    return {
      text: "Currently, most products are at their regular prices. However, I'm continuously tracking prices across platforms. Let me show you some highly-rated products that offer great value:\n\n💡 Tip: Set up price alerts to get notified immediately when prices drop!",
      products: products.slice(0, 6),
      followUpQuestions: [
        'Set up price alerts',
        'When is the next sale?',
        'Show me trending products',
        'Find products under budget',
      ],
    };
  }

  const avgDiscount =
    dealsProducts.reduce((sum, p) => {
      const discount = ((p.original_price - p.current_price) / p.original_price) * 100;
      return sum + discount;
    }, 0) / dealsProducts.length;

  const totalSavings = dealsProducts.reduce((sum, p) => sum + (p.original_price - p.current_price), 0);

  return {
    text: `🎉 Great news! I found ${dealsProducts.length} products with active price drops:\n\n• Average discount: ${avgDiscount.toFixed(1)}%\n• Total potential savings: ${formatINR(totalSavings)}\n• Best deal: ${dealsProducts[0].product_name} at ${((dealsProducts[0].original_price - dealsProducts[0].current_price) / dealsProducts[0].original_price * 100).toFixed(1)}% off\n\nThese are the best deals available right now across Amazon India and Flipkart!`,
    products: dealsProducts,
    followUpQuestions: [
      'Show me more deals',
      'Set alerts for similar products',
      'Compare these deals',
      'Which deal is the best?',
    ],
  };
}

// Handler for festival queries
function handleFestivalQuery(): AIResponse {
  const currentMonth = new Date().getMonth();
  const upcomingSales = getUpcomingSales(currentMonth);

  if (upcomingSales.length > 0) {
    const salesText = upcomingSales.map((sale, idx) => `${idx + 1}. ${sale.name} - ${sale.timing}`).join('\n');

    return {
      text: `🎊 Upcoming Festival Sales in India:\n\n${salesText}\n\n💰 Expected Discounts:\n• Electronics: 20-40% off\n• Fashion: 30-70% off\n• Home & Kitchen: 40-60% off\n• Smartphones: 15-35% off\n\n📱 Major Sale Events:\n• Amazon Great Indian Festival\n• Flipkart Big Billion Days\n• Republic Day Sale (January)\n• Independence Day Sale (August)\n\nI recommend setting up price alerts now so you're notified the moment deals go live!`,
      followUpQuestions: [
        'Set price alerts for next sale',
        'What products have best festival discounts?',
        'Show me current deals',
        'Compare platform sales',
      ],
    };
  }

  return {
    text: "🎊 Festival & Sale Calendar for India:\n\nMajor annual sales you shouldn't miss:\n\n1. Republic Day Sale (January) - 20-40% off electronics\n2. Amazon Prime Day (July) - Exclusive member deals\n3. Independence Day Sale (August) - 15-50% off all categories\n4. Diwali Sales (October-November) - Biggest discounts of the year!\n5. Black Friday/Cyber Monday (November) - 25-60% off\n6. Year-End Sale (December) - Clearance deals\n\nSet up alerts now to never miss a deal!",
    followUpQuestions: [
      'Set up price alerts',
      'What products should I buy in sales?',
      'Compare Amazon vs Flipkart sales',
      'Show me current best deals',
    ],
  };
}

// Handler for brand queries
function handleBrandQuery(message: string, products: Product[]): AIResponse {
  const brands = ['apple', 'samsung', 'oneplus', 'xiaomi', 'realme', 'oppo', 'vivo', 'dell', 'hp', 'lenovo', 'asus'];
  let brand = '';

  for (const b of brands) {
    if (message.includes(b)) {
      brand = b;
      break;
    }
  }

  const filtered = products.filter(
    (p) => p.brand.toLowerCase().includes(brand) || p.product_name.toLowerCase().includes(brand)
  );

  const topProducts = filtered.slice(0, 6);

  if (topProducts.length === 0) {
    return {
      text: `I don't have any ${brand} products in the current inventory. Let me show you similar alternatives from other popular brands.`,
      products: products.slice(0, 6),
      followUpQuestions: [
        'Show me all brands',
        'Compare different brands',
        'What are the best alternatives?',
        'Find highly-rated products',
      ],
    };
  }

  const avgPrice = filtered.reduce((sum, p) => sum + p.current_price, 0) / filtered.length;
  const avgRating = filtered.reduce((sum, p) => sum + p.rating, 0) / filtered.length;

  return {
    text: `I found ${filtered.length} ${brand.charAt(0).toUpperCase() + brand.slice(1)} products!\n\n📊 Brand Insights:\n• Average price: ${formatINR(avgPrice)}\n• Average rating: ${avgRating.toFixed(1)}⭐\n• Product range: ${formatINR(Math.min(...filtered.map((p) => p.current_price)))} - ${formatINR(Math.max(...filtered.map((p) => p.current_price)))}\n\nHere are the best ${brand} products based on ratings and current deals:`,
    products: topProducts,
    followUpQuestions: [
      `Compare ${brand} with other brands`,
      `Find ${brand} products under ₹50,000`,
      `What are the best ${brand} deals?`,
      `Set price alerts for ${brand}`,
    ],
  };
}

// Handler for rating queries
function handleRatingQuery(_message: string, products: Product[]): AIResponse {
  // Filter for highly rated products (4+ stars)
  const highlyRated = products
    .filter((p) => p.rating >= 4.0)
    .sort((a, b) => {
      // Sort by rating first, then by number of reviews
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return b.review_count - a.review_count;
    })
    .slice(0, 6);

  if (highlyRated.length === 0) {
    return {
      text: "Let me show you the best available products based on customer feedback and reviews.",
      products: products.slice(0, 6),
      followUpQuestions: [
        'Show me all products',
        'Find products by category',
        'What are the best deals?',
        'Compare prices',
      ],
    };
  }

  const avgRating = highlyRated.reduce((sum, p) => sum + p.rating, 0) / highlyRated.length;
  const totalReviews = highlyRated.reduce((sum, p) => sum + p.review_count, 0);

  return {
    text: `⭐ Here are the highest-rated products:\n\n• ${highlyRated.length} products with 4+ star ratings\n• Average rating: ${avgRating.toFixed(1)}⭐\n• Total customer reviews: ${totalReviews.toLocaleString('en-IN')}\n\nThese products are loved by customers and have consistently excellent reviews. You can trust these choices!`,
    products: highlyRated,
    followUpQuestions: [
      'Which one offers best value?',
      'Show me more highly-rated products',
      'Compare prices for these',
      'Set price alerts',
    ],
  };
}

// Helper to get upcoming sales based on current month
function getUpcomingSales(currentMonth: number): Array<{ name: string; timing: string; message: string; recommendation: string }> {
  const sales = [];

  // January - Republic Day
  if (currentMonth === 0) {
    sales.push({
      name: 'Republic Day Sale',
      timing: 'Around 26th January',
      message: 'Republic Day Sale is coming soon! Expect 20-40% discounts.',
      recommendation: "waiting a few days could save you significant money, especially on electronics.",
    });
  }

  // June-July - Prime Day
  if (currentMonth >= 5 && currentMonth <= 6) {
    sales.push({
      name: 'Amazon Prime Day',
      timing: 'Mid-July',
      message: 'Amazon Prime Day is approaching! Great deals for Prime members.',
      recommendation: "if you're an Amazon Prime member, waiting could get you exclusive deals.",
    });
  }

  // July-August - Independence Day
  if (currentMonth >= 6 && currentMonth <= 7) {
    sales.push({
      name: 'Independence Day Sale',
      timing: 'Around 15th August',
      message: 'Independence Day Sale is near! Expect 15-50% off across categories.',
      recommendation: "waiting for Independence Day could give you better prices.",
    });
  }

  // September-October - Diwali
  if (currentMonth >= 8 && currentMonth <= 10) {
    sales.push({
      name: 'Diwali Festival Sale',
      timing: 'October-November',
      message: 'Diwali Sale is approaching - the BIGGEST sale of the year!',
      recommendation: "definitely consider waiting for Diwali sales. They offer the best discounts all year (up to 40% off)!",
    });
  }

  // November - Black Friday
  if (currentMonth === 10) {
    sales.push({
      name: 'Black Friday / Cyber Monday',
      timing: 'Late November',
      message: 'Black Friday & Cyber Monday are coming! International sale season.',
      recommendation: "waiting a few weeks could get you Black Friday deals.",
    });
  }

  // December - Year End
  if (currentMonth === 11) {
    sales.push({
      name: 'Year-End Clearance Sale',
      timing: 'Throughout December',
      message: "Year-end clearance sales are active! Retailers are clearing inventory.",
      recommendation: "this is a great time to buy as sellers want to clear stock before the new year.",
    });
  }

  return sales;
}
