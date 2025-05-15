import { 
  users, 
  type User, 
  type InsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Review,
  type InsertReview,
  type Testimonial,
  type InsertTestimonial
} from "@shared/schema";

// Complete storage interface with all required CRUD methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: InsertCategory): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Product methods
  getAllProducts(options?: {
    categoryId?: number;
    featured?: boolean;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    search?: string;
  }): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Cart methods
  getCartItems(userId: number): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(userId: number, itemId: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(userId: number, itemId: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Order methods
  getAllOrders(): Promise<Order[]>;
  getUserOrders(userId: number): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder, cartItems: CartItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
  
  // Review methods
  getProductReviews(productId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Admin dashboard stats
  getAdminStats(): Promise<any>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  private reviews: Map<number, Review>;
  private testimonials: Map<number, Testimonial>;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private productIdCounter: number;
  private cartItemIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private reviewIdCounter: number;
  private testimonialIdCounter: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.reviews = new Map();
    this.testimonials = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.productIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.reviewIdCounter = 1;
    this.testimonialIdCounter = 1;
    
    // Initialize with admin user
    this.createUser({
      username: 'admin',
      password: '$2b$10$bQvHh1.IXpxx86IpQMF4ReabM4J98K6j18mxEwc9GbYc.WfS7Tn9W', // password: admin123
      email: 'admin@sareegrace.com',
      fullName: 'Admin User',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Add some sample categories
    const silkCategory = this.createCategory({
      name: 'Silk Sarees',
      description: 'Luxurious silk sarees for special occasions',
      imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1974&auto=format&fit=crop',
      slug: 'silk-sarees'
    });
    
    const cottonCategory = this.createCategory({
      name: 'Cotton Sarees',
      description: 'Comfortable cotton sarees for daily wear',
      imageUrl: 'https://images.unsplash.com/photo-1610030438527-649eadb57178?q=80&w=2069&auto=format&fit=crop',
      slug: 'cotton-sarees'
    });
    
    // Add sample products
    this.createProduct({
      name: 'Banarasi Silk Saree',
      slug: 'banarasi-silk-saree',
      description: 'Traditional Banarasi silk saree with intricate golden zari work',
      price: 15999,
      discountPrice: 13999,
      imageUrl: 'https://images.unsplash.com/photo-1610030438527-649eadb57178?q=80&w=2069&auto=format&fit=crop',
      categoryId: 1, // Silk category
      stock: 15,
      featured: true,
      isNewArrival: true,
      isBestSeller: true
    });
    
    this.createProduct({
      name: 'Kanjivaram Silk Saree',
      slug: 'kanjivaram-silk-saree',
      description: 'Pure Kanjivaram silk saree with traditional temple border design',
      price: 25999,
      discountPrice: 22999,
      imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1974&auto=format&fit=crop',
      categoryId: 1, // Silk category
      stock: 8,
      featured: true,
      isNewArrival: false,
      isBestSeller: true
    });
    
    this.createProduct({
      name: 'Handloom Cotton Saree',
      slug: 'handloom-cotton-saree',
      description: 'Comfortable handloom cotton saree perfect for daily wear',
      price: 3999,
      discountPrice: 3499,
      imageUrl: 'https://images.unsplash.com/photo-1623004477281-27932582ad02?q=80&w=1974&auto=format&fit=crop',
      categoryId: 2, // Cotton category
      stock: 25,
      featured: false,
      isNewArrival: true,
      isBestSeller: false
    });
    
    this.createProduct({
      name: 'Printed Cotton Saree',
      slug: 'printed-cotton-saree',
      description: 'Elegant printed cotton saree with modern design patterns',
      price: 2999,
      discountPrice: 2499,
      imageUrl: 'https://images.unsplash.com/photo-1633168898957-4458e2a65f10?q=80&w=2070&auto=format&fit=crop',
      categoryId: 2, // Cotton category
      stock: 30,
      featured: false,
      isNewArrival: true,
      isBestSeller: false
    });
    
    // Add testimonials
    this.createTestimonial({
      name: 'Priya Sharma',
      rating: 5,
      featured: true,
      comment: 'I absolutely love the quality of the Banarasi silk saree I purchased. The colors are vibrant and the zari work is exquisite!',
      location: 'Delhi',
      avatarInitials: 'PS',
      avatarColor: '#e11d48'
    });
    
    this.createTestimonial({
      name: 'Ananya Patel',
      rating: 4,
      featured: true,
      comment: 'Great collection of cotton sarees that are perfect for office wear. Very comfortable even during summer.',
      location: 'Mumbai',
      avatarInitials: 'AP',
      avatarColor: '#8b5cf6'
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: insertUser.createdAt || new Date(),
      updatedAt: insertUser.updatedAt || new Date()
    };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }
  
  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryIdCounter++;
    const newCategory: Category = {
      ...category,
      id,
      createdAt: category.createdAt || new Date(),
      updatedAt: category.updatedAt || new Date()
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }
  
  async updateCategory(id: number, category: InsertCategory): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) {
      return undefined;
    }
    
    const updatedCategory: Category = {
      ...existingCategory,
      ...category,
      id,
      updatedAt: new Date()
    };
    
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }
  
  async deleteCategory(id: number): Promise<boolean> {
    if (!this.categories.has(id)) {
      return false;
    }
    return this.categories.delete(id);
  }
  
  // Product methods
  async getAllProducts(options?: {
    categoryId?: number;
    featured?: boolean;
    isNewArrival?: boolean;
    isBestSeller?: boolean;
    search?: string;
  }): Promise<Product[]> {
    let products = Array.from(this.products.values());
    
    if (options) {
      if (options.categoryId !== undefined) {
        products = products.filter(p => p.categoryId === options.categoryId);
      }
      
      if (options.featured) {
        products = products.filter(p => p.featured);
      }
      
      if (options.isNewArrival) {
        products = products.filter(p => p.isNewArrival);
      }
      
      if (options.isBestSeller) {
        products = products.filter(p => p.isBestSeller);
      }
      
      if (options.search) {
        const searchLower = options.search.toLowerCase();
        products = products.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          (p.description && p.description.toLowerCase().includes(searchLower))
        );
      }
    }
    
    return products;
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const newProduct: Product = {
      ...product,
      id,
      createdAt: product.createdAt || new Date(),
      updatedAt: product.updatedAt || new Date()
    };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, product: InsertProduct): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      return undefined;
    }
    
    const updatedProduct: Product = {
      ...existingProduct,
      ...product,
      id,
      updatedAt: new Date()
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    if (!this.products.has(id)) {
      return false;
    }
    return this.products.delete(id);
  }
  
  // Cart methods
  async getCartItems(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(item => item.userId === userId);
  }
  
  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists for this user and product
    const existingCartItem = Array.from(this.cartItems.values()).find(
      item => item.userId === cartItem.userId && item.productId === cartItem.productId
    );
    
    if (existingCartItem) {
      // Update quantity instead
      return this.updateCartItem(
        cartItem.userId, 
        existingCartItem.id, 
        existingCartItem.quantity + cartItem.quantity
      ) as Promise<CartItem>;
    }
    
    const id = this.cartItemIdCounter++;
    const newCartItem: CartItem = {
      ...cartItem,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }
  
  async updateCartItem(userId: number, itemId: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(itemId);
    
    if (!cartItem || cartItem.userId !== userId) {
      return undefined;
    }
    
    const updatedCartItem: CartItem = {
      ...cartItem,
      quantity,
      updatedAt: new Date()
    };
    
    this.cartItems.set(itemId, updatedCartItem);
    return updatedCartItem;
  }
  
  async removeFromCart(userId: number, itemId: number): Promise<boolean> {
    const cartItem = this.cartItems.get(itemId);
    
    if (!cartItem || cartItem.userId !== userId) {
      return false;
    }
    
    return this.cartItems.delete(itemId);
  }
  
  async clearCart(userId: number): Promise<boolean> {
    const userCartItemIds = Array.from(this.cartItems.values())
      .filter(item => item.userId === userId)
      .map(item => item.id);
    
    for (const itemId of userCartItemIds) {
      this.cartItems.delete(itemId);
    }
    
    return true;
  }
  
  // Order methods
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }
  
  async getUserOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }
  
  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async createOrder(order: InsertOrder, cartItems: CartItem[]): Promise<Order> {
    const id = this.orderIdCounter++;
    
    // Calculate total from cart items
    let total = 0;
    const orderItems: OrderItem[] = [];
    
    for (const item of cartItems) {
      const product = this.products.get(item.productId);
      if (!product) continue;
      
      const price = product.discountPrice || product.price;
      const subtotal = price * item.quantity;
      total += subtotal;
      
      // Create order item
      const orderItemId = this.orderItemIdCounter++;
      const orderItem: OrderItem = {
        id: orderItemId,
        orderId: id,
        productId: item.productId,
        quantity: item.quantity,
        price: price,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.orderItems.set(orderItemId, orderItem);
      orderItems.push(orderItem);
    }
    
    const newOrder: Order = {
      ...order,
      id,
      total,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.orders.set(id, newOrder);
    
    return {
      ...newOrder,
      items: orderItems
    } as Order;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    
    if (!order) {
      return undefined;
    }
    
    const updatedOrder: Order = {
      ...order,
      status,
      updatedAt: new Date()
    };
    
    this.orders.set(id, updatedOrder);
    
    // Include order items
    const items = Array.from(this.orderItems.values()).filter(item => item.orderId === id);
    return {
      ...updatedOrder,
      items
    } as Order;
  }
  
  // Review methods
  async getProductReviews(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => review.productId === productId);
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const newReview: Review = {
      ...review,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.reviews.set(id, newReview);
    return newReview;
  }
  
  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }
  
  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    const newTestimonial: Testimonial = {
      ...testimonial,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }
  
  // Admin dashboard stats
  async getAdminStats(): Promise<any> {
    const totalOrders = this.orders.size;
    const totalRevenue = Array.from(this.orders.values()).reduce((sum, order) => sum + order.total, 0);
    const totalCustomers = new Set(Array.from(this.users.values()).filter(user => !user.isAdmin).map(user => user.id)).size;
    const totalProducts = this.products.size;
    
    // Recent orders
    const recentOrders = Array.from(this.orders.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        date: order.createdAt.toISOString(),
        total: order.total,
        status: order.status
      }));
    
    // Top products based on order items
    const productSales = new Map<number, { sold: number, revenue: number }>();
    
    Array.from(this.orderItems.values()).forEach(item => {
      const current = productSales.get(item.productId) || { sold: 0, revenue: 0 };
      productSales.set(item.productId, {
        sold: current.sold + item.quantity,
        revenue: current.revenue + (item.price * item.quantity)
      });
    });
    
    const topProducts = Array.from(productSales.entries())
      .map(([productId, stats]) => {
        const product = this.products.get(productId);
        return {
          id: productId,
          name: product?.name || `Product ${productId}`,
          sold: stats.sold,
          revenue: stats.revenue
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
    
    return {
      totalOrders,
      totalRevenue,
      totalCustomers,
      totalProducts,
      recentOrders,
      topProducts
    };
  }
}

export const storage = new MemStorage();
