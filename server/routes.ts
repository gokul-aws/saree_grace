import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import { z } from "zod";
import memorystore from "memorystore";
import {
  insertUserSchema,
  insertProductSchema,
  insertCategorySchema,
  insertCartItemSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertReviewSchema,
  insertTestimonialSchema
} from "@shared/schema";

// Create a secure session middleware
const createSessionMiddleware = () => {
  const MemoryStore = memorystore(session);

  return session({
    secret: process.env.SESSION_SECRET || 'saree-grace-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', maxAge: 86400000 }, // 24hrs
    store: new MemoryStore({ checkPeriod: 86400000 })
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up session middleware
  app.use(createSessionMiddleware());

  // Configure passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport local strategy
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  // Serialize and deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
  };

  // Check if user is admin
  const isAdmin = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated() && (req.user as any).isAdmin) {
      return next();
    }
    res.status(403).json({ message: 'Forbidden' });
  };

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(validatedData.password, salt);
      
      const userData = { ...validatedData, password: hashedPassword };
      const newUser = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ message: 'Error logging out' });
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/user', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const { password, ...userWithoutPassword } = req.user as any;
    res.json(userWithoutPassword);
  });

  // Categories API
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/categories/:id', async (req, res) => {
    try {
      const category = await storage.getCategoryById(parseInt(req.params.id));
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/categories', isAdmin, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const newCategory = await storage.createCategory(validatedData);
      res.status(201).json(newCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/categories/:id', isAdmin, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const updatedCategory = await storage.updateCategory(parseInt(req.params.id), validatedData);
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(updatedCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/categories/:id', isAdmin, async (req, res) => {
    try {
      const success = await storage.deleteCategory(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Products API
  app.get('/api/products', async (req, res) => {
    try {
      const { category, featured, newArrival, bestSeller, search } = req.query;
      
      const products = await storage.getAllProducts({
        categoryId: category ? parseInt(category as string) : undefined,
        featured: featured === 'true',
        isNewArrival: newArrival === 'true',
        isBestSeller: bestSeller === 'true',
        search: search as string,
      });
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const product = await storage.getProductById(parseInt(req.params.id));
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/products', isAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const newProduct = await storage.createProduct(validatedData);
      res.status(201).json(newProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/products/:id', isAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const updatedProduct = await storage.updateProduct(parseInt(req.params.id), validatedData);
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/products/:id', isAdmin, async (req, res) => {
    try {
      const success = await storage.deleteProduct(parseInt(req.params.id));
      if (!success) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Cart API
  app.get('/api/cart', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/cart', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        userId
      });
      
      const newCartItem = await storage.addToCart(validatedData);
      res.status(201).json(newCartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/cart/:id', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const itemId = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ message: 'Quantity must be a positive number' });
      }
      
      const updatedItem = await storage.updateCartItem(userId, itemId, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.delete('/api/cart/:id', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const itemId = parseInt(req.params.id);
      
      const success = await storage.removeFromCart(userId, itemId);
      if (!success) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Orders API
  app.get('/api/orders', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const isAdminUser = (req.user as any).isAdmin;
      
      let orders;
      if (isAdminUser && req.query.all === 'true') {
        orders = await storage.getAllOrders();
      } else {
        orders = await storage.getUserOrders(userId);
      }
      
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/orders/:id', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const isAdminUser = (req.user as any).isAdmin;
      const orderId = parseInt(req.params.id);
      
      const order = await storage.getOrderById(orderId);
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      // Only allow users to view their own orders unless they're an admin
      if (order.userId !== userId && !isAdminUser) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/orders', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      
      const validatedData = insertOrderSchema.parse({
        ...req.body,
        userId
      });
      
      // Get cart items to create order items
      const cartItems = await storage.getCartItems(userId);
      
      if (cartItems.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
      
      // Create order
      const newOrder = await storage.createOrder(validatedData, cartItems);
      
      // Clear cart after successful order
      await storage.clearCart(userId);
      
      res.status(201).json(newOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/api/orders/:id/status', isAdmin, async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: 'Status is required' });
      }
      
      const updatedOrder = await storage.updateOrderStatus(orderId, status);
      
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Reviews API
  app.get('/api/products/:id/reviews', async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/products/:id/reviews', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const productId = parseInt(req.params.id);
      
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        userId,
        productId
      });
      
      const newReview = await storage.createReview(validatedData);
      res.status(201).json(newReview);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Testimonials API
  app.get('/api/testimonials', async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/testimonials', isAdmin, async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const newTestimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(newTestimonial);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Admin dashboard stats
  app.get('/api/admin/stats', isAdmin, async (req, res) => {
    try {
      const stats = await storage.getAdminStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Admin users management
  app.get('/api/admin/users', isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const safeUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
