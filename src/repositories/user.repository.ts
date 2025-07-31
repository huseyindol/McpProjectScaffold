// User Repository - Data Access Layer (Context7 Best Practices)
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { User } from "../types/user";

// ES module için __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * User Repository Class - JSON File Operations
 * Context7 Pattern: Pure data access, no business logic
 */
export class UserRepository {
  private readonly dataPath: string;

  constructor() {
    this.dataPath = join(__dirname, "../../data/users.json");
  }

  /**
   * Load all users from JSON file
   * @returns Promise<User[]> - Array of users
   */
  async findAll(): Promise<User[]> {
    try {
      const data = readFileSync(this.dataPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Repository: Users verisi yüklenirken hata:", error);
      return [];
    }
  }

  /**
   * Find user by ID
   * @param id - User ID to find
   * @returns Promise<User | null> - Found user or null
   */
  async findById(id: number): Promise<User | null> {
    const users = await this.findAll();
    return users.find(user => user.id === id) || null;
  }

  /**
   * Find users by name (partial match)
   * @param name - Name to search for
   * @returns Promise<User[]> - Array of matching users
   */
  async findByName(name: string): Promise<User[]> {
    const users = await this.findAll();
    return users.filter(user => 
      user.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  /**
   * Find user by email
   * @param email - Email to search for
   * @returns Promise<User | null> - Found user or null
   */
  async findByEmail(email: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find(user => user.email === email) || null;
  }

  /**
   * Find user by phone
   * @param phone - Phone to search for
   * @returns Promise<User | null> - Found user or null
   */
  async findByPhone(phone: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find(user => user.phone === phone) || null;
  }

  /**
   * Save all users to JSON file
   * @param users - Array of users to save
   * @returns Promise<boolean> - Success status
   */
  async saveAll(users: User[]): Promise<boolean> {
    try {
      const data = JSON.stringify(users, null, 2);
      writeFileSync(this.dataPath, data, "utf-8");
      return true;
    } catch (error) {
      console.error("Repository: Users verisi kaydedilirken hata:", error);
      return false;
    }
  }

  /**
   * Create new user
   * @param userData - User data without ID
   * @returns Promise<User | null> - Created user or null if failed
   */
  async create(userData: Omit<User, 'id'>): Promise<User | null> {
    try {
      const users = await this.findAll();
      const newId = this.getNextId(users);
      const newUser: User = { id: newId, ...userData };
      
      const updatedUsers = [...users, newUser];
      const saveSuccess = await this.saveAll(updatedUsers);
      
      return saveSuccess ? newUser : null;
    } catch (error) {
      console.error("Repository: User oluşturulurken hata:", error);
      return null;
    }
  }

  /**
   * Generate next available ID
   * @param users - Current users array
   * @returns number - Next ID
   */
  private getNextId(users: User[]): number {
    if (users.length === 0) return 1;
    return Math.max(...users.map(u => u.id)) + 1;
  }
}

// Singleton instance export
export const userRepository = new UserRepository();