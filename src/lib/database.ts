// Unified Database Interface
// يتيح التبديل التلقائي بين MySQL و localStorage

import { mysqlManager } from './mysql';
import { storage, User, Post, Category, Comment, Contact, Newsletter } from './storage';

class DatabaseManager {
  private useMySQL = false;
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    // Try to connect to MySQL first
    this.useMySQL = await mysqlManager.connect();
    
    if (this.useMySQL) {
      console.log('✅ Using MySQL database');
      // التحقق من وجود بيانات في localStorage للترحيل
      const hasLocalData = storage.getAllUsers().length > 0 || 
                          storage.getAllPosts().length > 0 || 
                          storage.getAllCategories().length > 0;
      
      if (hasLocalData) {
        console.log('📦 Found existing localStorage data, migrating to MySQL...');
        const localData = storage.exportData();
        await mysqlManager.migrateFromLocalStorage(JSON.parse(localData));
        console.log('✅ Data migration completed successfully');
        // مسح البيانات من localStorage بعد الترحيل الناجح
        storage.clearAllData();
      }
    } else {
      console.log('📱 Using localStorage (MySQL not available)');
    }

    this.initialized = true;
  }

  // User operations
  async getAllUsers(): Promise<User[]> {
    await this.initialize();
    return this.useMySQL ? mysqlManager.getUsers() : storage.getAllUsers();
  }

  async getUserById(id: string): Promise<User | null> {
    await this.initialize();
    return this.useMySQL ? mysqlManager.getUserById(id) : storage.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    await this.initialize();
    if (this.useMySQL) {
      // MySQL doesn't have getUserByEmail method, so we get all users and filter
      const users = await mysqlManager.getUsers();
      return users.find(user => user.email === email) || null;
    }
    return storage.getUserByEmail(email);
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string; avatar?: string }): Promise<User> {
    await this.initialize();
    return this.useMySQL ? mysqlManager.createUser(userData) : storage.createUser(userData);
  }

  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    await this.initialize();
    return this.useMySQL ? null : storage.updateUser(id, updates); // MySQL update not implemented yet
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.initialize();
    return this.useMySQL ? false : storage.deleteUser(id); // MySQL delete not implemented yet
  }

  // Post operations
  async getAllPosts(): Promise<Post[]> {
    await this.initialize();
    return this.useMySQL ? mysqlManager.getPosts() : storage.getAllPosts();
  }

  async getPublishedPosts(): Promise<Post[]> {
    await this.initialize();
    return this.useMySQL ? mysqlManager.getPublishedPosts() : storage.getPublishedPosts();
  }

  async getPostsByCategory(categoryId: string): Promise<Post[]> {
    await this.initialize();
    if (this.useMySQL) {
      const posts = await mysqlManager.getPosts();
      return posts.filter(post => post.categories.includes(categoryId));
    }
    return storage.getPostsByCategory(categoryId);
  }

  async getPostsByAuthor(authorId: string): Promise<Post[]> {
    await this.initialize();
    if (this.useMySQL) {
      const posts = await mysqlManager.getPosts();
      return posts.filter(post => post.authorId === authorId);
    }
    return storage.getPostsByAuthor(authorId);
  }

  async getPostById(id: string): Promise<Post | null> {
    await this.initialize();
    if (this.useMySQL) {
      const posts = await mysqlManager.getPosts();
      return posts.find(post => post.id === id) || null;
    }
    return storage.getPostById(id);
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    await this.initialize();
    if (this.useMySQL) {
      const posts = await mysqlManager.getPosts();
      return posts.find(post => post.slug === slug) || null;
    }
    return storage.getPostBySlug(slug);
  }

  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    await this.initialize();
    return this.useMySQL ? mysqlManager.createPost(postData) : storage.createPost(postData);
  }

  async updatePost(id: string, updates: Partial<Omit<Post, 'id' | 'createdAt'>>): Promise<Post | null> {
    await this.initialize();
    return this.useMySQL ? null : storage.updatePost(id, updates); // MySQL update not implemented yet
  }

  async deletePost(id: string): Promise<boolean> {
    await this.initialize();
    return this.useMySQL ? false : storage.deletePost(id); // MySQL delete not implemented yet
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    await this.initialize();
    return this.useMySQL ? mysqlManager.getCategories() : storage.getAllCategories();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    await this.initialize();
    if (this.useMySQL) {
      const categories = await mysqlManager.getCategories();
      return categories.find(category => category.id === id) || null;
    }
    return storage.getCategoryById(id);
  }

  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    await this.initialize();
    return this.useMySQL ? mysqlManager.createCategory(categoryData) : storage.createCategory(categoryData);
  }

  async updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<Category | null> {
    await this.initialize();
    return this.useMySQL ? null : storage.updateCategory(id, updates); // MySQL update not implemented yet
  }

  async deleteCategory(id: string): Promise<boolean> {
    await this.initialize();
    return this.useMySQL ? false : storage.deleteCategory(id); // MySQL delete not implemented yet
  }

  // Comment operations
  async getAllComments(): Promise<Comment[]> {
    await this.initialize();
    return this.useMySQL ? [] : storage.getAllComments(); // MySQL getAllComments not implemented
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    await this.initialize();
    return this.useMySQL ? mysqlManager.getCommentsByPostId(postId) : storage.getCommentsByPostId(postId);
  }

  async createComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    await this.initialize();
    return this.useMySQL ? mysqlManager.createComment(commentData) : storage.createComment(commentData);
  }

  async updateComment(id: string, updates: Partial<Omit<Comment, 'id' | 'createdAt'>>): Promise<Comment | null> {
    await this.initialize();
    return this.useMySQL ? null : storage.updateComment(id, updates); // MySQL update not implemented yet
  }

  async deleteComment(id: string): Promise<boolean> {
    await this.initialize();
    return this.useMySQL ? false : storage.deleteComment(id); // MySQL delete not implemented yet
  }

  // Contact operations
  async getAllContacts(): Promise<Contact[]> {
    await this.initialize();
    return this.useMySQL ? mysqlManager.getContacts() : storage.getAllContacts();
  }

  async createContact(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    await this.initialize();
    return this.useMySQL ? mysqlManager.createContact(contactData) : storage.createContact(contactData);
  }

  async updateContact(id: string, updates: Partial<Omit<Contact, 'id' | 'createdAt'>>): Promise<Contact | null> {
    await this.initialize();
    return this.useMySQL ? null : storage.updateContact(id, updates); // MySQL update not implemented yet
  }

  async deleteContact(id: string): Promise<boolean> {
    await this.initialize();
    return this.useMySQL ? false : storage.deleteContact(id); // MySQL delete not implemented yet
  }

  // Newsletter operations
  async getAllNewsletterSubscriptions(): Promise<Newsletter[]> {
    await this.initialize();
    return this.useMySQL ? mysqlManager.getNewsletters() : storage.getAllNewsletterSubscriptions();
  }

  async getNewsletterByEmail(email: string): Promise<Newsletter | null> {
    await this.initialize();
    if (this.useMySQL) {
      const newsletters = await mysqlManager.getNewsletters();
      return newsletters.find(newsletter => newsletter.email === email) || null;
    }
    return storage.getNewsletterByEmail(email);
  }

  async createNewsletterSubscription(newsletterData: Omit<Newsletter, 'id' | 'createdAt' | 'updatedAt'>): Promise<Newsletter> {
    await this.initialize();
    return this.useMySQL ? mysqlManager.createNewsletter(newsletterData) : storage.createNewsletterSubscription(newsletterData);
  }

  async updateNewsletterSubscription(id: string, updates: Partial<Omit<Newsletter, 'id' | 'createdAt'>>): Promise<Newsletter | null> {
    await this.initialize();
    return this.useMySQL ? null : storage.updateNewsletterSubscription(id, updates); // MySQL update not implemented yet
  }

  async deleteNewsletterSubscription(id: string): Promise<boolean> {
    await this.initialize();
    return this.useMySQL ? false : storage.deleteNewsletterSubscription(id); // MySQL delete not implemented yet
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    await this.initialize();
    if (!this.useMySQL) {
      storage.clearAllData();
    }
    // MySQL clear not implemented for safety
  }

  async exportData(): Promise<string> {
    await this.initialize();
    if (this.useMySQL) {
      // Export from MySQL
      const data = {
        users: await mysqlManager.getUsers(),
        posts: await mysqlManager.getPosts(),
        categories: await mysqlManager.getCategories(),
        comments: [], // Would need to implement getAllComments for MySQL
        contacts: await mysqlManager.getContacts(),
        newsletters: await mysqlManager.getNewsletters(),
      };
      return JSON.stringify(data, null, 2);
    }
    return storage.exportData();
  }

  async importData(jsonData: string): Promise<boolean> {
    await this.initialize();
    return this.useMySQL ? false : storage.importData(jsonData); // MySQL import not implemented yet
  }

  // Initialize with sample data
  async initializeSampleData(): Promise<void> {
    await this.initialize();
    if (!this.useMySQL) {
      storage.initializeSampleData();
    }
    // For MySQL, sample data would be created during migration or manually
  }

  // Database status
  async getStatus(): Promise<{ type: 'mysql' | 'localStorage'; connected: boolean; healthy: boolean }> {
    await this.initialize();
    
    if (this.useMySQL) {
      const healthy = await mysqlManager.isHealthy();
      return {
        type: 'mysql',
        connected: true,
        healthy
      };
    }
    
    return {
      type: 'localStorage',
      connected: true,
      healthy: true
    };
  }

  // Force switch to localStorage (useful for testing or fallback)
  async switchToLocalStorage(): Promise<void> {
    this.useMySQL = false;
    await mysqlManager.disconnect();
    console.log('🔄 Switched to localStorage');
  }

  // Force reconnect to MySQL
  async reconnectMySQL(): Promise<boolean> {
    const connected = await mysqlManager.connect();
    this.useMySQL = connected;
    if (connected) {
      console.log('🔄 Reconnected to MySQL');
    }
    return connected;
  }
}

// Export singleton instance
export const db = new DatabaseManager();

// Auto-initialize
db.initialize().catch(console.error);