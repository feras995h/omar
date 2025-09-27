// API Storage Management System
// نظام إدارة التخزين عبر API

export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  categories: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  postId: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'PENDING' | 'REVIEWED' | 'RESPONDED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
}

export interface Newsletter {
  id: string;
  email: string;
  name?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

class APIStorageManager {
  private baseURL: string;

  constructor() {
    this.baseURL = '/api';
  }

  private async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // User methods
  async getAllUsers(): Promise<User[]> {
    return this.apiRequest<User[]>('/users');
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.apiRequest<User>(`/users/${id}`);
    } catch (error) {
      return null;
    }
  }

  async createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    return this.apiRequest<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User | null> {
    try {
      return await this.apiRequest<User>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      return null;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await this.apiRequest(`/users/${id}`, { method: 'DELETE' });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Post methods
  async getAllPosts(): Promise<Post[]> {
    return this.apiRequest<Post[]>('/posts');
  }

  async getPostById(id: string): Promise<Post | null> {
    try {
      return await this.apiRequest<Post>(`/posts/${id}`);
    } catch (error) {
      return null;
    }
  }

  async getPostBySlug(slug: string): Promise<Post | null> {
    try {
      return await this.apiRequest<Post>(`/posts/slug/${slug}`);
    } catch (error) {
      return null;
    }
  }

  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'>): Promise<Post> {
    return this.apiRequest<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id: string, updates: Partial<Omit<Post, 'id' | 'createdAt'>>): Promise<Post | null> {
    try {
      return await this.apiRequest<Post>(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      return null;
    }
  }

  async deletePost(id: string): Promise<boolean> {
    try {
      await this.apiRequest(`/posts/${id}`, { method: 'DELETE' });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return this.apiRequest<Category[]>('/categories');
  }

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      return await this.apiRequest<Category>(`/categories/${id}`);
    } catch (error) {
      return null;
    }
  }

  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    return this.apiRequest<Category>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<Category | null> {
    try {
      return await this.apiRequest<Category>(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    } catch (error) {
      return null;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      await this.apiRequest(`/categories/${id}`, { method: 'DELETE' });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Comment methods
  async getAllComments(): Promise<Comment[]> {
    return this.apiRequest<Comment[]>('/comments');
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.apiRequest<Comment[]>(`/comments/post/${postId}`);
  }

  async createComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comment> {
    return this.apiRequest<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  async deleteComment(id: string): Promise<boolean> {
    try {
      await this.apiRequest(`/comments/${id}`, { method: 'DELETE' });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Contact methods
  async getAllContacts(): Promise<Contact[]> {
    return this.apiRequest<Contact[]>('/contacts');
  }

  async createContact(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>): Promise<Contact> {
    return this.apiRequest<Contact>('/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async updateContactStatus(id: string, status: Contact['status']): Promise<Contact | null> {
    try {
      return await this.apiRequest<Contact>(`/contacts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      return null;
    }
  }

  async deleteContact(id: string): Promise<boolean> {
    try {
      await this.apiRequest(`/contacts/${id}`, { method: 'DELETE' });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Newsletter methods
  async getAllNewsletterSubscriptions(): Promise<Newsletter[]> {
    return this.apiRequest<Newsletter[]>('/newsletter');
  }

  async subscribeToNewsletter(email: string, name?: string): Promise<Newsletter> {
    return this.apiRequest<Newsletter>('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    });
  }

  async unsubscribeFromNewsletter(email: string): Promise<boolean> {
    try {
      await this.apiRequest('/newsletter/unsubscribe', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Utility methods
  async clearAllData(): Promise<void> {
    await this.apiRequest('/admin/clear-all', { method: 'DELETE' });
  }

  async exportData(): Promise<string> {
    const data = await this.apiRequest<any>('/admin/export');
    return JSON.stringify(data, null, 2);
  }

  async initializeSampleData(): Promise<void> {
    await this.apiRequest('/admin/initialize-sample-data', { method: 'POST' });
  }
}

// Export singleton instance
export const storage = new APIStorageManager();