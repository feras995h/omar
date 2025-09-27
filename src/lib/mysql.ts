import { createConnection, Connection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { User, Post, Category, Comment, Contact, Newsletter } from './storage';

// MySQL-compatible interfaces that match storage.ts
interface MySQLUser extends Omit<User, 'role'> {
  password: string;
  avatar?: string;
  role: 'ADMIN' | 'USER';
}

interface MySQLPost extends Omit<Post, 'categories' | 'slug' | 'publishedAt'> {
  authorId: string;
  categoryId: string;
  featured: boolean;
  image?: string;
  tags: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

interface MySQLCategory extends Omit<Category, 'slug'> {
  color: string;
}

interface MySQLComment extends Omit<Comment, 'authorId'> {
  authorName: string;
  authorEmail: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface MySQLContact extends Omit<Contact, 'phone'> {
  status: 'PENDING' | 'REVIEWED' | 'RESPONDED' | 'CLOSED';
}

interface MySQLNewsletter extends Omit<Newsletter, 'name' | 'isActive'> {
  isActive: boolean;
}

interface MySQLConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export class MySQLManager {
  private connection: Connection | null = null;
  private config: MySQLConfig;

  constructor() {
    // Load configuration from environment variables
    const getEnvVar = (key: string, defaultValue: string = ''): string => {
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env[key] || defaultValue;
      }
      if (typeof process !== 'undefined' && process.env) {
        return process.env[key] || defaultValue;
      }
      return defaultValue;
    };

    this.config = {
      host: getEnvVar('VITE_MYSQL_HOST', 'localhost'),
      port: parseInt(getEnvVar('VITE_MYSQL_PORT', '3306')),
      user: getEnvVar('VITE_MYSQL_USER', ''),
      password: getEnvVar('VITE_MYSQL_PASSWORD', ''),
      database: getEnvVar('VITE_MYSQL_DATABASE', ''),
    };
  }

  async connect(): Promise<boolean> {
    try {
      if (!this.config.user || !this.config.password || !this.config.database) {
        console.warn('MySQL configuration incomplete, falling back to localStorage');
        return false;
      }

      this.connection = await createConnection(this.config);
      await this.initializeTables();
      console.log('Connected to MySQL database successfully');
      return true;
    } catch (error) {
      console.warn('Failed to connect to MySQL:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }

  private async initializeTables(): Promise<void> {
    if (!this.connection) return;

    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user',
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Categories table
      `CREATE TABLE IF NOT EXISTS categories (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        color VARCHAR(7) DEFAULT '#3B82F6',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Posts table
      `CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(36) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT,
        author_id VARCHAR(36) NOT NULL,
        category_id VARCHAR(36) NOT NULL,
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        featured BOOLEAN DEFAULT FALSE,
        image TEXT,
        tags JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )`,

      // Comments table
      `CREATE TABLE IF NOT EXISTS comments (
        id VARCHAR(36) PRIMARY KEY,
        post_id VARCHAR(36) NOT NULL,
        author_name VARCHAR(255) NOT NULL,
        author_email VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
      )`,

      // Contacts table
      `CREATE TABLE IF NOT EXISTS contacts (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('new', 'read', 'replied') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`,

      // Newsletter table
      `CREATE TABLE IF NOT EXISTS newsletters (
        id VARCHAR(36) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        status ENUM('active', 'unsubscribed') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`
    ];

    for (const table of tables) {
      await this.connection.execute(table);
    }
  }

  // User operations
  async getUsers(): Promise<User[]> {
    if (!this.connection) return [];
    const [rows] = await this.connection.execute('SELECT * FROM users ORDER BY created_at DESC') as [RowDataPacket[], any];
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: undefined,
      role: row.role === 'admin' ? 'ADMIN' : 'USER',
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    }));
  }

  async getUserById(id: string): Promise<User | null> {
    if (!this.connection) return null;
    const [rows] = await this.connection.execute('SELECT * FROM users WHERE id = ?', [id]) as [RowDataPacket[], any];
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: undefined,
      role: row.role === 'admin' ? 'ADMIN' : 'USER',
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
  }

  async createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string; avatar?: string }): Promise<User> {
    if (!this.connection) throw new Error('No database connection');
    const id = crypto.randomUUID();
    const now = new Date();
    
    await this.connection.execute(
      'INSERT INTO users (id, name, email, password, role, avatar, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, user.name, user.email, user.password, user.role === 'ADMIN' ? 'admin' : 'user', user.avatar, now, now]
    );

    return {
      id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    if (!this.connection) return null;
    
    const mysqlUpdates: any = { ...updates };
    if (mysqlUpdates.role) {
      mysqlUpdates.role = mysqlUpdates.role === 'ADMIN' ? 'admin' : 'user';
    }
    
    const fields = Object.keys(mysqlUpdates).filter(key => key !== 'id' && key !== 'createdAt').map(key => `${key} = ?`);
    const values = Object.entries(mysqlUpdates)
      .filter(([key]) => key !== 'id' && key !== 'createdAt')
      .map(([, value]) => value);
    
    if (fields.length === 0) return this.getUserById(id);
    
    values.push(new Date().toISOString(), id);
    await this.connection.execute(
      `UPDATE users SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`,
      values
    );

    return this.getUserById(id);
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!this.connection) return false;
    const [result] = await this.connection.execute('DELETE FROM users WHERE id = ?', [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    if (!this.connection) return [];
    const [rows] = await this.connection.execute('SELECT * FROM categories ORDER BY name') as [RowDataPacket[], any];
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      slug: row.name.toLowerCase().replace(/\s+/g, '-'),
      description: row.description,
      color: row.color,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    }));
  }

  async getCategoryById(id: string): Promise<Category | null> {
    if (!this.connection) return null;
    const [rows] = await this.connection.execute('SELECT * FROM categories WHERE id = ?', [id]) as [RowDataPacket[], any];
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      slug: row.name.toLowerCase().replace(/\s+/g, '-'),
      description: row.description,
      color: row.color,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
  }

  async createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    if (!this.connection) throw new Error('No database connection');
    const id = crypto.randomUUID();
    const now = new Date();
    
    await this.connection.execute(
      'INSERT INTO categories (id, name, description, color, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
      [id, category.name, category.description, category.color, now, now]
    );

    return {
      id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
  }

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category | null> {
    if (!this.connection) return null;
    
    const mysqlUpdates: any = { ...updates };
    delete mysqlUpdates.slug; // Remove slug as it's not stored in MySQL
    
    const fields = Object.keys(mysqlUpdates).filter(key => key !== 'id' && key !== 'createdAt').map(key => `${key} = ?`);
    const values = Object.entries(mysqlUpdates)
      .filter(([key]) => key !== 'id' && key !== 'createdAt')
      .map(([, value]) => value);
    
    if (fields.length === 0) return this.getCategoryById(id);
    
    values.push(new Date().toISOString(), id);
    await this.connection.execute(
      `UPDATE categories SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`,
      values
    );

    return this.getCategoryById(id);
  }

  async deleteCategory(id: string): Promise<boolean> {
    if (!this.connection) return false;
    const [result] = await this.connection.execute('DELETE FROM categories WHERE id = ?', [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }

  // Post operations
  async getPosts(): Promise<Post[]> {
    if (!this.connection) return [];
    const [rows] = await this.connection.execute(`
      SELECT p.*, u.name as author_name, c.name as category_name 
      FROM posts p 
      LEFT JOIN users u ON p.author_id = u.id 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.created_at DESC
    `) as [RowDataPacket[], any];
    
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      excerpt: row.excerpt,
      slug: row.title.toLowerCase().replace(/\s+/g, '-'),
      status: row.status === 'published' ? 'PUBLISHED' : row.status === 'archived' ? 'ARCHIVED' : 'DRAFT',
      publishedAt: row.status === 'published' ? row.updated_at.toISOString() : undefined,
      authorId: row.author_id,
      categories: [row.category_id],
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    }));
  }

  async getPublishedPosts(): Promise<Post[]> {
    if (!this.connection) return [];
    const [rows] = await this.connection.execute(`
      SELECT p.*, u.name as author_name, c.name as category_name 
      FROM posts p 
      LEFT JOIN users u ON p.author_id = u.id 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.status = 'published'
      ORDER BY p.created_at DESC
    `) as [RowDataPacket[], any];
    
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      excerpt: row.excerpt,
      slug: row.title.toLowerCase().replace(/\s+/g, '-'),
      status: 'PUBLISHED',
      publishedAt: row.updated_at.toISOString(),
      authorId: row.author_id,
      categories: [row.category_id],
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    }));
  }

  async getPostById(id: string): Promise<Post | null> {
    if (!this.connection) return null;
    const [rows] = await this.connection.execute('SELECT * FROM posts WHERE id = ?', [id]) as [RowDataPacket[], any];
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      id: row.id,
      title: row.title,
      content: row.content,
      excerpt: row.excerpt,
      slug: row.title.toLowerCase().replace(/\s+/g, '-'),
      status: row.status === 'published' ? 'PUBLISHED' : row.status === 'archived' ? 'ARCHIVED' : 'DRAFT',
      publishedAt: row.status === 'published' ? row.updated_at.toISOString() : undefined,
      authorId: row.author_id,
      categories: [row.category_id],
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
  }

  async createPost(post: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    if (!this.connection) throw new Error('No database connection');
    const id = crypto.randomUUID();
    const now = new Date();
    
    const mysqlStatus = post.status === 'PUBLISHED' ? 'published' : post.status === 'ARCHIVED' ? 'archived' : 'draft';
    const categoryId = post.categories && post.categories.length > 0 ? post.categories[0] : null;
    
    await this.connection.execute(
      'INSERT INTO posts (id, title, content, excerpt, author_id, category_id, status, featured, image, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, post.title, post.content, post.excerpt, post.authorId, categoryId, mysqlStatus, false, null, JSON.stringify([]), now, now]
    );

    return {
      id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      status: post.status,
      publishedAt: post.publishedAt,
      authorId: post.authorId,
      categories: post.categories,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
  }

  async updatePost(id: string, updates: Partial<Post>): Promise<Post | null> {
    if (!this.connection) return null;
    
    const mysqlUpdates: any = { ...updates };
    if (mysqlUpdates.status) {
      mysqlUpdates.status = mysqlUpdates.status === 'PUBLISHED' ? 'published' : 
                           mysqlUpdates.status === 'ARCHIVED' ? 'archived' : 'draft';
    }
    if (mysqlUpdates.categories && mysqlUpdates.categories.length > 0) {
      mysqlUpdates.category_id = mysqlUpdates.categories[0];
    }
    delete mysqlUpdates.categories;
    delete mysqlUpdates.slug;
    delete mysqlUpdates.publishedAt;
    
    const fields = Object.keys(mysqlUpdates).filter(key => key !== 'id' && key !== 'createdAt').map(key => `${key} = ?`);
    const values = Object.entries(mysqlUpdates)
      .filter(([key]) => key !== 'id' && key !== 'createdAt')
      .map(([, value]) => value);
    
    if (fields.length === 0) return this.getPostById(id);
    
    values.push(new Date().toISOString(), id);
    await this.connection.execute(
      `UPDATE posts SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`,
      values
    );

    return this.getPostById(id);
  }

  async deletePost(id: string): Promise<boolean> {
    if (!this.connection) return false;
    const [result] = await this.connection.execute('DELETE FROM posts WHERE id = ?', [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }

  // Comment operations
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    if (!this.connection) return [];
    const [rows] = await this.connection.execute(`
      SELECT c.*, u.name as author_name, p.title as post_title 
      FROM comments c 
      LEFT JOIN users u ON c.author_id = u.id 
      LEFT JOIN posts p ON c.post_id = p.id 
      WHERE c.post_id = ?
      ORDER BY c.created_at DESC
    `, [postId]) as [RowDataPacket[], any];
    
    return rows.map(row => ({
      id: row.id,
      content: row.content,
      authorId: row.author_id,
      postId: row.post_id,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    }));
  }

  async getCommentById(id: string): Promise<Comment | null> {
    if (!this.connection) return null;
    const [rows] = await this.connection.execute('SELECT * FROM comments WHERE id = ?', [id]) as [RowDataPacket[], any];
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      id: row.id,
      content: row.content,
      authorId: row.author_id,
      postId: row.post_id,
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
  }

  async createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    if (!this.connection) throw new Error('No database connection');
    const id = crypto.randomUUID();
    const now = new Date();
    
    await this.connection.execute(
      'INSERT INTO comments (id, content, author_id, post_id, parent_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, comment.content, comment.authorId, comment.postId, null, 'pending', now, now]
    );

    return {
      id,
      content: comment.content,
      authorId: comment.authorId,
      postId: comment.postId,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
  }

  async updateComment(id: string, updates: Partial<Comment>): Promise<Comment | null> {
    if (!this.connection) return null;
    
    const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'createdAt').map(key => `${key} = ?`);
    const values = Object.entries(updates)
      .filter(([key]) => key !== 'id' && key !== 'createdAt')
      .map(([, value]) => value);
    
    if (fields.length === 0) return this.getCommentById(id);
    
    values.push(new Date().toISOString(), id);
    await this.connection.execute(
      `UPDATE comments SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`,
      values
    );

    return this.getCommentById(id);
  }

  async deleteComment(id: string): Promise<boolean> {
    if (!this.connection) return false;
    const [result] = await this.connection.execute('DELETE FROM comments WHERE id = ?', [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }

  // Contact operations
  async getContacts(): Promise<Contact[]> {
    if (!this.connection) return [];
    const [rows] = await this.connection.execute('SELECT * FROM contacts ORDER BY created_at DESC') as [RowDataPacket[], any];
    
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone || undefined,
      subject: row.subject,
      message: row.message,
      status: row.status === 'reviewed' ? 'REVIEWED' : 
              row.status === 'responded' ? 'RESPONDED' : 
              row.status === 'closed' ? 'CLOSED' : 'PENDING',
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    }));
  }

  async getContactById(id: string): Promise<Contact | null> {
    if (!this.connection) return null;
    const [rows] = await this.connection.execute('SELECT * FROM contacts WHERE id = ?', [id]) as [RowDataPacket[], any];
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone || undefined,
      subject: row.subject,
      message: row.message,
      status: row.status === 'reviewed' ? 'REVIEWED' : 
              row.status === 'responded' ? 'RESPONDED' : 
              row.status === 'closed' ? 'CLOSED' : 'PENDING',
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
  }

  async createContact(contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    if (!this.connection) throw new Error('No database connection');
    const id = crypto.randomUUID();
    const now = new Date();
    
    const mysqlStatus = contact.status === 'REVIEWED' ? 'reviewed' : 
                       contact.status === 'RESPONDED' ? 'responded' : 
                       contact.status === 'CLOSED' ? 'closed' : 'pending';
    
    await this.connection.execute(
      'INSERT INTO contacts (id, name, email, phone, subject, message, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, contact.name, contact.email, contact.phone || null, contact.subject, contact.message, mysqlStatus, now, now]
    );

    return {
      id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      subject: contact.subject,
      message: contact.message,
      status: contact.status,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
  }

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact | null> {
    if (!this.connection) return null;
    
    const mysqlUpdates: any = { ...updates };
    if (mysqlUpdates.status) {
      mysqlUpdates.status = mysqlUpdates.status === 'REVIEWED' ? 'reviewed' : 
                           mysqlUpdates.status === 'RESPONDED' ? 'responded' : 
                           mysqlUpdates.status === 'CLOSED' ? 'closed' : 'pending';
    }
    
    const fields = Object.keys(mysqlUpdates).filter(key => key !== 'id' && key !== 'createdAt').map(key => `${key} = ?`);
    const values = Object.entries(mysqlUpdates)
      .filter(([key]) => key !== 'id' && key !== 'createdAt')
      .map(([, value]) => value);
    
    if (fields.length === 0) return this.getContactById(id);
    
    values.push(new Date().toISOString(), id);
    await this.connection.execute(
      `UPDATE contacts SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`,
      values
    );

    return this.getContactById(id);
  }

  async deleteContact(id: string): Promise<boolean> {
    if (!this.connection) return false;
    const [result] = await this.connection.execute('DELETE FROM contacts WHERE id = ?', [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }

  // Newsletter operations
  async getNewsletters(): Promise<Newsletter[]> {
    if (!this.connection) return [];
    const [rows] = await this.connection.execute('SELECT * FROM newsletters ORDER BY created_at DESC') as [RowDataPacket[], any];
    
    return rows.map(row => ({
      id: row.id,
      email: row.email,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    }));
  }

  async getNewsletterById(id: string): Promise<Newsletter | null> {
    if (!this.connection) return null;
    const [rows] = await this.connection.execute('SELECT * FROM newsletters WHERE id = ?', [id]) as [RowDataPacket[], any];
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      id: row.id,
      email: row.email,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at.toISOString(),
      updatedAt: row.updated_at.toISOString()
    };
  }

  async createNewsletter(newsletter: Omit<Newsletter, 'id' | 'createdAt' | 'updatedAt'>): Promise<Newsletter> {
    if (!this.connection) throw new Error('No database connection');
    const id = crypto.randomUUID();
    const now = new Date();
    
    await this.connection.execute(
      'INSERT INTO newsletters (id, email, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
      [id, newsletter.email, newsletter.isActive ? 1 : 0, now, now]
    );

    return {
      id,
      email: newsletter.email,
      isActive: newsletter.isActive,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    };
  }

  async updateNewsletter(id: string, updates: Partial<Newsletter>): Promise<Newsletter | null> {
    if (!this.connection) return null;
    
    const mysqlUpdates: any = { ...updates };
    if (typeof mysqlUpdates.isActive === 'boolean') {
      mysqlUpdates.is_active = mysqlUpdates.isActive ? 1 : 0;
      delete mysqlUpdates.isActive;
    }
    
    const fields = Object.keys(mysqlUpdates).filter(key => key !== 'id' && key !== 'createdAt').map(key => `${key} = ?`);
    const values = Object.entries(mysqlUpdates)
      .filter(([key]) => key !== 'id' && key !== 'createdAt')
      .map(([, value]) => value);
    
    if (fields.length === 0) return this.getNewsletterById(id);
    
    values.push(new Date().toISOString(), id);
    await this.connection.execute(
      `UPDATE newsletters SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`,
      values
    );

    return this.getNewsletterById(id);
  }

  async deleteNewsletter(id: string): Promise<boolean> {
    if (!this.connection) return false;
    const [result] = await this.connection.execute('DELETE FROM newsletters WHERE id = ?', [id]) as [ResultSetHeader, any];
    return result.affectedRows > 0;
  }

  // Migration utility
  async migrateFromLocalStorage(localData: any): Promise<void> {
    if (!this.connection) return;

    try {
      // Migrate users
      if (localData.users && Array.isArray(localData.users)) {
        for (const user of localData.users) {
          await this.createUser(user);
        }
      }

      // Migrate categories
      if (localData.categories && Array.isArray(localData.categories)) {
        for (const category of localData.categories) {
          await this.createCategory(category);
        }
      }

      // Migrate posts
      if (localData.posts && Array.isArray(localData.posts)) {
        for (const post of localData.posts) {
          await this.createPost(post);
        }
      }

      // Migrate comments
      if (localData.comments && Array.isArray(localData.comments)) {
        for (const comment of localData.comments) {
          await this.createComment(comment);
        }
      }

      // Migrate contacts
      if (localData.contacts && Array.isArray(localData.contacts)) {
        for (const contact of localData.contacts) {
          await this.createContact(contact);
        }
      }

      // Migrate newsletters
      if (localData.newsletters && Array.isArray(localData.newsletters)) {
        for (const newsletter of localData.newsletters) {
          await this.createNewsletter(newsletter);
        }
      }

      console.log('Data migration from localStorage to MySQL completed successfully');
    } catch (error) {
      console.error('Error during data migration:', error);
    }
  }

  async isHealthy(): Promise<boolean> {
    try {
      if (!this.connection) return false;
      await this.connection.execute('SELECT 1');
      return true;
    } catch (error) {
      console.error('MySQL health check failed:', error);
      return false;
    }
  }
}

export const mysqlManager = new MySQLManager();