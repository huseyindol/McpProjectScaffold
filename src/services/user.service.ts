// User Service - Business Logic Layer (Context7 Best Practices)
import { User, UserSchema } from "../types/user.js";
import { userRepository } from "../repositories/user.repository.js";

// Service Result Types (Context7 Pattern)
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * User Service Class - Business Logic & Validation
 * Context7 Pattern: Business rules, validation, error handling
 */
export class UserService {
  [x: string]: any;
  
  /**
   * Get all users - Simple pass-through with error handling
   * @returns Promise<ServiceResult<User[]>>
   */
  async getAllUsers(): Promise<ServiceResult<User[]>> {
    try {
      const users = await userRepository.findAll();
      return {
        success: true,
        data: users,
        message: `${users.length} kullanıcı bulundu`
      };
    } catch (error) {
      return {
        success: false,
        error: "Kullanıcılar yüklenirken hata oluştu",
        data: []
      };
    }
  }

  /**
   * Get user by ID with business validation
   * @param id - User ID
   * @returns Promise<ServiceResult<User>>
   */
  async getUserById(id: number): Promise<ServiceResult<User>> {
    try {
      // Business rule: ID must be positive
      if (id <= 0) {
        return {
          success: false,
          error: "Geçersiz kullanıcı ID'si. ID pozitif bir sayı olmalıdır."
        };
      }

      const user = await userRepository.findById(id);
      
      if (!user) {
        return {
          success: false,
          error: `ID ${id} ile kullanıcı bulunamadı`
        };
      }

      return {
        success: true,
        data: user,
        message: "Kullanıcı başarıyla bulundu"
      };
    } catch (error) {
      return {
        success: false,
        error: "Kullanıcı getirilirken hata oluştu"
      };
    }
  }

  /**
   * Search users by name with business validation
   * @param name - Search term
   * @returns Promise<ServiceResult<User[]>>
   */
  async searchUsersByName(name: string): Promise<ServiceResult<User[]>> {
    try {
      // Business rule: Name must be at least 2 characters
      if (name.trim().length < 2) {
        return {
          success: false,
          error: "Arama terimi en az 2 karakter olmalıdır",
          data: []
        };
      }

      const users = await userRepository.findByName(name);
      
      return {
        success: true,
        data: users,
        message: users.length > 0 
          ? `"${name}" için ${users.length} kullanıcı bulundu`
          : `"${name}" ismiyle kullanıcı bulunamadı`
      };
    } catch (error) {
      return {
        success: false,
        error: "Kullanıcı arama işleminde hata oluştu",
        data: []
      };
    }
  }

  /**
   * Search users by email with business validation
   * @param email - Search term
   * @returns Promise<ServiceResult<User[]>>
   */
  async searchUsersByEmail(email: string): Promise<ServiceResult<User | null>> {
    try {
      // Business rule: Email must be a valid email address
      if (!email.includes('@')) {
        return {
          success: false,
          error: "E-posta adresi geçersiz",
          data: null
        };
      }

      const user = await userRepository.findByEmail(email);
      
      return {
        success: true,
        data: user,
        message: user ? `"${email}" için kullanıcı bulundu` : `"${email}" e-posta adresiyle kullanıcı bulunamadı`
      };
    } catch (error) {
      return {
        success: false,
        error: "Kullanıcı arama işleminde hata oluştu",
        data: null
      };
    }
  }

  /**
   * Search users by phone with business validation
   * @param phone - Search term
   * @returns Promise<ServiceResult<User | null>>
   */
  async searchUsersByPhone(phone: string): Promise<ServiceResult<User | null>> {
    try {
      // Business rule: Phone must be a valid phone number
      if (!phone.includes(' ')) {
        return {
          success: false,
          error: "Telefon numarası geçersiz",
          data: null
        };
      }

      const user = await userRepository.findByPhone(phone);
      
      return {
        success: true,
        data: user,
        message: user ? `"${phone}" için kullanıcı bulundu` : `"${phone}" telefon numarasıyla kullanıcı bulunamadı`
      };
    } catch (error) {
      return {
        success: false,
        error: "Kullanıcı arama işleminde hata oluştu",
        data: null
      };
    }
  }

  /**
   * Create new user with full business logic validation
   * @param userData - User data to create
   * @returns Promise<ServiceResult<User>>
   */
  async createUser(userData: { name: string; email: string; phone: string }): Promise<ServiceResult<User>> {
    try {
      // Business Rule 1: Input validation with Zod
      const inputValidation = UserSchema.omit({ id: true }).safeParse(userData);
      if (!inputValidation.success) {
        return {
          success: false,
          error: `Validasyon hatası: ${inputValidation.error.message}`
        };
      }

      // Business Rule 2: Email uniqueness check
      const existingUser = await userRepository.findByEmail(userData.email);
      if (existingUser) {
        return {
          success: false,
          error: `Bu e-posta adresi zaten kullanımda (ID: ${existingUser.id})`
        };
      }

      // Business Rule 3: Email format additional check (Context7 pattern)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return {
          success: false,
          error: "Geçersiz e-posta formatı"
        };
      }

      // Business Rule 4: Name sanitization (trim whitespace)
      const sanitizedData = {
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        phone: userData.phone.trim()
      };

      // Create user through repository
      const newUser = await userRepository.create(sanitizedData);
      
      if (!newUser) {
        return {
          success: false,
          error: "Kullanıcı oluşturulurken bir hata oluştu"
        };
      }

      return {
        success: true,
        data: newUser,
        message: "Kullanıcı başarıyla oluşturuldu"
      };
    } catch (error) {
      return {
        success: false,
        error: "Kullanıcı oluşturma işleminde beklenmeyen bir hata oluştu"
      };
    }
  }

  /**
   * Validate user data (can be used by other services)
   * @param userData - User data to validate
   * @returns Promise<ServiceResult<boolean>>
   */
  async validateUserData(userData: Partial<User>): Promise<ServiceResult<boolean>> {
    try {
      const validation = UserSchema.partial().safeParse(userData);
      
      if (!validation.success) {
        return {
          success: false,
          error: `Validasyon hatası: ${validation.error.message}`,
          data: false
        };
      }

      return {
        success: true,
        data: true,
        message: "Veri doğrulaması başarılı"
      };
    } catch (error) {
      return {
        success: false,
        error: "Validasyon işleminde hata oluştu",
        data: false
      };
    }
  }
}

// Singleton instance export (Context7 pattern)
export const userService = new UserService();