import { getAllProducts } from '../db/products';

import { Product } from '../types';

export interface ProductRecommendation {
  type: 'product_recommendation';
  content: {
    products: Product[];
    context: string;
  };
}

export class ProductRecommendationTool {
  async getRecommendations(userInput: string): Promise<ProductRecommendation | null> {
    // Analyze user input for product-related intent
    if (!this.hasProductIntent(userInput)) {
      return null;
    }

    try {
      // Get products from database
      const products = await getAllProducts();
      
      // Filter and rank products based on user input
      const relevantProducts = this.findRelevantProducts(userInput, products);
      
      if (relevantProducts.length === 0) {
        return null;
      }

      // Format response to match MessageList expectations
      return {
        type: 'product_recommendation',
        content: {
          products: relevantProducts,
          context: this.generateRecommendationContext(userInput)
        }
      };
    } catch (error) {
      console.error('Error getting product recommendations:', error);
      return null;
    }
  }

  private hasProductIntent(userInput: string): boolean {
    // Health-related product keywords
    const healthProductKeywords = [
      'medicine', 'medication', 'treatment',
      'supplement', 'vitamin', 'remedy',
      'relief', 'health product', 'medical supply'
    ];

    // Shopping intent keywords
    const shoppingKeywords = [
      'buy', 'purchase', 'recommend', 'suggest',
      'looking for', 'want to buy', 'shop',
      'product', 'item', 'price', 'show me',
      'where can i get', 'need to buy'
    ];

    const input = userInput.toLowerCase();
    
    // Check both health and shopping keywords
    const hasHealthKeyword = healthProductKeywords.some(keyword => 
      input.includes(keyword.toLowerCase())
    );

    const hasShoppingKeyword = shoppingKeywords.some(keyword => 
      input.includes(keyword.toLowerCase())
    );

    // Return true if we find either type of keyword
    return hasHealthKeyword || hasShoppingKeyword;
  }

  private findRelevantProducts(userInput: string, products: Product[]): Product[] {
    const input = userInput.toLowerCase();
    const keywords = input.split(' ');
    
    // Extract health conditions and symptoms
    const healthTerms = [
      'headache', 'pain', 'nausea', 'sleep', 'stress',
      'energy', 'fatigue', 'wellness', 'health'
    ];

    const matchedHealthTerms = healthTerms.filter(term => input.includes(term));
    
    // Score products based on relevance
    const scoredProducts = products.map(product => {
      const productText = `${product.name} ${product.description}`.toLowerCase();
      let score = 0;

      // Score based on direct keyword matches
      keywords.forEach(keyword => {
        if (productText.includes(keyword)) score += 1;
      });

      // Boost score for health term matches
      matchedHealthTerms.forEach(term => {
        if (productText.includes(term)) score += 2;
      });

      // Boost score for products in relevant categories
      const healthCategories = ['health', 'wellness', 'medicine', 'supplements'];
      if (healthCategories.includes(product.category?.toLowerCase())) {
        score += 1;
      }

      return { product, score };
    });

    // Sort by score and return top matches
    return scoredProducts
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.product)
      .slice(0, 3); // Limit to top 3 recommendations
  }

  private generateRecommendationContext(userInput: string): string {
    let context = `Based on your interest in "${userInput}", here are some products that might help:\n\n`;
    context += "Note: Always consult with a healthcare provider before starting any new treatment or supplement regimen.";
    return context;
  }
}
